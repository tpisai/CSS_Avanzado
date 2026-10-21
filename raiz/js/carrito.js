(() => {
  "use strict";

  const STORAGE_KEY = "streethype-cart";
  const FREE_SHIPPING_FROM = 399;
  const SHIPPING_COST = 20;
  const recommendedProducts = document.querySelector("#recommended-products");
  const cartItems = document.querySelector("#cart-items");
  const emptyCart = document.querySelector("#empty-cart");
  const cartCount = document.querySelector("#cart-count");
  const cartItemLabel = document.querySelector("#cart-item-label");
  const subtotalElement = document.querySelector("#subtotal");
  const shippingElement = document.querySelector("#shipping");
  const totalElement = document.querySelector("#total");
  const checkoutButton = document.querySelector("#checkout-button");
  const toast = document.querySelector("#toast");
  const MAX_PER_PRODUCT = 4;

  function getCartKey(item) {
      return `${item.id}::${Number(item.warrantyPrice) || 0}`;
  }

  function escapeHTML(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
      })[char]);
  }

  if (!cartItems || !emptyCart) return;

  let cart = loadCart();
  let toastTimeout;

  function resolveProduct(item) {
    const productoCentral = (window.STREETHYPE_PRODUCTS || [])
      .find(producto => producto.id === item.id) || {};
    const product = {
      ...productoCentral,
      ...item
    };
    const image = item.image || productoCentral.image || "";
    return {
      ...product,
      id: item.id,
      name: item.name || productoCentral.name || "Producto",
      category: item.category || productoCentral.category || "Sin categoría",
      color: item.color || productoCentral.color || "Sin variante",
      image: image && window.STREETHYPE_IMAGE ? window.STREETHYPE_IMAGE(image) : image,
      price: Number(item.price ?? productoCentral.price ?? 0),
      previousPrice: Number(item.previousPrice ?? productoCentral.previousPrice ?? 0),
      badge: item.badge || productoCentral.badge || "",
      quantity: Number(item.quantity) || 1,
      warrantyPrice: Number(item.warrantyPrice) || 0
    };
  }

  function loadCart() {
    try {
      const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(savedCart)) return [];
      return savedCart.filter(item => item && item.id &&
          Number.isInteger(Number(item.quantity)) &&
          Number(item.quantity) > 0).map(item => ({ ...item, quantity: Number(item.quantity)}));
    } catch (error) {
      console.error("Error al recuperar el carrito:", error);
      return [];
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
      if (!product.image) {
          return "<span>Imagen pendiente</span>";
      }
      return `<img class="cart-product-image"
                  src="${escapeHTML(product.image)}"
                  alt="${escapeHTML(product.name)}">`;
  }

  function renderRecommendations() {
    if (!recommendedProducts) return;
    const products = window.STREETHYPE_PRODUCTS || [];
    // No recomendar productos que ya estén en el carrito.
    const cartIds = new Set(cart.map(item => item.id));
    const recommendations = products.filter(product => !cartIds.has(product.id)).slice(0, 4);
    recommendedProducts.innerHTML = recommendations.map(product => {
      const image = product.image && window.STREETHYPE_IMAGE
        ? window.STREETHYPE_IMAGE(product.image) : product.image || "";
      const price = Number(product.price) || 0;
      const previousPrice = Number(product.previousPrice) || 0;
      const isSale = previousPrice > price || Boolean(product.badge);
      return `
        <article class="product-card">
          <a class="product-visual has-image"
            href="producto.html?id=${encodeURIComponent(product.id)}"
            aria-label="Ver ${escapeHTML(product.name)}">
            ${image
              ? `<img src="${escapeHTML(image)}"
                      alt="${escapeHTML(product.name)}"
                      loading="lazy">`
              : `<span>Imagen no disponible</span>`}
          </a>

          <div class="product-card__info">
            ${isSale
              ? `<p class="product-badge">${escapeHTML(product.badge || "SALE")}</p>`
              : ""}

            <h3>
              <a href="producto.html?id=${encodeURIComponent(product.id)}">
                ${escapeHTML(product.name)}
              </a>
            </h3>

            <p>${escapeHTML(product.category || "")}</p>

            <div class="product-footer">
              <div class="product-prices">
                <span class="product-price">${money(price)}</span>
                ${previousPrice > price
                  ? `<del>${money(previousPrice)}</del>`
                  : ""}
              </div>

              <button class="add-button"
                      type="button"
                      data-add-product="${escapeHTML(product.id)}"
                      aria-label="Agregar ${escapeHTML(product.name)} al carrito">
                +
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderCart() {
    const itemCount = getItemCount();
    const subtotal = getSubtotal();
    const shipping = getShipping(subtotal);
    const total = subtotal + shipping;

    cartItems.innerHTML = cart.map((item) => {
        const product = resolveProduct(item);
        const itemTotal = product.price * product.quantity;
        const imageClass = product.image ? " has-image" : "";
        const cartKey = escapeHTML(getCartKey(item));
        return `
            <article class="cart-item"
                    data-cart-key="${cartKey}">
                <div class="item-visual${imageClass}"
                    aria-label="Imagen de ${escapeHTML(product.name)}">
                    ${itemVisual(product)}
                </div>
                <div class="item-info">
                    <p class="item-category">
                        ${escapeHTML(product.category)}
                        ${product.previousPrice > product.price || product.badge
                            ? " · SALE" : ""}
                    </p>
                    <h3 class="item-name">${escapeHTML(product.name)}</h3>
                    <p class="item-meta">${escapeHTML(product.color)}</p>
                    <div class="item-actions">
                        <div class="quantity-control"
                            aria-label="Cantidad de ${escapeHTML(product.name)}">
                            <button type="button" data-action="decrease"
                                    aria-label="Disminuir cantidad">−</button>
                            <span class="quantity-value">${product.quantity}</span>
                            <button type="button" data-action="increase"
                                    aria-label="Aumentar cantidad">+</button>
                        </div>
                        <button class="remove-button" type="button"
                                data-action="remove">Eliminar</button>
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
    renderRecommendations();
  }

  function updateQuantity(cartKey, amount) {
    const item = cart.find((cartItem) => getCartKey(cartItem) === cartKey);
      if (!item) return;
      if (amount > 0) {
          const totalProducto = cart.filter((cartItem) => cartItem.id === item.id)
              .reduce((total, cartItem) => total + cartItem.quantity, 0);
          if (totalProducto >= MAX_PER_PRODUCT) {
              showToast("Máximo 4 unidades por producto.");
              return;
          }
      }
      item.quantity += amount;
      if (item.quantity <= 0) {
          cart = cart.filter((cartItem) => getCartKey(cartItem) !== cartKey);
          showToast("Producto eliminado del carrito.");
      }
      saveCart();
      renderCart();
  }

  document.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-add-product]");
      if (addButton) {
          const productId = addButton.dataset.addProduct;
          const product = (window.STREETHYPE_PRODUCTS || []).find(
              (item) => String(item.id) === String(productId));
          if (!product) {
              showToast("No se encontró el producto.");
              return;
          }
          if (typeof window.iniciarFlujoCompra !== "function") {
              showToast("No se pudo iniciar el proceso de compra.");
              return;
          }
          const image = product.image && window.STREETHYPE_IMAGE
              ? window.STREETHYPE_IMAGE(product.image) : product.image || "";
          window.iniciarFlujoCompra({
              id: product.id,
              title: product.name,
              category: product.category,
              price: Number(product.price) || 0,
              previousPrice: Number(product.previousPrice) || 0,
              badge: product.badge || "",
              image,
              sizes: Array.isArray(product.sizes) ? product.sizes : [],
              size: null
          });
          return;
      }
      const actionButton = event.target.closest("[data-action]");
      if (!actionButton) return;
      const cartItem = actionButton.closest("[data-cart-key]");
      if (!cartItem) return;
      const cartKey = cartItem.dataset.cartKey;
      const action = actionButton.dataset.action;
      if (action === "increase") {
          updateQuantity(cartKey, 1);
      } else if (action === "decrease") {
          updateQuantity(cartKey, -1);
      } else if (action === "remove") {
          cart = cart.filter((item) => getCartKey(item) !== cartKey);
          saveCart();
          renderCart();
          showToast("Producto eliminado del carrito.");
      }
  });


  checkoutButton.addEventListener("click", () => {
    window.location.href = "pagos.html";
  });  
  document.addEventListener("streethype:cart-updated", () => {
      cart = loadCart();
      renderCart();
  });
  document.getElementById("year").textContent = new Date().getFullYear();
  renderCart();
})();