import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('xyz.supabase.co')) {
    console.warn('Supabase env vars missing or using placeholder — running in mock-data mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('xyz.supabase.co')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
