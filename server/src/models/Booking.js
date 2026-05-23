const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      uppercase: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    guestName: {
      type: String,
      required: [true, 'Please provide guest name'],
    },
    guestEmail: {
      type: String,
      required: [true, 'Please provide guest email'],
    },
    guestPhone: {
      type: String,
      required: [true, 'Please provide guest phone'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Please provide number of guests'],
      min: 1,
      max: 20,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Please provide booking date'],
    },
    timeSlot: {
      type: String,
      enum: ['11:00-12:30', '12:30-14:00', '14:00-15:30', '17:00-18:30', '18:30-20:00', '20:00-21:30'],
      required: [true, 'Please select a time slot'],
    },
    duration: {
      type: Number,
      default: 120, // in minutes
    },
    specialRequests: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending',
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    qrCode: String,
    notes: String,
    cancelledAt: Date,
    cancelReason: String,
  },
  { timestamps: true }
);

// Generate unique booking ID
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.bookingId = `PAP${year}${month}${day}${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
