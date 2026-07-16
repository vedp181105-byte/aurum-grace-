// pages/track-order.js
import { useEffect, useState } from 'react';
import { apiCall } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import OrderTracker from '../components/OrderTracker';

export default function TrackOrder() {
  const { isLoggedIn } = useAuth();

  const [myOrders, setMyOrders] = useState([]);
  const [loadingMine, setLoadingMine] = useState(true);

  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { setLoadingMine(false); return; }
    apiCall('GET', '/api/orders/mine').then(data => {
      setMyOrders(data.orders || []);
      setLoadingMine(false);
    });
  }, [isLoggedIn]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchId.trim()) return;
    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    const data = await apiCall('GET', `/api/orders/${searchId.trim()}`);
    setSearching(false);
    if (data.success) setSearchResult(data.order);
    else setSearchError(data.message || 'Order not found');
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark)', padding: '72px 60px', textAlign: 'center' }}>
        <span style={{ fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '12px' }}>
          Order Status
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: '#fff' }}>
          Track Your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Order</em>
        </h1>
      </div>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Manual lookup — works for anyone, logged in or not */}
        <form onSubmit={handleSearch} style={{ background: '#fff', border: '1px solid var(--gold-pale)', padding: '28px', marginBottom: '48px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '220px', marginBottom: 0 }}>
            <label>Order ID</label>
            <input value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="e.g. AG1752489213456" />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', height: '44px' }} disabled={searching}>
            {searching ? 'Searching…' : 'Track Order'}
          </button>
        </form>

        {searchError && (
          <div style={{ background: '#fdecea', border: '1px solid #e74c3c', color: '#c0392b', padding: '12px 16px', fontSize: '.85rem', marginBottom: '32px' }}>
            {searchError}
          </div>
        )}

        {searchResult && (
          <div style={{ background: '#fff', border: '1px solid var(--gold-pale)', padding: '28px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>#{searchResult.orderId}</span>
              <span style={{ fontSize: '.78rem', color: 'var(--gray)', textTransform: 'capitalize' }}>{searchResult.status}</span>
            </div>
            <OrderTracker tracking={searchResult.tracking} />
          </div>
        )}

        {/* Logged-in user's own orders */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, marginBottom: '24px' }}>
          {isLoggedIn ? 'Your Recent Orders' : 'Sign In to See Your Orders'}
        </h2>

        {!isLoggedIn && (
          <p style={{ color: 'var(--gray-dark)', fontSize: '.9rem' }}>
            Log in to automatically see the tracking status of every order you've placed.
          </p>
        )}

        {isLoggedIn && loadingMine && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--gold)' }} />
          </div>
        )}

        {isLoggedIn && !loadingMine && myOrders.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-box" />
            <h3>No orders yet</h3>
            <p>Orders you place while logged in will show up here with live tracking.</p>
          </div>
        )}

        {isLoggedIn && myOrders.map(o => (
          <div key={o.id} style={{ background: '#fff', border: '1px solid var(--gold-pale)', padding: '28px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--gold)', marginBottom: '4px' }}>#{o.id}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--gray)' }}>{o.date} · {o.items.map(i => i.name).join(', ')}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>
                ₹{o.total.toLocaleString('en-IN')}
              </span>
            </div>
            <OrderTracker tracking={o.tracking} />
          </div>
        ))}
      </div>
    </div>
  );
}
