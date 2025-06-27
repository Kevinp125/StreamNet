//this file legit just makes a supabase client for us

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!, // Supabase URL
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Supabase super secret private one 
);
