const WebSocket = require("ws");
const { supbase, supabase } = require("../services/supabaseclient");

//*** TODO: REMEMBER TO REMOVE CONSOLE LOGS FOR PROD ***/

//this map is going allow us to store each user when they come online along with their ws object (connection)
// clients = userId: WebSocket connection
const clients = new Map();

function isUserOnline(userId) {
  const userConnection = clients.get(userId);
  return userConnection && userConnection.readyState === WebSocket.OPEN;
}

//we will call this function in our nudge scheduler
//it will get called whenever user is in active window
//and they are online.
function sendNudgeToUser(userId, notification) {
  const userConnection = clients.get(userId);

  if (isUserOnline(userId)) {
    userConnection.send(
      JSON.stringify({
        type: "nudge",
        data: {
          originalNotificationId: notification.id,
          title: notification.title,
          message: notification.message,
          originalType: notification.type,
          contextData: notification.contextData,
        },
      })
    );
    return true;
  } else {
    return false;
  }
}

//this function will get called by createNotification helper whenever notification gets created
//it attempts to send real time notification if user is online (they are on clients map)
async function sendNotificationToUser(userId, notification) {
  const userConnection = clients.get(userId);

  //we check map above if the userId is there websocket object is returned so check if
  //it is exists (isnt null) and the readyState of the ws object is OPEN
  if (isUserOnline(userId)) {
    const shouldSend = await shouldSendNotificationToUser(userId, notification);
    if (shouldSend) {
      userConnection.send(
        JSON.stringify({
          type: "notification",
          data: notification,
        })
      );
    }

    console.log(`Sent notif to user ${userId}`);
    return true;
  }

  console.log(
    `user is not connected or notif was disabled did not send notif real time`
  );
  return false;
}

async function shouldSendNotificationToUser(userId, notification) {
  try {
    const { data: settings, error } = await supabase
      .from("user_notification_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) return false;

    if (notification.priority === "immediate" && !settings.important_enabled)
      return false;
    if (notification.priority === "general" && !settings.general_enabled)
      return false;

    switch (notification.type) {
      case "connection_request":
        return settings.connection_request_enabled;
      case "connection_accepted":
        return settings.connection_accepted_enabled;
      case "connection_denied":
        return settings.connection_denied_enabled;
      case "private_event_invitation":
        return settings.private_event_invitation_enabled;
      case "event_rsvp_update":
        return settings.event_rsvp_updates_enabled;
      case "public_event_announcement":
        return settings.public_event_announcements_enabled;
      case "network_event_announcements":
        return settings.network_event_announcements_enabled;
      default:
        return false;
    }
  } catch (err) {
    console.error("Error checking notification settings:", err);
    return false;
  }
}

//everything for websockets is event driven...
//on a client connection to the server we want to get their ws object
//only run server if it was originally by node js not imports or stuff on load
//need to make a websocket server that listens on port 8080 (standard)

const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocket server running on port 8080");
wss.on("connection", (ws) => {
  console.log("New WebSocket connection has been established");

  //this runs when the user who connected sends a message
  ws.on("message", async (message) => {
    console.log("We got a message:", message.toString());

    //wrapping in try catch cause JSON.parse can fail if not valid message
    try {
      const data = JSON.parse(message);

      //if the message type is auth meaning we are just trying to verify who user is. we store users id into connection map with their ws object.
      //this will allow us to send messages to that ws object in the future
      if (data.type === "auth") {
        try {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser(data.token);

          if (error || !user) {
            ws.close();
            return;
          }

          clients.set(user.id, ws);
          ws.userId = user.id;
          console.log(`User ${user.id} authenticated and stored`);
          console.log(`Total connected users: ${clients.size}`);
        } catch (err) {
          console.error("websocket auth failed", err);
          ws.close();
        }
      }
    } catch (err) {
      console.error("Error parsing message", err);
    }
  });

  //runs whenever a user disconnects (closed client, etc)
  ws.on("close", () => {
    if (ws.userId) {
      //if ws object that got closes (from client) has a userId attached it was in our map
      clients.delete(ws.userId); //delete it to remove connection (they arent online anymore)
      console.log(`User ${ws.userId} disconnected`);
      console.log(`Total connected users: ${clients.size}`);
    }
  });

  //handle any connection errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

module.exports = { sendNotificationToUser, sendNudgeToUser };
