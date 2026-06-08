import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Admin.css';
import { Trash2, Edit, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user, authLoading } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('restaurants');
  const [loading, setLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: '' }

  // Form states
  const [newRestaurant, setNewRestaurant] = useState({ name: '', description: '', address: '', imageUrl: '' });
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '', restaurantId: '' });

  // Edit states
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!authLoading && user?.role === 'ADMIN') fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, orderRes, menuRes] = await Promise.all([
        API.get('/restaurants'),
        API.get('/admin/orders'),
        API.get('/menu'),
      ]);
      setRestaurants(resRes.data);
      setOrders(orderRes.data);
      setProducts(menuRes.data);
    } catch (error) {
      showToast('error', 'Failed to load data. Please refresh.');
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const allProducts = products.map(p => ({
    ...p,
    restaurantId: p.restaurant?.id,
    restaurantName: p.restaurant?.name
  }));

  // ── Restaurant CRUD ──────────────────────────────────────
  const handleSaveRestaurant = async (e) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        await API.put(`/admin/restaurants/${editingRestaurant.id}`, editingRestaurant);
        showToast('success', 'Restaurant updated successfully!');
        setEditingRestaurant(null);
      } else {
        await API.post('/admin/restaurants', newRestaurant);
        showToast('success', 'Restaurant added successfully!');
        setNewRestaurant({ name: '', description: '', address: '', imageUrl: '' });
      }
      fetchData();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to save restaurant.');
      console.error('Error saving restaurant', error);
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm('Delete this restaurant? All its products will be deleted too.')) return;
    try {
      await API.delete(`/admin/restaurants/${id}`);
      showToast('success', 'Restaurant deleted.');
      fetchData();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to delete restaurant.');
      console.error('Error deleting restaurant', error);
    }
  };

  // ── Product CRUD ─────────────────────────────────────────
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/admin/menu/${editingProduct.id}`, {
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          imageUrl: editingProduct.imageUrl,
        });
        showToast('success', 'Product updated successfully!');
        setEditingProduct(null);
      } else {
        if (!newProduct.restaurantId) {
          showToast('error', 'Please select a restaurant first.');
          return;
        }
        await API.post(`/admin/restaurants/${newProduct.restaurantId}/menu`, {
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          imageUrl: newProduct.imageUrl,
        });
        showToast('success', 'Product added successfully!');
        setNewProduct({ name: '', description: '', price: '', imageUrl: '', restaurantId: '' });
      }
      fetchData();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to save product.');
      console.error('Error saving product', error);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/admin/menu/${id}`);
      showToast('success', 'Product deleted.');
      fetchData();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to delete product.');
      console.error('Error deleting product', error);
    }
  };

  // ── Order Status ─────────────────────────────────────────
  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status });
      showToast('success', `Order #${id} marked as ${status}.`);
      fetchData();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to update order status.');
      console.error('Error updating order', error);
    }
  };

  // Wait for auth check before redirecting
  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #ff4757', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#888', fontWeight: 600 }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" />;

  return (
    <div className="admin-container">
      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p className="text-muted">Manage your restaurants, products and orders</p>
      </div>

      {/* Stats row */}
      <div className="admin-stats">
        <div className="stat-card"><span className="stat-num">{restaurants.length}</span><span>Restaurants</span></div>
        <div className="stat-card"><span className="stat-num">{allProducts.length}</span><span>Products</span></div>
        <div className="stat-card"><span className="stat-num">{orders.length}</span><span>Orders</span></div>
        <div className="stat-card"><span className="stat-num">{orders.filter(o => o.status === 'PENDING').length}</span><span>Pending</span></div>
      </div>

      <div className="admin-tabs mt-4">
        {['restaurants', 'products', 'orders'].map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        {loading && <span className="css-spinner" />}
      </div>

      {/* ── RESTAURANTS TAB ── */}
      {activeTab === 'restaurants' && (
        <div className="admin-section mt-4">
          <div className="card" style={{ padding: '2rem' }}>
            <h2>{editingRestaurant ? '✏️ Edit Restaurant' : '➕ Add New Restaurant'}</h2>
            <form onSubmit={handleSaveRestaurant} className="mt-3">
              <div className="form-row">
                <div className="form-group">
                  <label>Restaurant Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Spice Garden" required
                    value={editingRestaurant ? editingRestaurant.name : newRestaurant.name}
                    onChange={e => editingRestaurant
                      ? setEditingRestaurant({ ...editingRestaurant, name: e.target.value })
                      : setNewRestaurant({ ...newRestaurant, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input type="text" className="form-input" placeholder="e.g. 12 MG Road, Hyderabad" required
                    value={editingRestaurant ? editingRestaurant.address : newRestaurant.address}
                    onChange={e => editingRestaurant
                      ? setEditingRestaurant({ ...editingRestaurant, address: e.target.value })
                      : setNewRestaurant({ ...newRestaurant, address: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" className="form-input" placeholder="https://..."
                  value={editingRestaurant ? editingRestaurant.imageUrl : newRestaurant.imageUrl}
                  onChange={e => editingRestaurant
                    ? setEditingRestaurant({ ...editingRestaurant, imageUrl: e.target.value })
                    : setNewRestaurant({ ...newRestaurant, imageUrl: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" placeholder="Brief description..." rows="3"
                  value={editingRestaurant ? editingRestaurant.description : newRestaurant.description}
                  onChange={e => editingRestaurant
                    ? setEditingRestaurant({ ...editingRestaurant, description: e.target.value })
                    : setNewRestaurant({ ...newRestaurant, description: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> {editingRestaurant ? 'Update' : 'Add'} Restaurant
                </button>
                {editingRestaurant && (
                  <button type="button" className="btn btn-outline" onClick={() => setEditingRestaurant(null)}>
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <h2 className="mt-4">Current Restaurants ({restaurants.length})</h2>
          <div className="admin-grid mt-2">
            {restaurants.length === 0 && <p className="text-muted">No restaurants yet. Add one above!</p>}
            {restaurants.map(r => (
              <div key={r.id} className="card no-hover p-3 admin-item-card">
                {r.imageUrl && (
                  <img src={r.imageUrl} alt={r.name} className="admin-thumb" />
                )}
                <div className="item-details">
                  <h3>{r.name}</h3>
                  <p className="text-muted">📍 {r.address}</p>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>{(r.menuItems || []).length} products</p>
                </div>
                <div className="item-actions">
                  <button className="icon-btn edit-btn" title="Edit" onClick={() => { setEditingRestaurant(r); window.scrollTo(0,0); }}>
                    <Edit size={18} />
                  </button>
                  <button className="icon-btn delete-btn" title="Delete" onClick={() => deleteRestaurant(r.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <div className="admin-section mt-4">
          <div className="card" style={{ padding: '2rem' }}>
            <h2>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
            <form onSubmit={handleSaveProduct} className="mt-3">
              {!editingProduct && (
                <div className="form-group">
                  <label>Select Restaurant *</label>
                  <select className="form-input" required value={newProduct.restaurantId}
                    onChange={e => setNewProduct({ ...newProduct, restaurantId: e.target.value })}>
                    <option value="">-- Choose a restaurant --</option>
                    {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Chicken Burger" required
                    value={editingProduct ? editingProduct.name : newProduct.name}
                    onChange={e => editingProduct
                      ? setEditingProduct({ ...editingProduct, name: e.target.value })
                      : setNewProduct({ ...newProduct, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" step="0.01" min="0" className="form-input" placeholder="e.g. 299" required
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={e => editingProduct
                      ? setEditingProduct({ ...editingProduct, price: e.target.value })
                      : setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" className="form-input" placeholder="https://..."
                  value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
                  onChange={e => editingProduct
                    ? setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                    : setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" placeholder="Brief description..." rows="2"
                  value={editingProduct ? editingProduct.description : newProduct.description}
                  onChange={e => editingProduct
                    ? setEditingProduct({ ...editingProduct, description: e.target.value })
                    : setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> {editingProduct ? 'Update' : 'Add'} Product
                </button>
                {editingProduct && (
                  <button type="button" className="btn btn-outline" onClick={() => setEditingProduct(null)}>
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <h2 className="mt-4">All Products ({allProducts.length})</h2>
          <div className="admin-grid mt-2">
            {allProducts.length === 0 && <p className="text-muted">No products yet. Add one above!</p>}
            {allProducts.map(p => (
              <div key={p.id} className="card no-hover p-3 admin-item-card">
                {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="admin-thumb" />}
                <div className="item-details">
                  <h3>{p.name}</h3>
                  <p className="text-muted">₹{Number(p.price).toFixed(2)}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{p.restaurantName}</p>
                </div>
                <div className="item-actions">
                  <button className="icon-btn edit-btn" title="Edit" onClick={() => { setEditingProduct(p); window.scrollTo(0,0); }}>
                    <Edit size={18} />
                  </button>
                  <button className="icon-btn delete-btn" title="Delete" onClick={() => deleteProduct(p.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <div className="admin-section mt-4">
          <div className="card p-3">
            <h2>Recent Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="text-muted mt-3">No orders yet.</p>
            ) : (
              <div className="table-responsive mt-3">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>{order.user?.username || '—'}</td>
                        <td>{(order.orderItems || []).length} item(s)</td>
                        <td>₹{Number(order.totalPrice).toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.status?.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select className="form-input p-1" value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                            <option value="PENDING">PENDING</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
