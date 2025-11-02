import { useEffect, useState } from "react";
import blogApiService, { type BlogComment } from "../../../api/blog";

interface CommentProps {
  postId?: string;
}

const Comment = ({ postId }: CommentProps) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      const data = await blogApiService.getCommentsByPostId(postId);
      setComments(data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
      return `${day}${suffix} ${month}, ${year}`;
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="tg-tour-about-cus-review-wrap tg-blog-details-review mb-25">
         <div className="text-center py-3">Loading comments...</div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="tg-tour-about-cus-review-wrap tg-blog-details-review mb-25">
         <p className="text-muted">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="tg-tour-about-cus-review-wrap tg-blog-details-review mb-25">
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="mb-40">
            <div className="tg-tour-about-cus-review d-flex">
              <div className="tg-tour-about-cus-review-thumb">
                <img src="/assets/img/blog/details/avatar.png" alt={comment.name} />
              </div>
              <div className="flex-grow-1">
                <div className="tg-tour-about-cus-name">
                  <span>Author</span>
                  <h6>{comment.name}</h6>
                  {comment.website && (
                    <a href={comment.website} target="_blank" rel="noopener noreferrer" className="text-muted">
                      {comment.website}
                    </a>
                  )}
                  <span className="text-muted ms-2" style={{ fontSize: '12px' }}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-capitalize lh-28 mb-10">{comment.content}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comment;
