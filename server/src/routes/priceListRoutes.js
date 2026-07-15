const express = require('express');
const controller = require('../controllers/priceListController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/admin/all', authMiddleware, adminMiddleware, controller.getAllForAdmin);
router.post('/', authMiddleware, adminMiddleware, controller.create);
router.put('/:itemId', authMiddleware, adminMiddleware, controller.update);
router.delete('/:itemId', authMiddleware, adminMiddleware, controller.remove);

module.exports = router;
