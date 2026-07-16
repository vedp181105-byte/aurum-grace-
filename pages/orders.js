// pages/orders.js — My Orders Page
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiCall } from '../hooks/useApi';

export default function Orders() {
  const router = useRouter();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall('GET', '/api/orders').then(data => {
      setOrders(data.orders || []);
      setLoading(false);
    });
  }, []);

  const statusColor = {
    confirmed:  '#c9a84c',
    processing: '#3498db',
    shipped:    '#9b59b6',
    delivered:  '#2ecc71',
    cancelled:  '#e74c3c',
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)', padding: '100px 60px 60px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 300, marginBottom: '10px' }}>
        My <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Orders</em>
      </h1>
      <button className="btn-outline" style={{ marginBottom: '30px' }} onClick={() => router.push('/track-order')}>
        <i className="fas fa-truck-fast" style={{ marginRight: '8px' }} />Track an Order
      </button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--gold)' }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-box" />
          <h3>No orders yet</h3>
          <p>Your order history will appear here</p>
          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => router.push('/shop')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '860px' }}>
          {orders.map(o => {
            const date = new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
            return (
              <div key={o.id} style={{ background: '#fff', border: '1px solid var(--gold-pale)', padding: '28px' }}
                onClick={() => router.push(`/order-success?inv=${o.id}`)} style={{ background: '#fff', border: '1px solid var(--gold-pale)', padding: '28px', cursor: 'pointer', transition: 'box-shadow .2s' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.1)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--gold)', marginBottom: '4px' }}>
                      #{o.id}
                    </div>
                    <div style={{ fontSize: '.78rem', color: 'var(--gray)' }}>{date}</div>
                  </div>
                  <span style={{ background: statusColor[o.status] || 'var(--gold)', color: '#fff', padding: '4px 14px', fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {o.status}
                  </span>
                </div>
                <div style={{ fontSize: '.83rem', color: 'var(--gray-dark)', marginBottom: '14px' }}>
                  {o.items.map(i => i.name).join(', ')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--gold-pale)' }}>
                  <span style={{ fontSize: '.78rem', color: 'var(--gray)' }}>
                    {o.payMethod} · {o.items.reduce((s, i) => s + i.qty, 0)} items
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>
                    ₹{o.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
