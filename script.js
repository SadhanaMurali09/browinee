const cartToggle = document.getElementById("cart-toggle-check");
const cartBadge = document.querySelector(".cart-badge");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotalValue = document.querySelector(".cart-total span:last-child");
const navbar = document.querySelector(".navbar");
const productsContainer = document.getElementById("products-container");
const checkoutBtn = document.querySelector(".checkout-btn");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");
const priceValue = document.getElementById("price-value");

const API_HOSTS = [
  window.location.origin,
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);
const TOKEN_KEY = 'browniee-token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

async function requestApi(path, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  const requestOptions = {
    ...options,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };

  let lastError;

  for (const host of API_HOSTS) {
    try {
      const response = await fetch(`${host}${path}`, requestOptions);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || `${response.status} ${response.statusText}`;
        throw new Error(message);
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

let cartItems = JSON.parse(localStorage.getItem('browniee-cart') || '[]');
let products = [
  { id: 1, name: 'Classic Chocolate Brownie', price: 4.5, image: '/assets/classic chocolate browine.webp', alt: 'Classic Chocolate Brownie', category: 'classic' },
  { id: 2, name: 'Fudge Brownie', price: 4.99, image: '/assets/fudgebrownies.webp', alt: 'Fudge Brownie', category: 'fudge' },
  { id: 3, name: 'Walnut Brownie', price: 5.5, image: '/assets/walnut_brownie_01.png', alt: 'Walnut Brownie', category: 'nuts' },
  { id: 4, name: 'Oreo Brownie', price: 5.25, image: '/assets/oreo browinee.jpg', alt: 'Oreo Brownie', category: 'cookies' },
  { id: 5, name: 'Caramel Brownie', price: 5.75, image: '/assets/caremel browie.jpg', alt: 'Caramel Brownie', category: 'caramel' },
  { id: 6, name: 'Red Velvet Brownie', price: 6.0, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop', alt: 'Red Velvet Brownie', category: 'premium' },
  { id: 7, name: 'Nutella Brownie', price: 5.9, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop&crop=bottom', alt: 'Nutella Brownie', category: 'premium' },
  { id: 8, name: 'Cheesecake Brownie', price: 6.25, image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?q=80&w=600&auto=format&fit=crop', alt: 'Cheesecake Brownie', category: 'premium' },
  { id: 9, name: 'Peanut Butter Brownie', price: 5.5, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop', alt: 'Peanut Butter Brownie', category: 'nuts' },
  { id: 10, name: 'Dark Chocolate Brownie', price: 4.75, image: '/assets/darkchocolate.webp', alt: 'Dark Chocolate Brownie', category: 'classic' },
  { id: 11, name: 'Lotus Biscoff Brownie', price: 6.5, image: '/assets/lotus biscoff browinee.webp', alt: 'Lotus Biscoff Brownie', category: 'premium' },
  { id: 12, name: "S'mores Brownie", price: 5.95, image: "/assets/s'mores browine.webp", alt: "S'mores Brownie", category: 'classic' }
];
let wishlist = JSON.parse(localStorage.getItem('browniee-wishlist') || '[]');

function persistCart() {
  localStorage.setItem('browniee-cart', JSON.stringify(cartItems));
}

function persistWishlist() {
  localStorage.setItem('browniee-wishlist', JSON.stringify(wishlist));
}

function formatCurrency(value) {
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

function renderProducts(productList) {
  if (!productsContainer) return;
  productsContainer.innerHTML = productList.map((product) => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.alt}">
        <div class="product-overlay">
          <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
            <i class="ph ph-shopping-cart"></i> Add to Cart
          </button>
        </div>
        <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-wishlist-id="${product.id}" aria-label="Add to wishlist">
          <i class="ph ${wishlist.includes(product.id) ? 'ph-heart-fill' : 'ph-heart'}"></i>
        </button>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price-row">
          <span class="product-price">${formatCurrency(product.price)}</span>
        </div>
      </div>
    </div>
  `).join('');
  observeCards();
}

function renderCart() {
  if (!cartBadge || !cartTotalValue || !cartItemsContainer) return;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartBadge.textContent = totalItems;
  cartTotalValue.textContent = formatCurrency(totalPrice);

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty. Add some brownies to get started.</div>';
    return;
  }

  cartItemsContainer.innerHTML = cartItems.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.alt}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <span class="cart-item-price">${formatCurrency(item.price)}</span>
        <div class="cart-quantity-controls">
          <button class="qty-btn" data-action="decrease" data-name="${item.name}" aria-label="Decrease quantity"><i class="ph ph-minus"></i></button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-action="increase" data-name="${item.name}" aria-label="Increase quantity"><i class="ph ph-plus"></i></button>
        </div>
      </div>
      <button class="cart-item-remove" data-action="remove" data-name="${item.name}" title="Remove Item"><i class="ph ph-trash"></i></button>
    </div>
  `).join('');
}

function addToCart(product) {
  const existingItem = cartItems.find((item) => item.name === product.name);
  if (existingItem) existingItem.quantity += 1; else cartItems.push({ ...product, quantity: 1 });
  persistCart();
  renderCart();
  if (cartToggle) cartToggle.checked = true;
  showToast(`🍫 ${product.name} added to cart`);
}

function updateCartItem(name, action) {
  const item = cartItems.find((entry) => entry.name === name);
  if (!item) return;
  if (action === 'increase') item.quantity += 1;
  else if (action === 'decrease') { item.quantity -= 1; if (item.quantity <= 0) cartItems = cartItems.filter((entry) => entry.name !== name); }
  else if (action === 'remove') cartItems = cartItems.filter((entry) => entry.name !== name);
  persistCart();
  renderCart();
}

function applyFilters() {
  if (!products.length) return;
  const query = searchInput?.value.toLowerCase() || '';
  const category = categoryFilter?.value || 'all';
  const maxPrice = Number(priceFilter?.value || 999); 
  const filtered = products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query);
    const matchesCategory = category === 'all' || product.category === category;
    const matchesPrice = product.price <= maxPrice;
    return matchesQuery && matchesCategory && matchesPrice;
  });
  renderProducts(filtered);
}

async function loadProducts() {
  try {
    const response = await requestApi('/api/products');
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) products = data;
    applyFilters();
  } catch (error) {
    console.error('Could not load products from backend:', error);
    renderProducts(products);
    showToast('Using local product list.');
  }
}

function initStorefront() {
  if (productsContainer) {
    productsContainer.addEventListener('click', (event) => {
      const addButton = event.target.closest('.add-to-cart-btn');
      const wishlistButton = event.target.closest('.wishlist-btn');
      if (addButton) {
        event.preventDefault();
        const productId = Number(addButton.dataset.productId);
        const selectedProduct = products.find((product) => product.id === productId);
        if (selectedProduct) addToCart(selectedProduct);
      }
      if (wishlistButton) {
        const productId = Number(wishlistButton.dataset.wishlistId);
        if (wishlist.includes(productId)) wishlist = wishlist.filter((id) => id !== productId); else wishlist.push(productId);
        persistWishlist();
        applyFilters();
        showToast('Wishlist updated');
      }
    });
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (event) => {
      const control = event.target.closest('[data-action]');
      if (!control) return;
      updateCartItem(control.dataset.name, control.dataset.action);
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) { showToast('Your cart is empty.'); return; }
      window.location.href = 'frontend/checkout.html';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }
  if (priceFilter) {
    priceFilter.addEventListener('input', () => {
      if (priceValue) priceValue.textContent = `Up to ${formatCurrency(Number(priceFilter.value))}`;
      applyFilters();
    });
    if (priceValue) priceValue.textContent = `Up to ${formatCurrency(Number(priceFilter.value))}`;
  }

  renderCart();
  loadProducts();
}

function setAuthLinks() {
  const authLink = document.getElementById('auth-link');
  const profileLink = document.getElementById('profile-link');
  if (!authLink && !profileLink) return;
  if (getToken()) {
    if (authLink) { authLink.textContent = 'Logout'; authLink.href = '#'; authLink.addEventListener('click', (event) => { event.preventDefault(); clearToken(); window.location.reload(); }); }
    if (profileLink) profileLink.style.display = 'inline-block';
  } else {
    if (authLink) { authLink.textContent = 'Login'; authLink.href = 'frontend/auth.html'; }
    if (profileLink) profileLink.style.display = 'none';
  }
}

function showMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.className = `auth-message ${isError ? 'error' : 'success'}`;
}

async function initAuthForms() {
  const form = document.getElementById('auth-form');
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const nameGroup = document.getElementById('name-group');
  const confirmGroup = document.getElementById('confirm-group');
  const submitButton = document.getElementById('auth-submit');
  const switcher = document.getElementById('auth-switcher');
  let mode = 'login';

  if (!form) return;

  const toggleMode = (nextMode) => {
    mode = nextMode;
    const isSignup = mode === 'signup';
    if (nameGroup) nameGroup.classList.toggle('hidden', !isSignup);
    if (confirmGroup) confirmGroup.classList.toggle('hidden', !isSignup);
    if (title) title.textContent = isSignup ? 'Create your account' : 'Welcome back';
    if (subtitle) subtitle.textContent = isSignup ? 'Join the Browniee family and order your favorites.' : 'Sign in to continue your brownie journey.';
    if (submitButton) submitButton.textContent = isSignup ? 'Create Account' : 'Login';
    if (switcher) {
      switcher.innerHTML = isSignup ? 'Already have an account? <a href="#" data-mode="login">Log in</a>' : 'Need an account? <a href="#" data-mode="signup">Create one</a>';
    }
  };

  toggleMode('login');
  switcher?.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-mode]');
    if (!link) return;
    event.preventDefault();
    toggleMode(link.dataset.mode);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value
    };
    const messageBox = document.getElementById('auth-message');
    if (mode === 'signup') {
      payload.fullName = document.getElementById('fullName').value.trim();
      payload.confirmPassword = document.getElementById('confirmPassword').value;
      if (!payload.fullName || !payload.email || !payload.password || !payload.confirmPassword) {
        showMessage(messageBox, 'Please fill in all fields.', true); return;
      }
      if (payload.password.length < 6) { showMessage(messageBox, 'Password must be at least 6 characters.', true); return; }
      if (payload.password !== payload.confirmPassword) { showMessage(messageBox, 'Passwords do not match.', true); return; }
      try {
        const response = await requestApi('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json();
        if (result.success) { setToken(result.token); showMessage(messageBox, result.message || 'Registration successful.'); setTimeout(() => window.location.href = '../index.html', 700); }
        else showMessage(messageBox, result.message, true);
      } catch (error) { showMessage(messageBox, error.message || 'Registration failed.', true); }
    } else {
      if (!payload.email || !payload.password) { showMessage(messageBox, 'Email and password are required.', true); return; }
      try {
        const response = await requestApi('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json();
        if (result.success) { setToken(result.token); showMessage(messageBox, result.message || 'Login successful.'); setTimeout(() => window.location.href = '../index.html', 700); }
        else showMessage(messageBox, result.message, true);
      } catch (error) { showMessage(messageBox, error.message || 'Login failed.', true); }
    }
  });
}

async function initForgotPassword() {
  const form = document.getElementById('forgot-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const messageBox = document.getElementById('forgot-message');
    if (!email) { showMessage(messageBox, 'Please enter your email.', true); return; }
    try {
      const response = await requestApi('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const result = await response.json();
      showMessage(messageBox, result.message || 'Reset link sent.');
    } catch (error) {
      showMessage(messageBox, error.message || 'Request failed.', true);
    }
  });
}

async function initAdminLogin() {
  const form = document.getElementById('admin-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const messageBox = document.getElementById('admin-message');
    try {
      const response = await requestApi('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const result = await response.json();
      if (result.success && result.user?.role === 'admin') { setToken(result.token); showMessage(messageBox, 'Welcome, admin.'); setTimeout(() => window.location.href = 'admin-dashboard.html', 700); }
      else showMessage(messageBox, 'Invalid admin credentials.', true);
    } catch (error) {
      showMessage(messageBox, error.message || 'Admin login failed.', true);
    }
  });
}

async function initProfilePage() {
  const profileForm = document.getElementById('profile-form');
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const phoneInput = document.getElementById('profile-phone');
  const addressInput = document.getElementById('profile-address');
  const ordersList = document.getElementById('orders-list');
  const profileMessage = document.getElementById('profile-message');
  const logoutButton = document.getElementById('logout-button');
  if (!profileForm) return;
  try {
    const userResponse = await requestApi('/api/auth/me');
    const userResult = await userResponse.json();
    if (userResult.user) {
      nameInput.value = userResult.user.fullName || '';
      emailInput.value = userResult.user.email || '';
      phoneInput.value = userResult.user.phone || '';
      addressInput.value = userResult.user.address || '';
    }
    const ordersResponse = await requestApi('/api/orders/orders');
    const ordersResult = await ordersResponse.json();
    if (ordersResult.orders?.length) {
      ordersList.innerHTML = ordersResult.orders.map((order) => `<li><strong>Order #${order.id}</strong> — ${formatCurrency(order.total)} via ${order.paymentMethod || 'cod'} <span class="text-muted">${new Date(order.createdAt).toLocaleDateString()}</span></li>`).join('');
    } else {
      ordersList.innerHTML = '<li>No orders yet.</li>';
    }
  } catch (error) {
    showMessage(profileMessage, error.message || 'Profile could not be loaded.', true);
  }

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const response = await requestApi('/api/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName: nameInput.value, phone: phoneInput.value, address: addressInput.value }) });
      const result = await response.json();
      showMessage(profileMessage, result.success ? 'Profile updated.' : result.message, !result.success);
    } catch (error) {
      showMessage(profileMessage, error.message || 'Profile update failed.', true);
    }
  });

  logoutButton?.addEventListener('click', () => {
    clearToken();
    window.location.href = 'auth.html';
  });
}

async function initCheckoutPage() {
  const summaryList = document.getElementById('checkout-summary');
  const paymentMethodSelect = document.getElementById('payment-method');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutMessage = document.getElementById('checkout-message');
  if (!summaryList || !checkoutForm) return;

  const updateSelectedPayment = () => {
    const selected = document.querySelector('input[name="payment-method"]:checked')?.value || paymentMethodSelect?.value || 'cod';
    if (paymentMethodSelect) paymentMethodSelect.value = selected;
  };

  document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
    input.addEventListener('change', updateSelectedPayment);
  });

  const items = cartItems;
  if (!items.length) {
    summaryList.innerHTML = '<li>Your cart is empty.</li>';
    return;
  }
  summaryList.innerHTML = items.map((item) => `<li>${item.name} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}</li>`).join('');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('checkout-total').textContent = formatCurrency(total);

  checkoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    updateSelectedPayment();
    if (!getToken()) { window.location.href = 'auth.html'; return; }
    try {
      const response = await requestApi('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: paymentMethodSelect.value,
          items: cartItems.map((item) => ({
            ...item,
            price: Number(item.price)
          }))
        })
      });
      const result = await response.json();
      if (result.success) {
        cartItems = [];
        persistCart();
        renderCart();
        showMessage(checkoutMessage, 'Order placed successfully.');
        setTimeout(() => window.location.href = 'profile.html', 900);
      } else {
        showMessage(checkoutMessage, result.message || 'Checkout failed.', true);
      }
    } catch (error) {
      showMessage(checkoutMessage, error.message || 'Checkout could not be completed.', true);
    }
  });
}

async function initAdminDashboard() {
  const productForm = document.getElementById('product-form');
  const productsList = document.getElementById('admin-products');
  const usersList = document.getElementById('admin-users');
  const ordersList = document.getElementById('admin-orders');
  const stats = document.getElementById('admin-stats');
  const logoutButton = document.getElementById('admin-logout');
  if (!productForm) return;
  const refreshDashboard = async () => {
    try {
      const productsResponse = await requestApi('/api/products');
      const productData = await productsResponse.json();
      const statsResponse = await requestApi('/api/orders/admin/stats');
      const statsData = await statsResponse.json();
      const usersResponse = await requestApi('/api/orders/admin/users');
      const usersData = await usersResponse.json();
      const ordersResponse = await requestApi('/api/orders/orders');
      const ordersData = await ordersResponse.json();
      if (stats) stats.innerHTML = `
        <div class="stat-card"><h3>${statsData.stats?.users || 0}</h3><p>Users</p></div>
        <div class="stat-card"><h3>${statsData.stats?.products || 0}</h3><p>Products</p></div>
        <div class="stat-card"><h3>${statsData.stats?.orders || 0}</h3><p>Orders</p></div>
        <div class="stat-card"><h3>${formatCurrency(statsData.stats?.revenue || 0)}</h3><p>Revenue</p></div>`;
      if (productsList) productsList.innerHTML = (Array.isArray(productData) ? productData : []).map((product) => `<li>${product.name} — ${formatCurrency(product.price)} <button class="btn btn-secondary btn-sm" data-delete-product="${product.id}">Delete</button></li>`).join('');
      if (usersList) usersList.innerHTML = (usersData.users || []).map((user) => `<li>${user.fullName} (${user.email})</li>`).join('');
      if (ordersList) ordersList.innerHTML = (ordersData.orders || []).map((order) => `<li>#${order.id} — ${order.userId} — ${formatCurrency(order.total)}</li>`).join('');
    } catch (error) {
      console.error(error);
    }
  };

  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      name: document.getElementById('product-name').value,
      price: document.getElementById('product-price').value,
      category: document.getElementById('product-category').value,
      description: document.getElementById('product-description').value,
      image: document.getElementById('product-image').value || '/assets/fudgebrownies.webp',
      stock: document.getElementById('product-stock').value || 10
    };
    try {
      await requestApi('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      productForm.reset();
      refreshDashboard();
    } catch (error) {
      console.error(error);
    }
  });

  productsList?.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-delete-product]');
    if (!button) return;
    await requestApi(`/api/products/${button.dataset.deleteProduct}`, { method: 'DELETE' });
    refreshDashboard();
  });

  logoutButton?.addEventListener('click', () => {
    clearToken();
    window.location.href = 'admin.html';
  });

  refreshDashboard();
}

function observeCards() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card) => {
    card.classList.remove('show-card');
    if (window.IntersectionObserver && observer) observer.observe(card);
  });
}

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(15,10,7,0.9)';
      navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
    } else {
      navbar.style.background = 'rgba(15,10,7,0.65)';
      navbar.style.boxShadow = 'none';
    }
  });
}

const observer = window.IntersectionObserver ? new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show-card');
  });
}) : null;

setAuthLinks();
initStorefront();
initAuthForms();
initForgotPassword();
initAdminLogin();
initProfilePage();
initCheckoutPage();
initAdminDashboard();