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
  try {
    const userId = req.user.id;
    const supabaseClient = req.supabase;

    //grab all the connections user has we need this to check what network events we can display
    //network events are only displayed if creator is a connection to the user
    const { data: connections, connectionsErr } = await supabaseClient
      .from("connections")
      .select("*")
      .eq("user_id", userId);

    if (connectionsErr) throw connectionsErr;

    //we just need the array of ids that user is connected to
    const connectionIds =
      connections?.map((connection) => connection.connected_streamer_id) ?? [];

    //also get the all events user is invited to (private events)
    const { data: invites, invitesErr } = await supabaseClient
      .from("event_invites")
      .select("event_id")
      .eq("invited_user_id", userId);

    if (invitesErr) throw invitesErr;

    //extract just the event IDs
    const invitedEventIds = invites?.map((invite) => invite.event_id) ?? [];

    //finally run query that gets all events pertianing to user based off privacy levels
    //display all public events
    //or events that are my own
    //or event that are netwokr events and the person who created it is in my connections
    //or event that is private and I am invited to it
    const { data: events, eventsErr } = await supabaseClient
      .from("events")
      .select(` *, profiles!creator_id(id, name, twitchUser, profilePic)`)
      .or(
        `privacy_level.eq.public, creator_id.eq.${userId}, and(privacy_level.eq.network,creator_id.in.(${connectionIds.join(
          ","
        )})), and(privacy_level.eq.private, id.in.(${invitedEventIds.join(
          ","
        )})))`
      )
      .order("event_date", { ascending: true }); //want to order events on the one coming soonest.

    if (eventsErr) throw eventsErr;

    res.status(200).json(events);
  } catch (err) {
    console.error("something went wrong when fetching a users events", err);
    res.status(500).json(err);
  }
});

router.route("/rsvp").post(authenticateMiddleware, async (req, res) => {
  try{




  } catch(err){
    


  }

})

module.exports = router;
