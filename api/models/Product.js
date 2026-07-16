const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id:       { type: Number, required: true, unique: true },
  name:     { type: String, required: true },
  cat:      { type: String, required: true },
  sub:      { type: String, required: true },
  price:    { type: Number, required: true },
  oldPrice: { type: Number, required: true },
  rating:   { type: Number, default: 0 },
  reviews:  { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  badge:    { type: String, default: '' },
  isNewProduct: { type: Boolean, default: false },
  images:   [{ type: String }],
  desc:     { type: String },
  material: { type: String },
  weight:   { type: String },
  occasion: { type: String },
  popular:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
