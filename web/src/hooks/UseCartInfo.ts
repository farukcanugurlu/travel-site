/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface CartItem {
   price: number;
   quantity: number;
}

interface CartSummary {
   quantity: number;
   total: number;
}

const UseCartInfo = () => {
   const [quantity, setQuantity] = useState<number>(0);
   const [total, setTotal] = useState<number>(0);

   const cartItems = useSelector((state: any) => state.cart?.cart || []);

   useEffect(() => {
      const cart: CartSummary = (Array.isArray(cartItems) ? cartItems : []).reduce(
         (cartTotal: CartSummary, cartItem: CartItem) => {
            const { price = 0, quantity = 0 } = cartItem;
            const itemTotal = (price || 0) * (quantity || 0);

            cartTotal.total += itemTotal;
            cartTotal.quantity += quantity;

            return cartTotal;
         },
         {
            total: 0,
            quantity: 0,
         }
      );
      setQuantity(cart.quantity);
      setTotal(cart.total);
   }, [cartItems]);
   return {
      quantity,
      total,
   };
}

export default UseCartInfo
