const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/auth')

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

// Edit user profile (PUT request, requiring user ID)
router.put('/edit/:userId',authenticate.authenticate, authController.editProfile);
module.exports = router;

