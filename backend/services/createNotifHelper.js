const { sendNotificationToUser } = require("../websocket/websocketServer");
const { getUsersActiveWindow } = require("./activityAnalysis");

//This function is a helper that allows us to make a notif in table after certain triggers
//we also call the sendNotificationToUser function that attempts to send same notification
//to users websocket in real time
async function createNotification(
  supabaseClient,
  { userId, type, title, message, contextData = {}, priority = "general" }
) {
  try {
    //lets let the status of a notif be delivered by default
    let status = "delivered";

    if (priority === "general") {
      const window = await getUsersActiveWindow(userId);
      const currentHour = new Date().getHours();

      if (currentHour >= window.start && currentHour < window.end) {
        status = "delivered"; // Send now - user will see it
      } else {
        status = "pending"; // Queue for later - user won't see it yet
      }
    }
    //gotta get notification back when its created so we can try to notify user if they are online
    const { data: notification, error } = await supabaseClient
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
        contextData,
        priority,
      })
      .select()
      .single();

    if (error) throw error;

    const sent = sendNotificationToUser(userId, notification);

    if (sent) {
      console.log(`Sent notification via WebSocket to user ${userId}`);
    } else {
      console.log(
        `User ${userId} offline, notification stored in database only`
      );
    }
  } catch (err) {
    console.error("Could not create a notification", err);
    throw err;
  }
}

module.exports = { createNotification };
