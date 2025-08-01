const { supabase } = require("./supabaseclient");
const { getUsersActiveWindow } = require("./activityAnalysis");
const { sendNudgeToUser } = require("../websocket/websocketServer");

async function findNotificationsNeedingNudge() {
  try {
    //subtracing 3 hours from current time
    const threeHoursAgo = new Date(
      Date.now() - 3 * 60 * 60 * 1000
    ).toISOString();

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("status", "seen")
      .in("type", ["connection_request", "private_event_invite"])
      .lt("seen_at", threeHoursAgo);

    if (error) throw error;

    return notifications || [];
  } catch (err) {
    console.error("Error trying to find notifications that need a nudge", err);
    return [];
  }
}

async function deliverNudges() {
  try {
    const currentHour = new Date().getHours();
    const notificationsToNudge = await findNotificationsNeedingNudge();

    //dont need to nudge if this is the case
    if (notificationsToNudge.length === 0) {
      return;
    }

    //just want to grab all users who need to get nudges
    //remember one user can have multiple notifications
    const uniqueUserIds = [
      ...new Set(notificationsToNudge.map((n) => n.user_id)),
    ];

    for (const userId of uniqueUserIds) {
      const window = await getUsersActiveWindow(userId);

      if (currentHour >= window.start && currentHour < window.end) {
        const userNotifications = notificationsToNudge.filter(
          (n) => n.user_id === userId
        );

        for (const notification of userNotifications) {
          console.log(`Attempting to send nudge for notification ${notification.id}`);
          const sent = sendNudgeToUser(userId, notification);
          if (sent) {
            console.log(`Nudge sent for notification ${notification.id}`);
          } else {
            console.log(`User ${userId} offline, nudge not sent`);
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        console.log(`User ${userId} not in active window, skipping nudges`);
      }
    }
  } catch (err) {
    console.error("Error delivering nudges:", err);
  }
}

function startNudgeScheduler() {
  console.log("Starting nudge scheduler");

  setInterval(deliverNudges, 60 * 60 * 1000);

  deliverNudges();
}

module.exports = { startNudgeScheduler };
