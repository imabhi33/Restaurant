import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCrown, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaTimes, 
  FaMicrophone, 
  FaQuoteLeft, 
  FaBookOpen, 
  FaMusic, 
  FaToggleOn, 
  FaToggleOff 
} from 'react-icons/fa';
import { adminEventService } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/admin-experiences.css';

export default function Experiences() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    timing: '',
    badge: '',
    accentColor: '#d4af37',
    icon: 'FaMicrophone',
    isActive: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch all events (including inactive ones) by passing true
      const response = await adminEventService.getAllEvents(true);
      setEvents(response.data.events || []);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditEvent(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      timing: '',
      badge: '',
      accentColor: '#d4af37',
      icon: 'FaMicrophone',
      isActive: true
    });
  };

  const handleAddClick = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (event) => {
    setEditEvent(event);
    setFormData({
      title: event.title,
      subtitle: event.subtitle,
      description: event.description,
      timing: event.timing,
      badge: event.badge,
      accentColor: event.accentColor || '#d4af37',
      icon: event.icon || 'FaMicrophone',
      isActive: event.isActive !== undefined ? event.isActive : true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subtitle || !formData.description || !formData.timing || !formData.badge) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (editEvent) {
        await adminEventService.updateEvent(editEvent._id, formData);
        toast.success('Experience updated successfully!');
      } else {
        await adminEventService.createEvent(formData);
        toast.success('New Experience added successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [deleteEventId, setDeleteEventId] = useState(null);

  const handleDelete = async (eventId) => {
    try {
      await adminEventService.deleteEvent(eventId);
      toast.success('Experience deleted successfully.');
      setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
    } catch (error) {
      toast.error('Failed to delete experience');
      console.error(error);
    }
  };

  const handleToggleActive = async (event) => {
    try {
      const updatedStatus = !event.isActive;
      await adminEventService.updateEvent(event._id, { ...event, isActive: updatedStatus });
      toast.success(`Experience ${updatedStatus ? 'activated' : 'deactivated'} successfully.`);
      setEvents((prev) => 
        prev.map((e) => e._id === event._id ? { ...e, isActive: updatedStatus } : e)
      );
    } catch (error) {
      toast.error('Failed to toggle status');
      console.error(error);
    }
  };

  const getIconElement = (iconName) => {
    switch (iconName) {
      case 'FaMicrophone': return <FaMicrophone />;
      case 'FaQuoteLeft': return <FaQuoteLeft />;
      case 'FaBookOpen': return <FaBookOpen />;
      case 'FaMusic': return <FaMusic />;
      default: return <FaMicrophone />;
    }
  };

  const modalRoot = document.body;

  return (
    <div className="admin-experiences-page fade-in">
      <div className="cockpit-header-row">
        <div>
          <h2 className="cockpit-main-title">Cultural Experiences Cockpit</h2>
          <p className="cockpit-subtitle">Orchestrate the non-dining activities shown on the grand-opening landing page.</p>
        </div>
        <button className="btn btn-primary create-btn" onClick={handleAddClick}>
          <FaPlus /> Create Experience
        </button>
      </div>

      <div className="card list-card">
        <h3>Experiences Registry</h3>
        {loading && events.length === 0 ? (
          <div className="loading">Fetching Experiences...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <FaCrown className="empty-icon" />
            <p>No cultural experiences registered yet. Press the golden button to seed your first event!</p>
          </div>
        ) : (
          <div className="ledger-table-wrapper">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Badge & Details</th>
                  <th>Timing</th>
                  <th>Theme Accent</th>
                  <th>Icon</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className={!event.isActive ? 'inactive-row' : ''}>
                    <td>
                      <div className="experience-detail-cell">
                        <span 
                          className="exp-badge" 
                          style={{ 
                            borderColor: event.accentColor + '40', 
                            color: event.accentColor, 
                            backgroundColor: event.accentColor + '10' 
                          }}
                        >
                          {event.badge}
                        </span>
                        <div className="exp-titles">
                          <span className="exp-main-title">{event.title}</span>
                          <span className="exp-subtitle">{event.subtitle}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="timing-cell">{event.timing}</span></td>
                    <td>
                      <div className="color-cell-wrapper">
                        <span className="color-dot" style={{ backgroundColor: event.accentColor }}></span>
                        <code>{event.accentColor}</code>
                      </div>
                    </td>
                    <td>
                      <div className="icon-preview-badge" style={{ color: event.accentColor }}>
                        {getIconElement(event.icon)}
                        <span className="icon-lbl">{event.icon}</span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className={`status-toggle-btn ${event.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleActive(event)}
                        title={event.isActive ? 'Click to Deactivate' : 'Click to Activate'}
                      >
                        {event.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        <span>{event.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" onClick={() => handleEditClick(event)} title="Edit">
                          <FaEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => setDeleteEventId(event._id)} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* React Portal Modal Backdrop Overlay */}
      {createPortal(
        <AnimatePresence>
          {showModal && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div 
                className="modal-card"
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>{editEvent ? 'Edit Cultural Experience' : 'Create New Cultural Experience'}</h2>
                  <button className="close-btn" onClick={() => setShowModal(false)}>
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form vertical-form">
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label>Event Title</label>
                      <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Royal Open Mic Spotlight"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Event Subtitle</label>
                      <input 
                        type="text" 
                        name="subtitle" 
                        value={formData.subtitle} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Share Your Voice"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Badge text (Caps)</label>
                      <input 
                        type="text" 
                        name="badge" 
                        value={formData.badge} 
                        onChange={handleInputChange} 
                        placeholder="e.g. LIVE MUSIC & COMEDY"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Timing Schedule</label>
                      <input 
                        type="text" 
                        name="timing" 
                        value={formData.timing} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Every Friday & Saturday, 8:00 PM"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Accent Theme Color</label>
                      <select 
                        name="accentColor" 
                        value={formData.accentColor} 
                        onChange={handleInputChange}
                      >
                        <option value="#d4af37">Gold Monarch (#d4af37)</option>
                        <option value="#b21e2d">Crimson Sunset (#b21e2d)</option>
                        <option value="#aa8214">Amber Heritage (#aa8214)</option>
                        <option value="#e57373">Rose Symphonie (#e57373)</option>
                        <option value="#9c27b0">Royal Purple (#9c27b0)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Display Icon</label>
                      <select 
                        name="icon" 
                        value={formData.icon} 
                        onChange={handleInputChange}
                      >
                        <option value="FaMicrophone">🎤 Microphone (FaMicrophone)</option>
                        <option value="FaQuoteLeft">❝ Quotes Mehfil (FaQuoteLeft)</option>
                        <option value="FaBookOpen">📖 Book/Tales (FaBookOpen)</option>
                        <option value="FaMusic">🎵 Sitar/Music (FaMusic)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Detailed Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      placeholder="Enter engaging description to attract visitors..."
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <input 
                      type="checkbox" 
                      id="isActive"
                      name="isActive" 
                      checked={formData.isActive} 
                      onChange={handleInputChange}
                      style={{ width: 'auto', cursor: 'pointer' }}
                    />
                    <label htmlFor="isActive" style={{ margin: 0, cursor: 'pointer', fontSize: '13.5px' }}>Make active on grand-opening slider immediately</label>
                  </div>

                  <div className="modal-actions" style={{ marginTop: '30px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Processing...' : editEvent ? 'Save Changes' : 'Publish Experience'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* React Portal Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteEventId && (
          <ConfirmationModal 
            isOpen={!!deleteEventId}
            onClose={() => setDeleteEventId(null)}
            onConfirm={() => {
              handleDelete(deleteEventId);
              setDeleteEventId(null);
            }}
            title="Delete Experience"
            message="Are you sure you want to permanently delete this cultural experience? This will instantly remove it from the guest-facing landing page."
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* Beautiful Custom Delete Confirmation Modal Component */
export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay" style={{ zIndex: 11000, background: 'rgba(12, 2, 4, 0.9)' }}>
      <motion.div 
        className="modal-card"
        style={{ maxWidth: '420px', border: '1px solid rgba(198, 40, 40, 0.35)' }}
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ borderBottomColor: 'rgba(198, 40, 40, 0.15)' }}>
          <h2 style={{ background: 'linear-gradient(135deg, #ff8a80 0%, var(--error-color) 100%)', webkitBackgroundClip: 'text', webkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {title || 'Confirm Action'}
          </h2>
          <button className="close-btn" onClick={onClose} style={{ color: 'var(--error-color)' }}>
            <FaTimes />
          </button>
        </div>
        
        <div style={{ padding: '24px 30px', fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <p>{message || 'Are you sure you want to proceed with this action?'}</p>
        </div>

        <div className="modal-actions" style={{ 
          padding: '0 30px 30px', 
          borderTop: 'none', 
          marginTop: 0, 
          display: 'flex', 
          gap: '15px',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1, padding: '10px 20px', fontSize: '13px' }}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onConfirm}
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '10px 20px', 
              fontSize: '13px',
              background: 'linear-gradient(135deg, #ff5252 0%, #c62828 100%)', 
              color: '#fff', 
              boxShadow: '0 4px 15px rgba(198, 40, 40, 0.25)',
              border: 'none'
            }}
          >
            {loading ? 'Processing...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
