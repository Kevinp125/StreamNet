const express = require("express");
const { authenticateUser } = require("../../middleware/middleware");
const router = express.Router(); //making a router

router
  .route("/check-user-exists") // `/api/auth`
  .get(authenticateUser, async (req, res) => {
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

module.exports = router;
