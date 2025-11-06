import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { blogApiService } from "../../../api/blog";
import settingsApi, { type SiteSettingsData } from "../../../api/settings";
import type { BlogPost } from "../../../api/blog";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    fetchBlogPosts();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsApi.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const posts = await blogApiService.getPosts({ published: true });
      // Take the first 3 posts: first one for the big card, next 2 for the side cards
      const recentPosts = posts.slice(0, 3);
      setBlogPosts(recentPosts);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      setBlogPosts([]);
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

  const getTimeToRead = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} mins Read`;
  };

  const getFirstPost = () => blogPosts[0];
  const getOtherPosts = () => blogPosts.slice(1, 3);
  return (
    <div className="tg-blog-area tg-blog-space tg-grey-bg pt-135 p-relative z-index-1">
      <img
        className="tg-blog-shape"
        src="/assets/img/blog/shape.png"
        alt="shape"
      />
      <img
        className="tg-blog-shape-2"
        src="/assets/img/blog/shape-2.png"
        alt="shape"
      />
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tg-location-section-title text-center mb-30">
              <h5
                className="tg-section-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".3s"
                data-wow-duration=".9s"
              >
                {settings?.blogSubtitle || "Blog And Article"}
              </h5>
              <h2
                className="mb-15 text-capitalize wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
                dangerouslySetInnerHTML={{
                  __html: settings?.blogTitle || "Latest News & Articles"
                }}
              />
              {settings?.blogDescription && (
                <p
                  className="text-capitalize wow fadeInUp"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                  dangerouslySetInnerHTML={{
                    __html: settings.blogDescription.replace(/\n/g, '<br />')
                  }}
                />
              )}
              {!settings?.blogDescription && (
                <p
                  className="text-capitalize wow fadeInUp"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                >
                  Are you tired of the typical tourist destinations and
                  <br /> looking to step out of your comfort zonetravel
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="col-12 text-center py-50">
              <span>Loading blog posts...</span>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="col-12 text-center py-50">
              <p>No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {getFirstPost() && (
                <div
                  className="col-lg-5 wow fadeInLeft"
                  data-wow-delay=".4s"
                  data-wow-duration=".9s"
                >
                  <div className="tg-blog-item mb-25">
                    <div className="tg-blog-thumb fix">
                      <Link to={`/blog-details/${getFirstPost().slug}`}>
                        <img
                          className="w-100"
                          src={getFirstPost().featuredImage || "/assets/img/blog/blog-1.jpg"}
                          alt={getFirstPost().title}
                        />
                      </Link>
                    </div>
                    <div className="tg-blog-content  p-relative">
                      <span className="tg-blog-tag p-absolute">
                        {getFirstPost().category?.name || "Travel"}
                      </span>
                      <h3 className="tg-blog-title">
                        <Link to={`/blog-details/${getFirstPost().slug}`}>
                          {getFirstPost().title}
                        </Link>
                      </h3>
                      <div className="tg-blog-date">
                        <span className="mr-20">
                          <i className="fa-light fa-calendar"></i> {formatDate(getFirstPost().createdAt)}
                        </span>
                        <span>
                          <i className="fa-regular fa-clock"></i> {getTimeToRead(getFirstPost().content)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-lg-7">
                <div className="row">
                  {getOtherPosts().map((post) => (
                    <div
                      key={post.id}
                      className="col-12 wow fadeInRight"
                      data-wow-delay=".4s"
                      data-wow-duration=".9s"
                    >
                      <div className="tg-blog-item mb-20">
                        <div className="row align-items-center">
                          <div className="col-lg-5">
                            <div className="tg-blog-thumb fix">
                              <Link to={`/blog-details/${post.slug}`}>
                                <img
                                  className="w-100"
                                  src={post.featuredImage || "/assets/img/blog/blog-2.jpg"}
                                  alt={post.title}
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="col-lg-7">
                            <div className="tg-blog-contents">
                              <span className="tg-blog-tag d-inline-block mb-10">
                                {post.category?.name || "Travel"}
                              </span>
                              <h3 className="tg-blog-title title-2 mb-0">
                                <Link to={`/blog-details/${post.slug}`}>{post.title}</Link>
                              </h3>
                              <div className="tg-blog-date">
                                <span className="mr-20">
                                  <i className="fa-light fa-calendar"></i>
                                  {formatDate(post.createdAt)}
                                </span>
                                <span>
                                  <i className="fa-regular fa-clock"></i>{" "}
                                  {getTimeToRead(post.content)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <div
            className="col-12 wow fadeInUp"
            data-wow-delay=".4s"
            data-wow-duration=".9s"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
