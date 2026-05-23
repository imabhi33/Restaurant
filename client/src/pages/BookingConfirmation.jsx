import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPrint, FaDownload } from 'react-icons/fa';
import { bookingService } from '../services/api';
import '../styles/confirmation.css';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.data.booking);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!booking) {
    return <div className="error-message">Booking not found</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      className="confirmation-page"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <motion.div
          className="confirmation-card"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="confirmation-header">
            <FaCheckCircle className="success-icon" />
            <h1>Booking Confirmed!</h1>
            <p>Your reservation has been successfully booked</p>
          </div>

          <div className="confirmation-details">
            <div className="detail-section">
              <h3>Booking Reference</h3>
              <p className="booking-id">{booking.bookingId}</p>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Guest Name</label>
                <p>{booking.guestName}</p>
              </div>

              <div className="detail-item">
                <label>Email</label>
                <p>{booking.guestEmail}</p>
              </div>

              <div className="detail-item">
                <label>Phone</label>
                <p>{booking.guestPhone}</p>
              </div>

              <div className="detail-item">
                <label>Number of Guests</label>
                <p>{booking.numberOfGuests}</p>
              </div>

              <div className="detail-item">
                <label>Date</label>
                <p>{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>

              <div className="detail-item">
                <label>Time Slot</label>
                <p>{booking.timeSlot}</p>
              </div>

              <div className="detail-item">
                <label>Table Number</label>
                <p>{booking.tableId.tableNumber}</p>
              </div>

              <div className="detail-item">
                <label>Table Capacity</label>
                <p>{booking.tableId.capacity} guests</p>
              </div>

              <div className="detail-item">
                <label>Status</label>
                <p className="status-badge pending">{booking.status.toUpperCase()}</p>
              </div>

              <div className="detail-item">
                <label>Advance Amount</label>
                <p>₹{booking.advanceAmount}</p>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="special-requests">
                <label>Special Requests</label>
                <p>{booking.specialRequests}</p>
              </div>
            )}
          </div>

          <div className="confirmation-actions">
            <motion.button
              className="btn btn-secondary"
              onClick={handlePrint}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPrint /> Print Confirmation
            </motion.button>

            <motion.button
              className="btn btn-primary"
              onClick={() => navigate('/my-bookings')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Bookings
            </motion.button>
          </div>

          <div className="confirmation-footer">
            <h4>Next Steps</h4>
            <ol>
              <li>You will receive a confirmation email shortly</li>
              <li>Please arrive 10 minutes before your scheduled time</li>
              <li>Present your booking reference at the entrance</li>
              <li>Enjoy your dining experience!</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
