const express = require('express');
const menuController = require('../controllers/menuController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', menuController.getAllMenuItems);
router.get('/category/:category', menuController.getMenuByCategory);
router.get('/search', menuController.searchMenuItems);
router.get('/bestsellers', menuController.getBestsellers);
router.get('/:itemId', menuController.getMenuItemById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, menuController.createMenuItem);
router.put('/:itemId', authMiddleware, adminMiddleware, menuController.updateMenuItem);
router.delete('/:itemId', authMiddleware, adminMiddleware, menuController.deleteMenuItem);

module.exports = router;
