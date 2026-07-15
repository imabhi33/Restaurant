import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaUsers, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { tableService, bookingService } from '../services/api';
import '../styles/booking.css';

export default function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: user?.phone || '',
    numberOfGuests: location.state?.guests || 2,
    bookingDate: location.state?.bookingDate || '',
    timeSlot: location.state?.timeSlot || '',
    tableId: '',
    specialRequests: '',
    totalAmount: 0,
    advanceAmount: 0,
  });

  const timeSlots = [
    '11:00-12:30',
    '12:30-14:00',
    '14:00-15:30',
    '17:00-18:30',
    '18:30-20:00',
    '20:00-21:30',
  ];

  useEffect(() => {
    if (location.state?.bookingDate && location.state?.timeSlot && location.state?.guests) {
      const checkPassedAvailability = async () => {
        setLoading(true);
        try {
          const tables = await tableService.getAvailableTables(
            location.state.bookingDate,
            location.state.timeSlot,
            location.state.guests
          );
          setAvailableTables(tables.data.tables);
          if (tables.data.tables.length === 0) {
            setError('No tables available for the selected date and time');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Error checking availability');
        } finally {
          setLoading(false);
        }
      };
      checkPassedAvailability();
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const checkAvailability = async () => {
    if (!formData.bookingDate || !formData.timeSlot || !formData.numberOfGuests) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const tables = await tableService.getAvailableTables(
        formData.bookingDate,
        formData.timeSlot,
        formData.numberOfGuests
      );
      setAvailableTables(tables.data.tables);
      if (tables.data.tables.length === 0) {
        setError('No tables available for the selected date and time');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error checking availability');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tableId) {
      setError('Please select a table');
      return;
    }

    setLoading(true);
    try {
      const booking = await bookingService.createBooking({
        tableId: formData.tableId,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        numberOfGuests: parseInt(formData.numberOfGuests),
        bookingDate: formData.bookingDate,
        timeSlot: formData.timeSlot,
        specialRequests: formData.specialRequests,
        totalAmount: formData.totalAmount,
        advanceAmount: formData.advanceAmount,
      });

      navigate(`/booking-confirmation/${booking.data.booking._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="booking-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <h1 className="page-title">Reserve Your Table</h1>

        <div className="booking-container">
          <motion.form
            className="booking-form-card"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
          >
            {error && <div className="error-message">{error}</div>}

            <div className="form-section">
              <h3>Guest Information</h3>
              <div className="grid grid-2">
                <div className="form-group">
                  <label><FaUser /> Name</label>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><FaEnvelope /> Email</label>
                  <input
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><FaPhone /> Phone</label>
                  <input
                    type="tel"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><FaUsers /> Number of Guests</label>
                  <select name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Booking Details</h3>
              <div className="grid grid-2">
                <div className="form-group">
                  <label><FaCalendar /> Booking Date</label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    min="2026-07-16"
                    required
                  />
                  <small style={{ color: 'var(--primary-gold)', fontSize: '11px', marginTop: '4px', display: 'block', letterSpacing: '0.5px' }}>
                    * Accepting reservations for the Grand Opening on Rath Yatra (July 16, 2026) onwards!
                  </small>
                </div>

                <div className="form-group">
                  <label><FaClock /> Time Slot</label>
                  <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
                    <option value="">Select Time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <motion.button
                type="button"
                className="btn btn-secondary"
                onClick={checkAvailability}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Checking...' : 'Check Availability'}
              </motion.button>
            </div>

            {availableTables.length > 0 && (
              <div className="form-section">
                <h3>Select Table</h3>
                <div className="tables-grid">
                  {availableTables.map(table => {
                    const isReserved = !!table.currentBooking;
                    return (
                      <motion.div
                        key={table._id}
                        className={`table-option ${isReserved ? 'reserved-disabled' : ''} ${formData.tableId === table._id ? 'selected' : ''}`}
                        onClick={() => {
                          if (isReserved) return;
                          setFormData(prev => ({ ...prev, tableId: table._id }));
                        }}
                        whileHover={isReserved ? {} : { scale: 1.05 }}
                        whileTap={isReserved ? {} : { scale: 0.95 }}
                      >
                        <div className="table-number">Table {table.tableNumber}</div>
                        <div className="table-capacity">Capacity: {table.capacity} guests</div>
                        <div className="table-location">{table.location}</div>
                        {isReserved && (
                          <div className="reserved-badge">
                            Already Reserved by {table.currentBooking.guestName} ({table.currentBooking.numberOfGuests} Guests)
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="form-section">
              <h3>Special Requests</h3>
              <div className="form-group">
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any special preferences? (e.g., window seat, celebration)"
                  rows="3"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.tableId}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </motion.button>
          </motion.form>

          <motion.div
            className="booking-info"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="info-card">
              <h3>🎉 Special Offers</h3>
              <ul>
                <li>10% off on group bookings (6+ guests)</li>
                <li>Complimentary appetizers on weekday bookings</li>
                <li>Free dessert on birthday celebrations</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>📋 Booking Policy</h3>
              <ul>
                <li>50% advance payment required</li>
                <li>Cancellation up to 24 hours before booking</li>
                <li>Maximum duration: 2 hours per table</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>📞 Need Help?</h3>
              <p>Call us: +91-123-456-7890</p>
              <p>Email: bookings@papalicious.com</p>
              <p>Available 24/7</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
