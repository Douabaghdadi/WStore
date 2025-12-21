const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/users/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', authController.getUsers);
router.get('/:id', authController.getUser);
router.put('/:id', upload.single('photo'), authController.updateUser);
router.delete('/:id', authController.deleteUser);

module.exports = router;
