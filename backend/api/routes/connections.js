const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const { mergeAndDeduplicateTags } = require("../../services/mergeArrays.js");
const router = express.Router(); //making a router
const {
  calcAgeScore,
  calcLanguageScore,
  calcGameScore,
} = require("../../services/calculateMatchScore.js");

const WEIGHT_UPDATE_TRESHOLD = 1;
const WEIGHT_INCREASE = 0.1;

//Route will add a connection to the database table
router.route("/").post(authenticateMiddleware, async (req, res) => {
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

router.route("/").get(authenticateMiddleware, async (req, res) => {
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

//api route fires whenever a user connects with a streamer.
//Instead of saving a connection or anything though this route handles updating the user weights table depending on what attributes match the user based off that streamer
router
  .route("/update-weight")
  .post(authenticateMiddleware, async (req, res) => {
    try {
      const { streamerId } = req.body;
      const userId = req.user.id;

      //get data of user that is logged in as well as streamer that was clicked on which will be passed through the body
      const { data: user } = await req.supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const { data: streamer } = await req.supabase
        .from("profiles")
        .select("*")
        .eq("id", streamerId)
        .single();

      //get what the users weights are right now
      const { data: userWeights } = await req.supabase
        .from("user_weights")
        .select("*")
        .eq("user_id", userId)
        .single();

      //remember calcAgeScore returns 2 or 4 if ages are closer so if its greater than 1 we consider it that user cares about age
      const ageClose = calcAgeScore(user, streamer) > WEIGHT_UPDATE_TRESHOLD;
      //same thing language matches if calc language checks them and they return greater than 1 cause they are same
      const languageMatch =
        calcLanguageScore(user, streamer) > WEIGHT_UPDATE_TRESHOLD;
      const gameMatch = calcGameScore(user, streamer) > WEIGHT_UPDATE_TRESHOLD;

      //now after we checked why user connected with this streamer. Did he give importance to languages matching, games matching, age?
      //we update all the weights based on the matching
      if (ageClose) userWeights.age_weight += WEIGHT_INCREASE;
      if (gameMatch) userWeights.game_weight += WEIGHT_INCREASE;
      if (languageMatch) userWeights.language_weight += WEIGHT_INCREASE;

      //Below two weight updates since they arent something as binary as same language or range of age we update based on user preference
      //dont need to parse audience_preferences I forgot supabase returns it as an object already not a string
      const audiencePreferences = userWeights.audience_preferences;
      const streamerAudience = streamer.targetAudience; //get what audience the streamer streams too

      //since when users sign up they have a dropdown list of audiences streamers audience will always exist in our JSON of audience preference weights
      //increase the weight of that streamer's audience in our preferences because if we connected with a mature streamer it is because we want to see more of those.
      audiencePreferences[streamerAudience] += WEIGHT_INCREASE;

      const noDupTags = mergeAndDeduplicateTags(
        streamer.tags,
        streamer.twitch_tags
      );

      //for each tag the streamer we connected with has
      noDupTags.forEach((tag) => {
        if (userWeights.preferred_tags[tag]) {
          //check the json of preffered tags if that tag exists in there already update the weight on that tag
          userWeights.preferred_tags[tag] += WEIGHT_INCREASE;
        } else {
          //if the tag doesnt exist then add it as a new tag and add the intial boost of 1.1 that is what all new tags will start with
          userWeights.preferred_tags[tag] = 1.1;
        }
      });

      //now that everything is updated accordingly actually save these weights in our database
      await req.supabase
        .from("user_weights")
        .update({
          age_weight: userWeights.age_weight,
          audience_preferences: audiencePreferences,
          game_weight: userWeights.game_weight,
          language_weight: userWeights.language_weight,
          preferred_tags: userWeights.preferred_tags,
        })
        .eq("user_id", userId);

      return res.status(200).json({
        message: "Connection processed and weights have all been updated",
      });
    } catch (err) {
      console.error("Failed to update weights accordingly", err);
      return res
        .status(500)
        .json({ error: "Failed to process weights after connecting" });
    }
  });

router.route("/send-request").post(authenticateMiddleware, async (req, res) => {
  try {
    const { receiver_id } = req.body;
    const sender_id = req.user.id;
    const supabaseClient = req.supabase;

    //check if the request being sent out exists in our table already jic
    const { data: existingRequest } = await supabaseClient
      .from("connection_requests")
      .select("*")
      .eq("sender_id", sender_id)
      .eq("receiver_id", receiver_id)
      .single();

    if (existingRequest) {
      return res.status(400).json({ error: "Request already sent" });
    }

    //since we already checked if the connection request existed previously add the actual connection request now with status pending. We will change it to approved when user clicks accept on their end
    const { error } = await supabaseClient.from("connection_requests").insert({
      sender_id: sender_id,
      receiver_id: receiver_id,
      status: "pending",
    });

    if (error) throw error;

    res.status(201).json({ success: true, message: "Connection request sent" });
  } catch (err) {
    console.error("Error sending the connect request", err);
    res.status(500).json({ error: "Failed to send request" });
  }
});

//route gets all pending-requests the user has from connection requests table so we can display them
router
  .route("/pending-requests")
  .get(authenticateMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const supabaseClient = req.supabase;

      //grab from connect_requests the id, sender, and use supabasejoin syntax to get sender's profile. We get all senders that have corresponding reciever as the user Id and status is pending
      const { data: pendingRequests, error } = await supabaseClient
        .from("connection_requests")
        .select(
          `
        id,
        sender_id,
        created_at,
        profiles!sender_id (*)
      `
        )
        .eq("receiver_id", userId)
        .eq("status", "pending")
        .order("created_at", { ascending: false }); //get most recent requests first

      if (error) throw error;

      //below code just helps us get cleaner response.
      //instead of sender being in profiles it is in sender and we arent copying the id twice.
      const reformattedRequests = pendingRequests.map((request) => ({
        requestId: request.id,
        createdAt: request.created_at,
        sender: request.profiles,
      }));

      res.status(200).json(reformattedRequests);
    } catch (err) {
      console.error(
        "could not get all the pending requests for this user",
        err
      );
      res.status(500).json({ error: "failed to fetch pending requests" });
    }
  });

module.exports = router;
