// pages/_app.js
// This file wraps EVERY page — like a master layout
import '../styles/globals.css';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
    <CartProvider>
      <Head>
        <title>Aurum & Grace — Luxury Jewellery</title>
        <meta name="description" content="Handcrafted luxury jewellery. BIS Hallmark certified." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </Head>

      <Navbar />
      <CartDrawer />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />
    </CartProvider>
    </AuthProvider>
  );
}
