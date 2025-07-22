const { supabase } = require("./supabaseclient");
const { sendNotificationToUser } = require("../websocket/websocketServer");

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
      .eq("status", "pending")
      .neq("user_id", null);

    if (usersError) {
      console.error(
        "Error fetching users with pending notifications:",
        usersError
      );
      return;
    }
  } catch (err) {}
}

//function will change noitfication status from pending to delievered
//to individual users
async function deliverUserPendingNotifications(userId) {}
