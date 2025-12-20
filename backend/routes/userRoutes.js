const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.getUsers);
router.get('/:id', authController.getUser);
router.put('/:id', authController.updateUser);
router.delete('/:id', authController.deleteUser);

module.exports = router;
