const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Please provide event subtitle'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    timing: {
      type: String,
      required: [true, 'Please provide event timing'],
      trim: true,
    },
    badge: {
      type: String,
      required: [true, 'Please provide event badge text'],
      trim: true,
    },
    accentColor: {
      type: String,
      required: [true, 'Please provide accent theme color'],
      trim: true,
      default: '#d4af37',
    },
    icon: {
      type: String,
      required: [true, 'Please select a display icon name'],
      enum: ['FaMicrophone', 'FaQuoteLeft', 'FaBookOpen', 'FaMusic'],
      default: 'FaMicrophone',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
