const productosData = [
  { 
    id: 1, 
    nombre: "Zapatilla Street Runner", 
    categoria: "zapatillas", 
    descripcion: "Suela chunky / Off White",
    precio: "S/ 389.00", 
    badge: "NEW",
    imagen: "https://www.nike.com.pe/dw/image/v2/BJKZ_PRD/on/demandware.static/-/Sites-catalog-equinox/default/dw6937087a/images/hi-res/198484285652_1_20250606-mrtPeru.jpg?sw=640&sh=640" 
  },
  { 
    id: 2, 
    nombre: "Polera Oversize Heavyweight", 
    categoria: "ropa", 
    descripcion: "Heavy cotton / Sand",
    precio: "S/ 199.00", 
    badge: "HOT",
    imagen: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=85" 
  },
  { 
    id: 3, 
    nombre: "Cadena Urban Silver", 
    categoria: "accesorios", 
    descripcion: "Stainless Steel / Silver",
    precio: "S/ 79.00", 
    badge: "",
    imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=85" 
  },
  { 
    id: 4, 
    nombre: "Casaca Varsity Black (Sale)", 
    categoria: "sale", 
    descripcion: "Overfit / Black",
    precio: "S/ 249.00", 
    precioAnterior: "S/ 329.00", 
    badge: "SALE",
    imagen: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&q=85" 
  }
];

function renderizarProductos(categoria = "todos") {
  const grid = document.getElementById("grid-productos");
  if (!grid) return;

  grid.innerHTML = "";

  const filtrados = categoria === "todos" 
    ? productosData 
    : productosData.filter(p => p.categoria === categoria);

  if (filtrados.length === 0) {
    grid.innerHTML = "<p>No se encontraron productos en esta categoría.</p>";
    return;
  }

  filtrados.forEach(prod => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-visual">
        ${prod.badge ? `<span class="product-badge">${prod.badge}</span>` : ""}
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <button class="favorite-button" type="button" aria-label="Añadir ${prod.nombre} a favoritos">♡</button>
      </div>
      <div class="product-body">
        <p class="product-category">${prod.categoria.toUpperCase()}</p>
        <h3>${prod.nombre}</h3>
        <p class="product-description">${prod.descripcion}</p>
        <div class="product-footer">
          <strong>${prod.precio} ${prod.precioAnterior ? `<span style="text-decoration: line-through; opacity: 0.6; font-size: 0.85em; margin-left: 6px;">${prod.precioAnterior}</span>` : ""}</strong>
          <button class="add-button" type="button" data-product="${prod.nombre}">+</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos("todos");

  const botonesFiltro = document.querySelectorAll(".btn-filtro");
  botonesFiltro.forEach(btn => {
    btn.addEventListener("click", (e) => {
      botonesFiltro.forEach(b => {
        b.classList.remove("activo");
        b.classList.add("button--secondary");
      });

      e.target.classList.add("activo");
      e.target.classList.remove("button--secondary");

      const cat = e.target.getAttribute("data-categoria");
      renderizarProductos(cat);
    });
  });
});