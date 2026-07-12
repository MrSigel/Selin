import { createClient } from "@supabase/supabase-js";

/**
 * Supabase-Client für den Browser.
 *
 * WICHTIG: Hier steht ausschließlich der ÖFFENTLICHE anon-Key. Er ist per Design
 * dafür gedacht, im Frontend zu stehen, und wird serverseitig durch Row-Level-Security
 * (RLS) geschützt. Der service_role-Key darf NIEMALS hier oder sonst im Client/Repo
 * landen – er umgeht RLS vollständig.
 */
const SUPABASE_URL = "https://dhsgjhwonkywvzubvleb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoc2dqaHdvbmt5d3Z6dWJ2bGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTk2NjgsImV4cCI6MjA5OTM5NTY2OH0.3_lomcx3o_O9V74AwNjXzUQSMjtUfNBvzaTK79Zimd4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "selin-crm-auth",
  },
});
