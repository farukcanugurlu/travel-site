import type { NewTour, Tour, UpdateTour } from "../types/tour";
// import { supabase } from "../lib/supabase"; // DB'ye geçtiğimizde açacağız

export const supabaseToursRepo = {
  async list(): Promise<Tour[]> {
    // TODO: supabase.from('tours').select('*').eq('published', true)
    return Promise.reject(new Error("Supabase repo not implemented yet"));
  },

  async create(_data: NewTour): Promise<Tour> {
    // argümanı kasıtlı olarak kullanılmadı — lint sustur
    void _data;
    return Promise.reject(new Error("Supabase repo not implemented yet"));
  },

  async update(_id: string, _patch: UpdateTour): Promise<Tour> {
    void _id;
    void _patch;
    return Promise.reject(new Error("Supabase repo not implemented yet"));
  },

  async remove(_id: string): Promise<void> {
    void _id;
    return Promise.reject(new Error("Supabase repo not implemented yet"));
  },
};
