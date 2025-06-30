const { supabase } = require("../services/supabaseclient");

//function just gets the token from the authorization header by splitting string
function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

/*
 * Middleware to authenticate users via Supabase JWT
 * Verifies the JWT token and attaches user info to req object so we dont have to continously do it on our actual api calls
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Extract JWT from Authorization header
    const JWT = getToken(req);

    if (!JWT) {
      //if there is not JWT then middleware returns with an error there isnt even a token
      return res.status(401).json({
        error: "No JWT token provided",
        message: "Authorization header with Bearer token is required",
      });
    }

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(JWT);

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid or expired token",
        message: "Please log in again",
      });
    }

    // Attach user and supabase client to request object
    req.user = user;
    req.supabase = supabase;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      error: "Authentication failed",
      message: "Internal server error during authentication",
    });
  }
};

module.exports = { authenticateUser };