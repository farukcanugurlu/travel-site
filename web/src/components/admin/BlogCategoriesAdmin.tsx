// src/components/admin/BlogCategoriesAdmin.tsx
import React, { useState, useEffect } from 'react';
import blogApiService, { type BlogCategory } from '../../api/blog';

const BlogCategoriesAdmin: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogApiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        await blogApiService.updateCategory(editingCategory.id, formData);
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat
        ));
      } else {
        const newCategory = await blogApiService.createCategory(formData);
        setCategories([...categories, newCategory]);
      }
      
      resetForm();
    } catch (err) {
      alert('Failed to save category');
      console.error('Error saving category:', err);
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await blogApiService.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      alert('Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="blog-categories-admin">
      <div className="admin-header">
        <div className="header-content">
          <h1>Blog Categories</h1>
          <p>Manage blog post categories</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            ➕ New Category
          </button>
        </div>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="category-form-section">
          <div className="form-header">
            <h3>{editingCategory ? 'Edit Category' : 'New Category'}</h3>
            <button 
              className="btn-close"
              onClick={resetForm}
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="name">Category Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter category name..."
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
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                placeholder="category-slug"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Category description..."
                rows={3}
                className="form-textarea"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="categories-table-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏷️</div>
            <h3>No categories found</h3>
            <p>Create your first category to organize blog posts</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="categories-table">
            <div className="table-header">
              <div className="col-name">Name</div>
              <div className="col-slug">Slug</div>
              <div className="col-description">Description</div>
              <div className="col-actions">Actions</div>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="table-row">
                <div className="col-name">
                  <div className="category-name">{category.name}</div>
                </div>
                
                <div className="col-slug">
                  <div className="category-slug">/{category.slug}</div>
                </div>
                
                <div className="col-description">
                  <div className="category-description">
                    {category.description || 'No description'}
                  </div>
                </div>
                
                <div className="col-actions">
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(category.id)}
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
        .blog-categories-admin {
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
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .category-form-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .form-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
        }

        .category-form {
          display: grid;
          gap: 20px;
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
        .form-textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
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

        .btn-save:hover {
          background: #218838;
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

        .categories-table-container {
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

        .categories-table {
          overflow-x: auto;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 150px 1fr 150px;
          gap: 16px;
          padding: 16px 20px;
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #e0e0e0;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 150px 1fr 150px;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .category-name {
          font-weight: 600;
          color: #2c3e50;
        }

        .category-slug {
          font-size: 14px;
          color: #666;
          font-family: monospace;
        }

        .category-description {
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-edit {
          padding: 6px 12px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
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

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .categories-table {
            font-size: 14px;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .col-name,
          .col-slug,
          .col-description,
          .col-actions {
            display: flex;
            align-items: center;
            padding: 8px 0;
          }

          .col-name::before {
            content: "Name: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-slug::before {
            content: "Slug: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-description::before {
            content: "Description: ";
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

export default BlogCategoriesAdmin;
