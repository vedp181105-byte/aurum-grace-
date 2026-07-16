// pages/account.js — shows the logged-in user's data (stored in MongoDB)
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const router = useRouter();
  const { user, authLoading, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user]);

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  if (authLoading || !user) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--gold)' }} />
      </div>
    );
  }

  const joined = new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark)', padding: '72px 60px', textAlign: 'center' }}>
        <span style={{ fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '12px' }}>
          My Account
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: '#fff' }}>
          Hello, <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{user.name.split(' ')[0]}</em>
        </h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--gold-pale)', padding: '40px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '28px', paddingBottom: '12px', borderBottom: '1px solid var(--gold-pale)' }}>
            Profile Details
          </h3>

          {[
            { label: 'Full Name',    value: user.name },
            { label: 'Email',        value: user.email },
            { label: 'Phone',        value: user.phone || '—' },
            { label: 'Member Since', value: joined },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--gold-pale)' }}>
              <span style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gray)' }}>{row.label}</span>
              <span style={{ fontSize: '.9rem', color: 'var(--dark)' }}>{row.value}</span>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '14px', marginTop: '32px', flexWrap: 'wrap' }}>
            <button className="btn-outline" style={{ flex: 1 }} onClick={() => router.push('/orders')}>
              My Orders
            </button>
            <button className="btn-outline" style={{ flex: 1 }} onClick={() => router.push('/track-order')}>
              Track Orders
            </button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
