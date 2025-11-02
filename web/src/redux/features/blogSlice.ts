import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

/* ——— Types (DB ile birebir kullanılabilir) ——— */
export type BlogStatus = "draft" | "published";

export interface BlogAuthor {
  name: string;
  avatar?: string;
}

export interface BlogPost {
  id: string; // uuid
  slug: string; // url slug
  title: string;
  excerpt: string;
  cover: string; // image url
  content: string; // (ileride markdown/HTML)
  author: BlogAuthor;
  tags: string[];
  category?: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  status: BlogStatus; // published | draft
}

/* ——— LocalStorage helpers (API geldiğinde çıkarılacak) ——— */
const LS_KEY = "lexor:blog:posts";
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ——— Seed (ilk kez boşsa gösterim için) ——— */
function seedIfEmpty(): BlogPost[] {
  const current = readJSON<BlogPost[]>(LS_KEY, []);
  if (current.length) return current;

  const now = new Date().toISOString();
  const seed: BlogPost[] = [
    {
      id: crypto.randomUUID(),
      slug: "spiritual-sojourn",
      title: "Spiritual Sojourn: Pilgrimage Tours For Soul Seekers",
      excerpt:
        "A gentle intro to pilgrimage routes and how to pick the right journey for your soul—and your schedule.",
      cover: "/assets/img/blog/blog-1.jpg",
      content:
        "Sample content. Replace with real data once admin panel goes live.",
      author: { name: "Lexor Editorial" },
      tags: ["spiritual", "slow-travel"],
      category: "Travel River",
      createdAt: now,
      status: "published",
    },
    {
      id: crypto.randomUUID(),
      slug: "wine-country-escapes",
      title: "Wine Country Escapes: Vineyard Tours For Connoisseurs",
      excerpt:
        "From tastings to terroir: how to spend a long weekend among the vines.",
      cover: "/assets/img/blog/blog-2.jpg",
      content: "Sample content.",
      author: { name: "Lexor Editorial" },
      tags: ["food", "wine"],
      category: "Hiking",
      createdAt: now,
      status: "published",
    },
    {
      id: crypto.randomUUID(),
      slug: "thrills-and-chills",
      title: "Thrills & Chills: Extreme Sports Tours For Adrenaline",
      excerpt:
        "Your starter kit to safely booking high-adrenaline experiences.",
      cover: "/assets/img/blog/blog-3.jpg",
      content: "Sample content.",
      author: { name: "Lexor Editorial" },
      tags: ["adventure"],
      category: "Adventure",
      createdAt: now,
      status: "published",
    },
  ];
  writeJSON(LS_KEY, seed);
  return seed;
}

export interface BlogState {
  items: BlogPost[];
}

const initialState: BlogState = {
  items: seedIfEmpty(),
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setPosts: (state, { payload }: PayloadAction<BlogPost[]>) => {
      state.items = payload;
      writeJSON(LS_KEY, state.items);
    },
    upsertPost: (state, { payload }: PayloadAction<BlogPost>) => {
      const idx = state.items.findIndex((p) => p.id === payload.id);
      if (idx >= 0) {
        state.items[idx] = {
          ...state.items[idx],
          ...payload,
          updatedAt: new Date().toISOString(),
        };
      } else {
        state.items.unshift({
          ...payload,
          id: payload.id || crypto.randomUUID(),
          createdAt: payload.createdAt || new Date().toISOString(),
        });
      }
      writeJSON(LS_KEY, state.items);
    },
    removePost: (state, { payload }: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== payload);
      writeJSON(LS_KEY, state.items);
    },
    publishPost: (
      state,
      { payload }: PayloadAction<{ id: string; status: BlogStatus }>
    ) => {
      const post = state.items.find((p) => p.id === payload.id);
      if (post) {
        post.status = payload.status;
        post.updatedAt = new Date().toISOString();
        writeJSON(LS_KEY, state.items);
      }
    },
    clearAll: (state) => {
      state.items = [];
      writeJSON(LS_KEY, state.items);
    },
  },
});

export const { setPosts, upsertPost, removePost, publishPost, clearAll } =
  blogSlice.actions;

/* ——— Selectors ——— */
export const selectAllPosts = (s: RootState) => s.blog.items;
export const selectPublishedPosts = (s: RootState) =>
  s.blog.items
    .filter((p) => p.status === "published")
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
export const selectPostBySlug = (slug: string) => (s: RootState) =>
  s.blog.items.find((p) => p.slug === slug);

export default blogSlice.reducer;
