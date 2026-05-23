const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public route to fetch footer/logo settings
router.get('/', restaurantController.getSettings);

// Admin authorized route to update settings
router.put('/', authMiddleware, adminMiddleware, restaurantController.updateSettings);

module.exports = router;
