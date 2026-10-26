(() => {
    "use strict";

    const STORAGE_KEY = "streethype-cart";
    const FREE_SHIPPING_FROM = 399;
    const SHIPPING_COST = 20;

    const form = document.querySelector("#payment-form");
    const orderItems = document.querySelector("#order-items");
    const orderSubtotal = document.querySelector("#order-subtotal");
    const orderShipping = document.querySelector("#order-shipping");
    const orderTotal = document.querySelector("#order-total");
    const emptyMessage = document.querySelector("#empty-order-message");
    const payButton = document.querySelector(".pay-button");
    const successMessage = document.querySelector("#success-message");
    const paymentLayout = document.querySelector(".payment-layout");
    const orderReference = document.querySelector("#order-reference");

    const cardNumber = document.querySelector("#card-number");
    const expiry = document.querySelector("#expiry");
    const cvv = document.querySelector("#cvv");

    // Evita errores si el script se carga en otra página.
    if (!form || !orderItems || !orderTotal || !emptyMessage || !payButton) {
        return;
    }

    function getCart() {
        try {
            const cart = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            if (!Array.isArray(cart)) return [];

            return cart.filter(item =>
                item &&
                item.id &&
                Number.isInteger(Number(item.quantity)) &&
                Number(item.quantity) > 0
            );
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

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function normalizeSize(size) {
        return String(size ?? "").trim().toUpperCase();
    }

    function resolveImagePath(image) {
        const source = String(image ?? "").trim();

        if (!source || /^(?:https?:|data:|blob:|\/)/i.test(source)) {
            return source;
        }

        // Los artículos guardados desde compra.js ya usan ../assets/... .
        // Las rutas sin prefijo provienen de productos.js.
        if (source.startsWith("../") || source.startsWith("./")) {
            return source;
        }

        return `../${source}`;
    }

    function createOrderReference() {
        const suffix = String(Date.now()).slice(-6);
        return `SH-${suffix}`;
    }

    function getPrice(item) {
        // El precio guardado incluye la protección cuando corresponde.
        const price = Number(
            item.price ??
            (Number(item.basePrice || 0) + Number(item.warrantyPrice || 0))
        );

        return Number.isFinite(price) && price > 0 ? price : 0;
    }

    function getSubtotal(cart) {
        return cart.reduce(
            (total, item) => total + getPrice(item) * Number(item.quantity),
            0
        );
    }

    function getShipping(subtotal) {
        return subtotal === 0 || subtotal >= FREE_SHIPPING_FROM
            ? 0
            : SHIPPING_COST;
    }

    function renderOrder() {
        const cart = getCart();

        if (cart.length === 0) {
            orderItems.innerHTML = "";

            if (orderSubtotal) orderSubtotal.textContent = money(0);
            if (orderShipping) orderShipping.textContent = money(0);

            orderTotal.textContent = money(0);
            emptyMessage.hidden = false;
            payButton.disabled = true;
            return;
        }

        const subtotal = getSubtotal(cart);
        const shipping = getShipping(subtotal);
        const total = subtotal + shipping;

        orderItems.innerHTML = cart.map(item => {
            const name = escapeHTML(item.name || "Producto STREET HYPE");
            const quantity = Number(item.quantity);
            const itemTotal = getPrice(item) * quantity;
            const warrantyPrice = Number(item.warrantyPrice) || 0;
            const size = normalizeSize(item.size);
            const image = resolveImagePath(item.image);

            return `
                <article class="order-item">
                    <div class="order-item__visual">
                        ${
                            image
                                ? `<img src="${escapeHTML(image)}" alt="${name}">`
                                : "<span>Imagen pendiente</span>"
                        }
                    </div>
                    <div class="order-item__details">
                        <p class="item-name">${name}</p>
                        <p class="item-detail">Cantidad: ${quantity}</p>
                        <p class="item-detail">${
                            size
                                ? `Talla: ${escapeHTML(size)}`
                                : "Talla única"
                        }</p>
                        ${
                            warrantyPrice > 0
                                ? `<p class="item-detail">
                                    Incluye protección: ${money(warrantyPrice)} por unidad
                                </p>`
                                : ""
                        }
                    </div>
                    <strong>${money(itemTotal)}</strong>
                </article>
            `;
        }).join("");

        if (orderSubtotal) {
            orderSubtotal.textContent = money(subtotal);
        }

        if (orderShipping) {
            orderShipping.textContent = shipping === 0
                ? "Gratis"
                : money(shipping);
        }

        orderTotal.textContent = money(total);
        emptyMessage.hidden = true;
        payButton.disabled = false;
    }

    // Formato del número de tarjeta para la demostración.
    cardNumber?.addEventListener("input", () => {
        cardNumber.setCustomValidity("");

        const digits = cardNumber.value
            .replace(/\D/g, "")
            .slice(0, 16);

        cardNumber.value = digits
            .replace(/(.{4})/g, "$1 ")
            .trim();
    });

    // Formato MM/AA.
    expiry?.addEventListener("input", () => {
        expiry.setCustomValidity("");

        const digits = expiry.value
            .replace(/\D/g, "")
            .slice(0, 4);

        expiry.value = digits.length > 2
            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
            : digits;
    });

    // Solo números, máximo cuatro dígitos.
    cvv?.addEventListener("input", () => {
        cvv.setCustomValidity("");

        cvv.value = cvv.value
            .replace(/\D/g, "")
            .slice(0, 4);
    });

    function validarTarjeta() {
        const digits = cardNumber?.value.replace(/\D/g, "") || "";

        if (!cardNumber || ![15, 16].includes(digits.length)) {
            cardNumber?.setCustomValidity(
                "Ingresa 15 o 16 dígitos para la demostración."
            );
            cardNumber?.reportValidity();
            return false;
        }

        cardNumber.setCustomValidity("");

        if (expiry) {
            const match = expiry.value.match(
                /^(0[1-9]|1[0-2])\/(\d{2})$/
            );

            if (!match) {
                expiry.setCustomValidity("Usa el formato MM/AA.");
                expiry.reportValidity();
                return false;
            }

            const month = Number(match[1]);
            const year = 2000 + Number(match[2]);
            const now = new Date();

            const expired =
                year < now.getFullYear() ||
                (year === now.getFullYear() &&
                    month < now.getMonth() + 1);

            if (expired) {
                expiry.setCustomValidity(
                    "La fecha debe ser vigente."
                );
                expiry.reportValidity();
                return false;
            }

            expiry.setCustomValidity("");
        }

        if (cvv && !/^\d{3,4}$/.test(cvv.value)) {
            cvv.setCustomValidity("Ingresa 3 o 4 dígitos.");
            cvv.reportValidity();
            return false;
        }

        cvv?.setCustomValidity("");

        return true;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        // No se permite confirmar una compra sin productos.
        if (getCart().length === 0) {
            renderOrder();
            return;
        }

        if (!form.reportValidity() || !validarTarjeta()) {
            return;
        }

        // Demostración académica: no se envían ni guardan datos bancarios.
        localStorage.removeItem(STORAGE_KEY);

        form.reset();

        if (orderReference) {
            orderReference.textContent = createOrderReference();
        }

        if (paymentLayout) {
            paymentLayout.hidden = true;
        }

        if (successMessage) {
            successMessage.hidden = false;
            successMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });

    // Actualiza el año del footer si existe en esta página.
    const year = document.querySelector("#year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    renderOrder();
})();
