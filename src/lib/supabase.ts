import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase project URL (API endpoint, not dashboard)
const supabaseUrl = 'https://mtmrsmbjllrfmduztofj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10bXJzbWJqbGxyZm1kdXp0b2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTU1ODgsImV4cCI6MjA3Mzc5MTU4OH0.4ZqBEeb0Q4hImYot3ov9ZxHcb-X2bB6v4TF5i4wJ0QQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);