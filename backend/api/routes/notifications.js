const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router

router.route("/").get(authenticateMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const supabaseClient = req.supabase;

    const { data: settings, error: settingsError } = await supabaseClient
      .from("user_notification_settings")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (settingsError) {
      console.error("Error fetching notification settings:", settingsError);
      return res.status(500).json({ error: "Failed to fetch settings" });
    }

    let enabledTypes = [];

    //add types to array we will use this array in query
    if (settings.connection_request_enabled)
      enabledTypes.push("connection_request");
    if (settings.connection_accepted_enabled)
      enabledTypes.push("connection_accepted");
    if (settings.connection_denied_enabled)
      enabledTypes.push("connection_denied");
    if (settings.private_event_invitation_enabled)
      enabledTypes.push("private_event_invitation");
    if (settings.event_rsvp_updates_enabled)
      enabledTypes.push("event_rsvp_updates");
    if (settings.public_event_announcements_enabled)
      enabledTypes.push("public_event_announcement");
    if (settings.network_event_announcements_enabled)
      enabledTypes.push("network_event_announcements");

    let priorityConditions = [];
    if (settings.important_enabled) priorityConditions.push("immediate");
    if (settings.general_enabled) priorityConditions.push("general");

    if (enabledTypes.length === 0 || priorityConditions.length === 0) {
      return res.status(200).json([]);
    }

    await supabaseClient
      .from("notifications")
      .update({
        status: "seen",
        seen_at: new Date().toISOString(),
      })
      .eq("user_id", user_id)
      .eq("status", "delivered")
      .in("type", enabledTypes)
      .in("priority", priorityConditions);

    const { data: notifications, error } = await supabaseClient
      .from("notifications")
      .select("*")
      .eq("user_id", user_id)
      .in("status", ["delivered", "seen"]) //dont show read or pending ones (queued for smart delivery)
      .order("created_at", { ascending: false }); // Most recent first

    if (error) throw error;

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

//will update notifcation status whether it be delivered, read, etc
router.route("/:id").put(authenticateMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id;
    const supabaseClient = req.supabase;

    const { error } = await supabaseClient
      .from("notifications")
      .update({
        status: status,
        //if status for notif is that it was read then update read_at field will need this later for tracking when user is most active viewing notifs
        read_at: status === "read" ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .eq("user_id", user_id);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

router.route("/settings").get(authenticateMiddleware, async (req, res) => {
  try {
    const { data: settings, error } = await req.supabase
      .from("user_notification_settings")
      .select("*")
      .eq("user_id", req.user.id)
      .single();

    if (error) {
      throw new Error(
        "Could not fetch the notification preferences for the user",
        error
      );
    }

    return res.status(200).json({ settings });
  } catch (err) {
    console.error("Could not fetch Notification Settings", err);
    return res.status(500).json({
      error: "Failed to fetch settings",
    });
  }
});

router.route("/settings").patch(authenticateMiddleware, async (req, res) => {
  const supabaseClient = req.supabase;
  const userId = req.user.id;

  try {
    const {
      push_enabled,
      important_enabled,
      general_enabled,
      connection_request_enabled,
      connection_accepted_enabled,
      connection_denied_enabled,
      private_event_invitation_enabled,
      event_rsvp_updates_enabled,
      public_event_announcements_enabled,
      network_event_announcements_enabled,
    } = req.body;

    const { error } = await supabaseClient
      .from("user_notification_settings")
      .update({
        push_enabled,
        important_enabled,
        general_enabled,
        connection_request_enabled,
        connection_accepted_enabled,
        connection_denied_enabled,
        private_event_invitation_enabled,
        event_rsvp_updates_enabled,
        public_event_announcements_enabled,
        network_event_announcements_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      throw new Error("Error updating the notification settings", error);
    }

    return res.status(200).json({
      message: "Notification settings have been updated for user",
    });
  } catch (err) {
    console.error("Error updating notification settings", err);
    return res.status(500).json({
      error: "Could not update notification settings",
    });
  }
});

module.exports = router;
