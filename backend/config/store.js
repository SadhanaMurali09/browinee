const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'brownie-secret';

const defaultProducts = [
  { id: 1, name: 'Classic Chocolate Brownie', price: 4.5, category: 'classic', image: '/assets/classic chocolate browine.webp', description: 'Rich cocoa with a fudgy center.', stock: 24 },
  { id: 2, name: 'Fudge Brownie', price: 4.99, category: 'fudge', image: '/assets/fudgebrownies.webp', description: 'Extra fudgy and glossy.', stock: 18 },
  { id: 3, name: 'Walnut Brownie', price: 5.5, category: 'nuts', image: '/assets/walnut_brownie_01.png', description: 'Crunchy walnut garnish.', stock: 15 },
  { id: 4, name: 'Oreo Brownie', price: 5.25, category: 'cookies', image: '/assets/oreo browinee.jpg', description: 'Creamy Oreo crumb topping.', stock: 12 },
  { id: 5, name: 'Caramel Brownie', price: 5.75, category: 'caramel', image: '/assets/caremel browie.jpg', description: 'Salted caramel swirl.', stock: 10 },
  { id: 6, name: 'Red Velvet Brownie', price: 6, category: 'premium', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop', description: 'Velvety cocoa with cream cheese glaze.', stock: 8 },
  { id: 7, name: 'Nutella Brownie', price: 5.9, category: 'premium', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop&crop=bottom', description: 'Silky Nutella swirl with a soft center.', stock: 9 },
  { id: 8, name: 'Cheesecake Brownie', price: 6.25, category: 'premium', image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?q=80&w=600&auto=format&fit=crop', description: 'Rich chocolate layered with cheesecake.', stock: 7 },
  { id: 9, name: 'Peanut Butter Brownie', price: 5.5, category: 'nuts', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop', description: 'Creamy peanut butter ribbons baked in.', stock: 11 },
  { id: 10, name: 'Dark Chocolate Brownie', price: 4.75, category: 'classic', image: '/assets/darkchocolate.webp', description: 'Deep cocoa flavor with a glossy top.', stock: 14 },
  { id: 11, name: 'Lotus Biscoff Brownie', price: 6.5, category: 'premium', image: '/assets/lotus biscoff browinee.webp', description: 'Biscoff spice and caramelized sweetness.', stock: 6 },
  { id: 12, name: "S'mores Brownie", price: 5.95, category: 'classic', image: "/assets/s'mores browine.webp", description: 'Marshmallow, graham cracker, and chocolate.', stock: 8 }
];

const state = {
  users: [],
  products: [],
  carts: [],
  orders: []
};

function seedDefaults() {
  if (state.products.length === 0) {
    state.products = defaultProducts.map((product) => ({ ...product }));
  }

  if (state.users.length === 0) {
    state.users.push({
      id: 1,
      fullName: 'Admin Brownie',
      email: 'admin@browniee.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      phone: '9876543210',
      address: 'Luxury Lane, Mumbai'
    });
  }
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

async function registerUser({ fullName, email, password, role = 'user' }) {
  seedDefaults();
  const existing = state.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('An account with that email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now(),
    fullName,
    email: email.toLowerCase(),
    password: passwordHash,
    role,
    phone: '',
    address: ''
  };

  state.users.push(user);
  return { user: sanitizeUser(user), token: createToken(user) };
}

async function loginUser(email, password) {
  seedDefaults();
  const user = state.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('No account found for that email.');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Incorrect password.');
  }

  return { user: sanitizeUser(user), token: createToken(user) };
}

async function resetPassword(email) {
  seedDefaults();
  const user = state.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return { success: true, message: 'If an account exists, reset instructions have been sent.' };
  }

  return { success: true, message: 'If an account exists, reset instructions have been sent.' };
}

async function getCurrentUser(id) {
  seedDefaults();
  const user = state.users.find((entry) => entry.id === id);
  return user ? sanitizeUser(user) : null;
}

async function updateProfile(id, data) {
  seedDefaults();
  const user = state.users.find((entry) => entry.id === id);
  if (!user) {
    throw new Error('User not found.');
  }

  Object.assign(user, data);
  return sanitizeUser(user);
}

function getProducts() {
  seedDefaults();
  return state.products;
}

function createProduct(data) {
  seedDefaults();
  const product = {
    id: Date.now(),
    ...data,
    price: Number(data.price),
    stock: Number(data.stock || 0)
  };
  state.products.push(product);
  return product;
}

function updateProduct(id, data) {
  seedDefaults();
  const product = state.products.find((entry) => entry.id === Number(id));
  if (!product) {
    throw new Error('Product not found.');
  }

  Object.assign(product, data, { price: Number(data.price || product.price), stock: Number(data.stock || product.stock) });
  return product;
}

function deleteProduct(id) {
  seedDefaults();
  const index = state.products.findIndex((entry) => entry.id === Number(id));
  if (index === -1) {
    throw new Error('Product not found.');
  }

  const [removed] = state.products.splice(index, 1);
  return removed;
}

function getCart(userId) {
  seedDefaults();
  return state.carts.find((entry) => entry.userId === userId)?.items || [];
}

function addToCart(userId, productId, quantity = 1) {
  seedDefaults();
  const cart = state.carts.find((entry) => entry.userId === userId) || { userId, items: [] };
  if (!state.carts.find((entry) => entry.userId === userId)) {
    state.carts.push(cart);
  }

  const product = state.products.find((entry) => entry.id === Number(productId));
  if (!product) {
    throw new Error('Product not found.');
  }

  const existingItem = cart.items.find((item) => item.productId === Number(productId));
  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ productId: Number(productId), quantity: Number(quantity), product });
  }

  return cart.items;
}

function updateCartItem(userId, productId, quantity) {
  seedDefaults();
  const cart = state.carts.find((entry) => entry.userId === userId);
  if (!cart) return [];

  const item = cart.items.find((entry) => entry.productId === Number(productId));
  if (!item) return cart.items;

  if (Number(quantity) <= 0) {
    cart.items = cart.items.filter((entry) => entry.productId !== Number(productId));
  } else {
    item.quantity = Number(quantity);
  }

  return cart.items;
}

function removeCartItem(userId, productId) {
  seedDefaults();
  const cart = state.carts.find((entry) => entry.userId === userId);
  if (!cart) return [];
  cart.items = cart.items.filter((item) => item.productId !== Number(productId));
  return cart.items;
}

function clearCart(userId) {
  seedDefaults();
  const cart = state.carts.find((entry) => entry.userId === userId);
  if (cart) {
    cart.items = [];
  }
  return [];
}

function createOrder(userId, items, paymentMethod) {
  seedDefaults();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: Date.now(),
    userId,
    items,
    paymentMethod,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  state.orders.push(order);
  return order;
}

function getOrders(userId, role) {
  seedDefaults();
  if (role === 'admin') {
    return state.orders;
  }
  return state.orders.filter((order) => order.userId === userId);
}

function getAllUsers() {
  seedDefaults();
  return state.users.map((user) => sanitizeUser(user));
}

function getStats() {
  seedDefaults();
  return {
    users: state.users.length,
    products: state.products.length,
    orders: state.orders.length,
    revenue: state.orders.reduce((sum, order) => sum + order.total, 0)
  };
}

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  getCurrentUser,
  updateProfile,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  createOrder,
  getOrders,
  getAllUsers,
  getStats
};
