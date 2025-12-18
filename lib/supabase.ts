
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

const supabaseUrl = 'https://avdcjecjlfwkziklghlt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGNqZWNqbGZ3a3ppa2xnaGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjU2NzAsImV4cCI6MjA4MTY0MTY3MH0.ly-V1FMKf8IYYxMrYvn63NHwnsB95NSKxM08oDGKFLE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
