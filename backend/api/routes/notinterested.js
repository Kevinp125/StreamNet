const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router
const {
  calcAgeScore,
  calcLanguageScore,
  calcGameScore,
} = require("../../services/calculateMatchScore.js");


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

  
});

module.exports = router;
