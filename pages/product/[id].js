// pages/product/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';
import { apiCall } from '../../hooks/useApi';

export default function ProductDetail() {
  const router = useRouter();
  const { id }  = router.query;
  const { addToCart, toggleWishlist, wishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [mainImg, setMainImg] = useState('');
  const [qty,     setQty]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiCall('GET', `/api/products/${id}`).then(data => {
      if (data.success) {
        setProduct(data.product);
        setRelated(data.related || []);
        setMainImg(data.product.images[0]);
      }
      setLoading(false);
    });
  }, [id]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  if (loading) return (
    <div style={{ paddingTop:'120px', textAlign:'center', minHeight:'60vh' }}>
      <i className="fas fa-circle-notch fa-spin" style={{ fontSize:'2rem', color:'var(--gold)' }} />
    </div>
  );

  if (!product) return (
    <div style={{ paddingTop:'120px', textAlign:'center', minHeight:'60vh' }}>
      <h2>Product not found</h2>
      <button className="btn-primary" style={{ marginTop:'20px' }} onClick={() => router.push('/shop')}>
        Back to Shop
      </button>
    </div>
  );

  const liked = wishlist.includes(product.id);

  function starsHtml(r) {
    let s = '';
    for (let i = 1; i <= 5; i++) s += i <= Math.round(r) ? '★' : '☆';
    return s;
  }

  return (
    <div style={{ paddingTop:'80px', minHeight:'100vh', background:'var(--cream)' }}>
      {toast && (
        <div style={{ position:'fixed', bottom:'30px', left:'50%', transform:'translateX(-50%)', background:'#1a1a1a', color:'#fff', padding:'12px 28px', borderLeft:'3px solid var(--gold)', zIndex:9999, fontSize:'.82rem' }}>
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ padding:'20px 60px', fontSize:'.78rem', color:'var(--gray)', display:'flex', gap:'8px', alignItems:'center' }}>
        <Link href="/" style={{ color:'var(--gray)' }}>Home</Link> /
        <Link href="/shop" style={{ color:'var(--gray)' }}>Collection</Link> /
        <span style={{ color:'var(--dark)' }}>{product.name}</span>
      </div>

      {/* Main */}
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 60px 80px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'64px', alignItems:'start' }}>
        {/* Gallery */}
        <div>
          <div style={{ height:'500px', overflow:'hidden', marginBottom:'16px', background:'#fff', border:'1px solid var(--gold-pale)' }}>
            <img src={mainImg} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s ease' }} />
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            {product.images.map((img, i) => (
              <div key={i} onClick={() => setMainImg(img)}
                style={{ width:'80px', height:'80px', cursor:'pointer', border: mainImg === img ? '2px solid var(--gold)' : '1px solid var(--gold-pale)', overflow:'hidden', transition:'border .2s' }}>
                <img src={img} alt={`view ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize:'.65rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'10px' }}>
            {product.cat} · {product.sub}
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:300, marginBottom:'16px' }}>
            {product.name}
          </h1>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px' }}>
            <span style={{ color:'var(--gold)', fontSize:'1rem' }}>{starsHtml(product.rating)}</span>
            <span style={{ fontSize:'.82rem', color:'var(--gray)' }}>{product.rating} · {product.reviews} reviews</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--gold)' }}>₹{product.price.toLocaleString('en-IN')}</span>
            <span style={{ fontSize:'1rem', color:'var(--gray)', textDecoration:'line-through' }}>₹{product.oldPrice.toLocaleString('en-IN')}</span>
            <span style={{ background:'#e8f5e9', color:'#2e7d32', padding:'3px 10px', fontSize:'.72rem', fontWeight:700 }}>{product.discount}% OFF</span>
          </div>
          <p style={{ fontSize:'.9rem', lineHeight:1.85, color:'var(--gray-dark)', marginBottom:'28px' }}>{product.desc}</p>

          {/* Specs */}
          <div style={{ border:'1px solid var(--gold-pale)', padding:'20px', marginBottom:'28px' }}>
            {[['Material',product.material],['Weight',product.weight],['Occasion',product.occasion],['Warranty','1 Year'],['Hallmark','BIS Certified']].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--gold-pale)', fontSize:'.84rem' }}>
                <span style={{ color:'var(--gray)', fontSize:'.7rem', letterSpacing:'.08em', textTransform:'uppercase' }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
            <div style={{ display:'flex', border:'1px solid var(--gold-pale)', overflow:'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:'40px', height:'48px', background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer' }}>−</button>
              <span style={{ width:'48px', height:'48px', display:'flex', alignItems:'center', justifyContent:'center', borderLeft:'1px solid var(--gold-pale)', borderRight:'1px solid var(--gold-pale)' }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} style={{ width:'40px', height:'48px', background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer' }}>+</button>
            </div>
            <button className="btn-primary" style={{ flex:1 }}
              onClick={async () => { const ok = await addToCart(product.id, qty); if(ok) showToast('Added to bag! 🛍'); }}>
              <i className="fas fa-shopping-bag" style={{ marginRight:'8px' }} />Add to Bag
            </button>
            <button onClick={async () => { const d = await toggleWishlist(product.id); if(d) showToast(d.action==='added'?'Added to wishlist ❤️':'Removed from wishlist'); }}
              style={{ width:'48px', height:'48px', border:'1px solid var(--gold-pale)', background: liked ? 'var(--gold)' : '#fff', fontSize:'1rem', cursor:'pointer', color: liked ? 'var(--dark)' : 'var(--gray)', transition:'all .25s' }}>
              <i className={`fa${liked?'s':'r'} fa-heart`} />
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ padding:'60px', background:'#fff' }}>
          <div className="section-header">
            <span className="section-tag">You May Also Like</span>
            <h2 className="section-title">Related <em>Pieces</em></h2>
            <div className="section-divider" />
          </div>
          <div className="products-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
