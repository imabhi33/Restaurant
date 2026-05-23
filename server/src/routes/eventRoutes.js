const express = require('express');
const eventController = require('../controllers/eventController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:eventId', eventController.getEventById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, eventController.createEvent);
router.put('/:eventId', authMiddleware, adminMiddleware, eventController.updateEvent);
router.delete('/:eventId', authMiddleware, adminMiddleware, eventController.deleteEvent);

module.exports = router;
