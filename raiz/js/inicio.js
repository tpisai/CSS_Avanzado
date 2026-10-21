
(() => {
    "use strict";

    const STORAGE_KEY = "streethype-cart";
    const MAX_PER_PRODUCT = 4;

    // ==========================================
    // UTILIDADES
    // ==========================================
    const formatMoney = (value) =>
        new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
            minimumFractionDigits: 2
        }).format(Number(value) || 0);

    const escapeHTML = (value) =>
        String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    function readCart() {
        try {
            const cart = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(cart) ? cart : [];
        } catch {
            return [];
        }
    }

    function updateCartCount(cart = readCart()) {
        const count = cart.reduce(
            (total, item) => total + (Number(item.quantity) || 0),
            0
        );

        document.querySelectorAll(".cart-count, #cart-count")
            .forEach((element) => {
                element.textContent = count;
            });
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            updateCartCount(cart);
            return true;
        } catch {
            showMessage("No se pudo guardar el carrito.");
            return false;
        }
    }

    function showMessage(message) {
        const cartMessage = document.querySelector("#cart-message");
        if (!cartMessage) return;

        cartMessage.textContent = message;
        cartMessage.classList.add("is-visible");

        clearTimeout(showMessage.timeout);

        showMessage.timeout = setTimeout(() => {
            cartMessage.classList.remove("is-visible");
        }, 2200);
    }

    function getProductImage(image) {
        if (typeof window.STREETHYPE_IMAGE === "function") {
            return window.STREETHYPE_IMAGE(image);
        }

        return image || "";
    }

    // ==========================================
    // MENÚ DE NAVEGACIÓN
    // ==========================================
    const menuButton = document.querySelector(".menu-button");
    const siteNav = document.querySelector(".site-nav");

    if (menuButton && siteNav) {
        menuButton.addEventListener("click", () => {
            const isOpen = siteNav.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        siteNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                siteNav.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ==========================================
    // CARRUSEL PRINCIPAL
    // ==========================================
    const heroImage = document.querySelector(".hero-media img");
    const heroTitle = document.querySelector("#hero-title");
    const heroText = document.querySelector(".hero-text");
    const heroEyebrow = document.querySelector(".hero-content .eyebrow");
    const heroDots = document.querySelectorAll(".hero-dot");

    const slides = [
        {
            image: "assets/img/hero/hero-1.webp",
            alt: "Modelo con una propuesta de moda urbana",
            title: "OWN YOUR STYLE.",
            text: "Prendas, zapatillas y accesorios para quienes convierten la calle en su propio escenario.",
            eyebrow: "NEW STREET SEASON / 2026"
        },
        {
            image: "assets/img/hero/hero-2.webp",
            alt: "Colección de ropa urbana",
            title: "MAKE THE STREET YOURS.",
            text: "Siluetas amplias, básicos esenciales y piezas pensadas para construir tu propio código.",
            eyebrow: "DROP 02 / STREET CULTURE"
        },
        {
            image: "assets/img/hero/hero-3.webp",
            alt: "Persona usando ropa de estilo urbano",
            title: "NO RULES. JUST STYLE.",
            text: "Una selección urbana para combinar, experimentar y moverte sin seguir el manual.",
            eyebrow: "LIMITED EDITION / 2026"
        }
    ];

    let currentSlide = 0;
    let heroTimer;

    function showSlide(index) {
        if (!heroImage || !heroTitle || !heroText || !heroEyebrow) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;
        const slide = slides[currentSlide];

        heroImage.src = slide.image;
        heroImage.alt = slide.alt;
        heroTitle.textContent = slide.title;
        heroText.textContent = slide.text;
        heroEyebrow.textContent = slide.eyebrow;

        heroDots.forEach((dot, dotIndex) => {
            const active = dotIndex === currentSlide;

            dot.classList.toggle("hero-dot--active", active);

            if (active) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    if (
        heroImage &&
        heroTitle &&
        heroText &&
        heroEyebrow &&
        slides.length
    ) {
        heroDots.forEach((dot) => {
            dot.addEventListener("click", () => {
                const index = Number(dot.dataset.slide);

                if (!Number.isInteger(index)) return;

                showSlide(index);
                clearInterval(heroTimer);

                heroTimer = setInterval(() => {
                    showSlide(currentSlide + 1);
                }, 6000);
            });
        });

        showSlide(0);

        heroTimer = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 6000);
    }

    // ==========================================
    // PRODUCTOS EN OFERTA
    // ==========================================
    const products = Array.isArray(window.STREETHYPE_PRODUCTS)
        ? window.STREETHYPE_PRODUCTS
        : [];

    const productGrid = document.querySelector("#grid-productos");
    
    function renderProducts() {
        if (!productGrid) return;
        const saleProducts = products.filter((product) => product.category === "sale");
        productGrid.innerHTML = saleProducts.map((product) => {
            const image = getProductImage(product.image);
            return `<article class="product-card">
                      <a href="paginas/producto.html?id=${encodeURIComponent(product.id)}"
                        class="product-media"
                        aria-label="Ver ${escapeHTML(product.name)}">
                        <img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" loading="lazy">
                          ${product.badge 
                            ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
                      </a>
                      <div class="product-content">
                        <span class="product-category">SALE</span>
                        <h3 class="product-title">
                            ${escapeHTML(product.name)}
                        </h3>
                        <p class="product-desc">
                            ${escapeHTML(product.description)}
                        </p>
                        <div class="product-footer">
                          <div class="price-wrapper">
                            <span class="price">
                              ${formatMoney(product.price)}
                            </span>
                            ${product.previousPrice 
                              ? `<span class="old-price">${formatMoney(product.previousPrice)}</span>`
                              : ""}
                          </div>
                          <a class="add-button" 
                          href="paginas/producto.html?id=${encodeURIComponent(product.id)}"
                          aria-label="Ver ${escapeHTML(product.name)}">
                            +
                          </a>
                        </div>
                    </div>
                </article>`;
        }).join("");
      }
    renderProducts();
    updateCartCount();

    // Actualiza el contador si el carrito cambia en otra pestaña.
    window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_KEY) {
            updateCartCount();
        }
    });

    // NEWSLETTER
    const newsletterForm = document.querySelector("#newsletter-form");
    const formMessage = document.querySelector("#form-message");

    if (newsletterForm && formMessage) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!newsletterForm.reportValidity()) return;

            formMessage.textContent =
                "¡Listo! Te avisaremos cuando llegue el próximo drop.";

            newsletterForm.reset();
        });
    }

    // ==========================================
    // AÑO DEL FOOTER
    // ==========================================
    const year = document.querySelector("#year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
})();
