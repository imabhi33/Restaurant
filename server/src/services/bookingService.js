const Booking = require('../models/Booking');
const Table = require('../models/Table');
const { validateBooking } = require('../validators/validators');
const { isBookingAvailable } = require('../utils/helpers');

class BookingService {
  async createBooking(userId, bookingData) {
    // Validate input
    const validation = validateBooking(bookingData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if booking date/time is available
    const availability = isBookingAvailable(bookingData.bookingDate, bookingData.timeSlot);
    if (!availability.available) {
      throw new Error(availability.reason);
    }

    // Check if table is available
    const table = await Table.findById(bookingData.tableId);
    if (!table || !table.isActive) {
      throw new Error('Selected table is not available');
    }

    if (bookingData.numberOfGuests > table.capacity) {
      throw new Error(`This table can only accommodate ${table.capacity} guests`);
    }

    // Check for existing bookings at same time
    const targetDate = new Date(bookingData.bookingDate);
    const startOfDay = new Date(targetDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setUTCHours(23, 59, 59, 999));

    const existingBooking = await Booking.findOne({
      tableId: bookingData.tableId,
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot: bookingData.timeSlot,
      status: { $in: ['confirmed', 'pending'] },
    });

    if (existingBooking) {
      throw new Error('This table is not available for the selected time slot');
    }

    // Create booking
    const booking = new Booking({
      userId,
      tableId: bookingData.tableId,
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      guestPhone: bookingData.guestPhone,
      numberOfGuests: bookingData.numberOfGuests,
      bookingDate: bookingData.bookingDate,
      timeSlot: bookingData.timeSlot,
      specialRequests: bookingData.specialRequests || '',
      totalAmount: bookingData.totalAmount || 0,
      advanceAmount: bookingData.advanceAmount || 0,
      status: 'confirmed', // Auto-confirm bookings!
    });

    await booking.save();
    await booking.populate('tableId userId');

    return booking;
  }

  async getBookingById(bookingId) {
    const booking = await Booking.findById(bookingId)
      .populate('tableId')
      .populate('userId', '-password');

    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  }

  async getUserBookings(userId, filters = {}) {
    const query = { userId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.fromDate) {
      query.bookingDate = {
        $gte: new Date(filters.fromDate),
      };
    }

    if (filters.toDate) {
      query.bookingDate = {
        ...query.bookingDate,
        $lte: new Date(filters.toDate),
      };
    }

    const bookings = await Booking.find(query)
      .populate('tableId')
      .sort({ bookingDate: -1 });

    return bookings;
  }

  async updateBooking(bookingId, updateData) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Allow admin to update status freely - no restrictions
    const allowedFields = ['specialRequests', 'notes', 'status', 'paymentStatus'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        booking[field] = updateData[field];
      }
    });

    await booking.save();
    return booking;
  }

  async cancelBooking(bookingId, cancelReason) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      throw new Error('Cannot cancel a completed or already cancelled booking');
    }

    booking.status = 'cancelled';
    booking.cancelReason = cancelReason;
    booking.cancelledAt = new Date();

    await booking.save();
    return booking;
  }

  async getAllBookings(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.bookingDate) {
      const date = new Date(filters.bookingDate);
      query.bookingDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    const bookings = await Booking.find(query)
      .populate('tableId')
      .populate('userId', '-password')
      .sort({ bookingDate: -1, timeSlot: 1 });

    return bookings;
  }

  async getBookingStats() {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    return {
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
    };
  }
}

module.exports = new BookingService();
