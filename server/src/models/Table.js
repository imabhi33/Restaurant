const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: [true, 'Please provide a table number'],
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide table capacity'],
      min: 1,
      max: 20,
    },
    location: {
      type: String,
      enum: ['window', 'corner', 'center', 'outdoor'],
      default: 'center',
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'maintenance'],
      default: 'available',
    },
    description: String,
    features: [String], // e.g., ['AC', 'WiFi', 'Carpet']
    qrCode: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Table', tableSchema);
