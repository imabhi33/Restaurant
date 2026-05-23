import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaClock, FaUsers, FaTrash, FaEye } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { bookingService } from '../services/api';
import '../styles/mybookings.css';

export default function MyBookings() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [cancelBookingId, setCancelBookingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, navigate, filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const filters = filter !== 'all' ? { status: filter } : {};
      const response = await bookingService.getUserBookings(filters);
      setBookings(response.data.bookings);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId, 'Cancelled by customer');
      setBookings(prev => prev.map(b => 
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      confirmed: '#27ae60',
      completed: '#3498db',
      cancelled: '#e74c3c',
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <motion.div
      className="mybookings-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage your restaurant reservations</p>
        </div>

        <div className="filter-buttons">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>No bookings found</h3>
            <p>You haven't made any bookings yet</p>
            <motion.button
              className="btn btn-primary"
              onClick={() => navigate('/booking')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Make a Reservation
            </motion.button>
          </motion.div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                className="booking-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="booking-header">
                  <div>
                    <h3>Booking #{booking.bookingId}</h3>
                    <p>{booking.guestName}</p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail">
                    <FaCalendar /> {new Date(booking.bookingDate).toLocaleDateString()}
                  </div>
                  <div className="detail">
                    <FaClock /> {booking.timeSlot}
                  </div>
                  <div className="detail">
                    <FaUsers /> {booking.numberOfGuests} Guests
                  </div>
                  <div className="detail">
                    Table {booking.tableId.tableNumber}
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="special-requests">
                    <strong>Special Requests:</strong> {booking.specialRequests}
                  </div>
                )}

                <div className="booking-actions">
                  <motion.button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/booking-confirmation/${booking._id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEye /> View Details
                  </motion.button>

                  {['pending', 'confirmed'].includes(booking.status) && (
                    <motion.button
                      className="btn btn-outline"
                      style={{ borderColor: '#e74c3c', color: '#e74c3c' }}
                      onClick={() => setCancelBookingId(booking._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTrash /> Cancel
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* React Portal Cancel Booking Confirmation Modal */}
      <AnimatePresence>
        {cancelBookingId && (
          <ConfirmationModal 
            isOpen={!!cancelBookingId}
            onClose={() => setCancelBookingId(null)}
            onConfirm={() => {
              handleCancel(cancelBookingId);
              setCancelBookingId(null);
            }}
            title="Cancel Booking"
            message="Are you sure you want to cancel this booking? This action is permanent and will release your reserved table."
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Beautiful Custom Confirmation Modal Component for Client Page */
export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(12, 2, 4, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 11000
    }}>
      <motion.div 
        className="booking-form-card"
        style={{ 
          maxWidth: '420px', 
          border: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '30px',
          background: 'rgba(28, 9, 12, 0.95)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7)'
        }}
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontFamily: 'Cinzel, serif', color: 'var(--primary-gold)', letterSpacing: '1px' }}>
            {title || 'Confirm Action'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ff8a80', fontSize: '18px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
        
        <div style={{ fontSize: '14.5px', color: '#eaeaea', lineHeight: '1.6', marginBottom: '25px' }}>
          <p>{message || 'Are you sure you want to proceed with this action?'}</p>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1, padding: '10px' }}>
            No, Keep
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onConfirm}
            style={{ 
              flex: 1, 
              padding: '10px',
              background: 'linear-gradient(135deg, #c62828 0%, #b21e2d 100%)', 
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 15px rgba(198, 40, 40, 0.25)' 
            }}
          >
            Yes, Cancel
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
