// pages/register.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }

    setLoading(true);
    const data = await register(form.name, form.email, form.password, form.phone);
    setLoading(false);

    if (data.success) router.push('/account');
    else setError(data.message || 'Registration failed. Please try again.');
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark)', padding: '72px 60px', textAlign: 'center' }}>
        <span style={{ fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '12px' }}>
          Join Us
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: '#fff' }}>
          Create <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Account</em>
        </h1>
      </div>

      <div style={{ maxWidth: '440px', margin: '0 auto', padding: '72px 24px' }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', border: '1px solid var(--gold-pale)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '24px' }}>
            Sign Up
          </h3>

          {error && (
            <div style={{ background: '#fdecea', border: '1px solid #e74c3c', color: '#c0392b', padding: '10px 14px', fontSize: '.8rem', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ananya Patel" />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 99999 99999" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '.85rem', color: 'var(--gray-dark)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--gold)', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
