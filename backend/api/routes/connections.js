const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router

//Route will add a connection to the database table
router.route("/add").post(authenticateMiddleware, async (req, res) => {
  try {
    const { connected_streamer_id } = req.body;
    const user_id = req.user.id;
    const supabaseClient = req.supabase;

    const { error } = await supabaseClient.from("connections").insert({
      user_id: user_id,
      connected_streamer_id: connected_streamer_id,
    });

    if (error) throw error;

    //201 status code signifies successful creation of a connection
    res.status(201).json({ success: true, message: "Connection created" });
  } catch (err) {
    console.error("Error creating connection:", err);
    res.status(500).json({ error: "Failed to create connection" });
  }
});

module.exports = router;
