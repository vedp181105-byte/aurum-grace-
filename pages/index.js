// pages/index.js — Home Page
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ProductCard from '../components/ProductCard';
import { apiCall } from '../hooks/useApi';

export default function Home() {
  const router = useRouter();
  const [featured,     setFeatured]     = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    async function load() {
      const [f, t] = await Promise.all([
        apiCall('GET', '/api/products/featured'),
        apiCall('GET', '/api/testimonials'),
      ]);
      setFeatured(f.products       || []);
      setTestimonials(t.testimonials || []);
      setLoading(false);
    }
    load();
  }, []);

  const collections = [
    { name: 'Bridal Collection',  img: 'https://i.pinimg.com/1200x/2b/87/74/2b8774e9c44f664a217c8595aada50f0.jpg', cat: 'bridal'  },
    { name: 'Gold Jewellery',     img: 'https://i.pinimg.com/736x/0d/00/c1/0d00c18fe3cbd07d1c22c25fa5723b0b.jpg',  cat: 'gold'    },
    { name: 'Diamond Collection', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',   cat: 'diamond' },
    { name: 'Silver & Pearls',    img: 'https://i.pinimg.com/736x/52/65/d4/5265d46ff1e3febc28a2566706e8d3a0.jpg', cat: 'silver'  },
  ];

  const features = [
    { icon:'fa-award',         title:'BIS Hallmark',   desc:'Every piece certified by Bureau of Indian Standards' },
    { icon:'fa-shipping-fast', title:'Free Shipping',  desc:'Complimentary delivery on orders above ₹5000' },
    { icon:'fa-undo',          title:'30-Day Returns', desc:'Hassle-free returns on all jewellery pieces' },
    { icon:'fa-headset',       title:'24/7 Support',   desc:'Dedicated customer care always at your service' },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          <img
            src="https://i.pinimg.com/1200x/2b/87/74/2b8774e9c44f664a217c8595aada50f0.jpg"
            alt="Hero"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(.4)' }}
          />
        </div>
        <div style={{ position:'relative', zIndex:1, padding:'120px 60px 60px', maxWidth:'720px' }}>
          <span style={{ fontSize:'.65rem', letterSpacing:'.25em', textTransform:'uppercase', color:'var(--gold)', display:'block', marginBottom:'16px' }}>
            Handcrafted Luxury Since 2010
          </span>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.8rem,5vw,4.2rem)', fontWeight:300, color:'#fff', lineHeight:1.08, marginBottom:'24px' }}>
            Where Every Piece<br />
            <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Tells a Story</em>
          </h1>
          <p style={{ color:'rgba(255,255,255,.7)', fontSize:'.95rem', lineHeight:1.85, maxWidth:'480px', marginBottom:'40px' }}>
            Discover exquisite handcrafted jewellery — from bridal sets to everyday elegance. BIS Hallmark certified.
          </p>
          <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
            <button className="btn-primary" onClick={() => router.push('/shop')}>Explore Collection</button>
            <button className="btn-outline" style={{ color:'#fff', borderColor:'rgba(255,255,255,.5)' }}
              onClick={() => router.push('/shop?cat=bridal')}>Bridal Jewellery</button>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ── */}
      <section style={{ padding:'80px 60px', background:'var(--cream)' }}>
        <div className="section-header">
          <span className="section-tag">Curated for You</span>
          <h2 className="section-title">Our <em>Collections</em></h2>
          <div className="section-divider" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }}>
          {collections.map(c => (
            <div key={c.cat} onClick={() => router.push(`/shop?cat=${c.cat}`)}
              style={{ cursor:'pointer', position:'relative', height:'320px', overflow:'hidden' }}>
              <img src={c.img} alt={c.name}
                style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .5s ease' }}
                onMouseOver={e => e.currentTarget.style.transform='scale(1.06)'}
                onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
              />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.7),transparent)' }} />
              <div style={{ position:'absolute', bottom:'20px', left:'20px', color:'#fff' }}>
                <div style={{ fontSize:'.65rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'6px' }}>Explore</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem' }}>{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding:'80px 60px', background:'#fff' }}>
        <div className="section-header">
          <span className="section-tag">Handpicked for You</span>
          <h2 className="section-title">Featured <em>Pieces</em></h2>
          <div className="section-divider" />
        </div>
        {loading ? (
          <div style={{ textAlign:'center', padding:'60px', color:'var(--gray)' }}>
            <i className="fas fa-circle-notch fa-spin" style={{ fontSize:'2rem', color:'var(--gold)' }} />
            <p style={{ marginTop:'16px' }}>Loading collection…</p>
          </div>
        ) : (
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        <div style={{ textAlign:'center', marginTop:'48px' }}>
          <button className="btn-outline" onClick={() => router.push('/shop')}>View All Jewellery</button>
        </div>
      </section>

      {/* ── OFFER BANNER ── */}
      <section style={{ padding:'80px 60px', background:'var(--dark)', textAlign:'center' }}>
        <span style={{ fontSize:'.65rem', letterSpacing:'.25em', textTransform:'uppercase', color:'var(--gold)', display:'block', marginBottom:'16px' }}>
          Limited Time Offer
        </span>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2.6rem', fontWeight:300, color:'#fff', marginBottom:'16px' }}>
          Bridal Season Sale — Up to <em style={{ color:'var(--gold)' }}>30% Off</em>
        </h2>
        <p style={{ color:'rgba(255,255,255,.6)', marginBottom:'36px', fontSize:'.92rem' }}>
          On selected bridal sets and gold jewellery. Valid till end of month.
        </p>
        <button className="btn-primary" onClick={() => router.push('/shop?cat=bridal')}>
          Shop Bridal Collection
        </button>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section style={{ padding:'80px 60px', background:'var(--cream)' }}>
          <div className="section-header">
            <span className="section-tag">What Our Customers Say</span>
            <h2 className="section-title">Happy <em>Stories</em></h2>
            <div className="section-divider" />
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card">
                <div className="testi-stars">{'★'.repeat(t.rating)}</div>
                <div className="testi-text">"{t.text}"</div>
                <div className="testi-author">
                  <img src={t.avatar} alt={t.name} className="testi-avatar" />
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-loc">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── WHY US ── */}
      <section style={{ padding:'80px 60px', background:'#fff' }}>
        <div className="section-header">
          <span className="section-tag">Why Choose Us</span>
          <h2 className="section-title">The Aurum & Grace <em>Promise</em></h2>
          <div className="section-divider" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'32px', textAlign:'center' }}>
          {features.map((item, i) => (
            <div key={i} style={{ padding:'32px 20px', border:'1px solid var(--gold-pale)' }}>
              <i className={`fas ${item.icon}`} style={{ fontSize:'2rem', color:'var(--gold)', marginBottom:'16px', display:'block' }} />
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', marginBottom:'10px', fontWeight:400 }}>{item.title}</h3>
              <p style={{ fontSize:'.82rem', color:'var(--gray)', lineHeight:1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
