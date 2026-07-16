// components/Navbar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { cartCount, wishlist, setCartOpen } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/',          label: 'Home'       },
    { href: '/shop',      label: 'Collection' },
    { href: '/about',     label: 'About'      },
    { href: '/contact',   label: 'Contact'    },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="nav-logo">
        Aurum <span>&</span> Grace
      </Link>

      <div className="nav-links">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={router.pathname === l.href ? 'active' : ''}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className="nav-icons">
        {/* Search */}
        <button className="nav-icon-btn" onClick={() => router.push('/shop')} title="Search">
          <i className="fas fa-search" />
        </button>

        {/* Wishlist */}
        <button className="nav-icon-btn" onClick={() => router.push('/wishlist')} title="Wishlist">
          <i className="far fa-heart" />
          {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
        </button>

        {/* Cart */}
        <button className="nav-icon-btn" onClick={() => setCartOpen(true)} title="Cart">
          <i className="fas fa-shopping-bag" />
          {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
        </button>

        {/* My Orders */}
        <button className="nav-icon-btn" onClick={() => router.push('/orders')} title="My Orders">
          <i className="fas fa-box" />
        </button>

        {/* Track Order */}
        <button className="nav-icon-btn" onClick={() => router.push('/track-order')} title="Track Order">
          <i className="fas fa-truck-fast" />
        </button>

        {/* Account */}
        <button
          className="nav-icon-btn"
          onClick={() => router.push(isLoggedIn ? '/account' : '/login')}
          title={isLoggedIn ? user.name : 'Login'}
        >
          <i className="far fa-user" />
        </button>
      </div>
    </nav>
  );
}
