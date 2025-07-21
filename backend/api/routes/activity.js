const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router();

//router posts a new activity on table
router.route("/").post(authenticateMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const supabaseClient = req.supabase;

    const { activityType } = req.body;

    const { error } = await supabaseClient.from("user_activity").insert({
      user_id: userId,
      activity_type: activityType,
    });

    if (error) {
      throw new Error("Error inserting a user activity into table", error);
    }

    return res
      .status(201)
      .json({ message: "User Activity successfully logged" });
  } catch (err) {
    console.error("Error logging activity", err);
    return res.status(500).json({
      error: "Failed to log activity",
      message: "Internal server error",
    });
  }
});

module.exports = router;
