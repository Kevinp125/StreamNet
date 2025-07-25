const { supabase } = require("./supabaseclient");

async function logUserActivity(userId, activityType) {
  try {
    const { error } = await supabase.from("user_activity").insert({
      user_id: userId,
      activity_type: activityType,
    });

    if (error) {
      throw new Error("Error inserting a user activity into table", error);
    }

  } catch (err) {
    console.error("Error logging activity", err);
  }
}

module.exports = { logUserActivity };
