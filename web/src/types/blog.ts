// src/types/blog.ts
export type BlogPost = {
  id: number | string;
  slug?: string; // DB/SEO için
  page?: string; // template filtresi ("inner_2" vs.)
  title: string;
  thumb: string; // kapak görseli
  desc?: string; // kısa özet
  content?: string; // detay sayfası içeriği
  date?: string; // "26th Sep, 2024" gibi
  time?: string; // "5 Mins Read" gibi
  author?: string; // "Admin" vb.
  category?: string;
  tags?: string[];
};
