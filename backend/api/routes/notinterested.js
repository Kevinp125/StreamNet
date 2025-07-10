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
const WEIGHT_DECREASE = 0.1;

//learning from past so this route is going to add a streamer to the not interested table as well as updating the weights for our algorithm negatively since user wasnt interested
router.route("/").post(authenticateMiddleware, async (req, res) => {
  const { streamerId } = req.body;
  const userId = req.user.id;

  const { error: notInterestedError } = await req.supabase
    .from("user_not_interested")
    .insert({
      user_id: userId,
      streamer_id: streamerId,
    });

  if (notInterestedError) throw notInterestedError;

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

  //check if factors matched same as the connections way
  //but this time if say the age was close or the language matched
  //but user picked NOT INTERESTED it is becuase they dont show much importance
  //to those things so LOWER their weights
  const ageClose = calcAgeScore(user, streamer) > WEIGHT_UPDATE_TRESHOLD;
  const languageMatch =
    calcLanguageScore(user, streamer) > WEIGHT_UPDATE_TRESHOLD;
  const gameMatch = calcGameScore(user, streamer) > WEIGHT_UPDATE_TRESHOLD;

  if (ageClose) userWeights.age_weight -= WEIGHT_DECREASE;
  if (gameMatch) userWeights.game_weight -= WEIGHT_DECREASE;
  if (languageMatch) userWeights.language_weight -= WEIGHT_DECREASE;

  //decrease audience preferences since we clicked not interested it means the preference for that audience is lowered
  const audiencePreferences = userWeights.audience_preferences;
  const streamerAudience = streamer.targetAudience; //get what audience the streamer streams too
  //Finally lower the pereference for that specific audience
  audiencePreferences[streamerAudience] -= WEIGHT_DECREASE;

  //grab all the tags the streamer we clicked on has
  const noDupTags = mergeAndDeduplicateTags(
    streamer.tags,
    streamer.twitch_tags
  );

  //for each tag the streamer we connected with has
  noDupTags.forEach((tag) => {
    if (userWeights.preferred_tags[tag]) {
      //check the json of preffered tags if that tag exists in there already update the weight on that tag
      userWeights.preferred_tags[tag] -= WEIGHT_DECREASE;
    } else {
      //if the tag doesnt exist then add it as a new tag and add the intial score of 0.9 which is under the boost for a tag we liked which was 1.1. Just so we can log tags user did not like
      userWeights.preferred_tags[tag] = 0.9;
    }
  });

  
});

module.exports = router;
