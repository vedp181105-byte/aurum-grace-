// pages/login.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }

    setLoading(true);
    const data = await login(form.email, form.password);
    setLoading(false);

    if (data.success) router.push('/account');
    else setError(data.message || 'Login failed. Please try again.');
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark)', padding: '72px 60px', textAlign: 'center' }}>
        <span style={{ fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '12px' }}>
          Welcome Back
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: '#fff' }}>
          Sign <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>In</em>
        </h1>
      </div>

      <div style={{ maxWidth: '440px', margin: '0 auto', padding: '72px 24px' }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', border: '1px solid var(--gold-pale)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '24px' }}>
            Login to Your Account
          </h3>

          {error && (
            <div style={{ background: '#fdecea', border: '1px solid #e74c3c', color: '#c0392b', padding: '10px 14px', fontSize: '.8rem', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email Address *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '.85rem', color: 'var(--gray-dark)' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--gold)', fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
