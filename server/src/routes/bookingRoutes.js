const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/user/my-bookings', authMiddleware, bookingController.getUserBookings);
router.get('/:bookingId', authMiddleware, bookingController.getBookingById);
router.put('/:bookingId', authMiddleware, bookingController.updateBooking);
router.post('/:bookingId/cancel', authMiddleware, bookingController.cancelBooking);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, bookingController.getAllBookings);
router.get('/stats/overview', authMiddleware, adminMiddleware, bookingController.getBookingStats);

module.exports = router;
