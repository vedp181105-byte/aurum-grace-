// pages/shop.js — Collection / Shop Page
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '../components/ProductCard';
import { apiCall } from '../hooks/useApi';

const CATEGORIES = [
  { value: 'all',     label: 'All Jewellery' },
  { value: 'necklace',label: 'Necklaces'     },
  { value: 'ring',    label: 'Rings'         },
  { value: 'earring', label: 'Earrings'      },
  { value: 'bangle',  label: 'Bangles'       },
  { value: 'bracelet',label: 'Bracelets'     },
  { value: 'gold',    label: 'Gold'          },
  { value: 'diamond', label: 'Diamond'       },
  { value: 'silver',  label: 'Silver'        },
  { value: 'bridal',  label: 'Bridal'        },
];

export default function Shop() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [cat,      setCat]      = useState('all');
  const [sort,     setSort]     = useState('');
  const [search,   setSearch]   = useState('');

  // Sync cat from URL query e.g. /shop?cat=ring
  useEffect(() => {
    if (router.query.cat) setCat(router.query.cat);
  }, [router.query.cat]);

  // Fetch products whenever filter/sort/search changes
  useEffect(() => {
    fetchProducts();
  }, [cat, sort, search]);

  async function fetchProducts() {
    setLoading(true);
    let url = `/api/products?cat=${cat === 'all' ? '' : cat}&sort=${sort}`;
    if (search) url += `&q=${encodeURIComponent(search)}`;
    const data = await apiCall('GET', url);
    setProducts(data.products || []);
    setLoading(false);
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--dark)', padding: '60px', textAlign: 'center' }}>
        <span style={{ fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '12px' }}>
          Our Collection
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: '#fff' }}>
          Fine <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Jewellery</em>
        </h1>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 60px' }}>
        {/* Filters Bar */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', background: '#fff', padding: '20px 24px', border: '1px solid var(--gold-pale)' }}>
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jewellery…"
            style={{ padding: '10px 14px', border: '1px solid var(--gold-pale)', background: 'var(--cream)', flex: 1, minWidth: '200px', fontSize: '.88rem', outline: 'none' }}
          />

          {/* Sort */}
          <select
            value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid var(--gold-pale)', background: 'var(--cream)', fontSize: '.82rem', cursor: 'pointer' }}
          >
            <option value="">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>

          {/* Results count */}
          <span style={{ fontSize: '.78rem', color: 'var(--gray)', marginLeft: 'auto' }}>
            {loading ? 'Loading…' : `${products.length} products`}
          </span>
        </div>

        {/* Category Chips */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => { setCat(c.value); router.push(`/shop?cat=${c.value}`, undefined, { shallow: true }); }}
              style={{
                padding: '8px 20px', border: '1px solid var(--gold-pale)',
                background: cat === c.value ? 'var(--gold)' : '#fff',
                color: cat === c.value ? 'var(--dark)' : 'var(--gray-dark)',
                fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all .25s',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray)' }}>
            <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--gold)' }} />
            <p style={{ marginTop: '16px' }}>Loading jewellery…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search" />
            <h3>No products found</h3>
            <p>Try a different search or category</p>
            <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => { setSearch(''); setCat('all'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
