const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const { mergeAndDeduplicateTags } = require("../../services/mergeArrays.js");
const { createNotification } = require("../../services/createNotifHelper.js");
const router = express.Router(); //making a router
const {
  calcAgeScore,
  calcLanguageScore,
  calcGameScore,
} = require("../../services/calculateMatchScore.js");

const WEIGHT_UPDATE_TRESHOLD = 1;
const WEIGHT_INCREASE = 0.1;

//Route will grab a requestId update its status to approved or denied depending on user decision and if it is approved it will post the connection to connections table
router.route("/").post(authenticateMiddleware, async (req, res) => {
  try {
    const { decision, requestId } = req.body;
    const user_id = req.user.id;
    const supabaseClient = req.supabase;

    //first let us get the details on the request that was sent to the user (connection request)
    const { data: request, error: error } = await supabaseClient
      .from("connection_requests")
      .select("sender_id, receiver_id")
      .eq("id", requestId)
      .eq("receiver_id", user_id)
      .eq("status", "pending")
      .single();

    if (error) throw error;

    //after we grab all the request infromtion above check how we need to update request. This is important becayse rest of app checks this field to determine how buttons look
    //when to display requests on dashboard etc
    const { error: updateError } = await supabaseClient
      .from("connection_requests")
      .update({ status: decision === "accept" ? "accepted" : "denied" })
      .eq("id", requestId);

    if (updateError) throw updateError;

    //if user decided to accept connection that is only time we make bi directional connection
    //bi directional in the sense it will appear on my connections and user who sent it
    if (decision === "accept") {
      const { error: connectError } = await supabaseClient
        .from("connections")
        .insert([
          { user_id: request.sender_id, connected_streamer_id: user_id },
          { user_id: user_id, connected_streamer_id: request.sender_id },
        ]);

      if (connectError) throw connectError;
    }

    //201 status code signifies successful processing of a request
    res.status(201).json({
      success: true,
      message: decision === "accept" ? "accepted" : "denied",
    });
  } catch (err) {
    console.error("Error processing the connection request", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

router.route("/").delete(authenticateMiddleware, async (req, res) => {
  try {
    const { connected_streamer_id } = req.body;
    const user_id = req.user.id;
    const supabaseClient = req.supabase;

    //delete a row from connections whenver user id = the user_id column AND the streamer we connected with equals their column OR it is the other way around because we want to also remove connection from other streamers page
    const { error } = await supabaseClient
      .from("connections")
      .delete()
      .or(
        `and(user_id.eq.${user_id},connected_streamer_id.eq.${connected_streamer_id}),and(user_id.eq.${connected_streamer_id},connected_streamer_id.eq.${user_id})`
      );

    if (error) throw error;

    res.status(200).json({ success: true, message: "Connection was deleted!" });
  } catch (err) {
    console.error("Could not remove connection:", err);
    res.status(500).json({ error: "Failed to remove connection", err });
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
    const { data: insertedRequest, error } = await supabaseClient
      .from("connection_requests")
      .insert({
        sender_id: sender_id,
        receiver_id: receiver_id,
        status: "pending",
      })
      .select()
      .single();

    //need this so that notification that we put in table has this information. So when user
    //accepts a request we know which one to accept.

    const requestId = insertedRequest.id;
    if (error) throw error;

    //get data of user that is logged in as well as streamer that was clicked on which will be passed through the body
    const { data: user } = await req.supabase
      .from("profiles")
      .select("*")
      .eq("id", sender_id)
      .single();

    const { data: streamer } = await req.supabase
      .from("profiles")
      .select("*")
      .eq("id", receiver_id)
      .single();

    //get what the users weights are right now
    const { data: userWeights } = await req.supabase
      .from("user_weights")
      .select("*")
      .eq("user_id", sender_id)
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
      .eq("user_id", sender_id);

    //finally we post a notification to the database...
    await createNotification(supabaseClient, {
      userId: receiver_id,
      type: "connection_request",
      title: "New Connection Request",
      message: `@${user.twitchUser} wants to connect with you`,
      contextData: { sender_id: sender_id, request_id: requestId },
      priority: "immediate",
    });

    res.status(201).json({
      success: true,
      message: "Connection request sent and weigths updated",
    });
  } catch (err) {
    console.error("Error sending the connect request or updating weights", err);
    res.status(500).json({ error: "Failed to send request / update weigths" });
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
