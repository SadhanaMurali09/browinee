const express = require('express');
const { register, login, forgotPassword, me, updateProfileHandler } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', authMiddleware, me);
router.put('/profile', authMiddleware, updateProfileHandler);

module.exports = router;
