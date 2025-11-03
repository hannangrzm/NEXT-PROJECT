import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jnhxhevdcfsnzhcdvntr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuaHhoZXZkY2ZzbnpoY2R2bnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMDM1OTMsImV4cCI6MjA3NjU3OTU5M30.uVEEiXZ7RnivzN9ygdHnWHZvU5IVM--xMNQpVxCHCTc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);