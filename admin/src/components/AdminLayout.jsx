import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaCalendar, FaUtensils, FaTable, FaSignOutAlt, FaBars, FaTimes, FaCrown, FaCog } from 'react-icons/fa';
import useAdminAuth from '../hooks/useAdminAuth';
import '../styles/admin-layout.css';
import logoImg from '../assets/logo1.png';
import { adminRestaurantService } from '../services/api';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, admin, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [settings, setSettings] = useState(null);
  const sidebarRef = useRef(null);

  const fetchSettings = async () => {
    try {
      const response = await adminRestaurantService.getSettings();
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching settings in AdminLayout:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchSettings();

    const handleLogoUpdate = () => {
      fetchSettings();
    };

    window.addEventListener('logoUpdated', handleLogoUpdate);
    return () => {
      window.removeEventListener('logoUpdated', handleLogoUpdate);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FaCalendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: FaTable, label: 'Tables', path: '/admin/tables' },
    { icon: FaUtensils, label: 'Menu', path: '/admin/menu' },
    { icon: FaCrown, label: 'Experiences', path: '/admin/experiences' },
    { icon: FaCog, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}
      >
        {/* Sidebar Header with Logo and Close Button (mobile) */}
        <div className="sidebar-header">
          <div className="sidebar-logo-wrap">
            <img
              src={settings?.logoImage || logoImg}
              alt="Papalicious Logo"
              className="sidebar-logo-img"
            />
            {(sidebarOpen && !isMobile) && (
              <span className="sidebar-brand-name">Papalicious</span>
            )}
          </div>
          {/* Close button visible only on mobile inside the sidebar */}
          {isMobile && sidebarOpen && (
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              title="Close Sidebar"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`menu-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                <Icon className="menu-icon" />
                {(sidebarOpen) && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="menu-item logout"
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt className="menu-icon" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${isMobile && sidebarOpen ? 'sidebar-visible' : ''}`}>
        <header className="admin-header">
          {/* Hamburger Toggle Button */}
          <button
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
          >
            {sidebarOpen && !isMobile ? <FaTimes /> : <FaBars />}
          </button>

          {/* Page breadcrumb */}
          <div className="header-breadcrumb">
            <span className="breadcrumb-text">
              {menuItems.find(m => m.path === location.pathname)?.label || 'Admin'}
            </span>
          </div>

          <div className="header-right">
            {admin && (
              <div className="admin-info">
                <span className="admin-name">{admin.name}</span>
                <span className="admin-email">{admin.email}</span>
              </div>
            )}
          </div>
        </header>

        <main className="admin-content">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
