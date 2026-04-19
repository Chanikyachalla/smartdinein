import React, { useState } from 'react';
import { ShoppingCart, X, ChevronDown, Plus, Minus, Send, PartyPopper } from 'lucide-react';
import './OrderPopup.css';


export function OrderPopup({ facilityId, menuItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({});

  const [form, setForm] = useState({
    customerName: '',
    hostel: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const adjustQty = (itemId, delta) => {
    setCart(prev => {
      const cur = prev[itemId] || 0;
      const next = Math.max(0, cur + delta);
      if (next === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const cartItems = menuItems
    .filter(item => cart[item._id] > 0)
    .map(item => ({ ...item, quantity: cart[item._id] }));

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert('Add at least one item to your cart.');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityId,
          customerName: form.customerName,
          hostel: form.hostel,
          phone: form.phone,
          items: cartItems.map(i => ({
            menuItemId: i._id,
            name: i.name,
            price: i.price,
            quantity: i.quantity
          }))
        })
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      setCart({});
      setForm({ customerName: '', hostel: '', phone: '' });
      setTimeout(() => { setSubmitted(false); setIsOpen(false); }, 2800);
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cartCount = Object.values(cart).reduce((s, n) => s + n, 0);

  return (
    <div className="order-popup-container">
      {!isOpen && (
        <button className="order-fab" onClick={() => setIsOpen(true)}>
          <ShoppingCart size={20} />
          <span>Place Order</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      )}

      {isOpen && (
        <div className={`order-popup ${isMinimized ? 'minimized' : ''}`}>
          <div className="order-popup-header" onClick={() => isMinimized && setIsMinimized(false)}>
            <span className="popup-title">
              <ShoppingCart size={16} />
              Place Order
              {cartCount > 0 && <span className="cart-badge-inline">{cartCount} items</span>}
            </span>
            <div className="popup-controls">
              <button className="popup-ctrl-btn" onClick={e => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
                <ChevronDown size={16} style={{ transform: isMinimized ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              <button className="popup-ctrl-btn" onClick={() => { setIsOpen(false); setIsMinimized(false); }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="order-popup-body">
              {submitted ? (
                <div className="order-thanks">
                  <PartyPopper size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                  <p>Order placed successfully!</p>
                  <small>We'll prepare your order shortly.</small>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Customer details */}
                  <div className="order-section-label">Your Details</div>
                  <input name="customerName" placeholder="Your name *" value={form.customerName} onChange={handleChange} className="popup-input" required />
                  <input name="hostel" placeholder="Hostel / Block *" value={form.hostel} onChange={handleChange} className="popup-input" required />
                  <input name="phone" placeholder="Phone number *" value={form.phone} onChange={handleChange} className="popup-input" type="tel" required />

                  {/* Item selection */}
                  <div className="order-section-label" style={{ marginTop: '0.75rem' }}>Select Items</div>
                  <div className="item-selector">
                    {menuItems.filter(i => i.availability !== 'soldOut').map(item => (
                      <div key={item._id} className="order-item-row">
                        <div className="order-item-info">
                          <span className="order-item-name">{item.name}</span>
                          <span className="order-item-price">₹{item.price}</span>
                        </div>
                        <div className="qty-control">
                          <button type="button" onClick={() => adjustQty(item._id, -1)} className="qty-btn"><Minus size={12} /></button>
                          <span className="qty-num">{cart[item._id] || 0}</span>
                          <button type="button" onClick={() => adjustQty(item._id, 1)} className="qty-btn"><Plus size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  {total > 0 && (
                    <div className="order-total">
                      <span>Total</span>
                      <strong>₹{total}</strong>
                    </div>
                  )}

                  <button type="submit" className="popup-send-btn" disabled={loading || cartItems.length === 0} style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
                    {loading ? 'Placing...' : <><Send size={14} /> Confirm Order</>}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


