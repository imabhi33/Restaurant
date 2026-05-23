const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Papalicious',
    },
    description: String,
    location: {
      address: {
        type: String,
        default: 'Cuttack, Odisha',
      },
      city: String,
      state: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    openingHours: [
      {
        day: String,
        opening: String,
        closing: String,
        isClosed: Boolean,
      },
    ],
    cuisineType: [String],
    totalTables: {
      type: Number,
      default: 20,
    },
    averageRating: {
      type: Number,
      default: 4.5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    bannerImage: String,
    logoImage: String,
    featuredImage: String,
    socialLinks: {
      facebook: {
        type: String,
        default: 'https://facebook.com/papalicious',
      },
      instagram: {
        type: String,
        default: 'https://instagram.com/papalicious',
      },
      twitter: {
        type: String,
        default: 'https://twitter.com/papalicious',
      },
    },
    settings: {
      advanceBookingDays: {
        type: Number,
        default: 30,
      },
      cancellationWindow: {
        type: Number,
        default: 24, // hours
      },
      advancePaymentPercentage: {
        type: Number,
        default: 50,
      },
      maxGuestsPerTable: {
        type: Number,
        default: 6,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
