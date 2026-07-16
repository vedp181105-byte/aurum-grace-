const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: Number,
  name:      String,
  cat:       String,
  price:     Number,
  qty:       Number,
  total:     Number,
  image:     String,
});

const orderSchema = new mongoose.Schema({
  orderId:   { type: String, required: true, unique: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null for guest checkout
  customer: {
    name:    String,
    email:   String,
    phone:   String,
    address: String,
  },
  items:      [orderItemSchema],
  subtotal:   Number,
  tax:        Number,
  discount:   { type: Number, default: 0 },
  total:      Number,
  payMethod:  { type: String, default: 'card' },
  couponCode: { type: String, default: '' },
  status:     { type: String, default: 'confirmed', enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
