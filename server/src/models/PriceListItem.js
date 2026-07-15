const mongoose = require('mongoose');

const priceListItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '', trim: true },
    isVeg: { type: Boolean, default: true },
    availability: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

priceListItemSchema.index({ category: 1, sortOrder: 1, name: 1 });

module.exports = mongoose.model('PriceListItem', priceListItemSchema);
