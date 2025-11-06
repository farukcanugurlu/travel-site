import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import BlogSidebar from "../blog-sidebar";
import { blogApiService } from "../../../api/blog";
import type { BlogPost } from "../../../api/blog";
import Button from "../../common/Button";

const BlogArea = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const itemsPerPage = 8;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredPosts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredPosts.length / itemsPerPage);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await blogApiService.getPosts({ published: true });
      setBlogPosts(posts);
      setFilteredPosts(posts);
    } catch (err) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search and category
  useEffect(() => {
    setItemOffset(0); // Reset pagination when filtering
    
    let filtered = [...blogPosts];

    // Apply category filter
    if (selectedCategoryId) {
      filtered = filtered.filter((post) => post.category?.id === selectedCategoryId);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((post) => {
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
    }

    setFilteredPosts(filtered);
  }, [blogPosts, searchQuery, selectedCategoryId]);

  // Search function
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Category filter function
  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  // click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % filteredPosts.length;
    setItemOffset(newOffset);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeToRead = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="tg-blog-grid-area pt-130 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading blog posts...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tg-blog-grid-area pt-130 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <div className="text-center py-5">
                <div className="alert alert-danger" role="alert">
                  <h4 className="alert-heading">Error!</h4>
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={fetchBlogPosts}>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tg-blog-grid-area pt-130 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <div className="tg-blog-grid-wrap tg-blog-lg-spacing mr-50">
              {blogPosts.length === 0 ? (
                <div className="text-center py-5">
                  <h3>No blog posts found</h3>
                  <p>Check back later for new content!</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-5">
                  <h3>No results found</h3>
                  <p>Try searching with different keywords.</p>
                </div>
              ) : (
                <>
                  {(searchQuery || selectedCategoryId) && (
                    <div className="mb-20" style={{ fontSize: '14px', color: '#666' }}>
                      Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
                      {selectedCategoryId && (
                        <>
                          {' in '}
                          <strong>
                            {blogPosts.find(p => p.category?.id === selectedCategoryId)?.category?.name || 'category'}
                          </strong>
                        </>
                      )}
                      {searchQuery && (
                        <>
                          {selectedCategoryId ? ' matching' : ' for'} "{searchQuery}"
                        </>
                      )}
                    </div>
                  )}
                  <div className="row">
                    {currentItems.map((post) => (
                      <div key={post.id} className="col-xl-6 col-lg-12 col-md-6">
                        <div className="tg-blog-grid-item mb-30">
                          <div className="tg-blog-standard-thumb mb-15" style={{ 
                            width: '100%',
                            aspectRatio: '16/9',
                            overflow: 'hidden',
                            borderRadius: '8px'
                          }}>
                            <Link to={`/blog-details/${post.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                              <img 
                                className="w-100" 
                                src={post.featuredImage || '/assets/img/blog/blog-1.jpg'} 
                                alt={post.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                              />
                            </Link>
                          </div>
                          <div className="tg-blog-standard-content">
                            <h2 className="tg-blog-standard-title">
                              <Link to={`/blog-details/${post.slug}`}>{post.title}</Link>
                            </h2>
                            <div className="tg-blog-standard-date mb-10">
                              <span>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1.51089 15.2889C1.33312 15.2889 1.15534 15.2 1.06645 15.1111C0.977561 14.9334 0.888672 14.8445 0.888672 14.6667C0.888672 13.4222 1.24423 12.1778 1.86645 11.0222C2.48867 9.95558 3.46645 8.9778 4.53312 8.35558C4.08867 7.82225 3.73312 7.11114 3.55534 6.40003C3.46645 5.68892 3.46645 4.88892 3.64423 4.26669C3.82201 3.55558 4.26645 2.84447 4.71089 2.31114C5.24423 1.7778 5.86645 1.33336 6.48867 1.15558C7.02201 0.977805 7.55534 0.888916 8.08867 0.888916C8.26645 0.888916 8.53312 0.888916 8.71089 0.888916C9.42201 0.977805 10.1331 1.24447 10.7553 1.68892C11.3776 2.13336 11.822 2.66669 12.1776 3.28892C12.5331 3.91114 12.7109 4.62225 12.7109 5.42225C12.7109 6.48892 12.3553 7.55558 11.6442 8.35558C12.1776 8.71114 12.7109 9.06669 13.2442 9.51114C13.9553 10.2222 14.3998 10.9334 14.8442 11.8222C15.1998 12.7111 15.3776 13.6 15.3776 14.5778C15.3776 14.7556 15.2887 14.9334 15.1998 15.0222C15.1109 15.1111 14.9331 15.2 14.7553 15.2C14.6665 15.2 14.5776 15.2 14.4887 15.1111C14.3998 15.1111 14.3109 15.0222 14.3109 14.9334C14.222 14.8445 14.222 14.8445 14.1331 14.7556C14.1331 14.6667 14.0442 14.5778 14.0442 14.4889C14.0442 13.6889 13.8664 12.9778 13.5998 12.2667C13.3331 11.5556 12.8887 10.9334 12.2664 10.4C11.7331 9.95558 11.1998 9.51114 10.5776 9.24447C9.86645 9.68892 9.06645 9.95558 8.08867 9.95558C7.19978 9.95558 6.31089 9.68892 5.59978 9.24447C4.62201 9.68892 3.73312 10.4 3.11089 11.3778C2.48867 12.3556 2.13312 13.4222 2.13312 14.5778C2.13312 14.7556 2.04423 14.9334 1.95534 15.0222C1.86645 15.2 1.68867 15.2889 1.51089 15.2889Z"
                                    fill="#560CE3"
                                  />
                                </svg>
                                by Admin
                              </span>
                              <span>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.76501 0.777771V3.26668M4.23413 0.777771V3.26668M0.777344 5.75548H13.2218M2.16006 2.02211H11.8391C12.6027 2.02211 13.2218 2.57927 13.2218 3.26656V11.9778C13.2218 12.6651 12.6027 13.2222 11.8391 13.2222H2.16006C1.39641 13.2222 0.777344 12.6651 0.777344 11.9778V3.26656C0.777344 2.57927 1.39641 2.02211 2.16006 2.02211Z"
                                    stroke="#560CE3"
                                    strokeWidth="0.977778"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {formatDate(post.createdAt)}
                              </span>
                              <span>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7.99979 3.73329V7.99996L10.8442 9.42218M15.1109 8.00003C15.1109 11.9274 11.9271 15.1111 7.99978 15.1111C4.07242 15.1111 0.888672 11.9274 0.888672 8.00003C0.888672 4.07267 4.07242 0.888916 7.99978 0.888916C11.9271 0.888916 15.1109 4.07267 15.1109 8.00003Z"
                                    stroke="#560CE3"
                                    strokeWidth="1.06667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {getTimeToRead(post.content)}
                              </span>
                            </div>
                            <p className="mb-20 tg-blog-standard-para">
                              {post.excerpt || post.content.substring(0, 150) + '...'}
                            </p>
                            <div className="tg-blog-sidebar-btn">
                              <Link
                                to={`/blog-details/${post.slug}`}
                                className="tg-btn tg-btn-switch-animation"
                              >
                                <Button text="Read More" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {filteredPosts.length > itemsPerPage && (
                <div className="tg-pagenation-wrap text-center pt-80 mb-30">
                  <nav>
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel={<i className="p-btn">Next Page</i>}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      pageCount={pageCount}
                      previousLabel={<i className="p-btn">Previous Page</i>}
                      renderOnZeroPageCount={null}
                    />
                  </nav>
                </div>
              )}
            </div>
          </div>

          <div className="col-xl-3 col-lg-4">
            <BlogSidebar 
              onSearch={handleSearch} 
              searchQuery={searchQuery}
              onCategoryFilter={handleCategoryFilter}
              selectedCategoryId={selectedCategoryId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArea;
