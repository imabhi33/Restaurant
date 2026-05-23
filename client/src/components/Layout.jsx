import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaCalendar, FaUser, FaBars, FaTimes, FaSignOutAlt, FaCrown } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import '../styles/layout.css';
import logoImg from '../assets/logo1.png';
import { restaurantService } from '../services/api';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    const fetchSettings = async () => {
      try {
        const response = await restaurantService.getSettings();
        setSettings(response.data.settings);
      } catch (error) {
        console.error('Error fetching layout settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  const activeLogo = settings?.logoImage || logoImg;

  return (
    <div className="layout">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container navbar-content">
          <div
            className="navbar-brand"
            onClick={() => navigate('/')}
            role="button"
            tabIndex="0"
            style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}
          >
            <img 
              src={activeLogo} 
              alt="Papalicious Logo" 
              style={{ 
                height: '44px', 
                width: 'auto', 
                objectFit: 'contain',
                transition: 'all 0.3s ease',
                filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.45))'
              }} 
            />
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={`navbar-items ${mobileMenuOpen ? 'active' : ''}`}>
            <button
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
            >
              <FaHome /> Home
            </button>

            <button
              className="nav-item"
              onClick={() => {
                if (location.pathname === '/') {
                  const section = document.querySelector('.experiences-carousel-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/', { state: { scrollToExperiences: true } });
                }
                setMobileMenuOpen(false);
              }}
            >
              <FaCrown /> Experiences
            </button>

            {isAuthenticated && (
              <>
                <button
                  className={`nav-item ${isActive('/my-bookings') ? 'active' : ''}`}
                  onClick={() => {
                    navigate('/my-bookings');
                    setMobileMenuOpen(false);
                  }}
                >
                  <FaCalendar /> My Bookings
                </button>
                <button
                  className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
                  onClick={() => {
                    navigate('/profile');
                    setMobileMenuOpen(false);
                  }}
                >
                  <FaUser /> Profile
                </button>
                <button className="nav-item logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <button
                  className={`nav-item ${isActive('/login') ? 'active' : ''}`}
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="nav-item btn btn-primary"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div style={{ marginBottom: '20px' }}>
                <img 
                  src={activeLogo} 
                  alt="Papalicious Logo" 
                  style={{ 
                    height: '52px', 
                    width: 'auto', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4))'
                  }} 
                />
              </div>
              <p>{settings?.description || 'Experience authentic Odia cuisine with premium ambiance and service.'}</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>📍 {settings?.location?.address || 'Cuttack, Odisha'}</p>
              <p>📞 {settings?.contact?.phone || '+91-123-456-7890'}</p>
              <p>✉️ {settings?.contact?.email || 'info@papalicious.com'}</p>
            </div>
            <div className="footer-section">
              <h4>Hours</h4>
              {settings?.openingHours && settings.openingHours.length > 0 ? (
                settings.openingHours.map((h, i) => (
                  <p key={i}>{h.day}: {h.opening} - {h.closing}</p>
                ))
              ) : (
                <>
                  <p>Mon-Fri: 11:00 AM - 10:00 PM</p>
                  <p>Sat-Sun: 10:00 AM - 11:00 PM</p>
                </>
              )}
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <p>
                {settings?.socialLinks?.facebook ? (
                  <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Facebook</a>
                ) : 'Facebook'}
                {' | '}
                {settings?.socialLinks?.instagram ? (
                  <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Instagram</a>
                ) : 'Instagram'}
                {' | '}
                {settings?.socialLinks?.twitter ? (
                  <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Twitter</a>
                ) : 'Twitter'}
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; Papalicious. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
