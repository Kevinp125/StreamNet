const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router

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
});

module.exports = router;
