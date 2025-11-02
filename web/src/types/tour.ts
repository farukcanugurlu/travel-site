// src/types/tour.ts
export type Tour = {
  id: string;
  title: string;
  destination: string;
  location?: string;
  price: number;
  duration?: string;
  published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  // front-end alanları
  thumb?: string;
  page?: string;
  total_review?: number;
  review?: number;
};

export type NewTour = Omit<
  Tour,
  "id" | "created_at" | "updated_at" | "created_by"
>;

export type UpdateTour = Partial<NewTour>;
