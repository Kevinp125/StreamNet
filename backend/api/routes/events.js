const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const router = express.Router(); //making a router

router.route("/").post(authenticateMiddleware, async (req, res) => {
  try {
    const creator_id = req.user.id;
    const supabaseClient = req.supabase;

    const {
      title,
      description,
      event_date,
      privacy_level,
      modality,
      location,
      tags,
      invited_users,
    } = req.body;

    //first thing let us just insert the event into our events table

    const { data: event, error: eventErr } = await supabaseClient
      .from("events")
      .insert({
        title,
        description,
        event_date,
        privacy_level,
        modality,
        location,
        tags,
        creator_id,
      })
      .select()
      .single();

    if (eventErr) throw eventErr;

    //if the event we inserted has a privacy level of private it means we need to add to the event_invites tables all the users that were invited so we can display that invite to the right users
    if (privacy_level === "private" && invited_users.length > 0) {
      const invites = invited_users.map((userId) => ({
        event_id: event.id,
        invited_user_id: userId,
      }));

      //after we map through the invited users array and refactor it so that it is an object containing invited user and the event they correspond to insert that to our table
      const { error: inviteError } = await supabaseClient
        .from("event_invites")
        .insert(invites);

      if (inviteError) throw inviteError;
    }

    res
      .status(201)
      .json({ success: true, message: "event was added to database!" });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.route("/").get(authenticateMiddleware, async (req, res) => {
  try{
    const userId = req.user.id;
    const supabaseClient = req.supabase;



  } catch(err){
    




  }  


})

module.exports = router;
