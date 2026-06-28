const cartToggle = document.getElementById("cart-toggle-check");
const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
const cartBadge = document.querySelector(".cart-badge");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotalValue = document.querySelector(".cart-total span:last-child");
const navbar = document.querySelector(".navbar");

let cartItems = [];

function formatCurrency(value) {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR"
  });
}

function getProductDetails(button) {
  const card = button.closest(".product-card");
  const image = card.querySelector(".product-image img");
  const name = card.querySelector("h3").textContent.trim();
  const price = parseFloat(card.querySelector(".product-price").textContent.replace("$", ""));

  return {
    name,
    price,
    image: image.src,
    alt: image.alt,
  };
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

function initCart() {
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      addToCart(getProductDetails(btn));
    });
  });

  cartItemsContainer.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control) return;

    updateCartItem(control.dataset.name, control.dataset.action);
  });

  renderCart();
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

const cards = document.querySelectorAll(".product-card");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-card");
    }
  });
});

cards.forEach((card) => {
  observer.observe(card);
});

initCart();