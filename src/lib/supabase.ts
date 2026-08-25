import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
