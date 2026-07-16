// pages/order-success.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiCall } from '../hooks/useApi';
import OrderTracker from '../components/OrderTracker';

export default function OrderSuccess() {
  const router  = useRouter();
  const { inv } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!inv) return;
    apiCall('GET', `/api/orders/${inv}`).then(data => {
      if (data.success) setOrder(data.order);
    });
  }, [inv]);

  if (!order) return (
    <div style={{ paddingTop:'120px', textAlign:'center', minHeight:'60vh' }}>
      <i className="fas fa-circle-notch fa-spin" style={{ fontSize:'2rem', color:'var(--gold)' }} />
    </div>
  );

  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });

  return (
    <div style={{ paddingTop:'80px', minHeight:'100vh', background:'var(--cream)', padding:'100px 60px 60px' }}>
      {/* Success banner */}
      <div style={{ textAlign:'center', marginBottom:'48px' }}>
        <div style={{ width:'72px', height:'72px', background:'var(--gold)', borderRadius:'50%', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem' }}>✓</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.6rem', fontWeight:300, marginBottom:'10px' }}>
          Order <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Confirmed!</em>
        </h1>
        <p style={{ color:'var(--gray)', fontSize:'.95rem' }}>
          Thank you, {order.customer.name.split(' ')[0]}! Your jewellery is on its way.
        </p>
      </div>

      {/* Invoice */}
      <div style={{ maxWidth:'820px', margin:'0 auto', background:'#fff', border:'1px solid var(--gold-pale)', padding:'48px' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'40px', paddingBottom:'28px', borderBottom:'2px solid var(--gold)' }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', color:'var(--gold)' }}>Aurum <span style={{ color:'var(--dark)' }}>&</span> Grace</div>
            <div style={{ fontSize:'.78rem', color:'var(--gray)', marginTop:'6px' }}>Ring Road, Surat - 395001, Gujarat, India</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--gold)', fontWeight:300 }}>Invoice</div>
            <div style={{ fontSize:'.82rem', color:'var(--gray)', marginTop:'4px' }}># {order.id}</div>
            <div style={{ fontSize:'.78rem', color:'var(--gray)' }}>{date}</div>
            <div style={{ marginTop:'8px', background:'var(--gold)', color:'var(--dark)', padding:'4px 14px', fontSize:'.65rem', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, display:'inline-block' }}>✅ Confirmed</div>
          </div>
        </div>

        {/* Tracking */}
        {order.tracking && (
          <div style={{ marginBottom: '36px', paddingBottom: '28px', borderBottom: '1px solid var(--gold-pale)' }}>
            <OrderTracker tracking={order.tracking} />
          </div>
        )}

        {/* Parties */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px', marginBottom:'36px' }}>
          <div>
            <div style={{ fontSize:'.65rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'10px' }}>Bill To</div>
            <div style={{ fontWeight:500, marginBottom:'4px' }}>{order.customer.name}</div>
            <div style={{ fontSize:'.83rem', color:'var(--gray-dark)', lineHeight:1.7 }}>
              {order.customer.email}<br />{order.customer.phone}<br />{order.customer.address}
            </div>
          </div>
          <div>
            <div style={{ fontSize:'.65rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'10px' }}>Payment</div>
            <div style={{ fontWeight:500, marginBottom:'4px', textTransform:'capitalize' }}>{order.payMethod}</div>
            <div style={{ fontSize:'.83rem', color:'var(--green)', fontWeight:600 }}>Confirmed</div>
          </div>
        </div>

        {/* Table */}
        <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:'28px' }}>
          <thead>
            <tr style={{ background:'var(--dark)', color:'#fff' }}>
              {['# Product','Price','Qty','Total'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign: h==='Total' ? 'right' : 'left', fontSize:'.68rem', letterSpacing:'.15em', textTransform:'uppercase', fontWeight:400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} style={{ borderBottom:'1px solid var(--gold-pale)' }}>
                <td style={{ padding:'14px 16px', fontSize:'.84rem' }}>
                  <span style={{ color:'var(--gray)', fontSize:'.72rem', marginRight:'8px' }}>{i+1}</span>
                  {item.name}
                </td>
                <td style={{ padding:'14px 16px', fontSize:'.84rem' }}>₹{item.price.toLocaleString('en-IN')}</td>
                <td style={{ padding:'14px 16px', fontSize:'.84rem' }}>{item.qty}</td>
                <td style={{ padding:'14px 16px', fontSize:'.84rem', textAlign:'right', fontWeight:500 }}>₹{item.total.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ maxWidth:'260px', marginLeft:'auto' }}>
          {[['Subtotal',`₹${order.subtotal.toLocaleString('en-IN')}`],['Shipping','FREE'],['GST (3%)',`₹${order.tax.toLocaleString('en-IN')}`]].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'.83rem', color:'var(--gray)', marginBottom:'6px' }}>
              <span>{k}</span><span style={{ color: k==='Shipping' ? 'var(--green)' : 'inherit' }}>{v}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--gold)', borderTop:'1px solid var(--gold)', paddingTop:'12px', marginTop:'8px' }}>
            <span>Grand Total</span><span>₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style={{ marginTop:'40px', paddingTop:'24px', borderTop:'1px solid var(--gold-pale)', textAlign:'center', fontSize:'.78rem', color:'var(--gray)' }}>
          <p>✦ Thank you for choosing Aurum & Grace — Every piece is BIS Hallmark certified.</p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ maxWidth:'820px', margin:'24px auto 0', display:'flex', gap:'14px', flexWrap:'wrap', justifyContent:'center' }}>
        <button className="btn-primary" onClick={() => window.print()}>
          <i className="fas fa-print" style={{ marginRight:'8px' }} />Print Invoice
        </button>
        <button className="btn-outline" onClick={() => router.push('/orders')}>
          <i className="fas fa-box" style={{ marginRight:'8px' }} />My Orders
        </button>
        <button className="btn-outline" onClick={() => router.push('/shop')}>
          <i className="fas fa-shopping-bag" style={{ marginRight:'8px' }} />Continue Shopping
        </button>
      </div>
    </div>
  );
}
