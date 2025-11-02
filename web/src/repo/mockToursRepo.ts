// src/repo/mockToursRepo.ts
import type { Tour, NewTour, UpdateTour } from "../types/tour";

// Basit in-memory veritabanı
let _tours: Tour[] = [
  {
    id: "t1",
    title: "Cappadocia Hot Air Balloon",
    destination: "Cappadocia",
    location: "Göreme, Nevşehir",
    price: 299,
    duration: "1 Day",
    published: true,
    created_by: "mock-user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    thumb: "/assets/img/listing/listing-1.jpg",
    page: "shop_2",
    total_review: 10,
    review: 5,
  },
  {
    id: "t2",
    title: "Antalya Old Town Walk",
    destination: "Antalya",
    location: "Kaleiçi, Antalya",
    price: 149,
    duration: "4 Hours",
    published: true,
    created_by: "mock-user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    thumb: "/assets/img/listing/listing-2.jpg",
    page: "shop_2",
    total_review: 8,
    review: 4.5,
  },
];

const uid = () => Math.random().toString(36).slice(2, 10);

export const mockToursRepo = {
  async list(): Promise<Tour[]> {
    await new Promise((r) => setTimeout(r, 150));
    return [..._tours];
  },

  async create(input: NewTour): Promise<Tour> {
    const now = new Date().toISOString();

    // published ve thumb'ı ayır ki ...rest ile tekrar yazılmasın
    const { published = false, thumb, ...rest } = input;

    const tour: Tour = {
      id: uid(),
      created_by: "mock-user",
      created_at: now,
      updated_at: now,

      // default + kontrollü alanlar
      published,
      thumb: thumb ?? "/assets/img/listing/listing-1.jpg",

      // bu alanlar mock için default
      total_review: 0,
      review: 0,
      page: "shop_2",

      // geriye kalan güvenli alanlar (dup yok)
      ...rest,
    };

    _tours.unshift(tour);
    return tour;
  },

  async update(id: string, patch: UpdateTour): Promise<Tour> {
    const i = _tours.findIndex((t) => t.id === id);
    if (i === -1) throw new Error("Tour not found");

    const now = new Date().toISOString();

    // Tek literal yerine assign kullan: duplicate-property uyarısı çıkmaz
    const updated: Tour = { ..._tours[i] };
    Object.assign(updated, patch, { updated_at: now });
    _tours[i] = updated;

    return updated;
  },

  async remove(id: string): Promise<void> {
    _tours = _tours.filter((t) => t.id !== id);
  },
};
