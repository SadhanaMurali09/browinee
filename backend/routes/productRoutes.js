const express = require('express');
const { listProducts, addProduct, editProduct, removeProduct } = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', listProducts);
router.post('/', authMiddleware, adminMiddleware, addProduct);
router.put('/:id', authMiddleware, adminMiddleware, editProduct);
router.delete('/:id', authMiddleware, adminMiddleware, removeProduct);

module.exports = router;
