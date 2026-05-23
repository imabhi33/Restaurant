const express = require('express');
const tableController = require('../controllers/tableController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', tableController.getAllTables);
router.get('/available', tableController.getAvailableTables);
router.get('/:tableId', tableController.getTableById);
router.get('/:tableId/status', tableController.getTableStatus);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, tableController.createTable);
router.put('/:tableId', authMiddleware, adminMiddleware, tableController.updateTable);
router.delete('/:tableId', authMiddleware, adminMiddleware, tableController.deleteTable);

module.exports = router;
