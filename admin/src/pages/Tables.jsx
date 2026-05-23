import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTable, FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { adminTableService } from '../services/api';
import { toast } from 'react-toastify';
import { ConfirmationModal } from './Experiences';
import '../styles/admin-tables.css';

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [deleteTableId, setDeleteTableId] = useState(null);

  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '4',
    location: 'center',
    description: '',
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await adminTableService.getAllTables();
      setTables(response.data.tables || []);
    } catch (error) {
      toast.error('Failed to fetch tables');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      tableNumber: parseInt(formData.tableNumber),
      capacity: parseInt(formData.capacity),
      location: formData.location,
      description: formData.description,
    };

    setLoading(true);
    try {
      if (editTable) {
        await adminTableService.updateTable(editTable._id, payload);
        toast.success('Table updated successfully!');
      } else {
        await adminTableService.createTable(payload);
        toast.success('Table added successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tableId) => {
    try {
      await adminTableService.deleteTable(tableId);
      toast.success('Table deactivated successfully.');
      setTables((prev) => prev.filter((t) => t._id !== tableId));
    } catch (error) {
      toast.error('Failed to delete table');
      console.error(error);
    }
  };

  const handleEditClick = (table) => {
    setEditTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location,
      description: table.description || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditTable(null);
    setFormData({
      tableNumber: '',
      capacity: '4',
      location: 'center',
      description: '',
    });
  };

  const locations = ['window', 'corner', 'center', 'outdoor'];

  return (
    <div className="admin-tables-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Table Cockpit</h1>
          <p>Configure seating arrangements and dining sections</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus style={{ marginRight: '8px' }} /> Add Dining Table
        </button>
      </div>

      {loading && tables.length === 0 ? (
        <div className="loading">Fetching dining layout...</div>
      ) : (
        <div className="tables-cockpit-grid">
          {/* Visual Table Seating Grid Map */}
          <div className="card cockpit-card">
            <h3>Floor Plan Preview</h3>
            <div className="floor-plan-grid">
              {tables.map((t) => (
                <motion.div
                  key={t._id}
                  className="floor-table-node"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="node-icon">
                    <FaTable />
                  </div>
                  <div className="node-details">
                    <span className="node-title">Table {t.tableNumber}</span>
                    <span className="node-seater">{t.capacity} Seater</span>
                    <span className="node-location">{t.location}</span>
                  </div>
                </motion.div>
              ))}
              {tables.length === 0 && (
                <div className="empty-floor-plan">
                  No active dining tables on the floor.
                </div>
              )}
            </div>
          </div>

          {/* Master Table Ledger */}
          <div className="card list-card">
            <h3>Active Tables Ledger</h3>
            <div className="bookings-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Table No.</th>
                    <th>Capacity</th>
                    <th>Location Section</th>
                    <th>Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((t) => (
                    <tr key={t._id}>
                      <td style={{ fontWeight: '700', fontSize: '15px' }}>
                        Table {t.tableNumber}
                      </td>
                      <td>
                        <span className="table-capacity-label">{t.capacity} Seater</span>
                      </td>
                      <td style={{ textTransform: 'uppercase', fontFamily: 'Cinzel', fontSize: '12px', letterSpacing: '0.5px' }}>
                        {t.location}
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {t.description || 'No custom details added.'}
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn-icon" onClick={() => handleEditClick(t)} title="Edit Table">
                            <FaEdit />
                          </button>
                          <button className="btn-icon delete" onClick={() => setDeleteTableId(t._id)} title="Deactivate Table">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tables.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No tables configured in the MERN database yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                  <h2>{editTable ? 'Edit Seating Table' : 'Add Seating Table'}</h2>
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
                      <label>Table Number</label>
                      <input
                        type="number"
                        name="tableNumber"
                        value={formData.tableNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. 1"
                        min="1"
                        disabled={!!editTable}
                      />
                    </div>

                    <div className="form-group">
                      <label>Capacity (Seater)</label>
                      <select name="capacity" value={formData.capacity} onChange={handleInputChange}>
                        {[2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                          <option key={num} value={num}>
                            {num} Seater
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location Section</label>
                    <select name="location" value={formData.location} onChange={handleInputChange}>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description / Features</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g. Quiet window corner with AC vent access..."
                      rows="3"
                    />
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
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Processing...' : editTable ? 'Save Changes' : 'Create Table'}
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
        {deleteTableId && (
          <ConfirmationModal 
            isOpen={!!deleteTableId}
            onClose={() => setDeleteTableId(null)}
            onConfirm={() => {
              handleDelete(deleteTableId);
              setDeleteTableId(null);
            }}
            title="Deactivate Dining Table"
            message="Are you sure you want to deactivate this table? This will instantly release it from active bookings and make it unavailable for new guest selections."
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
