const { supabase } = require("./supabaseclient");
const { sendNotificationToUser } = require("../websocket/websocketServer");
const { getUsersActiveWindow } = require("./activityAnalysis");

//function will check what users fall within
//active window during a set interval and call a helper function
//that updates each users notifications
async function deliverPendingNotifications() {
  try {
    const currentHour = new Date().getHours();

    //we need to get all users who have pending notifs
    //keep in mind this might return duplicate userIds since one user
    //might have multiple pending notifications
    const { data: usersWithPending, error: usersError } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("status", "pending");

    if (usersError) {
      console.error(
        "Error fetching users with pending notifications:",
        usersError
      );
      return;
    }

    if (!usersWithPending || usersWithPending.length === 0) {
      return;
    }

    //remember what I said above user might have multiple notifications pending so put the results
    //from query in a Set to avoid duplicates and just have userId of users who need notifications updated
    const uniqueUserIds = [...new Set(usersWithPending.map((n) => n.user_id))];

    //using for instead of for each so each user
    //is processed one by one. If we use async await for each
    //database gets hit all at once
    for (const userId of uniqueUserIds) {
      const window = await getUsersActiveWindow(userId);

      if (currentHour >= window.start && currentHour < window.end) {
        await deliverUserPendingNotifications(userId); //function will take care of changing this users notifs from pending to delivered
      }
    }
  } catch (err) {
    console.error(
      "Error with the background job that gets all users with pending notifications",
      err
    );
  }
}

//function will change noitfication status from pending to delievered
//to individual users
async function deliverUserPendingNotifications(userId) {
  try {
    const { data: pendingNotifications, error: notifError } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending");

    if (notifError) {
      console.error(
        `Error fetching pending notifications for user`,
        notifError
      );
      return;
    }

    if (!pendingNotifications || pendingNotifications.length === 0) {
      return;
    }

    const { error: updateError } = await supabase
      .from("notifications")
      .update({ status: "delivered" })
      .eq("user_id", userId)
      .eq("status", "pending");

    if (updateError) {
      console.error(`Error updating notifications for user`, updateError);
      return;
    }

    //after we update try and send notifications through websocket
    //function we have will handle that
    pendingNotifications.forEach((notification) => {
      const sent = sendNotificationToUser(userId, notification);
      if (sent) {
        console.log(
          `Sent pending notification that is now a delievered one via WebSocket to user`
        );
      }
    });
  } catch (err) {
    console.error(`Error delivering notifications to user`, err);
  }
}

function startGeneralNotificationScheduler() {
  console.log(`Starting general notification scheduler...`);

  //run function as soon as app starts
  deliverPendingNotifications();

  //then run it once every hour
  setInterval(deliverPendingNotifications, 60 * 60 * 1000);
}

module.exports = { startGeneralNotificationScheduler };
