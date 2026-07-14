const { getProducts, createProduct, updateProduct, deleteProduct } = require('../config/store');

function listProducts(req, res) {
  try {
    return res.json(getProducts());
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

function addProduct(req, res) {
  try {
    const product = createProduct(req.body);
    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

function editProduct(req, res) {
  try {
    const product = updateProduct(req.params.id, req.body);
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

function removeProduct(req, res) {
  try {
    const product = deleteProduct(req.params.id);
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { listProducts, addProduct, editProduct, removeProduct };
