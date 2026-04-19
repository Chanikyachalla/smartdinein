import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Utensils, Coffee, BarChart3, Users, Plus, Trash2, Star, ClipboardList, Clock, MessageSquareText, Phone, Check } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import './VendorDashboard.css';


export function VendorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mess'); // Default to mess, overridden based on facility
  const [items, setItems] = useState([]);
  const [messMenu, setMessMenu] = useState(null);

  const [facility, setFacility] = useState(null);
  const [crowdLevel, setCrowdLevel] = useState('low');
  const [vendorInfo, setVendorInfo] = useState(null);

  // Analytics state
  const [analytics, setAnalytics] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Written reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Form states for new canteen item
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Meals');
  const [newItemType, setNewItemType] = useState('Veg');
  const [newMessSlot, setNewMessSlot] = useState('Breakfast');

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('vendorInfo'));
    if (!info || !info.token) {
      navigate('/vendor');
      return;
    }
    setVendorInfo(info);

    loadData(info.facilityId);
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'analytics' && vendorInfo?.facilityId) {
      setLoadingAnalytics(true);
      setLoadingReviews(true);
      fetch(`${process.env.API_URL}/api/facilities/${vendorInfo.facilityId}/analytics`, {
        headers: { 'Authorization': `Bearer ${vendorInfo.token}` }
      })
        .then(res => res.json())
        .then(data => {
          setAnalytics(data);
          setLoadingAnalytics(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingAnalytics(false);
        });

      fetch(`${process.env.API_URL}/api/facilities/${vendorInfo.facilityId}/reviews`, {
        headers: { 'Authorization': `Bearer ${vendorInfo.token}` }
      })
        .then(res => res.json())
        .then(data => {
          setReviews(data);
          setLoadingReviews(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingReviews(false);
        });
    }
  }, [activeTab, vendorInfo]);

  // Fetch orders when on orders/history tab
  useEffect(() => {
    if (!vendorInfo?.facilityId) return;
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      fetch(`${process.env.API_URL}/api/facilities/${vendorInfo.facilityId}/orders`, {
        headers: { 'Authorization': `Bearer ${vendorInfo.token}` }
      })
        .then(r => r.json())
        .then(data => { setOrders(data); setLoadingOrders(false); })
        .catch(() => setLoadingOrders(false));
    }
    if (activeTab === 'history') {
      setLoadingOrders(true);
      fetch(`${process.env.API_URL}/api/facilities/${vendorInfo.facilityId}/orders/history`, {
        headers: { 'Authorization': `Bearer ${vendorInfo.token}` }
      })
        .then(r => r.json())
        .then(data => { setOrderHistory(data); setLoadingOrders(false); })
        .catch(() => setLoadingOrders(false));
    }
  }, [activeTab, vendorInfo]);

  const loadData = async (facilityId) => {
    try {
      const facRes = await fetch(`${process.env.API_URL}/api/facilities/${facilityId}`);
      if (facRes.ok) {
        const facData = await facRes.json();
        setFacility(facData);
        setCrowdLevel(facData.crowdLevel || 'low');
        setActiveTab(facData.type === 'canteen' ? 'canteen' : 'mess');
      }

      const menuRes = await fetch(`${process.env.API_URL}/api/facilities/${facilityId}/menu`);
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        if (Array.isArray(menuData)) {
          setItems(menuData);
        } else {
          setMessMenu(menuData);
        }
      }
    } catch (err) {
      console.error("Failed to fetch data. Is the backend running?", err);
    }
  };

  const updateCrowd = async (level) => {
    setCrowdLevel(level);
    try {
      await fetch(`${process.env.API_URL}/api/facilities/${vendorInfo.facilityId}/crowd`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vendorInfo.token}`
        },
        body: JSON.stringify({ crowdLevel: level })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'available' ? 'limited'
      : currentStatus === 'limited' ? 'soldOut'
        : 'available';

    // Optimistic UI update
    setItems(items.map(item => item._id === id ? { ...item, availability: nextStatus } : item));

    try {
      await fetch(`${process.env.API_URL}/api/items/${id}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vendorInfo.token}`
        },
        body: JSON.stringify({ availability: nextStatus })
      });
    } catch (err) {
      console.error(err);
      // Revert on error
      setItems(items.map(item => item._id === id ? { ...item, availability: currentStatus } : item));
    }
  };

  const handleAddMessItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.API_URL}/api/facilities/${vendorInfo.facilityId}/menu/today`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vendorInfo.token}`
        },
        body: JSON.stringify({
          name: newItemName,
          mealSlot: newMessSlot,
          type: newItemType
        })
      });
      if (res.ok) {
        const updatedMenu = await res.json();
        setMessMenu(updatedMenu);
        setNewItemName('');
      } else {
        alert("Failed to add item to menu.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearMenu = async () => {
    if (!window.confirm('Are you sure you want to clear the entire menu for today?')) return;
    try {
      const res = await fetch(`${process.env.API_URL}/api/facilities/${vendorInfo.facilityId}/menu/today`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${vendorInfo.token}`
        }
      });
      if (res.ok) {
        const updatedMenu = await res.json();
        setMessMenu(updatedMenu);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await fetch(`${process.env.API_URL}/api/facilities/${vendorInfo.facilityId}/menu/today/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${vendorInfo.token}`
        }
      });
      if (res.ok) {
        const updatedMenu = await res.json();
        setMessMenu(updatedMenu);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNoteReview = async (reviewId) => {
    try {
      await fetch(`${process.env.API_URL}/api/feedback/${reviewId}`, {
        method: 'DELETE'
      });
      // Remove from local state instantly
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCanteenItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.API_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vendorInfo.token}` },
        body: JSON.stringify({
          facilityId: vendorInfo.facilityId,
          name: newItemName,
          price: Number(newItemPrice),
          category: newItemCategory,
          dietaryTags: [newItemType.toLowerCase().replace('-', '-')]
        })
      });
      if (res.ok) {
        const created = await res.json();
        setItems(prev => [...prev, created]);
        setNewItemName(''); setNewItemPrice('');
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteCanteenItem = async (itemId) => {
    try {
      const res = await fetch(`${process.env.API_URL}/api/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${vendorInfo.token}` }
      });
      if (res.ok) setItems(prev => prev.filter(i => i._id !== itemId));
    } catch (err) { console.error(err); }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const res = await fetch(`${process.env.API_URL}/api/orders/${orderId}/complete`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${vendorInfo.token}` }
      });
      if (res.ok) setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorInfo');
    navigate('/vendor');
  };

  if (!facility) return <div style={{ padding: '2rem' }}>Loading Dashboard... (Please ensure backend and DB are running)</div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Vendor Admin</h2>
          <p>{facility.name}</p>
        </div>

        <nav className="sidebar-nav">
          {facility.type === 'canteen' && (
            <>
              <button className={`nav-btn ${activeTab === 'canteen' ? 'active' : ''}`} onClick={() => setActiveTab('canteen')}>
                <Coffee size={20} /> Canteen Inventory
              </button>
              <button className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                <ClipboardList size={20} /> Live Orders
              </button>
              <button className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                <Clock size={20} /> Order History
              </button>
            </>
          )}
          {facility.type === 'mess' && (
            <button className={`nav-btn ${activeTab === 'mess' ? 'active' : ''}`} onClick={() => setActiveTab('mess')}>
              <Utensils size={20} /> Mess Menu
            </button>
          )}
          <button className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <BarChart3 size={20} /> Feedback Analytics
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-btn text-danger" onClick={handleLogout}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
          <div className="crowd-control-widget">
            <span className="widget-label"><Users size={16} /> Live Crowd:</span>
            <div className="crowd-toggles">
              {['low', 'medium', 'high'].map(level => (
                <button
                  key={level}
                  className={`crowd-btn ${crowdLevel === level ? 'active' : ''} ${level}`}
                  onClick={() => updateCrowd(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </header>

        {activeTab === 'canteen' && facility.type === 'canteen' && (
          <div className="admin-panel">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Canteen Inventory Management</h3>
                <p>{items.length} item{items.length !== 1 ? 's' : ''} in menu</p>
              </div>
            </div>

            {/* Add item form */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--surface)' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Add New Item</h4>
              <form onSubmit={handleAddCanteenItem} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) auto', gap: '0.75rem', alignItems: 'end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ marginBottom: '0.25rem' }}>Name</label>
                  <input className="input-field" style={{ marginTop: 0 }} placeholder="e.g. Vada Pav" value={newItemName} onChange={e => setNewItemName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ marginBottom: '0.25rem' }}>Price (₹)</label>
                  <input className="input-field" style={{ marginTop: 0 }} type="number" placeholder="30" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ marginBottom: '0.25rem' }}>Category</label>
                  <select className="input-field" style={{ marginTop: 0 }} value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)}>
                    <option>Meals</option><option>Snacks</option><option>Beverages</option><option>Desserts</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ marginBottom: '0.25rem' }}>Type</label>
                  <select className="input-field" style={{ marginTop: 0 }} value={newItemType} onChange={e => setNewItemType(e.target.value)}>
                    <option>Veg</option><option>Non-Veg</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1rem' }}><Plus size={16} /></button>
              </form>
            </div>

            {/* Item list */}
            <div className="inventory-list" style={{ padding: '1rem 1.5rem' }}>
              {items.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', padding: '2rem 0', textAlign: 'center' }}>No items yet. Add one above.</p>
              ) : items.map(item => (
                <div key={item._id} className="inventory-row">
                  <div className="item-details">
                    <img src={item.imageUrl || 'https://placehold.co/60x60/1e1e2e/6366f1?text=Food'} alt={item.name} className="item-thumb" />
                    <div>
                      <h4>{item.name}</h4>
                      <span className="item-meta">₹{item.price} • {item.category} • {item.dietaryTags?.[0]}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button className="status-toggle-btn" onClick={() => toggleAvailability(item._id, item.availability)} title="Toggle status">
                      <Badge type="availability" status={item.availability || 'available'} />
                    </button>
                    <button onClick={() => handleDeleteCanteenItem(item._id)} style={{ color: 'var(--danger-color)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mess' && facility.type === 'mess' && (
          <div className="admin-panel">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Mess Menu Management ({new Date().toLocaleDateString()})</h3>
                <p>Manage today's meal offerings</p>
              </div>
              {messMenu && (
                <button className="btn text-danger flex items-center gap-2" style={{ border: '1px solid var(--danger-color)', padding: '0.5rem 1rem' }} onClick={handleClearMenu}>
                  <Trash2 size={16} /> Clear Menu
                </button>
              )}
            </div>

            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Add Item to Today's Menu</h4>
              <form className="add-item-form" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto', gap: '1rem', alignItems: 'end' }} onSubmit={handleAddMessItem}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ marginBottom: '0.25rem' }}>Item Name</label>
                  <input type="text" className="input-field" placeholder="e.g. Paneer Masala" style={{ marginTop: 0 }}
                    value={newItemName} onChange={e => setNewItemName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ marginBottom: '0.25rem' }}>Meal Slot</label>
                  <select className="input-field" style={{ marginTop: 0 }} value={newMessSlot} onChange={e => setNewMessSlot(e.target.value)}>
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ marginBottom: '0.25rem' }}>Type</label>
                  <select className="input-field" style={{ marginTop: 0 }} value={newItemType} onChange={e => setNewItemType(e.target.value)}>
                    <option>Veg</option>
                    <option>Non-Veg</option>
                    <option>Jain</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary flex items-center gap-2" style={{ padding: '0.75rem 1.5rem', height: '100%' }}>
                  <Plus size={18} /> Add
                </button>
              </form>
            </div>

            {!messMenu && (
              <div className="placeholder-content" style={{ padding: '4rem 1rem' }}>
                <Utensils size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <p>No items added for today yet.</p>
              </div>
            )}

            {messMenu && (
              <div style={{ padding: '2rem' }}>
                {['breakfast', 'lunch', 'dinner'].map(slot => (
                  <div key={slot} style={{ marginBottom: '2rem' }}>
                    <h4 style={{ textTransform: 'capitalize', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                      {slot} ({messMenu[slot]?.time})
                    </h4>
                    {messMenu[slot]?.items?.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)' }}>No items yet.</p>
                    ) : (
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {messMenu[slot]?.items?.map(item => (
                          <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--background)', marginBottom: '0.5rem', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontWeight: 500 }}>{item.name}</span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--surface)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                {item.dietaryTags?.[0] || 'veg'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              style={{ color: 'var(--danger-color)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                              title="Delete Item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h3>Feedback Analytics</h3>
                <p>Track your {facility.type === 'mess' ? 'meal slot' : 'item'} ratings in real-time</p>
              </div>
            </div>

            {/* -- Star Ratings -- */}
            <div style={{ padding: '2rem 2rem 1rem' }}>
<<<<<<< HEAD
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}> Star Ratings</h4>
=======
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Star Ratings</h4>
>>>>>>> 9ee3a50e5bfa666bcb16fb4c0d45974fe7d53a7a
              {loadingAnalytics ? (
                <p>Loading analytics data...</p>
              ) : analytics.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No rating data available yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {analytics.map(stat => (
                    <div key={stat.targetId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <h4 style={{ margin: 0, textTransform: 'capitalize', fontSize: '1.1rem' }}>{stat.targetName}</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Total Ratings: {stat.totalRatings}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Star size={28} fill="#fbbf24" color="#fbbf24" />
                        <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stat.averageRating}</span>
                        <span style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>/ 5</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* -- Written Reviews -- */}
            <div style={{ padding: '1rem 2rem 2rem', borderTop: '1px solid var(--border-color)', marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquareText size={18} /> Written Reviews</h4>
              {loadingReviews ? (
                <p>Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No written reviews yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {reviews.map(review => (
                    <div key={review._id} style={{ backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.studentName || 'Anonymous'}</span>
                          {review.rollNumber && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--background)', padding: '2px 8px', borderRadius: '4px' }}>{review.rollNumber}</span>}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{review.reviewText}</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleNoteReview(review._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.85rem', fontSize: '0.8rem', fontWeight: 600, color: '#16a34a', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                          onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
                        >
                          <Check size={14} style={{ marginRight: '4px' }} /> Noted
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* — Live Orders — */}
        {activeTab === 'orders' && facility.type === 'canteen' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h3>Live Orders</h3>
                <p>{orders.length} pending order{orders.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {loadingOrders ? <p>Loading orders...</p> : orders.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}>No pending orders right now.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(order => (
                    <div key={order._id} style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ margin: 0 }}>{order.customerName}</h4>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>{order.hostel} • <Phone size={12} /> {order.phone}</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.75rem' }}>
                        {order.items.map((it, i) => (
                          <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.2rem 0' }}>
                            <span>{it.name} × {it.quantity}</span>
                            <span>₹{it.price * it.quantity}</span>
                          </li>
                        ))}
                      </ul>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                        <strong>Total: ₹{order.totalAmount}</strong>
                        <button onClick={() => handleCompleteOrder(order._id)} style={{ padding: '0.4rem 1rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                          <Check size={14} style={{ marginRight: '4px' }} /> Completed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -- Order History -- */}
        {activeTab === 'history' && facility.type === 'canteen' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h3>Order History</h3>
                <p>Completed orders</p>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {loadingOrders ? <p>Loading history...</p> : orderHistory.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}>No completed orders yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {orderHistory.map(order => (
                    <div key={order._id} style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{order.customerName} - {order.hostel}</h4>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#16a34a' }}>₹{order.totalAmount}</strong>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


