console.log("Iniciando producto.js..."); // Mensaje de prueba

// 1. BASE DE DATOS
window.STREETHYPE_PRODUCTS = [
    { id: "camiseta-magica", name: "Camiseta Mágica", category: "ropa", description: "Camiseta de estilo urbano", price: 89, image: "assets/img/camiseta.magica.jpg", color: "Negro", sizes: ["S", "M", "L", "XL"] },
    { id: "polo-azul", name: "Polo Azul", category: "sale", price: 79, previousPrice: 99, badge: "SALE", description: "Polo casual azul", image: "assets/img/polo.azul.jpg", color: "Azul", sizes: ["S", "M", "L", "XL"] },
    { id: "polo-crema", name: "Polo Crema", category: "sale", price: 79, previousPrice: 99, badge: "SALE", description: "Polo casual color crema", image: "assets/img/polo.crema.jpg", color: "Crema", sizes: ["S", "M", "L", "XL"] },
    { id: "polo-verde-militar", name: "Polo Verde Militar", category: "ropa", description: "Polo casual verde militar", price: 99, image: "assets/img/polo.verde.militar.jpg", color: "Verde militar", sizes: ["S", "M", "L", "XL"] },
    { id: "jogger-mujer", name: "Jogger para Mujer", category: "ropa", description: "Jogger de estilo urbano", price: 129, image: "assets/img/Jogger Para Mujer.jpg", color: "Negro", sizes: ["S", "M", "L", "XL"] },
    { id: "chaqueta-hype", name: "Chaqueta Hype", category: "ropa", description: "Chaqueta de estilo urbano", price: 249, image: "assets/img/chaquetas.jpg", color: "Negro", sizes: ["S", "M", "L", "XL"] },
    { id: "zapatillas-nike-rojas", name: "Zapatillas Nike Rojas", category: "zapatillas", description: "Zapatillas urbanas rojas", price: 389, image: "assets/img/Zapatillas Nike Rojas.jpg", color: "Rojo", sizes: ["38", "39", "40", "41", "42", "43"] },
    { id: "botines-rojos-nike", name: "Botines Rojos Nike", category: "zapatillas", description: "Botines deportivos rojos", price: 529, image: "assets/img/Botines rojos Nike.jpg", color: "Rojo", sizes: ["38", "39", "40", "41", "42", "43"] },
    { id: "adidas-id3711", name: "Adidas ID3711", category: "zapatillas", description: "Zapatillas Adidas urbanas", price: 349, image: "assets/img/Zapatillas adidadas id3711.jpg", color: "Multicolor", sizes: ["38", "39", "40", "41", "42", "43"] },
    { id: "adidas-running-azul", name: "Adidas Running Azul", category: "sale", price: 249, previousPrice: 299, badge: "SALE", description: "Zapatillas para running", image: "assets/img/Zapatillas Running azul.jpg", color: "Azul", sizes: ["38", "39", "40", "41", "42", "43"] },
    { id: "gorra-blanca", name: "Gorra Blanca", category: "sale", price: 39, previousPrice: 49, badge: "SALE", description: "Gorra urbana blanca", image: "assets/img/Gorra Blanca.jpg", color: "Blanco", sizes: [] },
    { id: "gorra-crema", name: "Gorra Crema", category: "accesorios", description: "Gorra urbana color crema", price: 55, image: "assets/img/gorra crema.jpg", color: "Crema", sizes: [] },
    { id: "gorra-deportiva", name: "Gorra Deportiva", category: "accesorios", description: "Gorra de estilo deportivo", price: 65, image: "assets/img/Gorra Deportiva.jpg", color: "Negro", sizes: [] },
    { id: "gorra-dunkelvolk", name: "Gorra Dunkelvolk", category: "accesorios", description: "Gorra urbana para hombre", price: 79, image: "assets/img/Gorra para Hombre DUNKELVOLK.jpg", color: "Negro", sizes: [] }
];

window.STREETHYPE_IMAGE = function (image) {
    if (/^https?:\/\//i.test(image)) return image;
    return window.location.pathname.includes("/paginas/") ? "../" + image : image;
};

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. RENDERIZADO DEL CATÁLOGO DINÁMICO
    const catalogoGrid = document.getElementById("catalogo-grid");
    const productosCatalogo = window.STREETHYPE_PRODUCTS || [];
    
    const renderizarCatalogo = (filtro = "todos") => {
        if (!catalogoGrid) return;
        catalogoGrid.innerHTML = productosCatalogo.filter(producto => {
            return filtro === "todos" || (producto.category && producto.category.toLowerCase() === filtro);
        }).map(producto => {
            const precio = Number(producto.price) || 0;
            const precioAnterior = Number(producto.previousPrice) || 0;
            const estaEnOferta = precioAnterior > precio;
            const categoria = String(producto.category || "").toLowerCase().trim();
            const imagen = window.STREETHYPE_IMAGE(producto.image);
            
            return `<article class="product-card" data-category="${categoria}" data-product-id="${producto.id}">
                    <div class="product-card-image-wrap">
                        <a href="producto.html?id=${encodeURIComponent(producto.id)}">
                            ${estaEnOferta ? '<span class="product-sale-badge">SALE</span>' : ""}
                            <img src="${imagen}" alt="${producto.name}" loading="lazy">
                        </a>
                    </div>
                    <div class="product-card-details">
                        <p class="product-card-category">${categoria.toUpperCase()}</p>
                        <h3 class="product-card-title"><a href="producto.html?id=${encodeURIComponent(producto.id)}">${producto.name}</a></h3>
                        <div class="product-card-footer">
                            <div class="product-card-prices">
                                ${estaEnOferta ? `<span class="product-card-old-price">S/ ${precioAnterior.toFixed(2)}</span>` : ""}
                                <strong class="${estaEnOferta ? "product-card-sale-price" : ""}">S/ ${precio.toFixed(2)}</strong>
                            </div>
                            <button class="add-button btn-circle" type="button" data-product-id="${producto.id}">+</button>
                        </div>
                    </div>
                </article>`;
        }).join("");
    };
    renderizarCatalogo();

    // 3. FILTROS DEL CATÁLOGO
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            botonesFiltro.forEach(btn => btn.classList.remove('active'));
            boton.classList.add('active');
            renderizarCatalogo(boton.getAttribute('data-filter'));
        });
    });

    // 4. DETALLE DEL PRODUCTO PRINCIPAL
    let productoDetalle = null;
    try {
        const parametrosURL = new URLSearchParams(window.location.search); 
        const idProducto = parametrosURL.get("id") || "zapatillas-nike-rojas"; 
        const producto = productosCatalogo.find(item => item.id === idProducto);

        if (producto) {
            productoDetalle = producto;
            
            const imgElement = document.getElementById('producto-imagen');
            if (imgElement) imgElement.src = window.STREETHYPE_IMAGE(producto.image);
            
            const titleElement = document.getElementById('producto-titulo');
            if (titleElement) titleElement.textContent = producto.name;
            
            const descElement = document.getElementById('producto-descripcion');
            if (descElement) descElement.textContent = producto.description;
            
            const preEl = document.getElementById('producto-precio');
            if (preEl) {
                if (producto.previousPrice > producto.price) {
                    preEl.innerHTML = `<span class="product-price__old">S/ ${producto.previousPrice.toFixed(2)}</span> <strong class="product-price__current">S/ ${producto.price.toFixed(2)}</strong> <span class="product-price__badge">SALE</span>`;
                } else {
                    preEl.textContent = `S/ ${producto.price.toFixed(2)}`;
                }
            }
            
            const grupoTallas = document.getElementById("grupo-tallas");
            const bloqueTallas = document.getElementById("bloque-tallas");
            
            if (producto.sizes && producto.sizes.length > 0 && grupoTallas && bloqueTallas) {
                bloqueTallas.hidden = false;
                grupoTallas.innerHTML = producto.sizes.map((talla, index) => 
                    `<button type="button" class="btn-talla ${index === 0 ? 'talla-activa' : ''}">${talla}</button>`
                ).join("");
                
                grupoTallas.querySelectorAll('.btn-talla').forEach(boton => {
                    boton.addEventListener('click', function() {
                        grupoTallas.querySelectorAll('.btn-talla').forEach(b => {
                            b.classList.remove('talla-activa');
                        });
                        this.classList.add('talla-activa');
                    });
                });
            } else if (bloqueTallas) {
                bloqueTallas.hidden = true;
            }
        }
    } catch (error) { console.error("Error cargando detalle:", error); }

    // 5. LÓGICA DE CANTIDAD (Para el botón - 1 +)
    let cantidadProducto = 1;
    const btnRestar = document.getElementById('btn-restar-qty');
    const btnSumar = document.getElementById('btn-sumar-qty');
    const displayQty = document.getElementById('display-qty');

    if (btnRestar && btnSumar && displayQty) {
        btnRestar.addEventListener('click', () => {
            if (cantidadProducto > 1) {
                cantidadProducto--;
                displayQty.textContent = cantidadProducto;
            }
        });
        btnSumar.addEventListener('click', () => {
            if (cantidadProducto < 4) { 
                cantidadProducto++;
                displayQty.textContent = cantidadProducto;
            } else {
                alert("Máximo 4 unidades por producto.");
            }
        });
    }

    // 6. CONEXIÓN AL CARRITO (Abre modales de compra.js)
    const btnPrincipal = document.getElementById("producto-boton");
    if (btnPrincipal) {
        btnPrincipal.addEventListener("click", (e) => {
            e.preventDefault();
            if (!productoDetalle) return;
            const tallaSeleccionada = document.querySelector(".talla-activa");
            
            if (productoDetalle.sizes && productoDetalle.sizes.length > 0 && !tallaSeleccionada) {
                alert("Selecciona una talla antes de continuar.");
                return;
            }
            if (typeof window.iniciarFlujoCompra === "function") {
                window.iniciarFlujoCompra({
                    id: productoDetalle.id,
                    title: productoDetalle.name,
                    category: productoDetalle.category,
                    price: Number(productoDetalle.price) || 0,
                    previousPrice: Number(productoDetalle.previousPrice) || 0,
                    image: window.STREETHYPE_IMAGE(productoDetalle.image),
                    sizes: Array.isArray(productoDetalle.sizes) ? productoDetalle.sizes : [],
                    size: tallaSeleccionada ? tallaSeleccionada.textContent : null,
                    cantidadSeleccionada: cantidadProducto 
                });
            } else {
                console.error("compra.js no está enlazado correctamente.");
            }
        });
    }

    // Botones + del catálogo
    if (catalogoGrid) {
        catalogoGrid.addEventListener("click", (e) => {
            const boton = e.target.closest(".btn-circle");
            if (!boton) return;
            const producto = productosCatalogo.find(item => item.id === boton.dataset.productId);
            if (!producto) return;
            
            if (typeof window.iniciarFlujoCompra === "function") {
                window.iniciarFlujoCompra({
                    id: producto.id,
                    title: producto.name,
                    category: producto.category,
                    price: Number(producto.price) || 0,
                    previousPrice: Number(producto.previousPrice) || 0,
                    image: window.STREETHYPE_IMAGE(producto.image),
                    sizes: Array.isArray(producto.sizes) ? producto.sizes : [],
                    size: null,
                    cantidadSeleccionada: 1 
                });
            }
        });
    }
});