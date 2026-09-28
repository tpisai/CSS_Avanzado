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
/* -------------------- CATÁLOGO Y FILTROS -------------------- */

const productosData = [
  {
    id: 1,
    categoria: "zapatillas",
    categoriaTexto: "ZAPATILLAS",
    nombre: "Zapatilla Street Runner",
    descripcion: "Suela chunky / Off White",
    precio: "<strong>S/ 389.00</strong>",
    badge: "NEW",
    imagen: "https://www.nike.com.pe/dw/image/v2/BJKZ_PRD/on/demandware.static/-/Sites-catalog-equinox/default/dw6937087a/images/hi-res/198484285652_1_20250606-mrtPeru.jpg?sw=640&sh=640"
  },
  {
    id: 2,
    categoria: "ropa",
    categoriaTexto: "ROPA",
    nombre: "Polera Oversize Heavyweight",
    descripcion: "Heavy cotton / Sand",
    precio: "<strong>S/ 199.00</strong>",
    badge: "NEW",
    imagen: "https://www.flavorjack.pe/cdn/shop/files/HOODIE-NEGRA-BLANK-6.jpg?v=1751472414",
  },
  {
    id: 3,
    categoria: "accesorios",
    categoriaTexto: "ACCESORIOS",
    nombre: "Cadena Urban Silver",
    descripcion: "Stainless Steel / Silver",
    precio: "<strong>S/ 79.00</strong>",
    badge: "NEW",
    imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 4,
    categoria: "sale",
    categoriaTexto: "SALE",
    nombre: "Casaca Varsity Black (Sale)",
    descripcion: "Overfit / Black",
    precio: "<strong>S/ 329.00</strong>",
    badge: "NEW",
    imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85"
  }
];

const gridProductos = document.querySelector("#grid-productos");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

function renderizarProductos(categoriaSeleccionada = "todos") {
  if (!gridProductos) return;

  const productosFiltrados = categoriaSeleccionada === "todos"
    ? productosData
    : productosData.filter(prod => prod.categoria === categoriaSeleccionada);

  gridProductos.innerHTML = productosFiltrados.map(prod => `
    <article class="product-card">
      <div class="product-media">
        ${prod.badge ? `<span class="badge badge--${prod.badge.toLowerCase()}">${prod.badge}</span>` : ''}
        <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
        <button class="wishlist-btn" aria-label="Añadir a favoritos">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
      </div>
      <div class="product-content">
        <span class="product-category">${prod.categoriaTexto}</span>
        <h3 class="product-title">${prod.nombre}</h3>
        <p class="product-desc">${prod.descripcion}</p>
        <div class="product-footer">
          <div class="price-wrapper">
            <span class="price">${prod.precio}</span>
            ${prod.precioAnterior ? `<span class="price-old">${prod.precioAnterior}</span>` : ''}
          </div>
          <button class="add-button" data-product="${prod.nombre}">+</button>
        </div>
      </div>
    </article>
  `).join('');

  // Volver a vincular eventos de agregar al carrito a los nuevos botones
  document.querySelectorAll("#grid-productos .add-button").forEach(btn => {
    btn.addEventListener("click", () => {
      cartItems += 1;
      if (cartCount) cartCount.textContent = cartItems;
      showCartMessage(btn.dataset.product);
    });
  });
}

// Eventos de click en los botones de filtro
botonesFiltro.forEach(btn => {
  btn.addEventListener("click", () => {
    botonesFiltro.forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
    renderizarProductos(btn.dataset.categoria);
  });
});

// Renderizar todos al cargar
document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos();
});

