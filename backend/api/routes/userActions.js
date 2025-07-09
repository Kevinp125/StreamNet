const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router
const { calcAgeScore, calcAudienceScore, calcLanguageScore, calcGameScore } = require("../../services/calculateMatchScore.js");

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
    const ageClose = calcAgeScore(user,streamer) > 1;
    //same thing language matches if calc language checks them and they return greater than 1 cause they are same
    const languageMatch = calcLanguageScore(user, streamer) > 1;
    const gameMatch = calcGameScore(user,streamer) >1;
    const audienceMatch = calcAudienceScore(user,streamer) >1;

    //now after we checked why user connected with this streamer. Did he give importance to languages matching, games matching, audiences matching?
    //we update all the weights based on the matching
    if (ageClose) userWeights.age_weight += 0.1;
    if (audienceMatch) userWeights.audience_weight += 0.1;
    if (gameMatch) userWeights.game_weight += 0.1;
    if (languageMatch) userWeights.language_weight += 0.1;

    //for each tag the streamer we connected with has
    streamer.tags.forEach(tag => {
      if (userWeights.preferred_tags[tag]) { //check the json of preffered tags if that tag exists in there already update the weight on that tag
        userWeights.preferred_tags[tag] += 0.1;
      } else { //if the tag doesnt exist then add it as a new tag and add the intial boost of 1.1 that is what all new tags will start with
        userWeights.preferred_tags[tag] = 1.1;
      }
    });



  } catch (err) {}
});

module.exports = router;
