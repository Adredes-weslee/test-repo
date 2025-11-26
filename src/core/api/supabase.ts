import { createClient } from '@supabase/supabase-js';
import { SUPABASE_FALLBACK } from '../../config/supabase.config';

const supabaseUrl = process.env.SUPABASE_URL || SUPABASE_FALLBACK.URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || SUPABASE_FALLBACK.ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);