import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaPlus, FaTrash, FaEdit, FaCloudUploadAlt, FaSpinner, FaTimes } from 'react-icons/fa';
import { adminMenuService, adminUploadService } from '../services/api';
import { toast } from 'react-toastify';
import { ConfirmationModal } from './Experiences';
import '../styles/admin-menu.css';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'main-course',
    price: '',
    image: '',
    isVeg: true,
    isSpicy: false,
    spicyLevel: 0,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await adminMenuService.getAllMenuItems();
      setMenuItems(response.data.items || response.data.menuItems || []);
    } catch (error) {
      toast.error('Failed to fetch menu items');
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setUploading(true);
      try {
        const response = await adminUploadService.uploadImage(reader.result);
        setFormData((prev) => ({ ...prev, image: response.data.url }));
        toast.success('Image uploaded successfully to Cloudinary!');
      } catch (error) {
        toast.error('Image upload failed. Please try again.');
        console.error(error);
      } finally {
        setUploading(false);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please upload an item image');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      spicyLevel: parseInt(formData.spicyLevel),
    };

    setLoading(true);
    try {
      if (editItem) {
        await adminMenuService.updateMenuItem(editItem._id, payload);
        toast.success('Menu item updated successfully!');
      } else {
        await adminMenuService.createMenuItem(payload);
        toast.success('Menu item added successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchMenuItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await adminMenuService.deleteMenuItem(itemId);
      toast.success('Menu item deleted successfully.');
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (error) {
      toast.error('Failed to delete menu item');
      console.error(error);
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
      isSpicy: item.isSpicy,
      spicyLevel: item.spicyLevel,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'main-course',
      price: '',
      image: '',
      isVeg: true,
      isSpicy: false,
      spicyLevel: 0,
    });
  };

  const categories = ['appetizers', 'main-course', 'rice', 'bread', 'desserts', 'beverages', 'specials'];

  const filteredItems = filterCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filterCategory);

  return (
    <div className="admin-menu-page">
      <div className="page-header">
        <div className="header-info">
          <h1>Menu Management</h1>
          <p>Manage royal delicacies and recipes in the database</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus style={{ marginRight: '8px' }} /> Add New Item
        </button>
      </div>

      {/* Categories Filter tab */}
      <div className="filter-section">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading && menuItems.length === 0 ? (
        <div className="loading">Fetching menu records...</div>
      ) : (
        <div className="card">
          <div className="bookings-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Spiciness</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img src={item.image} alt={item.name} className="menu-thumb" />
                    </td>
                    <td style={{ fontWeight: '600' }}>{item.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{item.category.replace('-', ' ')}</td>
                    <td style={{ color: 'var(--primary-gold)', fontWeight: '700' }}>₹{item.price}</td>
                    <td>
                      <span className={`menu-type-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </td>
                    <td>{item.isSpicy ? `Spicy (Lvl ${item.spicyLevel})` : 'Mild'}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-icon" onClick={() => handleEditClick(item)} title="Edit Item">
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" onClick={() => setDeleteItemId(item._id)} title="Delete Item">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No delicacies found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {createPortal(
        <AnimatePresence>
          {showModal && (
            <div className="modal-overlay">
              <motion.div
                className="modal-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="modal-header">
                  <h2>{editItem ? 'Edit Royal Delicacy' : 'Add Royal Delicacy'}</h2>
                  <button
                    className="close-btn"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Delicacy Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Royal Odia Mutton Kasa"
                      />
                    </div>

                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. 480"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange}>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.toUpperCase().replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Spicy Level (0-3)</label>
                      <select name="spicyLevel" value={formData.spicyLevel} onChange={handleInputChange} disabled={!formData.isSpicy}>
                        <option value="0">0 - No Spice</option>
                        <option value="1">1 - Mild</option>
                        <option value="2">2 - Medium</option>
                        <option value="3">3 - Royal Spicy</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      placeholder="Describe the recipe, heritage background, raw materials, or taste details..."
                      rows="3"
                    />
                  </div>

                  {/* Switches/Toggles */}
                  <div className="toggle-row">
                    <label className="toggle-container">
                      <input
                        type="checkbox"
                        name="isVeg"
                        checked={formData.isVeg}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-label">Vegetarian Recipe</span>
                    </label>

                    <label className="toggle-container">
                      <input
                        type="checkbox"
                        name="isSpicy"
                        checked={formData.isSpicy}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-label">Contains Spices</span>
                    </label>
                  </div>

                  {/* Cloudinary Image Upload Box */}
                  <div className="form-group">
                    <label>Delicacy Image</label>
                    <div className="upload-box">
                      {formData.image ? (
                        <div className="image-preview-container">
                          <img src={formData.image} alt="Preview" className="image-preview" />
                          <button
                            type="button"
                            className="remove-img"
                            onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <label className="upload-placeholder">
                          {uploading ? (
                            <>
                              <FaSpinner className="spin" />
                              <span>Uploading to Cloudinary...</span>
                            </>
                          ) : (
                            <>
                              <FaCloudUploadAlt />
                              <span>Select Delicacy Photo</span>
                              <small>Max 10MB (PNG, JPG)</small>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            disabled={uploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
                      {loading ? 'Processing...' : editItem ? 'Save Changes' : 'Add Recipe'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* React Portal Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteItemId && (
          <ConfirmationModal 
            isOpen={!!deleteItemId}
            onClose={() => setDeleteItemId(null)}
            onConfirm={() => {
              handleDelete(deleteItemId);
              setDeleteItemId(null);
            }}
            title="Delete Menu Item"
            message="Are you sure you want to permanently delete this royal delicacy? This will instantly remove it from the guest-facing digital menu ledger."
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
