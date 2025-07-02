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


//this branch will get the streamers and the user that is logged in as well. 
//We will go through each streamer and calculate their score based off audience match / tag matches
//Then on the backend we will sort streamers based off score and return it as the response for the client to 
//display
router.route("/get-all").get(authenticateMiddleware, async (req, res) => {

  
  try {
    //putting client that we attached to request in a variable for ease of use. Same with userId
    const supabase = req.supabase;
    const userId = req.user.id;

    // Get current user
    const { data: currentUser, userErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if(userErr){
      throw new Error('Error fetching the current user', userErr);
    }

    //fetch all profile rows
    const { data: streamers, streamersError } = await supabase
      .from("profiles")
      .select("*")
      //neq means select all profiles that arent equal to current user session id. We dont want oursevles showing up in recommendation
      .neq("id", userId)
      //ascending false allows us to get newly created streamers first
      .order("created_at", { ascending: false });

    if (streamersError) {
      throw new Error('Error fetching the streamers', streamersError);
    }

    return res.status(200).json(streamers);
  } catch (err) {
    console.error("Error fetching all the streamers", err);
    return res.status(500).json({ error: "Failed to fetch streamers" });
  }
});

module.exports = router;
