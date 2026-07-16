// components/CartDrawer.js
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';

export default function CartDrawer() {
  const router = useRouter();
  const { cartItems, cartTotals, cartOpen, setCartOpen, removeFromCart, updateQty } = useCart();

  function goCheckout() {
    setCartOpen(false);
    router.push('/checkout');
  }

  return (
    <>
      {/* Dark overlay */}
      <div
        className={`cart-overlay ${cartOpen ? 'open' : ''}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h3>Shopping Bag ({cartItems.length})</h3>
          <button className="cart-close-btn" onClick={() => setCartOpen(false)}>
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer-items">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <i className="fas fa-shopping-bag" style={{ fontSize: '2.5rem', color: 'var(--gold-pale)', marginBottom: '16px', display: 'block' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, marginBottom: '8px' }}>Your bag is empty</h3>
              <p style={{ color: 'var(--gray)', marginBottom: '20px' }}>Discover our jewellery collection</p>
              <button className="btn-primary" onClick={() => { setCartOpen(false); router.push('/shop'); }}>
                Shop Now
              </button>
            </div>
          ) : (
            cartItems.map(item => {
              const p = item.product;
              if (!p) return null;
              return (
                <div key={p.id} className="cart-item-row">
                  <img src={p.images[0]} alt={p.name} style={{ width: '70px', height: '70px', objectFit: 'cover', flexShrink: 0 }} />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{p.name}</div>
                    <div className="cart-item-price">₹{p.price.toLocaleString('en-IN')}</div>
                    <div className="cart-qty">
                      <button onClick={() => updateQty(p.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(p.id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="cart-remove" onClick={() => removeFromCart(p.id)} title="Remove">
                    <i className="fas fa-trash-alt" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total (incl. GST)</span>
              <span className="cart-total-amount">₹{(cartTotals.total || 0).toLocaleString('en-IN')}</span>
            </div>
            <button className="btn-primary cart-checkout-btn" onClick={goCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
