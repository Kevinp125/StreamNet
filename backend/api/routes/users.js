const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router

router.route("/me").get(authenticateMiddleware, async (req, res) => {
  try {
    //grab profile from profiles tables which equals the same as the req.user.id
    const { data: profile, error } = await req.supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json({ profile });
  } catch (err) {
    console.error("Fetch user profile error", err);
    return res.status(500).json({
      error: "Failed to fetch profile",
    });
  }
});

router.route("/get-all").get(authenticateMiddleware, async (req, res) => {
  try {
    //putting client that we attached to request in a variable for ease of use
    const supabase = req.supabase;

    //fetch all profile rows
    const { data: streamers, error } = await supabase
      .from("profiles")
      .select("*")
      //neq means select all profiles that arent equal to current user session id. We dont want oursevles showing up in recommendation
      .neq("id", req.user.id)
      //ascending false allows us to get newly created streamers first
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json(streamers);
  } catch (err) {
    console.error("Error fetching all the streamers", err);
    return res.status(500).json({ error: "Failed to fetch streamers" });
  }
});

module.exports = router;
