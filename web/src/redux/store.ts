// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import products from "./features/productSlice";
import blog from "./features/blogSlice";
import wishlist from "./features/wishlistSlice";
import cart from "./features/cartSlice";

export const store = configureStore({
  reducer: {
    products,
    blog,
    wishlist,
    cart,
  },
  middleware: (getDefault) => getDefault(),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
