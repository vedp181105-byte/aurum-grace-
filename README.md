# ✦ Aurum & Grace — Next.js + Express + MongoDB

## 📁 Project Structure

```
aurum-nextjs/
│
├── pages/                     ← Next.js Pages (each file = one URL)
│   ├── _app.js                ← Global layout (Navbar, Footer, Cart)
│   ├── index.js               → http://localhost:3001/
│   ├── shop.js                → http://localhost:3001/shop
│   ├── product/[id].js        → http://localhost:3001/product/1
│   ├── cart.js                → http://localhost:3001/cart
│   ├── checkout.js            → http://localhost:3001/checkout
│   ├── order-success.js       → http://localhost:3001/order-success
│   ├── wishlist.js            → http://localhost:3001/wishlist
│   ├── orders.js              → http://localhost:3001/orders
│   └── contact.js             → http://localhost:3001/contact
│
├── components/                ← Reusable React components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── CartDrawer.js
│   ├── ProductCard.js
│   └── Toast.js
│
├── context/
│   └── CartContext.js         ← Global cart + wishlist state
│
├── hooks/
│   └── useApi.js              ← All API calls to Express
│
├── styles/
│   └── globals.css            ← All CSS styles
│
├── api/                       ← Express Backend (unchanged)
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   ├── routes/api.js
│   ├── data/products.js
│   └── scripts/seed.js
│
├── .env.local                 ← Config (edit MongoDB URI here)
├── next.config.js
└── package.json
```

---

## 🚀 Setup in 4 Steps

### 1. Install all packages
```bash
npm install
```

### 2. Edit `.env.local` — set your MongoDB URI
```env
# Local MongoDB:
MONGO_URI=mongodb://localhost:27017/aurum_grace

# OR Atlas:
MONGO_URI=mongodb+srv://vedang:vedu1808@cluster0.motpd9d.mongodb.net/aurum_grace
```

### 3. Seed products into MongoDB (run once)
```bash
npm run seed
```

### 4. Start both servers together
```bash
npm run dev
```

This starts:
- **Express API** → http://localhost:3000  (backend)
- **Next.js**     → http://localhost:3001  (frontend)

Open your browser at → **http://localhost:3001** 🎉

---

## 📄 Pages & URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3001/ |
| Shop | http://localhost:3001/shop |
| Product | http://localhost:3001/product/1 |
| Cart | http://localhost:3001/cart |
| Checkout | http://localhost:3001/checkout |
| Order Confirm | http://localhost:3001/order-success |
| Wishlist | http://localhost:3001/wishlist |
| My Orders | http://localhost:3001/orders |
| Contact | http://localhost:3001/contact |

---

## 🗄️ What Saves to MongoDB

| Action | Collection |
|--------|-----------|
| Place Order | `orders` ✅ |
| Submit Review | `reviews` ✅ |
| Contact Form | (add Contact model if needed) |
| Cart & Wishlist | `sessions` ✅ |
| Products | `products` ✅ (seeded) |

---

## 💡 Key Concepts (for beginners)

| Concept | What it does |
|---------|-------------|
| `pages/` folder | Each `.js` file = one page/URL automatically |
| `components/` | Reusable pieces used across pages |
| `context/CartContext.js` | Global state — cart count, wishlist available everywhere |
| `next.config.js rewrites` | `/api/...` calls go to Express on port 3000 |
| `Image` from next/image | Optimized images (faster loading) |
| `useRouter` | Navigate between pages in code |
| `Link` from next/link | Clickable links between pages |
