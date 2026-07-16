// components/ProductCard.js
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product: p }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [adding, setAdding] = useState(false);
  const [toast,  setToast]  = useState('');
  const liked = wishlist.includes(p.id);

  async function handleAddToCart(e) {
    e.stopPropagation();
    setAdding(true);
    const ok = await addToCart(p.id, 1);
    setAdding(false);
    if (ok) { setToast('Added to bag! 🛍'); setTimeout(() => setToast(''), 2500); }
  }

  async function handleWish(e) {
    e.stopPropagation();
    const data = await toggleWishlist(p.id);
    if (data) {
      setToast(data.action === 'added' ? 'Added to wishlist ❤️' : 'Removed from wishlist');
      setTimeout(() => setToast(''), 2500);
    }
  }

  function starsHtml(r) {
    let s = '';
    for (let i = 1; i <= 5; i++) s += i <= Math.round(r) ? '★' : '☆';
    return s;
  }

  return (
    <>
      {/* Inline toast for this card */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '30px', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a1a1a', color: '#fff',
          padding: '12px 28px', fontSize: '.82rem',
          borderLeft: '3px solid var(--gold)',
          zIndex: 9999, whiteSpace: 'nowrap',
        }}>{toast}</div>
      )}

      <div className="product-card" onClick={() => router.push(`/product/${p.id}`)}>
        {/* Image wrapper — must have fixed height for img to show */}
        <div className="product-img-wrap">
          {/* Use regular <img> instead of next/image to avoid config issues */}
          <img
            src={p.images[0]}
            alt={p.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Badge */}
          {p.badge
            ? <div className={`product-badge${p.isNewProduct ? ' new-badge' : ''}`}>{p.badge}</div>
            : p.isNewProduct && <div className="product-badge new-badge">NEW</div>
          }
          {/* Wishlist heart */}
          <button
            className={`product-like ${liked ? 'liked' : ''}`}
            onClick={handleWish}
          >
            <i className={`fa${liked ? 's' : 'r'} fa-heart`} />
          </button>
          {/* Quick add overlay */}
          <div className="product-quick" onClick={handleAddToCart}>
            {adding ? 'Adding…' : 'Add to Bag'}
          </div>
        </div>

        <div className="product-info">
          <div className="product-cat">{p.cat}</div>
          <div className="product-name">{p.name}</div>
          <div className="product-rating">
            <div className="stars">{starsHtml(p.rating)}</div>
            <div className="rating-count">({p.reviews})</div>
          </div>
          <div className="product-price">
            <div className="price-now">₹{p.price.toLocaleString('en-IN')}</div>
            <div className="price-old">₹{p.oldPrice.toLocaleString('en-IN')}</div>
            <div className="price-save">{p.discount}% off</div>
          </div>
        </div>
      </div>
    </>
  );
}
