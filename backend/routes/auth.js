const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const logActivity = require('../middleware/audit');

// Strict rate limit for auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth requests per 15 minutes
  message: 'Too many login or registration attempts, please try again later'
});

router.post('/register', authLimiter, logActivity('user_registration'), authController.register);
router.post('/verify-otp', authLimiter, logActivity('email_verification_otp'), authController.verifyOTP);
router.post('/login', authLimiter, logActivity('user_login'), authController.login);
router.get('/challenge', authController.getWalletChallenge);
router.post('/bind-wallet', protect, logActivity('wallet_binding'), authController.bindWallet);
router.post('/login-wallet', authLimiter, logActivity('wallet_login'), authController.loginWithWallet);
router.post('/login-face', authLimiter, logActivity('user_face_login'), authController.loginWithFace);
router.post('/demo-switch', authController.demoPersonaLogin);

module.exports = router;
