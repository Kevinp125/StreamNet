const express = require("express");
const { authenticateMiddleware } = require("../../middleware/authRequest");
const { createNotification } = require("../../services/createNotifHelper");
const { logUserActivity } = require("../../services/activityLogger");
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

    //background processing of notifications after response is sent
    if (privacy_level === "private" && invited_users.length > 0) {
      invited_users.forEach((userId) => {
        createNotification(supabaseClient, {
          userId: userId,
          type: "private_event_invite",
          title: "You are invited to a Private Event!",
          message: `@${req.user.user_metadata.name} invited you to "${title}"`,
          contextData: { event_id: event.id },
          priority: "immediate",
        });
      });
    } else if (privacy_level === "network") {
      const { data: connections } = await supabaseClient
        .from("connections")
        .select("connected_streamer_id")
        .eq("user_id", creator_id);

      connections?.forEach((connection) => {
        createNotification(supabaseClient, {
          userId: connection.connected_streamer_id,
          type: "network_event_announcement",
          title: "New Event from Your Network",
          message: `@${req.user.user_metadata.name} created "${title}" for people in their network`,
          priority: "general",
        });
      });
    } else if (privacy_level === "public") {
      const { data: allUsers } = await supabaseClient
        .from("profiles")
        .select("id");

      allUsers?.forEach((user) => {
        // Don't notify the creator
        if (user.id !== creator_id) {
          createNotification(supabaseClient, {
            userId: user.id,
            type: "public_event_announcement",
            title: "New Public Event Available",
            message: `@${req.user.user_metadata.name} created "${title}" for all check it out!`,
            priority: "general",
          });
        }
      });
    }
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

    //Here we need to attach to each event who rsvped to each event so that in frontend we cna display it
    //Promise.all allows us to make queries run at the same time instead of doing them one after another waiting for each to resolve
    const eventsWithRSVPInfo = await Promise.all(
      events.map(async (event) => {
        //for each event get all the rsvps

        const { data: RSVPS } = await supabaseClient
          .from("event_rsvps")
          .select(
            `status, user_id, profiles!user_id (id, name, twitchUser, profilePic)`
          )
          .eq("event_id", event.id)
          .eq("status", "attending");

        const userRSVP = RSVPS?.find((rsvp) => rsvp.user_id === userId); //this will let us know if our user is rsvped to an event we need this because it will help us persis the button state on frontend "im attending" vs "not going"
        const attendees = RSVPS?.map((rsvp) => rsvp.profiles) ?? []; //this i just to put the attendants in their own array instead of having them be under profiles

        //finally spread the event and attach all these new fields to it
        return {
          ...event,
          userRSVPStatus: userRSVP?.status ?? null,
          attendees: attendees,
          attendeeCount: attendees.length,
        };
      })
    );

    res.status(200).json(eventsWithRSVPInfo);
  } catch (err) {
    console.error("something went wrong when fetching a users events", err);
    res.status(500).json(err);
  }
});

//so this route is going to handle both if user clicks im attending or clicks not going after they saif yes. In case they change their mind.
router.route("/rsvp").post(authenticateMiddleware, async (req, res) => {
  try {
    //in order to log rsvp we need to know what event it is and whether user is attending or they clicked button again and they changed to not going
    const { event_id, status, notification_id } = req.body;
    const user_id = req.user.id;
    const supabaseClient = req.supabase;

    //found on supabase documentation interesting query "upsert" will add a new row for the rsvp if it doesnt exist but if user clicked like not going after
    //rsvping this will update it with that status. Pretty useful
    const { error } = await supabaseClient.from("event_rsvps").upsert(
      {
        event_id,
        user_id,
        status,
      },
      { onConflict: "event_id, user_id" }
    );

    if (error) throw error;

    res.status(200).json({ success: true, message: "RSVP updated" });

    logUserActivity(user_id, "notification_action");

    if (notification_id) {
      await supabaseClient
        .from("notifications")
        .update({ status: "read" })
        .eq("id", notification_id)
        .eq("user_id", user_id);
    }

    const { data: event } = await supabaseClient
      .from("events")
      .select("creator_id, title")
      .eq("id", event_id)
      .single();

    //dont notify if you yourself are rsvping to own event
    if (event && event.creator_id !== user_id) {
      createNotification(supabaseClient, {
        userId: event.creator_id,
        type: "event_rsvp_update",
        title: `${
          status === "attending"
            ? "Someone RSVPed to Your Event"
            : "Someone Opted Out of Your Event"
        }`,
        message: `@${req.user.user_metadata.name} ${
          status === "attending" ? "will attend " : "won't attend "
        } "${event.title}"`,
        priority: "general",
      });
    }
  } catch (err) {
    console.error("Error updating RSVP:", err);
    res.status(500).json({ error: "Failed to update RSVP" });
  }
});

module.exports = router;
