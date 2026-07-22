// pages/about.js
import Link from 'next/link';

export default function About() {
  const stats = [
    { num: '15+',     label: 'Years of Excellence' },
    { num: '50,000+', label: 'Happy Customers' },
    { num: '120+',    label: 'Cities Served' },
    { num: '5,000+',  label: 'Unique Designs' },
  ];

  const values = [
    { icon: 'fa-gem',        title: 'Master Craftsmanship', desc: 'Every piece is hand-finished by artisans with decades of experience in fine jewellery making.' },
    { icon: 'fa-award',      title: '100% Certified',       desc: 'All our gold and diamond jewellery is BIS Hallmark certified for guaranteed purity.' },
    { icon: 'fa-leaf',       title: 'Ethical Sourcing',     desc: 'We source our gold and gemstones responsibly, from trusted and conflict-free suppliers.' },
    { icon: 'fa-heart',      title: 'Lifetime Care',        desc: 'From cleaning to resizing, we look after every piece long after it leaves our store.' },
  ];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>

      {/* ── HERO ── */}
      <div style={{ background: 'var(--dark)', padding: '72px 60px', textAlign: 'center' }}>
        <span style={{ fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '12px' }}>
          Our Story
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: '#fff' }}>
          The Art of Fine <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Jewellery</em>
        </h1>
      </div>

      {/* ── BRAND STORY ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
        <div>
          <img
            src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=80"
            alt="Jewellery craftsmanship"
            style={{ width: '100%', height: '480px', objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }}
          />
        </div>
        <div>
          <span style={{ fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '12px' }}>
            Since 2010
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: '20px' }}>
            Handcrafted With <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Heart</em>
          </h2>
          <p style={{ color: 'var(--gray-dark)', lineHeight: 1.85, marginBottom: '20px', fontSize: '.92rem' }}>
            Aurum & Grace began in Surat with a simple belief — that jewellery should feel personal.
            What started as a small family workshop has grown into a name trusted by thousands of
            customers across India, without ever losing sight of the craft that built it.
          </p>
          <p style={{ color: 'var(--gray-dark)', lineHeight: 1.85, marginBottom: '32px', fontSize: '.92rem' }}>
            Today, every piece we create still passes through the hands of skilled artisans before
            it reaches yours — checked, certified, and finished to a standard we'd be proud to wear
            ourselves.
          </p>
          <Link href="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '14px 32px', textDecoration: 'none' }}>
            Explore Our Collection
          </Link>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: 'var(--gold-pale)', padding: '56px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 400, color: 'var(--dark)' }}>{s.num}</div>
              <div style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray-dark)', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VALUES ── */}
      <section style={{ padding: '80px 60px', background: '#fff' }}>
        <div className="section-header">
          <span className="section-tag">What We Stand For</span>
          <h2 className="section-title">Our <em>Values</em></h2>
          <div className="section-divider" />
        </div>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {values.map((item, i) => (
            <div key={i} style={{ padding: '32px 20px', border: '1px solid var(--gold-pale)' }}>
              <i className={`fas ${item.icon}`} style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '16px', display: 'block' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: '10px', fontWeight: 400 }}>{item.title}</h3>
              <p style={{ fontSize: '.82rem', color: 'var(--gray)', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div style={{ background: 'var(--dark)', padding: '72px 60px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: '#fff', marginBottom: '16px' }}>
          Ready to Find Your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Perfect Piece</em>?
        </h2>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.92rem', marginBottom: '32px' }}>
          Browse our full collection of handcrafted, certified jewellery.
        </p>
        <Link href="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '14px 36px', textDecoration: 'none' }}>
          Shop Now
        </Link>
      </div>
    </div>
  );
}
