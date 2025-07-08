const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router
const { calculateMatchScore } = require("../../services/calculateMatchScore");

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

    if (userErr) {
      throw new Error("Error fetching the current user", userErr);
    }

    //get the connections this user has. We get connections from connections table and select the connected streamer id whenever that connection's user_id matches ours
    const { data: connections } = await supabase.from(
      "connections".select("connected_streamer_id").eq("user_id", userId)
    );

    //just to make our life easier map through connections cause each itme in it is a database object. just extract the id and put it in a new array.
    const connectedStreamersIds = connections.map(
      (c) => c.connected_streamer_id
    );
    


    let query = supabase
      .from("profiles")
      .select("*")
      //neq means select all profiles that arent equal to current user session id. We dont want oursevles showing up in recommendation
      .neq("id", userId)
      //ascending false allows us to get newly created streamers first
      .order("created_at", { ascending: false });

    if (streamersError) {
      throw new Error("Error fetching the streamers", streamersError);
    }

    //once we have fetched both the current User and the streamers in our database we need to map through the streamers and for each streamer calculate its match score with user and return the object with a new "score" field which we will use to sort order
    const streamersWithMatchScores = streamers.map((streamer) => {
      const matchScore = calculateMatchScore(currentUser, streamer);

      return {
        ...streamer,
        score: matchScore,
      };
    });

    // Sort by final score. Remember how sort works if its positive then the second one should come before the first one.
    streamersWithMatchScores.sort((a, b) => b.score - a.score);

    //return updated array that was sorted by highest matching first
    res.status(200).json(streamersWithMatchScores);
  } catch (err) {
    console.error("Error fetching either current user or streamers", err);
    return res
      .status(500)
      .json({ error: "Failed fetching either current user or streamers" });
  }
});

module.exports = router;
