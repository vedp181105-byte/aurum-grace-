const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  prod:   { type: String, default: '' },
  text:   { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

// Virtual for formatted date
reviewSchema.virtual('date').get(function () {
  return this.createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
});

reviewSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Review', reviewSchema);
