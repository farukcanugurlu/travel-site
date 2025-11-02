import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { blogApiService } from "../../../api/blog";
import type { BlogPost } from "../../../api/blog";

const RecentPost = () => {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const posts = await blogApiService.getRecentPosts(4);
      setRecentPosts(posts);
    } catch (error) {
      console.error('Failed to fetch recent posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const dayWithSuffix = day === 1 || day === 21 || day === 31 ? `${day}st` : 
                          day === 2 || day === 22 ? `${day}nd` : 
                          day === 3 || day === 23 ? `${day}rd` : 
                          `${day}th`;
    return `${dayWithSuffix} ${month}, ${year}`;
  };

  return (
    <div className="tg-blog-post tg-blog-sidebar-box mb-40">
      <h5 className="tg-blog-sidebar-title mb-25">Recent Posts</h5>
      {loading ? (
        <div className="text-center py-10">
          <span>Loading...</span>
        </div>
      ) : recentPosts.length === 0 ? (
        <div className="text-center py-10">
          <span>No recent posts found</span>
        </div>
      ) : (
        recentPosts.map((item) => (
          <div
            key={item.id}
            className="tg-blog-post-item d-flex align-items-center"
          >
            <div className="tg-blog-post-thumb mr-15">
              <img 
                src={item.featuredImage || '/assets/img/blog/sidebar/post.jpg'} 
                alt={item.title}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <div className="tg-blog-post-content w-100">
              <h4 className="tg-blog-post-title mb-5">
                <Link to={`/blog-details/${item.slug}`}>{item.title}</Link>
              </h4>
              <span className="tg-blog-post-date">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.76501 0.777832V3.26675M4.23413 0.777832V3.26675M0.777344 5.75554H13.2218M2.16006 2.02217H11.8391C12.6027 2.02217 13.2218 2.57933 13.2218 3.26662V11.9778C13.2218 12.6651 12.6027 13.2223 11.8391 13.2223H2.16006C1.39641 13.2223 0.777344 12.6651 0.777344 11.9778V3.26662C0.777344 2.57933 1.39641 2.02217 2.16006 2.02217Z"
                    stroke="#560CE3"
                    strokeWidth="0.977778"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {formatDate(item.createdAt)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentPost;
