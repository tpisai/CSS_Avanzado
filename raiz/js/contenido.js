
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-button");
  const siteNav = document.querySelector("#site-nav");

  // Menú responsive
  if (menuButton && siteNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
      );
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  // Contador compartido del carrito
  const updateCartCount = () => {
    const counters = document.querySelectorAll(".cart-count, #cart-count");

    try {
      const cart = JSON.parse(
        localStorage.getItem("streethype-cart") || "[]"
      );

      const total = Array.isArray(cart)
        ? cart.reduce((sum, item) => {
            return sum + Math.max(0, Number(item.quantity) || 0);
          }, 0)
        : 0;

      counters.forEach((counter) => {
        counter.textContent = total;
      });
    } catch {
      counters.forEach((counter) => {
        counter.textContent = "0";
      });
    }
  };

  updateCartCount();
  window.addEventListener("storage", updateCartCount);

  // Año del footer
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Confirmación visual del formulario de contacto
  const contactForm = document.querySelector("#contact-form");
  const formMessage = document.querySelector("#form-message");

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      formMessage.textContent =
        "Formulario validado. Para enviar tu mensaje, falta conectar un servicio de recepción.";

      contactForm.reset();
    });
  }
});
