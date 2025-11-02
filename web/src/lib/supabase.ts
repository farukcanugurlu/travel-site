// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const TOUR_IMAGES_BUCKET = "tour-images";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Dev sırasında anlaşılır bir hata verelim
  // (production'da console.error yeterli)
  throw new Error(
    "Missing Supabase env: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
