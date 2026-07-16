// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand-name">Aurum & Grace</div>
          <p>
            Crafting timeless jewellery with the finest materials.
            Every piece tells a story of elegance and artistry.
          </p>
        </div>
        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Collection</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><Link href="/shop?cat=necklace">Necklaces</Link></li>
            <li><Link href="/shop?cat=ring">Rings</Link></li>
            <li><Link href="/shop?cat=earring">Earrings</Link></li>
            <li><Link href="/shop?cat=bangle">Bangles</Link></li>
            <li><Link href="/shop?cat=bracelet">Bracelets</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a>Ring Road, Surat - 395001</a></li>
            <li><a>Gujarat, India</a></li>
            <li><a>+91 99999 99999</a></li>
            <li><a>hello@aurumgrace.in</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Aurum & Grace. All rights reserved.</p>
        <p>BIS Hallmark Certified · Secure Payments</p>
      </div>
    </footer>
  );
}
