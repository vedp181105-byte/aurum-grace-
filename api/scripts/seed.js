require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local') });

const mongoose  = require('mongoose');
const connectDB = require('../config/db');
const Product   = require('../models/Product');
const { PRODUCTS } = require('../data/products');

(async () => {
  console.log('MONGO_URI:', process.env.MONGO_URI);
  await connectDB();
  try {
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');
    await Product.insertMany(PRODUCTS);
    console.log(`✓ Seeded ${PRODUCTS.length} products into MongoDB`);
    const inserted = await Product.find().select('id name price');
    inserted.forEach(p => console.log(`  [${p.id}] ${p.name} — ₹${p.price}`));
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✦ Done.');
    process.exit(0);
  }
})();
