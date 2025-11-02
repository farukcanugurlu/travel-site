// src/components/admin/BlogAdmin.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogApiService, { type BlogPost } from '../../api/blog';

const BlogAdmin: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '', // 'published', 'draft'
    search: '',
  });

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams: any = {};
      if (filters.status === 'published') filterParams.published = true;
      if (filters.status === 'draft') filterParams.published = false;
      
      const data = await blogApiService.getPosts(filterParams);
      
      // Search filter
      let filteredData = data;
      if (filters.search) {
        filteredData = data.filter(post => 
          post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.content.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.category.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setPosts(filteredData);
    } catch (err) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await blogApiService.deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      alert('Failed to delete blog post');
      console.error('Error deleting blog post:', err);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const updatedPost = await blogApiService.updatePost(post.id, {
        published: !post.published,
      });
      
      setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
    } catch (err) {
      alert('Failed to update blog post');
      console.error('Error updating blog post:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="blog-admin">
      <div className="admin-header">
        <div className="header-content">
          <h1>Blog Management</h1>
          <p>Manage your blog posts and content</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/blog/new" className="btn-primary">
            ➕ New Blog Post
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="filter-select"
            >
              <option value="">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="blog-table-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No blog posts found</h3>
            <p>Create your first blog post to get started</p>
            <Link to="/admin/blog/new" className="btn-primary">
              Create Post
            </Link>
          </div>
        ) : (
          <div className="blog-table">
            <div className="table-header">
              <div className="col-image">Image</div>
              <div className="col-title">Title</div>
              <div className="col-category">Category</div>
              <div className="col-excerpt">Excerpt</div>
              <div className="col-date">Date</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Actions</div>
            </div>

            {posts.map((post) => (
              <div key={post.id} className="table-row">
                <div className="col-image">
                  <img 
                    src={post.featuredImage || '/assets/img/blog/blog-1.jpg'} 
                    alt={post.title}
                    className="post-thumbnail"
                  />
                </div>
                
                <div className="col-title">
                  <div className="post-title">{post.title}</div>
                  <div className="post-slug">/{post.slug}</div>
                </div>
                
                <div className="col-category">
                  <span className="category-badge">{post.category.name}</span>
                </div>
                
                <div className="col-excerpt">
                  <div className="excerpt-text">
                    {post.excerpt || post.content.substring(0, 100) + '...'}
                  </div>
                </div>
                
                <div className="col-date">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="col-status">
                  <button
                    className={`status-toggle ${post.published ? 'published' : 'draft'}`}
                    onClick={() => togglePublished(post)}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                </div>
                
                <div className="col-actions">
                  <div className="action-buttons">
                    <Link to={`/admin/blog/${post.id}`} className="btn-edit">
                      Edit
                    </Link>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .blog-admin {
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .loading-spinner {
          font-size: 18px;
          color: #666;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .header-content h1 {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .header-content p {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          background: #3498db;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .filters-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .filter-input,
        .filter-select {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #3498db;
        }

        .blog-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 16px;
          border-left: 4px solid #dc3545;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          color: #666;
          margin: 0 0 24px 0;
        }

        .blog-table {
          overflow-x: auto;
        }

        .table-header {
          display: grid;
          grid-template-columns: 80px 1fr 120px 200px 100px 100px 150px;
          gap: 16px;
          padding: 16px 20px;
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #e0e0e0;
        }

        .table-row {
          display: grid;
          grid-template-columns: 80px 1fr 120px 200px 100px 100px 150px;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .post-thumbnail {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
        }

        .post-title {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .post-slug {
          font-size: 12px;
          color: #666;
        }

        .category-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .excerpt-text {
          color: #666;
          font-size: 14px;
          line-height: 1.4;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status-toggle {
          padding: 6px 12px;
          border: none;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-toggle.published {
          background: #d4edda;
          color: #155724;
        }

        .status-toggle.draft {
          background: #fff3cd;
          color: #856404;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-edit {
          padding: 6px 12px;
          background: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-edit:hover {
          background: #2980b9;
        }

        .btn-delete {
          padding: 6px 12px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-delete:hover {
          background: #c0392b;
        }

        @media (max-width: 1200px) {
          .table-header,
          .table-row {
            grid-template-columns: 60px 1fr 100px 150px 80px 80px 120px;
            gap: 12px;
          }
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .blog-table {
            font-size: 14px;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .col-image,
          .col-title,
          .col-category,
          .col-excerpt,
          .col-date,
          .col-status,
          .col-actions {
            display: flex;
            align-items: center;
            padding: 8px 0;
          }

          .col-image::before {
            content: "Image: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-title::before {
            content: "Title: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-category::before {
            content: "Category: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-excerpt::before {
            content: "Excerpt: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-date::before {
            content: "Date: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-status::before {
            content: "Status: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-actions::before {
            content: "Actions: ";
            font-weight: 600;
            margin-right: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogAdmin;
