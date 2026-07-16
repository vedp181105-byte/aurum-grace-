// pages/wishlist.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '../components/ProductCard';
import { apiCall } from '../hooks/useApi';

export default function Wishlist() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    apiCall('GET', '/api/wishlist').then(data => {
      setProducts(data.products || []);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)', padding: '100px 60px 60px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 300, marginBottom: '40px' }}>
        My <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Wishlist</em>
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray)' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--gold)' }} />
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-heart" />
          <h3>Your wishlist is empty</h3>
          <p>Save pieces you love for later</p>
          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => router.push('/shop')}>
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
