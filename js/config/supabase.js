// Configuration Supabase
const SUPABASE_URL = 'https://pinyxawgqikuykbkexzz.supabase.co'; // Remplacez par votre URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbnl4YXdncWlrdXlrYmtleHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTM5MjksImV4cCI6MjA2OTk2OTkyOX0.7l1M773qBgxxhJSznFfLSlKUhXVqhDoD2FRXadSCWc0'; // Remplacez par votre clé

// Initialisation du client Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export pour utilisation dans d'autres modules
export { supabaseClient };
