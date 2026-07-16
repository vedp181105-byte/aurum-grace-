// pages/checkout.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { apiCall } from '../hooks/useApi';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, cartTotals, clearCart } = useCart();
  const { subtotal, tax, total } = cartTotals;
  const [payMethod, setPayMethod] = useState('card');
  const [loading,   setLoading]   = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', pin: '', state: '', country: 'India',
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function placeOrder() {
    if (!form.firstName || !form.lastName) { alert('Please enter your full name'); return; }
    if (!cartItems.length) { alert('Cart is empty'); return; }
    setLoading(true);
    const data = await apiCall('POST', '/api/orders', { customer: form, payMethod });
    setLoading(false);
    if (data.success) {
      await clearCart();
      router.push({ pathname: '/order-success', query: { inv: data.order.id } });
    } else {
      alert(data.message || 'Order failed. Please try again.');
    }
  }

  if (!cartItems.length) return (
    <div style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
      <h2>Your cart is empty</h2>
      <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => router.push('/shop')}>Shop Now</button>
    </div>
  );

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
      <div className="checkout-grid">
        {/* Left — Form */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: '36px' }}>Checkout</h1>

          {/* Delivery */}
          <div className="form-section">
            <h3>Delivery Details</h3>
            <div className="form-row">
              <div className="form-group"><label>First Name *</label><input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Your First Name" /></div>
              <div className="form-group"><label>Last Name *</label><input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Your Last Name" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" /></div>
              <div className="form-group"><label>Phone</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="Your Phone Number" /></div>
            </div>
            <div className="form-group"><label>Address</label><input name="address" value={form.address} onChange={handleChange} placeholder="Your Address" /></div>
            <div className="form-row">
              <div className="form-group"><label>City</label><input name="city" value={form.city} onChange={handleChange} placeholder="Your City" /></div>
              <div className="form-group"><label>PIN Code</label><input name="pin" value={form.pin} onChange={handleChange} placeholder="Your PIN Code" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>State</label><input name="state" value={form.state} onChange={handleChange} placeholder="Your State" /></div>
              <div className="form-group">
                <label>Country</label>
                <select name="country" value={form.country} onChange={handleChange}>
                  <option>India</option><option>UAE</option><option>USA</option><option>UK</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="form-section">
            <h3>Payment Method</h3>
            {[
              { value: 'card', label: 'Credit / Debit Card', icon: 'fa-credit-card' },
              { value: 'upi',  label: 'UPI / Google Pay',    icon: 'fa-mobile-alt'  },
              { value: 'cod',  label: 'Cash on Delivery',    icon: 'fa-money-bill'  },
            ].map(m => (
              <label key={m.value} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px', border: `1px solid ${payMethod === m.value ? 'var(--gold)' : 'var(--gold-pale)'}`,
                background: payMethod === m.value ? 'var(--gold-pale)' : '#fff',
                cursor: 'pointer', marginBottom: '10px', transition: 'all .2s',
              }}>
                <input type="radio" name="pay" value={m.value} checked={payMethod === m.value}
                  onChange={() => setPayMethod(m.value)} style={{ accentColor: 'var(--gold)' }} />
                <i className={`fas ${m.icon}`} style={{ color: 'var(--gold)', width: '20px' }} />
                <span style={{ fontSize: '.88rem' }}>{m.label}</span>
              </label>
            ))}
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: '16px' }}
            onClick={placeOrder} disabled={loading}>
            {loading ? 'Placing Order…' : <><i className="fas fa-lock" style={{ marginRight: '8px' }} />Place Order — ₹{(total||0).toLocaleString('en-IN')}</>}
          </button>
        </div>

        {/* Right — Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => {
            const p = item.product;
            if (!p) return null;
            return (
              <div key={p.id} className="summary-item">
                <img src={p.images[0]} alt={p.name} style={{ width: '54px', height: '54px', objectFit: 'cover' }} />
                <div className="summary-item-info">
                  <div className="summary-item-name">{p.name}</div>
                  <div className="summary-item-qty">Qty: {item.qty}</div>
                </div>
                <div className="summary-item-price">₹{(p.price * item.qty).toLocaleString('en-IN')}</div>
              </div>
            );
          })}
          <div className="summary-totals">
            <div className="summary-row"><span>Subtotal</span><span>₹{(subtotal||0).toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Shipping</span><span style={{ color: 'var(--green)' }}>FREE</span></div>
            <div className="summary-row"><span>GST (3%)</span><span>₹{(tax||0).toLocaleString('en-IN')}</span></div>
            <div className="summary-total"><span>Grand Total</span><span>₹{(total||0).toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
