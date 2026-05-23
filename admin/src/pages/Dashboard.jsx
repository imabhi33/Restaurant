import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookmark, FaCheckCircle, FaClock, FaBan, FaCalendarAlt, FaChartBar, FaUsers } from 'react-icons/fa';
import { adminBookingService } from '../services/api';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, bookingsResponse] = await Promise.all([
        adminBookingService.getBookingStats(),
        adminBookingService.getAllBookings(),
      ]);

      setStats(statsResponse.data.stats);
      setRecentBookings(bookingsResponse.data.bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      icon: FaBookmark,
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      color: '#d4af37',
      accent: 'rgba(212, 175, 55, 0.12)',
      description: 'All time reservations'
    },
    {
      icon: FaCheckCircle,
      title: 'Confirmed',
      value: stats?.confirmedBookings || 0,
      color: '#66bb6a',
      accent: 'rgba(102, 187, 106, 0.12)',
      description: 'Active reservations'
    },
    {
      icon: FaClock,
      title: 'Completed',
      value: stats?.completedBookings || 0,
      color: '#42a5f5',
      accent: 'rgba(66, 165, 245, 0.12)',
      description: 'Served guests'
    },
    {
      icon: FaBan,
      title: 'Cancelled',
      value: stats?.cancelledBookings || 0,
      color: '#ef5350',
      accent: 'rgba(239, 83, 80, 0.12)',
      description: 'Cancelled bookings'
    },
  ] : [];

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-row">
          <div>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back to Papalicious Admin Panel</p>
          </div>
          <div className="dashboard-date-badge">
            <FaCalendarAlt />
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            className="stat-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="stat-icon-wrap" style={{ background: card.accent, borderColor: `${card.color}30` }}>
              <card.icon style={{ color: card.color }} className="stat-icon-svg" />
            </div>
            <div className="stat-content">
              <p className="stat-title">{card.title}</p>
              <h3 className="stat-value" style={{ '--stat-color': card.color }}>{card.value}</h3>
              <p className="stat-desc">{card.description}</p>
            </div>
            <div className="stat-accent-bar" style={{ background: card.color }} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Row */}
      <div className="dashboard-content-row">
        {/* Recent Bookings Table */}
        <motion.div
          className="card recent-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="card-header-row">
            <div className="card-title-wrap">
              <FaChartBar className="card-title-icon" />
              <h3>Recent Reservations</h3>
            </div>
            <span className="card-badge">{recentBookings.length} shown</span>
          </div>

          {/* Desktop table */}
          <div className="bookings-table desktop-only">
            <table>
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Table</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="guest-cell">
                        <FaUsers className="guest-icon" />
                        {booking.guestName}
                      </div>
                    </td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td>
                      <span className="time-chip">{booking.timeSlot}</span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '700' }}>{booking.numberOfGuests}</td>
                    <td>
                      <span className="table-chip">
                        T{booking.tableId?.tableNumber || '–'}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-data-cell">No recent bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile booking cards */}
          <div className="booking-cards-mobile mobile-only">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="booking-card-item">
                <div className="booking-card-top">
                  <span className="booking-guest-name">{booking.guestName}</span>
                  <span className={`status ${booking.status}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="booking-card-meta">
                  <span>📅 {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>🕐 {booking.timeSlot}</span>
                  <span>👥 {booking.numberOfGuests} guests</span>
                  <span>🪑 Table {booking.tableId?.tableNumber || 'N/A'}</span>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <p className="no-data-text">No recent bookings found.</p>
            )}
          </div>
        </motion.div>

        {/* Quick Stats Panel */}
        <motion.div
          className="card quick-stats-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="card-header-row">
            <div className="card-title-wrap">
              <FaChartBar className="card-title-icon" />
              <h3>Quick Overview</h3>
            </div>
          </div>

          <div className="overview-rows">
            {stats && [
              { label: 'Pending', value: stats.pendingBookings || 0, color: '#ffb74d' },
              { label: 'Confirmed', value: stats.confirmedBookings || 0, color: '#66bb6a' },
              { label: 'Completed', value: stats.completedBookings || 0, color: '#42a5f5' },
              { label: 'Cancelled', value: stats.cancelledBookings || 0, color: '#ef5350' },
            ].map(row => (
              <div key={row.label} className="overview-row">
                <div className="overview-label-wrap">
                  <span className="overview-dot" style={{ background: row.color }} />
                  <span className="overview-label">{row.label}</span>
                </div>
                <div className="overview-bar-wrap">
                  <div
                    className="overview-bar"
                    style={{
                      width: stats.totalBookings ? `${Math.round((row.value / stats.totalBookings) * 100)}%` : '0%',
                      background: `linear-gradient(90deg, ${row.color}80 0%, ${row.color} 100%)`
                    }}
                  />
                </div>
                <span className="overview-count" style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Occupancy Ring Visual */}
          <div className="occupancy-summary">
            <div className="occupancy-label">Completion Rate</div>
            <div className="occupancy-value">
              {stats?.totalBookings
                ? `${Math.round(((stats.completedBookings || 0) / stats.totalBookings) * 100)}%`
                : '—'}
            </div>
            <div className="occupancy-sub">of all time bookings served</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
