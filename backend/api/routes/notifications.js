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
      .order("created_at", { ascending: false }); // Most recent first

    if (error) throw error;

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;
