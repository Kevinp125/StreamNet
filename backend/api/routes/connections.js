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

router.route("/get-all").get(authenticateMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const supabaseClient = req.supabase;

    const { data: connectionProfiles, error } = await supabaseClient
      .from("connections")
      //below syntax is interesting. The exclamation mark in supabase connects table by their foreign key relationships. Since connected_streamer_id
      //is a foreign key to id in profiles table it points to all that information. ! joins them so for each connected_streamer_id it looks at the corresponding
      //id in profiles table it is pointing at and returns all of that profiles columns. So all the streamer information we need to populate the cards.
      .select("profiles!connected_streamer_id (*)")
      .eq("user_id", user_id);

    if (error) throw error;

    //need to do this because since above we are doing ! it wraps each connection profile in a profiles object which we dont need
    const userConnections = connectionProfiles.map(
      (connection) => connection.profiles
    );

    res.status(200).json(userConnections);
  } catch (err) {
    console.error("Error fetching all the connections", err);
    res.status(500).json({ error: "Failed to fetch all the connections" });
  }
});

module.exports = router;
