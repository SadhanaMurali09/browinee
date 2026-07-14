const express = require('express');
const { getMyCart, addItemToCart, changeCartItem, deleteCartItem, checkout, listOrders, adminUsers, adminStats } = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/cart', authMiddleware, getMyCart);
router.post('/cart', authMiddleware, addItemToCart);
router.put('/cart/:productId', authMiddleware, changeCartItem);
router.delete('/cart/:productId', authMiddleware, deleteCartItem);
router.post('/checkout', authMiddleware, checkout);
router.get('/orders', authMiddleware, listOrders);
router.get('/admin/users', authMiddleware, adminMiddleware, adminUsers);
router.get('/admin/stats', authMiddleware, adminMiddleware, adminStats);

module.exports = router;
