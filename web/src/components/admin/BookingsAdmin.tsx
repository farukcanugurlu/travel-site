// src/components/admin/BookingsAdmin.tsx
import React, { useState, useEffect } from 'react';
import bookingsApiService from '../../api/bookings';
import type { Booking, BookingStats } from '../../api/bookings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faCheck, faTimes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingsAdmin: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {};
      if (filterStatus) filters.status = filterStatus;
      
      const [fetchedBookings, fetchedStats] = await Promise.all([
        bookingsApiService.getBookings(filters),
        bookingsApiService.getBookingStats(),
      ]);
      
      setBookings(fetchedBookings);
      setStats(fetchedStats);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings.');
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await bookingsApiService.updateBookingStatus(id, newStatus);
      toast.success(`Booking ${newStatus} successfully!`);
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error('Failed to update booking status:', err);
      toast.error('Failed to update booking status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingsApiService.deleteBooking(id);
        toast.success('Booking deleted successfully!');
        fetchBookings(); // Refresh list
      } catch (err) {
        console.error('Failed to delete booking:', err);
        toast.error('Failed to delete booking.');
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.tour?.title.toLowerCase().includes(searchLower) ||
      booking.user?.firstName.toLowerCase().includes(searchLower) ||
      booking.user?.lastName.toLowerCase().includes(searchLower) ||
      booking.user?.email.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      case 'completed': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading bookings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="bookings-admin">
      <div className="admin-header">
        <h1>Bookings Management</h1>
        <div className="header-stats">
          {stats && (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.confirmed}</span>
                <span className="stat-label">Confirmed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.cancelled}</span>
                <span className="stat-label">Cancelled</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found matching your criteria.</p>
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Tour</th>
                <th>Customer</th>
                <th>Package</th>
                <th>Participants</th>
                <th>Tour Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className="tour-cell">
                      <img 
                        src={booking.tour?.thumbnail || '/assets/img/listing/listing-1.jpg'} 
                        alt={booking.tour?.title} 
                        className="tour-thumb" 
                      />
                      <div>
                        <div className="tour-title">{booking.tour?.title}</div>
                        <div className="tour-location">{booking.tour?.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-name">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </div>
                      <div className="customer-email">{booking.user?.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="package-cell">
                      <div className="package-name">{booking.package?.name}</div>
                      <div className="package-language">{booking.package?.language}</div>
                    </div>
                  </td>
                  <td>
                    <div className="participants-cell">
                      <div>Adults: {booking.adultCount}</div>
                      {booking.childCount > 0 && <div>Children: {booking.childCount}</div>}
                      {booking.infantCount > 0 && <div>Infants: {booking.infantCount}</div>}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
                      {formatDate(booking.tourDate)}
                    </div>
                  </td>
                  <td>
                    <div className="amount-cell">
                      ${booking.totalAmount}
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        className="btn-action confirm"
                        title="Confirm Booking"
                        disabled={booking.status === 'confirmed'}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        className="btn-action cancel"
                        title="Cancel Booking"
                        disabled={booking.status === 'cancelled'}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="btn-action delete"
                        title="Delete Booking"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .bookings-admin {
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .admin-header h1 {
          font-size: 28px;
          color: #2c3e50;
          margin: 0;
        }

        .header-stats {
          display: flex;
          gap: 20px;
        }

        .stats-grid {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          text-align: center;
          padding: 15px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          min-width: 80px;
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 500;
        }

        .filters-bar {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .search-input, .filter-select {
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 15px;
          flex: 1;
          min-width: 200px;
        }

        .bookings-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow-x: auto;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .bookings-table th, .bookings-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .bookings-table th {
          background: #f8f8f8;
          font-weight: 600;
          color: #555;
          font-size: 15px;
        }

        .bookings-table tbody tr:last-child td {
          border-bottom: none;
        }

        .bookings-table tbody tr:hover {
          background: #fdfdfd;
        }

        .tour-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tour-thumb {
          width: 50px;
          height: 50px;
          border-radius: 6px;
          object-fit: cover;
        }

        .tour-title {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .tour-location {
          font-size: 12px;
          color: #666;
        }

        .customer-name {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .customer-email {
          font-size: 12px;
          color: #666;
        }

        .package-name {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .package-language {
          font-size: 12px;
          color: #666;
          background: #e3f2fd;
          color: #1976d2;
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-block;
        }

        .participants-cell {
          font-size: 14px;
          color: #555;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #555;
        }

        .date-icon {
          color: #3498db;
        }

        .amount-cell {
          font-weight: 600;
          color: #2ecc71;
          font-size: 16px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 16px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .actions-cell {
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .btn-action.confirm {
          background: #2ecc71;
          color: white;
        }

        .btn-action.confirm:hover:not(:disabled) {
          background: #27ae60;
        }

        .btn-action.cancel {
          background: #e74c3c;
          color: white;
        }

        .btn-action.cancel:hover:not(:disabled) {
          background: #c0392b;
        }

        .btn-action.delete {
          background: #95a5a6;
          color: white;
        }

        .btn-action.delete:hover {
          background: #7f8c8d;
        }

        .btn-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 50px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .empty-state p {
          font-size: 18px;
          color: #666;
          margin: 0;
        }

        .loading-spinner, .error-message {
          text-align: center;
          padding: 20px;
          font-size: 18px;
          color: #555;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .stats-grid {
            flex-wrap: wrap;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-input, .filter-select {
            width: 100%;
          }

          .bookings-table-container {
            overflow-x: scroll;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingsAdmin;
