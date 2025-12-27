const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.get('/all', protect, admin, orderController.getAllOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

module.exports = router;
