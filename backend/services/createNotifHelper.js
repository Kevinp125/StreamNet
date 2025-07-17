//This function is a helper that allows us to make a notif in table after certain triggers

async function createNotification(
  supabaseClient,
  { userId, type, title, message, contextData = {}, priority = "general" }
) {
  try {
    const { error } = await supabaseClient.from("notifications").insert({
      user_id: userId,
      type,
      title,
      message,
      contextData,
      priority,
    });

    if (error) throw error;
  } catch (err) {
    console.error("Could not create a notification", err);
    throw err;
  }
}

module.exports = { createNotification };
