import { Link } from "react-router-dom";
import type { Review } from "../../../../api/reviews";

interface ReviewDetailsProps {
  reviews: Review[];
}

const ReviewDetails = ({ reviews }: ReviewDetailsProps) => {
  // Filter only approved reviews
  const approvedReviews = reviews.filter(review => review.approved);

  if (approvedReviews.length === 0) {
    return (
      <div className="tg-tour-about-cus-review-wrap mb-25">
        <h4 className="tg-tour-about-title mb-40">0 Reviews</h4>
        <p>No reviews yet. Be the first to review this tour!</p>
      </div>
    );
  }

   return (
      <div className="tg-tour-about-cus-review-wrap mb-25">
         <h4 className="tg-tour-about-title mb-40">{approvedReviews.length} Review{approvedReviews.length !== 1 ? 's' : ''}</h4>
         <ul>
            {approvedReviews.map((review, index) => (
              <li key={review.id}>
                 <div className="tg-tour-about-cus-review d-flex mb-40">
                    <div className="tg-tour-about-cus-review-thumb">
                       <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: '#3498db',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '18px'
                       }}>
                          {review.user?.firstName?.[0] || 'U'}{review.user?.lastName?.[0] || ''}
                       </div>
                    </div>
                    <div>
                       <div className="tg-tour-about-cus-name mb-5 d-flex align-items-center justify-content-between flex-wrap">
                          <h6 className="mr-10 mb-10 d-inline-block">
                             {review.user?.firstName || 'Anonymous'} {review.user?.lastName || ''} 
                             <span> - {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                             })}</span>
                          </h6>
                          <span className="tg-tour-about-cus-review-star mb-10 d-inline-block">
                             {[1, 2, 3, 4, 5].map((star) => (
                                <i key={star} className={`fa-sharp fa-solid fa-star ${star <= review.rating ? '' : 'opacity-50'}`}></i>
                             ))}
                          </span>
                       </div>
                       {review.title && (
                          <h6 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 600 }}>
                             {review.title}
                          </h6>
                       )}
                       <p className="text-capitalize lh-28 mb-10">{review.content}</p>
                       <Link className="tg-tour-about-cus-reply" to="#">Reply</Link>
                    </div>
                 </div>
                 {index < approvedReviews.length - 1 && (
                    <div className="tg-tour-about-border mb-40"></div>
                 )}
              </li>
            ))}
         </ul>
      </div>
   )
}

export default ReviewDetails
