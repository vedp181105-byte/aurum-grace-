// pages/contact.js
import { useState } from 'react';
import { apiCall } from '../hooks/useApi';

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { alert('Please fill all required fields'); return; }
    setLoading(true);
    const data = await apiCall('POST', '/api/contact', form);
    setLoading(false);
    if (data.success) setSent(true);
    else alert(data.message || 'Failed to send. Please try again.');
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark)', padding: '72px 60px', textAlign: 'center' }}>
        <span style={{ fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '12px' }}>
          Get in Touch
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: '#fff' }}>
          Contact <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Us</em>
        </h1>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
        {/* Left — Contact Info */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '24px' }}>
            We'd Love to <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Hear From You</em>
          </h2>
          <p style={{ color: 'var(--gray-dark)', lineHeight: 1.85, marginBottom: '36px', fontSize: '.92rem' }}>
            Whether you have a question about a piece, need help with a bridal order, or just want to learn more — our team is here for you.
          </p>
          {[
            { icon: 'fa-map-marker-alt', title: 'Visit Us',    info: 'Ring Road, Surat, Gujarat 395001' },
            { icon: 'fa-phone',          title: 'Call Us',     info: '+91 99999 99999' },
            { icon: 'fa-envelope',       title: 'Email Us',    info: 'hello@aurumgrace.in' },
            { icon: 'fa-clock',          title: 'Store Hours', info: 'Mon–Sat: 10am – 8pm' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`fas ${item.icon}`} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <div style={{ fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '.88rem', color: 'var(--dark)' }}>{item.info}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Form */}
        <div>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid var(--gold-pale)' }}>
              <div style={{ fontSize: '3rem', color: 'var(--gold)', marginBottom: '16px' }}>✓</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, marginBottom: '10px' }}>Message Sent!</h3>
              <p style={{ color: 'var(--gray)', fontSize: '.88rem' }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', border: '1px solid var(--gold-pale)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '24px' }}>Send a Message</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Ananya Patel" />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Bridal jewellery enquiry…" />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Tell us how we can help…" rows={5}
                  style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
