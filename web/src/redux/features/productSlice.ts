import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import listing_data from "../../data/ListingData";
import type { RootState } from "../store";

/** Tour/Product modeli (normalize) */
export interface Product {
  id: number;
  page: string; // Tours için "shop_2" veya "home_3"
  thumb: string;
  tag?: string;
  featured?: string;
  offer?: string;

  title: string;
  location?: string;
  destination?: string; // yoksa location
  duration?: string; // yoksa time
  time?: string;

  price: number;
  review?: number;
  total_review?: number | string;

  category?: string;
  language?: string;
  desc?: string;
  guest?: string;
  quantity?: number;
}

/* ----------------- yardımcı dönüştürücüler ----------------- */
const toStr = (v: unknown): string | undefined =>
  typeof v === "string" ? v : v != null ? String(v) : undefined;

const toNumber = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d.,]/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const normalizeListingItem = (raw: unknown): Product => {
  const r = (raw ?? {}) as Record<string, unknown>;

  const id = toNumber(r.id);
  const page = String(toStr(r.page) ?? "");
  const thumb = String(toStr(r.thumb) ?? "");
  const title = String(toStr(r.title) ?? "Untitled Tour");

  const location = toStr(r.location);
  const destination = toStr(r.destination) ?? location;
  const duration = toStr(r.duration) ?? toStr(r.time);
  const time = toStr(r.time);

  const price = toNumber(r.price);

  return {
    id,
    page: page.toLowerCase(),
    thumb,
    tag: toStr(r.tag),
    featured: toStr(r.featured),
    offer: toStr(r.offer),

    title,
    location,
    destination,
    duration,
    time,

    price,
    review: typeof r.review === "number" ? r.review : undefined,
    total_review:
      typeof r.total_review === "number" || typeof r.total_review === "string"
        ? (r.total_review as number | string)
        : undefined,

    category: toStr(r.category),
    language: toStr(r.language),
    desc: toStr(r.desc),
    guest: toStr(r.guest),
    quantity: typeof r.quantity === "number" ? r.quantity : undefined,
  };
};

/* -------------------------- slice -------------------------- */
interface ProductState {
  products: Product[];
  product: Product | null;
}

const initialState: ProductState = {
  products: Array.isArray(listing_data)
    ? listing_data.map((x) => normalizeListingItem(x))
    : [],
  product: null,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    single_product: (state, { payload }: PayloadAction<number>) => {
      state.product =
        state.products.find((p) => p.id === Number(payload)) ?? null;
    },
    // İleride Supabase/adminden listeyi yenilersen kullanışlı:
    set_products: (state, { payload }: PayloadAction<unknown[]>) => {
      state.products = payload.map((x) => normalizeListingItem(x));
    },
  },
});

export const { single_product, set_products } = productSlice.actions;

/* ------------------------ selectors ------------------------ */

// Güvenli nested okuma (legacy anahtarlar için any kullanmadan)
const getNested = (
  obj: { [k: string]: unknown } | undefined,
  path: string[]
): unknown =>
  path.reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null) {
      return (acc as { [k: string]: unknown })[key];
    }
    return undefined;
  }, obj);

/** Ürün listesi */
export const selectProducts = (state: RootState): Product[] => {
  // Beklenen yol
  const arr = state.products.products;
  if (Array.isArray(arr)) return arr;

  // “Legacy” olası yollar — tip güvenli
  const s = state as unknown as { [k: string]: unknown };
  const legacyCandidates = [
    getNested(s, ["product", "products"]),
    getNested(s, ["productSlice", "products"]),
    getNested(s, ["Products", "products"]),
  ];

  for (const candidate of legacyCandidates) {
    if (Array.isArray(candidate)) return candidate as Product[];
  }

  // Son çare
  return initialState.products;
};

/** Seçili ürün */
export const selectProduct = (state: RootState): Product | null =>
  state.products.product ?? null;

export default productSlice.reducer;
