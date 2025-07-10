const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router
const {
  calcAgeScore,
  calcLanguageScore,
  calcGameScore,
} = require("../../services/calculateMatchScore.js");

//api route fires whenever a user connects with a streamer.
//Instead of saving a connection or anything though this route handles updating the user weights table depending on what attributes match the user based off that streamer
router.route("/connect").post(authenticateMiddleware, async (req, res) => {
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
    const ageClose = calcAgeScore(user, streamer) > 1;
    //same thing language matches if calc language checks them and they return greater than 1 cause they are same
    const languageMatch = calcLanguageScore(user, streamer) > 1;
    const gameMatch = calcGameScore(user, streamer) > 1;

    //now after we checked why user connected with this streamer. Did he give importance to languages matching, games matching, age?
    //we update all the weights based on the matching
    if (ageClose) userWeights.age_weight += 0.1;
    if (gameMatch) userWeights.game_weight += 0.1;
    if (languageMatch) userWeights.language_weight += 0.1;

    //Below two weight updates since they arent something as binary as same language or range of age we update based on user preference
    //dont need to parse audience_preferences I forgot supabase returns it as an object already not a string
    const audiencePreferences = userWeights.audience_preferences;
    const streamerAudience = streamer.targetAudience; //get what audience the streamer streams too

    //since when users sign up they have a dropdown list of audiences streamers audience will always exist in our JSON of audience preference weights
    //increase the weight of that streamer's audience in our preferences because if we connected with a mature streamer it is because we want to see more of those.
    audiencePreferences[streamerAudience] += 0.1;

    //we need to make a bigger array of tags based off the tags the user has on our platform combined with their tags on twitch that they dont know we are using shhhh
    const allTags = [...(streamer.tags || []), ...(streamer.twitch_tags || [])];

    // Below just makes all tags lowercase so comparison is always good as well as putting them in a set because that auto takes care of duplicates
    const noDupTags = [...new Set(allTags.map((tag) => tag.toLowerCase()))];

    //for each tag the streamer we connected with has
    noDupTags.forEach((tag) => {
      if (userWeights.preferred_tags[tag]) {
        //check the json of preffered tags if that tag exists in there already update the weight on that tag
        userWeights.preferred_tags[tag] += 0.1;
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

module.exports = router;
