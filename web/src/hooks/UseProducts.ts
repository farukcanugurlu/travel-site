import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectProducts, type Product } from "../redux/features/productSlice";

/**
 * Tours sayfasında filtrelemek için local state kullanıyoruz.
 * Bu hook:
 *  - Store'daki ürünleri çeker
 *  - İlk değer olarak local'e koyar
 *  - Store listesi değişirse local'i senkronlar (boş kalmaz)
 */
const UseProducts = () => {
  const storeProducts = useSelector(selectProducts);
  const [products, setProducts] = useState<Product[]>(
    Array.isArray(storeProducts) ? storeProducts : []
  );

  useEffect(() => {
    if (Array.isArray(storeProducts)) {
      setProducts(storeProducts);
    } else {
      setProducts([]);
    }
  }, [storeProducts]);

  return { products, setProducts };
};

export default UseProducts;
