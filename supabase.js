// =============================================
// supabase.js — GrooveLink Supabase Config
// =============================================
// Replace the two values below with your own from:
// Supabase Dashboard → Settings → API

const SUPABASE_URL = "https://qkdtgcvmygpivdcikhic.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrZHRnY3ZteWdwaXZkY2lraGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzcwNDAsImV4cCI6MjA4OTQ1MzA0MH0.wGCRhq3coiQtI47fQVwfjA_45-t6ekzIoL6EbEQhIlk";

// Create and export the Supabase client (available globally as `supabase`)
const { createClient } = supabase;
window._supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);