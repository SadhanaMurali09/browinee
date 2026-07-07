const cartToggle = document.getElementById("cart-toggle-check");
const cartBadge = document.querySelector(".cart-badge");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotalValue = document.querySelector(".cart-total span:last-child");
const navbar = document.querySelector(".navbar");
const productsContainer = document.getElementById("products-container");
const checkoutBtn = document.querySelector(".checkout-btn");

let cartItems = [];
let products = [
  {
    id: 1,
    name: 'Classic Chocolate Brownie',
    price: 4.5,
    image: '/assets/classic chocolate browine.webp',
    alt: 'Classic Chocolate Brownie'
  },
  {
    id: 2,
    name: 'Fudge Brownie',
    price: 4.99,
    image: '/assets/fudgebrownies.webp',
    alt: 'Fudge Brownie'
  },
  {
    id: 3,
    name: 'Walnut Brownie',
    price: 5.5,
    image: '/assets/walnut_brownie_01.png',
    alt: 'Walnut Brownie'
  },
  {
    id: 4,
    name: 'Oreo Brownie',
    price: 5.25,
    image: '/assets/oreo browinee.jpg',
    alt: 'Oreo Brownie'
  },
  {
    id: 5,
    name: 'Caramel Brownie',
    price: 5.75,
    image: '/assets/caremel browie.jpg',
    alt: 'Caramel Brownie'
  },
  {
    id: 6,
    name: 'Red Velvet Brownie',
    price: 6.0,
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop',
    alt: 'Red Velvet Brownie'
  },
  {
    id: 7,
    name: 'Nutella Brownie',
    price: 5.9,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop&crop=bottom',
    alt: 'Nutella Brownie'
  },
  {
    id: 8,
    name: 'Cheesecake Brownie',
    price: 6.25,
    image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?q=80&w=600&auto=format&fit=crop',
    alt: 'Cheesecake Brownie'
  },
  {
    id: 9,
    name: 'Peanut Butter Brownie',
    price: 5.5,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop',
    alt: 'Peanut Butter Brownie'
  },
  {
    id: 10,
    name: 'Dark Chocolate Brownie',
    price: 4.75,
    image: '/assets/darkchocolate.webp',
    alt: 'Dark Chocolate Brownie'
  },
  {
    id: 11,
    name: 'Lotus Biscoff Brownie',
    price: 6.5,
    image: '/assets/lotus biscoff browinee.webp',
    alt: 'Lotus Biscoff Brownie'
  },
  {
    id: 12,
    name: "S'mores Brownie",
    price: 5.95,
    image: "/assets/s'mores browine.webp",
    alt: "S'mores Brownie"
  }
];

function formatCurrency(value) {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR"
  });
}

function renderProducts(productList) {
  if (!productsContainer) return;

  productsContainer.innerHTML = productList
    .map(
      (product) => `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.alt}">
            <div class="product-overlay">
              <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                <i class="ph ph-shopping-cart"></i> Add to Cart
              </button>
            </div>
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <div class="price-row">
              <span class="product-price">$${product.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  observeCards();
}

function renderCart() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartBadge.textContent = totalItems;
  cartTotalValue.textContent = formatCurrency(totalPrice);

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty. Add some brownies to get started.</div>';
    return;
  }

  cartItemsContainer.innerHTML = cartItems
    .map(
      (item) => `
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
      `
    )
    .join("");
}

function addToCart(product) {
  const existingItem = cartItems.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  renderCart();
  cartToggle.checked = true;
  showToast(`🍫 ${product.name} added to cart`);
}

function updateCartItem(name, action) {
  const item = cartItems.find((entry) => entry.name === name);

  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cartItems = cartItems.filter((entry) => entry.name !== name);
    }
  } else if (action === "remove") {
    cartItems = cartItems.filter((entry) => entry.name !== name);
  }

  renderCart();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 2000);
}

async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      products = data;
    }
    renderProducts(products);
  } catch (error) {
    console.error("Could not load products from backend:", error);
    renderProducts(products);
    showToast("Using local product list.");
  }
}

function initCart() {
  if (productsContainer) {
    productsContainer.addEventListener("click", (event) => {
      const button = event.target.closest(".add-to-cart-btn");
      if (!button) return;

      event.preventDefault();
      const productId = Number(button.dataset.productId);
      const selectedProduct = products.find((product) => product.id === productId);

      if (selectedProduct) {
        addToCart(selectedProduct);
      }
    });
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (event) => {
      const control = event.target.closest("[data-action]");
      if (!control) return;

      updateCartItem(control.dataset.name, control.dataset.action);
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      if (cartItems.length === 0) {
        showToast("Your cart is empty.");
        return;
      }

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems })
        });

        const result = await response.json();
        showToast(result.message || "Order placed successfully");
        cartItems = [];
        renderCart();
      } catch (error) {
        console.error("Checkout failed:", error);
        showToast("Checkout failed. Please try again.");
      }
    });
  }

  renderCart();
}

function observeCards() {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card) => {
    card.classList.remove("show-card");
    observer.observe(card);
  });
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(15,10,7,0.9)";
    navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.5)";
  } else {
    navbar.style.background = "rgba(15,10,7,0.65)";
    navbar.style.boxShadow = "none";
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-card");
    }
  });
});

initCart();
loadProducts();