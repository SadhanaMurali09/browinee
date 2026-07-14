const express = require('express');
const authRoutes = require('../backend/routes/authRoutes');
const productRoutes = require('../backend/routes/productRoutes');
const orderRoutes = require('../backend/routes/orderRoutes');
const { authMiddleware } = require('../backend/middleware/auth');
const { checkout } = require('../backend/controllers/orderController');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.post('/checkout', authMiddleware, checkout);

module.exports = router;
