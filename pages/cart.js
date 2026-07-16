// pages/cart.js
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const router = useRouter();
  const { cartItems, cartTotals, removeFromCart, updateQty } = useCart();
  const { subtotal, tax, total } = cartTotals;

  if (!cartItems.length) return (
    <div style={{ paddingTop: '120px', minHeight: '70vh' }}>
      <div className="empty-state">
        <i className="fas fa-shopping-bag" />
        <h3>Your bag is empty</h3>
        <p>Add some beautiful jewellery to get started</p>
        <button className="btn-primary" onClick={() => router.push('/shop')}>
          Explore Collection
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--cream)', padding: '100px 60px 60px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 300, marginBottom: '40px' }}>
        Shopping <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Bag</em>
        <span style={{ fontSize: '1rem', color: 'var(--gray)', marginLeft: '12px', fontFamily: 'var(--font-body)' }}>
          ({cartItems.length} items)
        </span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
        {/* Items */}
        <div style={{ background: '#fff', border: '1px solid var(--gold-pale)' }}>
          {cartItems.map(item => {
            const p = item.product;
            if (!p) return null;
            return (
              <div key={p.id} style={{ display: 'flex', gap: '20px', padding: '24px', borderBottom: '1px solid var(--gold-pale)', alignItems: 'center' }}>
                <img
                  src={p.images[0]} alt={p.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', flexShrink: 0, cursor: 'pointer' }}
                  onClick={() => router.push(`/product/${p.id}`)}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>{p.cat}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: '6px', cursor: 'pointer' }}
                    onClick={() => router.push(`/product/${p.id}`)}>{p.name}</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--gold)' }}>₹{p.price.toLocaleString('en-IN')} per piece</div>
                </div>
                {/* Qty */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gold-pale)' }}>
                  <button onClick={() => updateQty(p.id, item.qty - 1)}
                    style={{ width: '36px', height: '36px', background: 'none', border: 'none', cursor: 'pointer' }}>−</button>
                  <span style={{ padding: '0 12px', fontSize: '.88rem', borderLeft: '1px solid var(--gold-pale)', borderRight: '1px solid var(--gold-pale)', lineHeight: '36px' }}>{item.qty}</span>
                  <button onClick={() => updateQty(p.id, item.qty + 1)}
                    style={{ width: '36px', height: '36px', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                </div>
                {/* Line total */}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', minWidth: '100px', textAlign: 'right' }}>
                  ₹{(p.price * item.qty).toLocaleString('en-IN')}
                </div>
                <button onClick={() => removeFromCart(p.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', padding: '4px' }}>
                  <i className="fas fa-times" />
                </button>
              </div>
            );
          })}
          <div style={{ padding: '20px 24px' }}>
            <Link href="/shop" style={{ fontSize: '.78rem', color: 'var(--gray)', textDecoration: 'underline' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-totals">
            <div className="summary-row"><span>Subtotal</span><span>₹{(subtotal||0).toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Shipping</span><span style={{ color: 'var(--green)' }}>FREE</span></div>
            <div className="summary-row"><span>GST (3%)</span><span>₹{(tax||0).toLocaleString('en-IN')}</span></div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{(total||0).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '15px' }}
            onClick={() => router.push('/checkout')}>
            <i className="fas fa-lock" style={{ marginRight: '8px' }} /> Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
