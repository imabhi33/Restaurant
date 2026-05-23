const express = require('express');
const uploadController = require('../controllers/uploadController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Admin-only route for uploading images
router.post('/', authMiddleware, adminMiddleware, uploadController.uploadImage);

module.exports = router;
