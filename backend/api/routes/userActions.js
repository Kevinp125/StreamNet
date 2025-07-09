const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router

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
  } catch (err) {}
});

module.exports = router;
