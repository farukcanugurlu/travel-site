import React, { useState } from "react";
import ReviewForm from "../../../forms/ReviewForm";

import type { Review } from "../../../../api/reviews";
import authApiService from "../../../../api/auth";

interface ReviewFormAreaProps {
  tourId: string;
  reviews?: Review[];
  onReviewSubmitted?: () => void;
}

interface DataType {
   id: number;
   title: string;
   rating: string[];
}

const review_data: DataType[] = [
   {
      id: 1,
      title: "Location :",
      rating: ["fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star",]
   },
   {
      id: 2,
      title: "Price :",
      rating: ["fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star",]
   },
   {
      id: 3,
      title: "Amenities :",
      rating: ["fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star",]
   },
   {
      id: 4,
      title: "Rooms :",
      rating: ["fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star",]
   },
   {
      id: 5,
      title: "Services :",
      rating: ["fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star", "fa-sharp fa-solid fa-star",]
   },
];

const ReviewFormArea = ({ tourId, reviews = [], onReviewSubmitted }: ReviewFormAreaProps) => {
   // Her kategori için ayrı rating state'i
   const [ratings, setRatings] = useState<Record<number, number>>({
      1: 5, // Location
      2: 5, // Price
      3: 5, // Amenities
      4: 5, // Rooms
      5: 5, // Services
   });
   
   const currentUser = authApiService.getCurrentUser();
   const hasReviewed = !!(currentUser && reviews.some(r => r.userId === currentUser.id));

   const categories = [
      { id: 1, title: "Location :" },
      { id: 2, title: "Price :" },
      { id: 3, title: "Amenities :" },
      { id: 4, title: "Rooms :" },
      { id: 5, title: "Services :" },
   ];

   // Ortalama rating hesapla
   const calculateAverageRating = () => {
      const values = Object.values(ratings);
      const sum = values.reduce((acc, val) => acc + val, 0);
      return Math.round((sum / values.length) * 10) / 10; // 1 ondalık basamak ile yuvarla
   };

   const handleRatingChange = (categoryId: number, star: number) => {
      if (hasReviewed) return;
      setRatings(prev => ({
         ...prev,
         [categoryId]: star
      }));
   };

   return (
      <div className="tg-tour-about-review-form-wrap mb-45">
         <h4 className="tg-tour-about-title mb-5">Leave a Reply</h4>
         <div className="tg-tour-about-rating-category mb-20">
            <ul>
              {categories.map((item) => (
                 <li key={item.id}>
                    <label>{item.title}</label>
                    <div className="rating-icon">
                       {[1,2,3,4,5].map((star) => (
                          <i
                             key={star}
                             className={`fa-sharp fa-${star <= ratings[item.id] ? "solid" : "regular"} fa-star`}
                             style={{ 
                                cursor: hasReviewed ? "not-allowed" : "pointer", 
                                opacity: hasReviewed ? 0.5 : 1,
                                color: star <= ratings[item.id] ? '#ffa500' : '#ccc'
                             }}
                             onClick={() => handleRatingChange(item.id, star)}
                             onMouseEnter={(e) => {
                                if (!hasReviewed) {
                                   e.currentTarget.style.transform = 'scale(1.2)';
                                }
                             }}
                             onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                             }}
                          ></i>
                       ))}
                    </div>
                 </li>
              ))}
            </ul>
         </div>
         <div className="tg-tour-about-review-form">
            {hasReviewed ? (
              <div className="alert" style={{ color: '#e74c3c' }}>You have already submitted a review for this tour.</div>
            ) : (
              <ReviewForm 
                tourId={tourId} 
                rating={calculateAverageRating()} 
                onReviewSubmitted={onReviewSubmitted} 
              />
            )}
         </div>
      </div>
   )
}

export default ReviewFormArea
