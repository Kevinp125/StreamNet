const { supabase } = require("./supabaseclient");
const { getUsersActiveWindow } = require("./activityAnalysis");

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
      .in("type", ["connection_request", "private_event_invitation"])
      .lt("seen_at", threeHoursAgo);

    if (error) throw error;

    return notifications || [];
  } catch (err) {
    console.error("Error trying to find notifications that need a nudge", err);
    return [];
  }
}

function startNudgeScheduler() {
  console.log("Starting nudge scheduler");

  setInterval(async () => {
    await findNotificationsNeedingNudge();
  }, 60 * 60 * 1000);

  findNotificationsNeedingNudge();
}

module.exports = { startNudgeScheduler };
