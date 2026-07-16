const express    = require('express');
const router     = express.Router();
const bcrypt     = require('bcryptjs');
const Product    = require('../models/Product');
const Order      = require('../models/Order');
const Review     = require('../models/Review');
const User       = require('../models/User');
const { TESTIMONIALS, COUPONS } = require('../data/products');

// ─── AUTH (register / login / logout / session) ───────────────────
// POST /api/auth/register — creates a user in MongoDB (password hashed) and logs them in
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name:  name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      phone: phone || '',
    });

    req.session.userId = user._id.toString();
    res.json({ success: true, user: user.toSafeJSON() });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login — verifies credentials against MongoDB, starts session
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    req.session.userId = user._id.toString();
    res.json({ success: true, user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/logout — destroys the session
router.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: 'Could not log out' });
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out' });
  });
});

// GET /api/auth/me — returns the currently logged-in user (or null), reads from MongoDB
router.get('/auth/me', async (req, res) => {
  try {
    if (!req.session.userId) return res.json({ success: true, user: null });
    const user = await User.findById(req.session.userId);
    if (!user) return res.json({ success: true, user: null });
    res.json({ success: true, user: user.toSafeJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PRODUCTS ────────────────────────────────────────────────────
// GET /api/products  — optional ?cat=&sort=&q=
router.get('/products', async (req, res) => {
  try {
    const { cat, sort, q } = req.query;
    const query = {};

    if (cat && cat !== 'all') {
      query.$or = [{ cat }, { sub: cat }];
    }
    if (q) {
      const rx = new RegExp(q, 'i');
      query.$or = [{ name: rx }, { cat: rx }, { sub: rx }, { desc: rx }];
    }

    let dbSort = {};
    if (sort === 'price-asc')  dbSort = { price:  1 };
    if (sort === 'price-desc') dbSort = { price: -1 };
    if (sort === 'rating')     dbSort = { rating: -1 };
    if (sort === 'popular')    dbSort = { popular: -1 };

    const products = await Product.find(query).sort(dbSort);
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/featured
router.get('/products/featured', async (req, res) => {
  try {
    const products = await Product.find().sort({ popular: -1 }).limit(6);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const related = await Product.find({ cat: product.cat, id: { $ne: product.id } }).limit(4);
    res.json({ success: true, product, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── TESTIMONIALS ─────────────────────────────────────────────────
router.get('/testimonials', (req, res) => {
  res.json({ success: true, testimonials: TESTIMONIALS });
});

// ─── CART (session — stays fast, no DB needed) ────────────────────
function getCart(req) {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

router.get('/cart', async (req, res) => {
  try {
    const cart = getCart(req);
    const ids  = cart.map(c => c.id);
    const dbProducts = await Product.find({ id: { $in: ids } });

    const enriched = cart.map(item => {
      const product = dbProducts.find(p => p.id === item.id);
      return product ? { ...item, product: product.toJSON() } : null;
    }).filter(Boolean);

    const subtotal = enriched.reduce((s, c) => s + c.product.price * c.qty, 0);
    const tax      = Math.round(subtotal * 0.03);
    res.json({ success: true, cart: enriched, subtotal, tax, total: subtotal + tax, count: cart.reduce((s, c) => s + c.qty, 0) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/cart', async (req, res) => {
  try {
    const { id, qty = 1 } = req.body;
    const product = await Product.findOne({ id: parseInt(id) });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const cart = getCart(req);
    const existing = cart.find(c => c.id === parseInt(id));
    if (existing) {
      existing.qty += parseInt(qty);
    } else {
      cart.push({ id: parseInt(id), qty: parseInt(qty) });
    }
    req.session.cart = cart;
    res.json({ success: true, message: 'Added to cart', count: cart.reduce((s, c) => s + c.qty, 0) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/cart/:id', (req, res) => {
  const cart = getCart(req);
  const item = cart.find(c => c.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });
  item.qty = Math.max(1, parseInt(req.body.qty));
  req.session.cart = cart;
  res.json({ success: true, message: 'Cart updated' });
});

router.delete('/cart/:id', (req, res) => {
  req.session.cart = getCart(req).filter(c => c.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Item removed', count: req.session.cart.reduce((s, c) => s + c.qty, 0) });
});

router.delete('/cart', (req, res) => {
  req.session.cart = [];
  res.json({ success: true, message: 'Cart cleared' });
});

// ─── WISHLIST (session) ────────────────────────────────────────────
function getWishlist(req) {
  if (!req.session.wishlist) req.session.wishlist = [];
  return req.session.wishlist;
}

router.get('/wishlist', async (req, res) => {
  try {
    const wishlist = getWishlist(req);
    const products = await Product.find({ id: { $in: wishlist } });
    res.json({ success: true, wishlist, products, count: wishlist.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/wishlist/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await Product.findOne({ id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const wishlist = getWishlist(req);
    const idx = wishlist.indexOf(id);
    let action;
    if (idx > -1) { wishlist.splice(idx, 1); action = 'removed'; }
    else          { wishlist.push(id);        action = 'added';   }

    req.session.wishlist = wishlist;
    res.json({ success: true, action, count: wishlist.length, liked: action === 'added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── COUPONS ──────────────────────────────────────────────────────
router.post('/coupon', (req, res) => {
  const code = (req.body.code || '').toUpperCase().trim();
  if (COUPONS[code]) {
    res.json({ success: true, coupon: { code, ...COUPONS[code] } });
  } else {
    res.status(400).json({ success: false, message: 'Invalid coupon code' });
  }
});

// ─── ORDERS ── saved to MongoDB ───────────────────────────────────
router.post('/orders', async (req, res) => {
  try {
    const { customer, payMethod, coupon } = req.body;
    const cart = getCart(req);

    if (!cart.length) return res.status(400).json({ success: false, message: 'Cart is empty' });
    if (!customer?.firstName || !customer?.lastName)
      return res.status(400).json({ success: false, message: 'Customer details required' });

    const ids = cart.map(c => c.id);
    const dbProducts = await Product.find({ id: { $in: ids } });

    const items = cart.map(c => {
      const p = dbProducts.find(pr => pr.id === c.id);
      return p ? { productId: p.id, name: p.name, cat: p.cat, price: p.price, qty: c.qty, total: p.price * c.qty, image: p.images[0] } : null;
    }).filter(Boolean);

    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const tax      = Math.round(subtotal * 0.03);

    let discountAmt = 0;
    if (coupon && COUPONS[coupon.toUpperCase()]) {
      const cp = COUPONS[coupon.toUpperCase()];
      if (cp.type === 'percent') discountAmt = Math.round(subtotal * cp.discount / 100);
    }

    const order = await Order.create({
      orderId:    'AG' + Date.now(),
      userId:     req.session.userId || null,
      customer: {
        name:    customer.firstName + ' ' + customer.lastName,
        email:   customer.email || '',
        phone:   customer.phone || '',
        address: [customer.address, customer.city, customer.pin, customer.state, customer.country].filter(Boolean).join(', '),
      },
      items,
      subtotal,
      tax,
      discount:   discountAmt,
      total:      subtotal + tax - discountAmt,
      payMethod:  payMethod || 'card',
      couponCode: coupon || '',
      status:     'confirmed',
    });

    // Clear cart
    req.session.cart = [];

    res.json({ success: true, order: serializeOrder(order) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── TRACKING helper ────────────────────────────────────────────
const TRACKING_STEPS = ['confirmed', 'processing', 'shipped', 'delivered'];
function buildTracking(status) {
  if (status === 'cancelled') {
    return { cancelled: true, steps: TRACKING_STEPS.map(s => ({ key: s, label: s, done: false, current: false })) };
  }
  const currentIdx = TRACKING_STEPS.indexOf(status);
  return {
    cancelled: false,
    steps: TRACKING_STEPS.map((s, i) => ({
      key: s,
      label: s,
      done: i <= currentIdx,
      current: i === currentIdx,
    })),
  };
}

// Always exposes the human-readable orderId (e.g. "AG1752489213456") as `id` —
// never the internal MongoDB _id, which Mongoose otherwise auto-adds as a
// same-named `id` virtual and silently overrides it.
function serializeOrder(order) {
  return {
    id:         order.orderId,
    date:       order.createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    createdAt:  order.createdAt,
    customer:   order.customer,
    items:      order.items,
    subtotal:   order.subtotal,
    tax:        order.tax,
    discount:   order.discount,
    total:      order.total,
    payMethod:  order.payMethod,
    couponCode: order.couponCode,
    status:     order.status,
    tracking:   buildTracking(order.status),
  };
}

// GET /api/orders/mine — orders for the logged-in user only, each with a tracking timeline
router.get('/orders/mine', async (req, res) => {
  try {
    if (!req.session.userId)
      return res.status(401).json({ success: false, message: 'Please log in to view your orders' });

    const orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders: orders.map(serializeOrder) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order: serializeOrder(order) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders  — all orders (admin use)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders: orders.map(serializeOrder) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── REVIEWS ── saved to MongoDB ──────────────────────────────────
router.get('/reviews', async (req, res) => {
  try {
    const dbReviews = await Review.find().sort({ createdAt: -1 });
    const formatted = dbReviews.map(r => ({
      name:   r.name,
      prod:   r.prod,
      text:   r.text,
      rating: r.rating,
      date:   r.createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));

    // Merge with static testimonials
    const staticRevs = TESTIMONIALS.map(t => ({
      name: t.name, prod: 'Jewellery', text: t.text, rating: t.rating, date: 'March 2025'
    }));

    const allReviews = [...formatted, ...staticRevs];
    res.json({ success: true, count: allReviews.length, reviews: allReviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const { name, prod, text, rating } = req.body;
    if (!name || !text || !rating)
      return res.status(400).json({ success: false, message: 'Name, text and rating are required' });

    const review = await Review.create({ name, prod: prod || '', text, rating: parseInt(rating) });
    res.json({ success: true, review });
  } catch (err) {
    if (err.name === 'ValidationError')
      return res.status(400).json({ success: false, message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

module.exports = router;
