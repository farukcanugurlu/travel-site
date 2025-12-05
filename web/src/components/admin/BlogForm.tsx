// src/components/admin/BlogForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogApiService, { type BlogPost, type BlogCategory } from '../../api/blog';
import ImageUpload from '../common/ImageUpload';

const BlogForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'Admin',
    tags: [] as string[],
    published: false,
    categoryId: '',
  });
  
  const [tagInput, setTagInput] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('url');

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
    if (isEditing && id) {
      fetchBlogData(id);
    }
  }, [id, isEditing]);

  const fetchInitialData = async () => {
    try {
      const data = await blogApiService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchBlogData = async (blogId: string) => {
    try {
      setLoading(true);
      const post = await blogApiService.getPostById(blogId);
      
      console.log('Fetched blog post:', post);
      console.log('Post tags:', post.tags);
      
      const tags = post.tags || [];
      const tagInputValue = tags.length > 0 ? tags.join(', ') : '';
      
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        featuredImage: post.featuredImage || '',
        author: post.author || 'Admin',
        tags: tags,
        published: post.published,
        categoryId: post.category.id,
      });
      setTagInput(tagInputValue);
      
      console.log('Set formData.tags:', tags);
      console.log('Set tagInput:', tagInputValue);
    } catch (err) {
      setError('Failed to fetch blog post data');
      console.error('Error fetching blog post:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Normalize content: remove extra whitespace, normalize line breaks
  const normalizeContent = (content: string): string => {
    if (!content) return '';
    
    let normalized = content
      // First, handle HTML content - convert <br> and <p> tags to newlines
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<p[^>]*>/gi, '')
      // Remove other HTML tags but keep their content
      .replace(/<[^>]+>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Replace multiple spaces with single space (but preserve intentional spacing)
      .replace(/[ \t]{2,}/g, ' ')
      // Replace multiple line breaks (3+) with double line break
      .replace(/\n{3,}/g, '\n\n')
      // Remove spaces before line breaks
      .replace(/ +\n/g, '\n')
      // Remove spaces after line breaks
      .replace(/\n +/g, '\n')
      // Trim each line but preserve intentional line breaks
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 || line === '') // Keep empty lines for paragraph breaks
      .join('\n')
      // Remove leading/trailing whitespace
      .trim()
      // Final cleanup: ensure max 2 consecutive line breaks
      .replace(/\n{3,}/g, '\n\n');
    
    return normalized;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === 'title') {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value),
      });
    } else if (field === 'content') {
      // Normalize content when pasting
      const normalized = normalizeContent(value);
      setFormData({
        ...formData,
        [field]: normalized,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  // Handle paste event to clean up content
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    const normalized = normalizeContent(pastedText);
    
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = formData.content;
    
    const newValue = currentValue.substring(0, start) + normalized + currentValue.substring(end);
    handleInputChange('content', newValue);
    
    // Set cursor position after paste
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + normalized.length;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Blog post title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Blog post content is required');
      return;
    }

    if (!formData.categoryId) {
      setError('Category is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Normalize content before saving
      const normalizedContent = normalizeContent(formData.content);

      const blogData = {
        ...formData,
        content: normalizedContent,
        categoryId: formData.categoryId,
      };

      if (isEditing && id) {
        await blogApiService.updatePost(id, blogData);
      } else {
        await blogApiService.createPost(blogData);
      }

      navigate('/admin/blog');
    } catch (err) {
      setError('Failed to save blog post');
      console.error('Error saving blog post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading blog post data...</div>
      </div>
    );
  }

  return (
    <div className="blog-form">
      <div className="form-header">
        <h1>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
        <button 
          className="btn-back"
          onClick={() => navigate('/admin/blog')}
        >
          ← Back to Blog
        </button>
      </div>

      <form onSubmit={handleSubmit} className="blog-form-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Blog Post Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter blog post title..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="blog-post-slug"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="featuredImage">Featured Image</label>
              <div className="image-input-tabs" style={{ marginBottom: '10px', display: 'flex', gap: '10px', borderBottom: '1px solid #ddd' }}>
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`tab-button ${imageInputMode === 'upload' ? 'active' : ''}`}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    background: imageInputMode === 'upload' ? '#3498db' : 'transparent',
                    color: imageInputMode === 'upload' ? 'white' : '#666',
                    cursor: 'pointer',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                  }}
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`tab-button ${imageInputMode === 'url' ? 'active' : ''}`}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    background: imageInputMode === 'url' ? '#3498db' : 'transparent',
                    color: imageInputMode === 'url' ? 'white' : '#666',
                    cursor: 'pointer',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                  }}
                >
                  Image URL
                </button>
              </div>
              
              {imageInputMode === 'upload' ? (
                <ImageUpload
                  onImageUploaded={(imageUrl) => handleInputChange('featuredImage', imageUrl)}
                  currentImage={formData.featuredImage}
                  label=""
                  folder="blog"
                  maxSize={10}
                />
              ) : (
                <div>
                  <input
                    type="url"
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="form-input"
                  />
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    <p style={{ margin: '5px 0', fontWeight: 600 }}>Stock Photo URLs:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <button
                        type="button"
                        onClick={() => handleInputChange('featuredImage', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80')}
                        className="stock-url-btn"
                        style={{
                          padding: '6px 12px',
                          background: '#f8f9fa',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '12px',
                        }}
                      >
                        🏛️ Turkey Travel - Cappadocia
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('featuredImage', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80')}
                        className="stock-url-btn"
                        style={{
                          padding: '6px 12px',
                          background: '#f8f9fa',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '12px',
                        }}
                      >
                        🏖️ Turkey Beach - Mediterranean
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('featuredImage', 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&q=80')}
                        className="stock-url-btn"
                        style={{
                          padding: '6px 12px',
                          background: '#f8f9fa',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '12px',
                        }}
                      >
                        🕌 Istanbul - Historical Sites
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Admin"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                  handleInputChange('tags', tagsArray);
                }}
                placeholder="Travel, Tips, Turkey"
                className="form-input"
              />
              {formData.tags && formData.tags.length > 0 && (
                <div className="tags-display" style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {formData.tags.map((tag, i) => (
                    <span key={i} className="tag-badge" style={{ 
                      background: '#e3f2fd', 
                      color: '#1976d2', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px' 
                    }}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = formData.tags.filter((_, index) => index !== i);
                          handleInputChange('tags', newTags);
                          setTagInput(newTags.join(', '));
                        }}
                        style={{ 
                          marginLeft: '4px', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          color: '#1976d2'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Brief summary of the blog post..."
              rows={3}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Content */}
        <div className="form-section">
          <h2>Content</h2>
          
          <div className="form-group">
            <label htmlFor="content">Blog Post Content *</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              onPaste={handlePaste}
              placeholder="Write your blog post content here..."
              rows={15}
              className="form-textarea"
              required
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontFamily: 'inherit',
                lineHeight: '1.6'
              }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              <p style={{ margin: '4px 0' }}>💡 Tip: Copy-paste yaptığınızda içerik otomatik olarak temizlenecektir.</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="form-section">
          <h2>Status & Settings</h2>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => handleInputChange('published', e.target.checked)}
              />
              Published
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Blog Post' : 'Create Blog Post')}
          </button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/admin/blog')}
          >
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        .blog-form {
          max-width: 1000px;
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

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .form-header h1 {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .btn-back {
          background: #6c757d;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-back:hover {
          background: #5a6268;
        }

        .blog-form-content {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 24px;
          border-left: 4px solid #dc3545;
        }

        .form-section {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid #f0f0f0;
        }

        .form-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
        }

        .form-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 20px 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .checkbox-group {
          flex-direction: row;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 0 !important;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .btn-save {
          background: #28a745;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-save:hover:not(:disabled) {
          background: #218838;
        }

        .btn-save:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-cancel:hover {
          background: #5a6268;
        }

        @media (max-width: 768px) {
          .form-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogForm;
