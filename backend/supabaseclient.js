//this file legit just makes a supabase client for us

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL, // Supabase URL
  process.env.SUPABASE_SERVICE_ROLE_KEY // Supabase super secret private one
);

module.exports = { supabase };
