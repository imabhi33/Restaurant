import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaCloudUploadAlt, FaSpinner, FaTimes, FaGlobe, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { adminRestaurantService, adminUploadService } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/dashboard.css'; // Leverage standard admin styles

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState({
    name: 'Papalicious',
    description: '',
    location: { address: 'Cuttack, Odisha' },
    contact: { phone: '', email: '', website: '' },
    openingHours: [
      { day: 'Mon-Fri', opening: '11:00 AM', closing: '10:00 PM', isClosed: false },
      { day: 'Sat-Sun', opening: '10:00 AM', closing: '11:00 PM', isClosed: false }
    ],
    logoImage: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await adminRestaurantService.getSettings();
      if (response.data.settings) {
        const s = response.data.settings;
        setSettings({
          name: s.name || 'Papalicious',
          description: s.description || '',
          location: { address: s.location?.address || 'Cuttack, Odisha' },
          contact: { 
            phone: s.contact?.phone || '', 
            email: s.contact?.email || '', 
            website: s.contact?.website || '' 
          },
          openingHours: s.openingHours && s.openingHours.length > 0 ? s.openingHours : [
            { day: 'Mon-Fri', opening: '11:00 AM', closing: '10:00 PM', isClosed: false },
            { day: 'Sat-Sun', opening: '10:00 AM', closing: '11:00 PM', isClosed: false }
          ],
          logoImage: s.logoImage || '',
          socialLinks: {
            facebook: s.socialLinks?.facebook || '',
            instagram: s.socialLinks?.instagram || '',
            twitter: s.socialLinks?.twitter || ''
          }
        });
      }
    } catch (error) {
      toast.error('Failed to load restaurant settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleHoursChange = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...prev.openingHours];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return {
        ...prev,
        openingHours: updated
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setUploading(true);
      try {
        const response = await adminUploadService.uploadImage(reader.result);
        setSettings((prev) => ({ ...prev, logoImage: response.data.url }));
        toast.success('Brand Logo uploaded successfully!');
      } catch (error) {
        toast.error('Logo upload failed. Please try again.');
        console.error(error);
      } finally {
        setUploading(false);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminRestaurantService.updateSettings(settings);
      toast.success('Restaurant settings saved successfully!');
      fetchSettings();
      // Dispatch custom event to notify Sidebar/Layout about logo update
      window.dispatchEvent(new Event('logoUpdated'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-experiences-page fade-in" style={{ paddingBottom: '40px' }}>
      <div className="cockpit-header-row">
        <div>
          <h2 className="cockpit-main-title">Restaurant Settings</h2>
          <p className="cockpit-subtitle">Manage dynamic branding, brand logos, contact coordinates, operating hours, and social networks.</p>
        </div>
      </div>

      {loading && !settings.description ? (
        <div className="loading">Fetching current settings...</div>
      ) : (
        <form onSubmit={handleSubmit} className="vertical-form" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="grid grid-2" style={{ gap: '30px' }}>
            {/* Core Settings Card */}
            <div className="card cockpit-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
              <h3 style={{ fontFamily: 'Cinzel', color: 'var(--primary-gold)', borderBottom: '1px solid var(--border-gold-rgba)', paddingBottom: '10px' }}>
                Branding & Metadata
              </h3>
              
              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description (Teaser Footer text)</label>
                <textarea
                  name="description"
                  value={settings.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter a premium brand summary for the website footer..."
                  required
                />
              </div>

              {/* Logo Upload Box */}
              <div className="form-group">
                <label>Custom Brand Logo</label>
                <div className="upload-box" style={{ 
                  border: '1px dashed var(--border-gold-rgba)', 
                  borderRadius: '6px', 
                  padding: '20px', 
                  textAlign: 'center',
                  background: 'rgba(12,2,4,0.4)',
                  position: 'relative'
                }}>
                  {settings.logoImage ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                      <img 
                        src={settings.logoImage} 
                        alt="Custom Logo" 
                        style={{ height: '70px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.4))' }} 
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '11px', height: 'auto' }}
                        onClick={() => setSettings((prev) => ({ ...prev, logoImage: '' }))}
                      >
                        <FaTimes style={{ marginRight: '6px' }} /> Remove Custom Logo
                      </button>
                    </div>
                  ) : (
                    <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      {uploading ? (
                        <>
                          <FaSpinner className="spin" style={{ color: 'var(--primary-gold)', fontSize: '24px' }} />
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Uploading Brand Logo...</span>
                        </>
                      ) : (
                        <>
                          <FaCloudUploadAlt style={{ color: 'var(--primary-gold)', fontSize: '32px' }} />
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Upload Brand Logo (PNG/JPG)</span>
                          <small style={{ color: 'var(--text-muted)', fontSize: '11px', opacity: 0.6 }}>By default, assets/logo1.png will render</small>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Settings Card */}
            <div className="card cockpit-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
              <h3 style={{ fontFamily: 'Cinzel', color: 'var(--primary-gold)', borderBottom: '1px solid var(--border-gold-rgba)', paddingBottom: '10px' }}>
                Contact & Social Handles
              </h3>

              <div className="form-group">
                <label>📍 Physical Address</label>
                <input
                  type="text"
                  value={settings.location.address}
                  onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>📞 Phone Number</label>
                <input
                  type="text"
                  value={settings.contact.phone}
                  onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>✉️ Public Email</label>
                <input
                  type="email"
                  value={settings.contact.email}
                  onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label><FaFacebook style={{ marginRight: '6px', color: '#1877f2' }} /> Facebook Profile Page Link</label>
                <input
                  type="url"
                  value={settings.socialLinks.facebook}
                  onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                  placeholder="e.g. https://facebook.com/papalicious"
                />
              </div>

              <div className="form-group">
                <label><FaInstagram style={{ marginRight: '6px', color: '#e1306c' }} /> Instagram Page Link</label>
                <input
                  type="url"
                  value={settings.socialLinks.instagram}
                  onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                  placeholder="e.g. https://instagram.com/papalicious"
                />
              </div>

              <div className="form-group">
                <label><FaTwitter style={{ marginRight: '6px', color: '#1da1f2' }} /> Twitter Page Link</label>
                <input
                  type="url"
                  value={settings.socialLinks.twitter}
                  onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                  placeholder="e.g. https://twitter.com/papalicious"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours Settings Card */}
          <div className="card cockpit-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
            <h3 style={{ fontFamily: 'Cinzel', color: 'var(--primary-gold)', borderBottom: '1px solid var(--border-gold-rgba)', paddingBottom: '10px' }}>
              Operating Hours Schedules
            </h3>

            <div className="grid grid-2" style={{ gap: '30px' }}>
              {settings.openingHours.map((hours, index) => (
                <div key={index} style={{ border: '1px solid rgba(212,175,55,0.08)', borderRadius: '6px', padding: '20px', background: 'rgba(12,2,4,0.15)' }}>
                  <h4 style={{ fontFamily: 'Cinzel', color: 'var(--primary-gold)', marginBottom: '15px' }}>{hours.day} Timings</h4>
                  
                  <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Opening Time</label>
                    <input
                      type="text"
                      value={hours.opening}
                      onChange={(e) => handleHoursChange(index, 'opening', e.target.value)}
                      placeholder="e.g. 11:00 AM"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label>Closing Time</label>
                    <input
                      type="text"
                      value={hours.closing}
                      onChange={(e) => handleHoursChange(index, 'closing', e.target.value)}
                      placeholder="e.g. 10:00 PM"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={loading || uploading}
              style={{ minWidth: '220px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Saving Changes...' : 'Save Settings Cockpit'}
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}
