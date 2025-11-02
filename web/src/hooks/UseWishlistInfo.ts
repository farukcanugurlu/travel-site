import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export const useWishlistInfo = () => {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isInWishlist: (id: string) => wishlistItems.some(item => item.id === id),
  };
};

export default useWishlistInfo;
