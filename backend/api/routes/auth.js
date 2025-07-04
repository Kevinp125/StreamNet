const express = require("express");
const { authenticateUser } = require("../../middleware/middleware");
const router = express.Router(); //making a router

router.route("/check-user-exists").get(authenticateUser, async (req, res) => {
  //authenticateUser will do the token checking for us and attach User to the req body as well as supabase client
  try {
    const { data: allProfiles, error: allError } = await req.supabase
      .from("profiles")
      .select("*");

    // Check if user has profile in database
    const { data: profile, error } = await req.supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .maybeSingle(); //this is meant to return null if no rows are found. Which is what we want because if there are no rows means user is new.

    return res.status(200).json({
      profileExists: !!profile, //double negation returns a boolean of what exactly profile is. If it is null which is false two negations means its false
      user: req.user,
    });
  } catch (err) {
    console.error("Check user exists error:", err);
    return res.status(500).json({
      error: "Failed to check user profile",
      message: "Internal server error",
    });
  }
});

router.route("/create-profile").post(authenticateUser, async (req, res) => {
  try {
    //first couple of things are all bookkeeping. Getting all the information
    //this is info that we get from profiles that are new that are sent in body after form submission
    const { name, dob, targetAudience, tags } = req.body;

    //check if the required fields are populated in case somoeone tries to hit api from route
    if (!name || !dob || !targetAudience || !tags) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //finally send the database query
    const { data: profile, error } = await req.supabase
      .from("profiles")
      .insert({
        //insert all these fields
        id: req.user.id,
        email: req.user.email,
        twitchUser: req.user.user_metadata?.nickname,
        profilePic: req.user.user_metadata?.avatar_url,
        description: req.user.user_metadata?.custom_claims?.description,
        //everything above is info from twitch. Everything below is from form submission
        name,
        dob,
        targetAudience,
        tags,
        created_at: new Date().toISOString(),
      })
      .select() //once thats done select row created
      .single(); //return single one

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (err) {
    console.error("Create profile error:", err);
    return res.status(500).json({
      error: "Failed to create profile",
      message: "Internal server error",
    });
  }
});

module.exports = router;
