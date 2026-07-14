const { getCart, addToCart, updateCartItem, removeCartItem, clearCart, createOrder, getOrders, getAllUsers, getStats } = require('../config/store');

function getMyCart(req, res) {
  try {
    return res.json({ success: true, items: getCart(req.user.id) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

function addItemToCart(req, res) {
  try {
    const items = addToCart(req.user.id, req.body.productId, req.body.quantity || 1);
    return res.json({ success: true, items });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

function changeCartItem(req, res) {
  try {
    const items = updateCartItem(req.user.id, req.params.productId, req.body.quantity);
    return res.json({ success: true, items });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

function deleteCartItem(req, res) {
  try {
    const items = removeCartItem(req.user.id, req.params.productId);
    return res.json({ success: true, items });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

function checkout(req, res) {
  try {
    const checkoutItems = Array.isArray(req.body.items) && req.body.items.length
      ? req.body.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0)
        }))
      : getCart(req.user.id).map((item) => ({
          ...item.product,
          quantity: Number(item.quantity || 1),
          price: Number(item.product.price || 0)
        }));

    if (!checkoutItems.length) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    const order = createOrder(req.user.id, checkoutItems, req.body.paymentMethod || 'cod');
    clearCart(req.user.id);
    return res.json({ success: true, message: 'Order placed successfully.', order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

function listOrders(req, res) {
  try {
    return res.json({ success: true, orders: getOrders(req.user.id, req.user.role) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

function adminUsers(req, res) {
  try {
    return res.json({ success: true, users: getAllUsers() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

function adminStats(req, res) {
  try {
    return res.json({ success: true, stats: getStats() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getMyCart, addItemToCart, changeCartItem, deleteCartItem, checkout, listOrders, adminUsers, adminStats };
