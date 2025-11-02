// src/components/common/FavoriteButton.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import favoritesApiService from '../../api/favorites';
import authApiService from '../../api/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FavoriteButtonProps {
  tourId: string;
  className?: string;
  showText?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  tourId, 
  className = '', 
  showText = false 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = authApiService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      checkFavoriteStatus();
    }
  }, [currentUser, tourId]);

  const checkFavoriteStatus = async () => {
    if (!currentUser) return;
    
    try {
      const favorite = await favoritesApiService.isFavorite(currentUser.id, tourId);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      toast.error('Please log in to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesApiService.removeFromFavorites(currentUser.id, tourId);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favoritesApiService.addToFavorites(currentUser.id, tourId);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Don't show favorite button if user is not logged in
  }

  return (
    <button
      className={`favorite-button ${className} ${isFavorite ? 'favorited' : ''}`}
      onClick={handleToggleFavorite}
      disabled={loading}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FontAwesomeIcon 
        icon={isFavorite ? faHeartSolid : faHeartRegular} 
        className="favorite-icon"
      />
      {showText && (
        <span className="favorite-text">
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
