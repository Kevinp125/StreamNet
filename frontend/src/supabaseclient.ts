//this file legit just makes a supabase client for us

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL, // Supabase URL
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY // Supabase anon key
);
