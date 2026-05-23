import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaCheck, FaTimes, FaCircle, FaInfoCircle } from 'react-icons/fa';
import { adminBookingService } from '../services/api';
import { toast } from 'react-toastify';
import { ConfirmationModal } from './Experiences';
import '../styles/admin-bookings.css';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteBookingId, setDeleteBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const filters = filter !== 'all' ? { status: filter } : {};
      const response = await adminBookingService.getAllBookings(filters);
      setBookings(response.data.bookings || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminBookingService.updateBookingStatus(bookingId, newStatus);
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      
      if (newStatus === 'completed') {
        toast.success('Reservation marked as Completed! Table is now free for new bookings.');
      } else if (newStatus === 'confirmed') {
        toast.success('Reservation status updated to Confirmed.');
      } else if (newStatus === 'cancelled') {
        toast.warn('Reservation has been Cancelled.');
      } else {
        toast.success(`Reservation status updated to ${newStatus.toUpperCase()}.`);
      }
    } catch (error) {
      toast.error('Failed to update reservation status');
      console.error('Error updating booking:', error);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      // In typical system we just update to cancelled or delete
      // Here we just delete or filter out for demo
      setBookings(prev => prev.filter(b => b._id !== bookingId));
      toast.success('Booking record removed successfully.');
    } catch (error) {
      toast.error('Failed to delete booking');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffb74d',
      confirmed: '#81c784',
      completed: '#64b5f6',
      cancelled: '#e57373',
    };
    return colors[status] || '#95a5a6';
  };

  // Filter bookings by search query
  const searchedBookings = bookings.filter(booking => {
    const query = searchQuery.toLowerCase();
    const bookingIdMatches = booking.bookingId?.toLowerCase().includes(query);
    const nameMatches = booking.guestName?.toLowerCase().includes(query);
    const phoneMatches = booking.guestPhone?.toLowerCase().includes(query);
    const tableMatches = `table ${booking.tableId?.tableNumber}`.toLowerCase().includes(query);
    
    return bookingIdMatches || nameMatches || phoneMatches || tableMatches;
  });

  return (
    <div className="admin-bookings-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1>Manage Reservations</h1>
          <p>Real-time booking ledger and table occupancy panel</p>
        </div>
        
        {/* Glow badge showing that the auto-confirm system is live */}
        <div className="auto-confirm-badge">
          <FaCheck className="check-icon" />
          <span>Auto-Confirm Active</span>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bookings-control-panel">
        {/* Category filters */}
        <div className="filter-buttons">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All Bookings' : status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="search-bar-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID, guest name, phone, or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bookings-search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="loading">Updating reservation ledger...</div>
      ) : (
        <div className="card">
          <div className="bookings-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest Name</th>
                  <th>Contact Details</th>
                  <th>Date & Time</th>
                  <th>Guests</th>
                  <th>Table</th>
                  <th>Status Select</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchedBookings.map((booking) => (
                  <tr key={booking._id} className="booking-row">
                    <td>
                      <strong className="booking-id-tag">{booking.bookingId}</strong>
                    </td>
                    <td style={{ fontWeight: '650' }}>{booking.guestName}</td>
                    <td>
                      <span className="contact-item">{booking.guestPhone}</span>
                      <br />
                      <span className="contact-item email">{booking.guestEmail}</span>
                    </td>
                    <td>
                      <span className="date-badge">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                      <br />
                      <small className="time-badge">{booking.timeSlot}</small>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '700' }}>
                      {booking.numberOfGuests}
                    </td>
                    <td style={{ fontWeight: '700' }}>
                      {booking.tableId ? (
                        <span className="table-badge">Table {booking.tableId.tableNumber}</span>
                      ) : (
                        <span className="table-badge" style={{ color: 'var(--text-muted)', opacity: 0.6, fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className="status-select"
                        style={{ 
                          borderColor: getStatusColor(booking.status),
                          color: getStatusColor(booking.status) 
                        }}
                      >
                        <option value="pending" style={{ color: '#ffb74d' }}>Pending</option>
                        <option value="confirmed" style={{ color: '#81c784' }}>Confirmed</option>
                        <option value="completed" style={{ color: '#64b5f6' }}>Completed</option>
                        <option value="cancelled" style={{ color: '#e57373' }}>Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn-icon delete" onClick={() => setDeleteBookingId(booking._id)} title="Delete Record">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {searchedBookings.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      <FaInfoCircle style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      No matching reservations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* React Portal Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteBookingId && (
          <ConfirmationModal 
            isOpen={!!deleteBookingId}
            onClose={() => setDeleteBookingId(null)}
            onConfirm={() => {
              handleDelete(deleteBookingId);
              setDeleteBookingId(null);
            }}
            title="Remove Booking Record"
            message="Are you sure you want to permanently remove this guest reservation record from the admin ledger?"
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
