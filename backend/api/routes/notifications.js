const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router

router.route("/").get(authenticateMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const supabaseClient = req.supabase;

    const { data: notifications, error } = await supabaseClient
      .from("notifications")
      .select("*")
      .eq("user_id", user_id)
      .neq("status", "read")
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

module.exports = router;
