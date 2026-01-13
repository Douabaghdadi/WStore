const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Routes protégées (nécessitent authentification)
router.post('/initiate', protect, paymentController.initiatePayment);
router.get('/status/:orderId', protect, paymentController.checkPaymentStatus);

// Webhook Paymee (pas d'auth, appelé par Paymee)
router.post('/webhook', paymentController.paymeeWebhook);

module.exports = router;
