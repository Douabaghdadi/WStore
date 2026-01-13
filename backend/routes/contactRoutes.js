const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

// Route publique - envoyer un message
router.post('/', contactController.createContact);

// Routes admin
router.get('/', protect, admin, contactController.getAllContacts);
router.get('/unread-count', protect, admin, contactController.getUnreadCount);
router.get('/:id', protect, admin, contactController.getContactById);
router.patch('/:id/status', protect, admin, contactController.updateContactStatus);
router.delete('/:id', protect, admin, contactController.deleteContact);

module.exports = router;
