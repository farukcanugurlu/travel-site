// src/components/admin/UsersAdmin.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import usersApiService, { type User, type UserFilters, type CreateUserData, type UpdateUserData } from '../../api/users';

const UsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    isActive: undefined,
  });
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'USER',
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersApiService.getUsers(filters);
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      toast.error('Password is required for new users');
      return;
    }

    try {
      if (editingUser) {
        const updateData: UpdateUserData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        };
        await usersApiService.updateUser(editingUser.id, updateData);
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...updateData } : user
        ));
        toast.success('User updated successfully');
      } else {
        const newUser = await usersApiService.createUser(formData);
        setUsers([...users, newUser]);
        toast.success('User created successfully');
      }
      
      resetForm();
    } catch (err) {
      toast.error('Failed to save user');
      console.error('Error saving user:', err);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = async (user: User) => {
    try {
      // First try to delete without force
      await usersApiService.deleteUser(user.id, false);
      setUsers(users.filter(u => u.id !== user.id));
      toast.success('User deleted successfully');
    } catch (err: any) {
      // Check if error is about bookings
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete user';
      
      if (errorMessage.includes('booking')) {
        // User has bookings, show warning and ask for confirmation
        const bookingCount = errorMessage.match(/\d+/)?.[0] || 'some';
        const confirmMessage = `This user has ${bookingCount} booking(s). Deleting will also delete all associated bookings, reviews, and favorites. Are you sure you want to proceed?`;
        
        if (window.confirm(confirmMessage)) {
          try {
            // Force delete
            await usersApiService.deleteUser(user.id, true);
            setUsers(users.filter(u => u.id !== user.id));
            toast.success('User and associated data deleted successfully');
          } catch (forceErr) {
            toast.error('Failed to delete user');
            console.error('Error force deleting user:', forceErr);
          }
        }
      } else {
        toast.error(errorMessage);
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updatedUser = await usersApiService.toggleUserStatus(id);
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      toast.success(`User ${updatedUser.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'USER',
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleFilterChange = (key: keyof UserFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <div className="header-content">
          <h1>Users Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filters.role || ''}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="USER">User</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={filters.isActive === undefined ? '' : filters.isActive.toString()}
            onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              {!editingUser && (
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'EDITOR' | 'USER' })}
                  required
                >
                  <option value="USER">User</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.firstName?.[0] || user.email[0] || 'U'}
                      </div>
                      <div className="user-details">
                        <div className="user-name">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.email
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="empty-state">
              <p>No users found</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .admin-users {
          max-width: 1200px;
          margin: 0 auto;
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
          margin: 0 0 5px 0;
          font-size: 28px;
          color: #2c3e50;
        }

        .header-content p {
          margin: 0;
          color: #7f8c8d;
        }

        .admin-filters {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .filter-group {
          flex: 1;
        }

        .filter-input, .filter-select {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-input:focus, .filter-select:focus {
          outline: none;
          border-color: #3498db;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .user-form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: flex;
          gap: 15px;
        }

        .form-row .form-group {
          flex: 1;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #2c3e50;
        }

        .form-group input, .form-group select {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .admin-table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #e0e0e0;
        }

        .admin-table td {
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .user-info {
          display: flex;
          align-items: center;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 12px;
        }

        .user-name {
          font-weight: 500;
          color: #2c3e50;
        }

        .role-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .role-admin {
          background: #e74c3c;
          color: white;
        }

        .role-editor {
          background: #f39c12;
          color: white;
        }

        .role-user {
          background: #95a5a6;
          color: white;
        }

        .status-toggle {
          padding: 6px 12px;
          border: none;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .status-toggle.active {
          background: #27ae60;
          color: white;
        }

        .status-toggle.inactive {
          background: #e74c3c;
          color: white;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #3498db;
          color: white;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .btn-secondary {
          background: #95a5a6;
          color: white;
        }

        .btn-secondary:hover {
          background: #7f8c8d;
        }

        .btn-danger {
          background: #e74c3c;
          color: white;
        }

        .btn-danger:hover {
          background: #c0392b;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }

        .error-message {
          background: #e74c3c;
          color: white;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .admin-loading {
          text-align: center;
          padding: 40px;
        }

        .loading-spinner {
          color: #7f8c8d;
        }
      `}</style>
    </div>
  );
};

export default UsersAdmin;

