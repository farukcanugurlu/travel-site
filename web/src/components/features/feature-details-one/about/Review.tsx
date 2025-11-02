import type { Review as ReviewModel } from "../../../../api/reviews";

interface ReviewProps {
  reviews: ReviewModel[];
  tourDescription?: string;
}

const Review = ({ reviews, tourDescription }: ReviewProps) => {
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Get rating text
  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 3.5) return "Very Good";
    if (rating >= 2.5) return "Good";
    if (rating >= 1.5) return "Fair";
    return "Poor";
  };

  // Calculate category ratings (for now, using average rating for all categories)
  // In future, this could be extended with category-specific ratings
  const categoryRating = averageRating || 0;
  const categoryPercentage = (categoryRating / 5) * 100;

   return (
      <div className="tg-tour-about-review-wrap mb-45">
         <h4 className="tg-tour-about-title mb-15">Customer Reviews</h4>
         <div className="tg-tour-about-review">
            <div className="head-reviews">
               <div className="review-left">
                  <div className="review-info-inner">
                     <h2>{averageRating.toFixed(1)}</h2>
                     <span>{getRatingText(averageRating)}</span>
                     <p>Based On {reviews.length} Review{reviews.length !== 1 ? 's' : ''}</p>
                  </div>
               </div>
               <div className="review-right">
                  <div className="review-progress">
                     <div className="item-review-progress">
                        <div className="text-rv-progress">
                           <p>Location</p>
                        </div>
                        <div className="bar-rv-progress">
                           <div className="progress">
                              <div className="progress-bar" style={{ width: `${categoryPercentage}%` }}> </div>
                           </div>
                        </div>
                        <div className="text-avarage">
                           <p>{categoryRating.toFixed(1)}/5</p>
                        </div>
                     </div>
                     <div className="item-review-progress">
                        <div className="text-rv-progress">
                           <p>Amenities</p>
                        </div>
                        <div className="bar-rv-progress">
                           <div className="progress">
                              <div className="progress-bar" style={{ width: `${categoryPercentage}%` }}> </div>
                           </div>
                        </div>
                        <div className="text-avarage">
                           <p>{categoryRating.toFixed(1)}/5</p>
                        </div>
                     </div>
                     <div className="item-review-progress">
                        <div className="text-rv-progress">
                           <p>Services</p>
                        </div>
                        <div className="bar-rv-progress">
                           <div className="progress">
                              <div className="progress-bar" style={{ width: `${categoryPercentage}%` }}> </div>
                           </div>
                        </div>
                        <div className="text-avarage">
                           <p>{categoryRating.toFixed(1)}/5</p>
                        </div>
                     </div>
                     <div className="item-review-progress">
                        <div className="text-rv-progress">
                           <p>Price</p>
                        </div>
                        <div className="bar-rv-progress">
                           <div className="progress">
                              <div className="progress-bar" style={{ width: `${categoryPercentage}%` }}> </div>
                           </div>
                        </div>
                        <div className="text-avarage">
                           <p>{categoryRating.toFixed(1)}/5</p>
                        </div>
                     </div>
                     <div className="item-review-progress mb-0">
                        <div className="text-rv-progress">
                           <p>Rooms</p>
                        </div>
                        <div className="bar-rv-progress">
                           <div className="progress">
                              <div className="progress-bar" style={{ width: `${categoryPercentage}%` }}> </div>
                           </div>
                        </div>
                        <div className="text-avarage">
                           <p>{categoryRating.toFixed(1)}/5</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Review
export const ReviewSection = Review
