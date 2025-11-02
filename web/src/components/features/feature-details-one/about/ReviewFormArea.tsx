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
   const [rating, setRating] = useState<number>(5);
   const currentUser = authApiService.getCurrentUser();
   const hasReviewed = !!(currentUser && reviews.some(r => r.userId === currentUser.id));

   const categories = [
      { id: 1, title: "Location :" },
      { id: 2, title: "Price :" },
      { id: 3, title: "Amenities :" },
      { id: 4, title: "Rooms :" },
      { id: 5, title: "Services :" },
   ];

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
                             className={`fa-sharp fa-${star <= rating ? "solid" : "regular"} fa-star`}
                             style={{ cursor: hasReviewed ? "not-allowed" : "pointer", opacity: hasReviewed ? 0.5 : 1 }}
                             onClick={() => !hasReviewed && setRating(star)}
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
              <ReviewForm tourId={tourId} rating={rating} onReviewSubmitted={onReviewSubmitted} />
            )}
         </div>
      </div>
   )
}

export default ReviewFormArea
