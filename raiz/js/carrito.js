(() => {
  "use strict";

  const STORAGE_KEY = "streethype-cart";
  const FREE_SHIPPING_FROM = 399;
  const SHIPPING_COST = 20;

  const catalog = {
    "hoodie-shadow": { id: "hoodie-shadow", name: "Hoodie Shadow", category: "Hoodie oversize", color: "Negro", price: 219 },
    "cargo-stone": { id: "cargo-stone", name: "Cargo Stone", category: "Pantalón cargo", color: "Gris", price: 189 },
    "low-street-neon": { id: "low-street-neon", name: "Low Street Neon", category: "Zapatillas urbanas", color: "Lima", price: 399 }
  };

  const initialCart = [
    { id: "hoodie-shadow", quantity: 1 },
    { id: "cargo-stone", quantity: 1 }
  ];

  const cartItems = document.querySelector("#cart-items");
  const emptyCart = document.querySelector("#empty-cart");
  const cartCount = document.querySelector("#cart-count");
  const cartItemLabel = document.querySelector("#cart-item-label");
  const subtotalElement = document.querySelector("#subtotal");
  const shippingElement = document.querySelector("#shipping");
  const totalElement = document.querySelector("#total");
  const checkoutButton = document.querySelector("#checkout-button");
  const toast = document.querySelector("#toast");

  if (!cartItems || !emptyCart) return;

  let cart = loadCart();
  let toastTimeout;

  function resolveProduct(item) {
    const product = catalog[item.id] || {};

    return {
      id: item.id,
      name: item.name || product.name || "Producto STREET HYPE",
      category: item.category || product.category || "Producto STREET HYPE",
      color: item.color || product.color || "Sin variante",
      image: item.image || product.image || "",
      price: Number(item.price ?? product.price ?? 0)
    };
  }

  function loadCart() {
    try {
      const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const source = Array.isArray(savedCart) ? savedCart : initialCart;

      return source
        .filter((item) => item && item.id && Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0)
        .map((item) => ({ ...item, quantity: Number(item.quantity) }));
    } catch {
      return [...initialCart];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function money(value) {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2
    }).format(value);
  }

  function getItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getSubtotal() {
    return cart.reduce((total, item) => total + (resolveProduct(item).price * item.quantity), 0);
  }

  function getShipping(subtotal) {
    return subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  }

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2800);
  }

  function itemVisual(product) {
    if (product.image) {
      return `<img class="cart-product-image" src="${product.image}" alt="${product.name}">`;
    }

    return "<span>Imagen pendiente</span>";
  }

  function renderCart() {
    const itemCount = getItemCount();
    const subtotal = getSubtotal();
    const shipping = getShipping(subtotal);
    const total = subtotal + shipping;

    cartItems.innerHTML = cart.map((item) => {
      const product = resolveProduct(item);
      const itemTotal = product.price * item.quantity;
      const imageClass = product.image ? " has-image" : "";

      return `
        <article class="cart-item" data-product-id="${product.id}">
          <div class="item-visual${imageClass}" aria-label="Imagen de ${product.name}">
            ${itemVisual(product)}
          </div>
          <div class="item-info">
            <p class="item-category">${product.category}</p>
            <h3 class="item-name">${product.name}</h3>
            <p class="item-meta">${product.color}</p>
            <div class="item-actions">
              <div class="quantity-control" aria-label="Cantidad de ${product.name}">
                <button type="button" data-action="decrease" aria-label="Disminuir cantidad de ${product.name}">−</button>
                <span class="quantity-value">${item.quantity}</span>
                <button type="button" data-action="increase" aria-label="Aumentar cantidad de ${product.name}">+</button>
              </div>
              <button class="remove-button" type="button" data-action="remove">Eliminar</button>
            </div>
          </div>
          <strong class="item-price">${money(itemTotal)}</strong>
        </article>
      `;
    }).join("");

    emptyCart.hidden = cart.length > 0;
    cartItems.hidden = cart.length === 0;
    cartCount.textContent = itemCount;
    cartItemLabel.textContent = `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`;
    subtotalElement.textContent = money(subtotal);
    shippingElement.textContent = shipping === 0 ? "Gratis" : money(shipping);
    totalElement.textContent = money(total);
    checkoutButton.disabled = cart.length === 0;
  }

  function updateQuantity(productId, amount) {
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
      cart = cart.filter((cartItem) => cartItem.id !== productId);
      showToast("Producto eliminado del carrito.");
    }

    saveCart();
    renderCart();
  }

  function addProduct(productId) {
    const product = catalog[productId];
    if (!product) return;

    const item = cart.find((cartItem) => cartItem.id === productId);

    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    renderCart();
    showToast(`${product.name} se agregó al carrito.`);
  }

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-product]");

    if (addButton) {
      addProduct(addButton.dataset.addProduct);
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const cartItem = actionButton.closest("[data-product-id]");
    if (!cartItem) return;

    const productId = cartItem.dataset.productId;
    const action = actionButton.dataset.action;

    if (action === "increase") updateQuantity(productId, 1);
    if (action === "decrease") updateQuantity(productId, -1);

    if (action === "remove") {
      cart = cart.filter((item) => item.id !== productId);
      saveCart();
      renderCart();
      showToast("Producto eliminado del carrito.");
    }
  });

  checkoutButton.addEventListener("click", () => {
    window.location.href = "pagos.html";
  });

  renderCart();
})();