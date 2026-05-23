const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide item description'],
    },
    category: {
      type: String,
      enum: ['appetizers', 'main-course', 'rice', 'bread', 'desserts', 'beverages', 'specials'],
      required: [true, 'Please select a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide item price'],
      min: 0,
    },
    image: String,
    isVeg: {
      type: Boolean,
      default: true,
    },
    isSpicy: {
      type: Boolean,
      default: false,
    },
    spicyLevel: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
    },
    calories: Number,
    allergens: [String],
    portions: [
      {
        size: String,
        priceMultiplier: Number,
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      default: 20, // in minutes
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    tags: [String],
    bestseller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
