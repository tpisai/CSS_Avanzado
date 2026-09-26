(() => {
  "use strict";

  const STORAGE_KEY = "streethype-cart";
  const FREE_SHIPPING_FROM = 399;
  const SHIPPING_COST = 20;

  const form = document.querySelector("#payment-form");
  const orderItems = document.querySelector("#order-items");
  const orderTotal = document.querySelector("#order-total");
  const emptyMessage = document.querySelector("#empty-order-message");
  const payButton = document.querySelector(".pay-button");
  const successMessage = document.querySelector("#success-message");
  const paymentLayout = document.querySelector(".payment-layout");
  const cardNumber = document.querySelector("#card-number");
  const expiry = document.querySelector("#expiry");
  const cvv = document.querySelector("#cvv");

  function getCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved.filter((item) => item && item.id && item.quantity > 0) : [];
    } catch {
      return [];
    }
  }

  function money(value) {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2
    }).format(value);
  }

  function getShipping(subtotal) {
    return subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  }

  function renderOrder() {
    const cart = getCart();

    if (cart.length === 0) {
      orderItems.innerHTML = "";
      emptyMessage.hidden = false;
      payButton.disabled = true;
      return;
    }

    const subtotal = cart.reduce((total, item) => total + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
    const total = subtotal + getShipping(subtotal);

    orderItems.innerHTML = cart.map((item) => {
      const name = item.name || "Producto STREET HYPE";
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0) * quantity;

      return `
        <article class="order-item">
          <div>
            <p class="item-name">${name}</p>
            <p class="item-detail">Cantidad: ${quantity}</p>
          </div>
          <strong>${money(price)}</strong>
        </article>
      `;
    }).join("");

    orderTotal.textContent = money(total);
    emptyMessage.hidden = true;
    payButton.disabled = false;
  }

  cardNumber.addEventListener("input", () => {
    const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
  });

  expiry.addEventListener("input", () => {
    const digits = expiry.value.replace(/\D/g, "").slice(0, 4);
    expiry.value = digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  });

  cvv.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const cardDigits = cardNumber.value.replace(/\D/g, "");

    if (cardDigits.length < 15) {
      cardNumber.setCustomValidity("Ingresa un número de tarjeta válido para la demostración.");
      cardNumber.reportValidity();
      return;
    }

    cardNumber.setCustomValidity("");

    // La demostración no transmite, guarda ni procesa los datos del formulario.
    form.reset();
    paymentLayout.hidden = true;
    successMessage.hidden = false;
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  renderOrder();
})();