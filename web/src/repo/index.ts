// src/repo/index.ts
import { mockToursRepo } from "./mockToursRepo";

// İleride Supabase'e geçtiğimizde bu import'u açacağız:
// import { supabaseToursRepo } from "./supabaseToursRepo";

const backend = import.meta.env.VITE_BACKEND ?? "mock";

export const toursRepo =
  backend === "supabase"
    ? // ? supabaseToursRepo
      mockToursRepo // şimdilik mock'a sabitle
    : mockToursRepo;
