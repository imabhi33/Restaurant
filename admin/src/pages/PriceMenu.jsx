import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminPriceMenuService } from '../services/api';
import '../styles/admin-menu.css';

const emptyForm = { name: '', category: 'Rice', price: '', description: '', isVeg: true, availability: true };

export default function PriceMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const response = await adminPriceMenuService.getAll(); setItems(response.data.items || []); }
    catch { toast.error('Failed to load the price menu'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (item) => { setEditing(item); setForm({ name: item.name, category: item.category, price: item.price, description: item.description || '', isVeg: item.isVeg, availability: item.availability }); setShowForm(true); };
  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editing) await adminPriceMenuService.update(editing._id, payload); else await adminPriceMenuService.create(payload);
      toast.success(editing ? 'Price-list item updated' : 'Price-list item added'); setShowForm(false); await load();
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to save item'); }
  };
  const remove = async (item) => {
    if (!window.confirm(`Hide ${item.name} from the public menu?`)) return;
    try { await adminPriceMenuService.remove(item._id); toast.success('Item hidden from the public menu'); await load(); }
    catch { toast.error('Unable to update item'); }
  };

  return <div className="admin-menu-page">
    <div className="page-header"><div className="header-info"><h1>Price Menu</h1><p>Manage the separate text-only menu and prices shown to guests.</p></div><button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Price Item</button></div>
    {loading ? <div className="loading">Loading price menu…</div> : <div className="card"><div className="bookings-table"><table className="data-table"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Type</th><th>Visible</th><th>Actions</th></tr></thead><tbody>
      {items.map((item) => <tr key={item._id}><td style={{ fontWeight: 600 }}>{item.name}{item.description && <small style={{ display: 'block', color: 'var(--text-muted)', marginTop: 4 }}>{item.description}</small>}</td><td>{item.category}</td><td style={{ color: 'var(--primary-gold)', fontWeight: 700 }}>₹{item.price}</td><td>{item.isVeg ? 'VEG' : 'NON-VEG'}</td><td>{item.availability ? 'Yes' : 'No'}</td><td><div className="actions"><button className="btn-icon" onClick={() => openEdit(item)} title="Edit"><FaEdit /></button><button className="btn-icon delete" onClick={() => remove(item)} title="Hide from public menu"><FaTrash /></button></div></td></tr>)}
    </tbody></table></div></div>}
    {showForm && <div className="modal-overlay"><div className="modal-card"><div className="modal-header"><h2>{editing ? 'Edit Price Item' : 'Add Price Item'}</h2><button className="close-btn" onClick={() => setShowForm(false)}><FaTimes /></button></div><form onSubmit={submit} className="modal-form"><div className="form-grid"><div className="form-group"><label>Item Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div className="form-group"><label>Category</label><input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div><div className="form-group"><label>Price (₹)</label><input required min="0" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div><div className="form-group"><label>Availability</label><select value={String(form.availability)} onChange={(e) => setForm({ ...form, availability: e.target.value === 'true' })}><option value="true">Visible</option><option value="false">Hidden</option></select></div></div><div className="form-group"><label>Description (optional)</label><textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div><label className="toggle-container"><input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} /><span className="toggle-label">Vegetarian</span></label><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save Item</button></div></form></div></div>}
  </div>;
}
