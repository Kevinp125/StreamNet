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

      if(eventError) throw eventError;

      
  } catch (err) {}
});

module.exports = router;
