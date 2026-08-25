const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", isOpen);
  });
}

/* -------------------- HERO SIMPLE -------------------- */

const heroImage = document.querySelector(".hero-media img");
const heroTitle = document.querySelector("#hero-title");
const heroText = document.querySelector(".hero-text");
const heroEyebrow = document.querySelector(".hero-content .eyebrow");
const heroDots = document.querySelectorAll(".hero-dot");

const slides = [
  {
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",
    alt: "Modelo con una propuesta de moda urbana",
    title: "OWN YOUR STYLE.",
    text: "Prendas, zapatillas y accesorios para quienes convierten la calle en su propio escenario.",
    eyebrow: "NEW STREET SEASON / 2026"
  },
  {
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85",
    alt: "Colección de ropa urbana",
    title: "MAKE THE STREET YOURS.",
    text: "Siluetas amplias, básicos esenciales y piezas pensadas para construir tu propio código.",
    eyebrow: "DROP 02 / STREET CULTURE"
  },
  {
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    alt: "Persona usando ropa de estilo urbano",
    title: "NO RULES. JUST STYLE.",
    text: "Una selección urbana para combinar, experimentar y moverte sin seguir el manual.",
    eyebrow: "LIMITED EDITION / 2026"
  }
];

let currentSlide = 0;

function showSlide(index) {
  if (!heroImage || !heroTitle || !heroText || !heroEyebrow) {
    return;
  }

  currentSlide = index;

  heroImage.src = slides[index].image;
  heroImage.alt = slides[index].alt;
  heroTitle.textContent = slides[index].title;
  heroText.textContent = slides[index].text;
  heroEyebrow.textContent = slides[index].eyebrow;

  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("hero-dot--active", dotIndex === index);
  });
}

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slide));
  });
});

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 6000);

/* -------------------- CARRITO -------------------- */

const cartCount = document.querySelector(".cart-count");
const addButtons = document.querySelectorAll(".add-button");
const cartMessage = document.querySelector("#cart-message");

let cartItems = 0;

function showCartMessage(productName) {
  if (!cartMessage) {
    return;
  }

  cartMessage.textContent = `${productName} fue añadido al carrito.`;
  cartMessage.classList.add("is-visible");

  setTimeout(() => {
    cartMessage.classList.remove("is-visible");
  }, 2200);
}

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cartItems += 1;

    if (cartCount) {
      cartCount.textContent = cartItems;
    }

    showCartMessage(button.dataset.product);
  });
});

/* -------------------- NEWSLETTER -------------------- */

const newsletterForm = document.querySelector("#newsletter-form");
const formMessage = document.querySelector("#form-message");

if (newsletterForm && formMessage) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formMessage.textContent = "¡Listo! Te avisaremos cuando llegue el próximo drop.";
    newsletterForm.reset();
  });
}

/* -------------------- AÑO DEL FOOTER -------------------- */

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}
