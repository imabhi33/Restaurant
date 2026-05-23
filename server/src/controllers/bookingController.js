const bookingService = require('../services/bookingService');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const booking = await bookingService.createBooking(req.user.id, req.body);
      res.status(201).json({
        success: true,
        booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req, res, next) {
    try {
      const booking = await bookingService.getBookingById(req.params.bookingId);
      res.status(200).json({
        success: true,
        booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserBookings(req, res, next) {
    try {
      const bookings = await bookingService.getUserBookings(req.user.id, req.query);
      res.status(200).json({
        success: true,
        bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req, res, next) {
    try {
      const booking = await bookingService.updateBooking(req.params.bookingId, req.body);
      res.status(200).json({
        success: true,
        booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const booking = await bookingService.cancelBooking(
        req.params.bookingId,
        req.body.cancelReason
      );
      res.status(200).json({
        success: true,
        booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const bookings = await bookingService.getAllBookings(req.query);
      res.status(200).json({
        success: true,
        bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookingStats(req, res, next) {
    try {
      const stats = await bookingService.getBookingStats();
      res.status(200).json({
        success: true,
        stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
