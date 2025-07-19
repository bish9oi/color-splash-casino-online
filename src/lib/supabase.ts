import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udjlglmidydtbnebgssk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkamxnbG1pZHlkdGJuZWJnc3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNjQxNTIsImV4cCI6MjA1MjkzODE1Mn0.hXwvlKmkfUVX1YfJBxpMXfNsXfhIJg4dNrm7QqGCqeU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);