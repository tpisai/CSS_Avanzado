document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. FILTROS DEL CATÁLOGO (Aislado para evitar errores)
    // ==========================================
    const inicializarFiltros = () => {
        const botonesFiltro = document.querySelectorAll('.filter-btn');
        const productosCatalogo = document.querySelectorAll('.product-card');

        if (botonesFiltro.length > 0) {
            botonesFiltro.forEach(boton => {
                boton.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Quitar clase 'active' a todos
                    botonesFiltro.forEach(btn => btn.classList.remove('active'));
                    // Añadir 'active' al botón clickeado
                    boton.classList.add('active');
                    // Obtener la categoría
                    const categoriaSeleccionada = boton.getAttribute('data-filter');
                    // Filtrar productos
                    productosCatalogo.forEach(producto => {
                        const categoriaProducto = producto.dataset.category;
                        producto.style.display = categoriaSeleccionada === "todos" || 
                        categoriaProducto === categoriaSeleccionada ? "" : "none";
                    });
                });
            });
        }
    };
    // Inicializamos los filtros inmediatamente
    inicializarFiltros();

    // ==========================================
    // 2. BASE DE DATOS Y RENDERIZADO
    // ==========================================
    let productoDetalle = null;
    try {
        const parametrosURL = new URLSearchParams(window.location.search);
        const idProducto = parametrosURL.get("id") || "camiseta-magica";
        const productos = window.STREETHYPE_PRODUCTS || [];
        const producto = productos.find(item => item.id === idProducto);

        if (!producto) {
            console.error("No se encontró el producto:", idProducto);
            document.getElementById("producto-titulo").textContent = "Producto no encontrado";
        } else {
            productoDetalle = producto;
            const imgEl = document.getElementById('producto-imagen');
            const titEl = document.getElementById('producto-titulo');
            const preEl = document.getElementById('producto-precio');
            const descEl = document.getElementById('producto-descripcion');
            
            if (imgEl) {
                imgEl.src = window.STREETHYPE_IMAGE(producto.image);
                imgEl.alt = producto.name;
            }
            if (titEl) titEl.textContent = producto.name;
            if (descEl) descEl.textContent = producto.description || "";
            // Precio actual y precio anterior si está en oferta.
            if (preEl) {
                const precioActual = Number(producto.price) || 0;
                const precioAnterior = Number(producto.previousPrice) || 0;
                if (precioAnterior > precioActual) {
                    preEl.innerHTML = `
                        <span class="product-price__old">
                            S/ ${precioAnterior.toFixed(2)}
                        </span>
                        <strong class="product-price__current">
                            S/ ${precioActual.toFixed(2)}
                        </strong>
                        <span class="product-price__badge">SALE</span>
                    `;
                } else {
                    preEl.textContent = `S/ ${precioActual.toFixed(2)}`;
                }
            }
            // Tallas.
            const bloqueTallas = document.getElementById("bloque-tallas");
            const grupoTallas = document.getElementById("grupo-tallas");
            const tallas = producto.sizes || [];
            if (bloqueTallas && grupoTallas) {
                grupoTallas.innerHTML = "";
                if (tallas.length === 0) {
                    bloqueTallas.style.display = "none";
                } else {
                    bloqueTallas.style.display = "block";
                    tallas.forEach((talla, index) => {
                        const boton = document.createElement("button");
                        boton.type = "button";
                        boton.className = "btn-talla" + (index === 0 ? " talla-activa" : "");
                        boton.textContent = talla;
                        boton.addEventListener("click", () => {
                            grupoTallas.querySelectorAll(".btn-talla")
                                .forEach(b => b.classList.remove("talla-activa"));
                            boton.classList.add("talla-activa");
                        });
                        grupoTallas.appendChild(boton);
                    });
                }
            }
            // Etiqueta superior.
            const eyebrow = document.querySelector(".product-info .eyebrow");
            if (eyebrow) {
                eyebrow.textContent = producto.previousPrice ? "OFERTA ESPECIAL" : "NUEVO INGRESO";
            }
        }
    } catch (error) {
        console.error("Error cargando el detalle del producto:", error);
    }

    // ==========================================
    // 3. CATÁLOGO DINÁMICO DE PRODUCTOS
    // ==========================================
    const catalogoGrid = document.getElementById("catalogo-grid");
    const productosCatalogo = window.STREETHYPE_PRODUCTS || [];
    if (catalogoGrid) {
        catalogoGrid.innerHTML = productosCatalogo.map(producto => {
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
                        <p class="product-card-category">
                            ${categoria.toUpperCase()}
                        </p>
                        <h3 class="product-card-title">
                            <a href="producto.html?id=${encodeURIComponent(producto.id)}">
                                ${producto.name}
                            </a>
                        </h3>
                        <div class="product-card-footer">
                            <div class="product-card-prices">
                                ${estaEnOferta ? 
                                    `<span class="product-card-old-price">
                                        S/ ${precioAnterior.toFixed(2)}
                                    </span>` : ""}
                                <strong class="${estaEnOferta ? "product-card-sale-price" : ""}">
                                    S/ ${precio.toFixed(2)}
                                </strong>
                            </div>
                            <button class="add-button" type="button" data-product-id="${producto.id}"
                                aria-label="Agregar ${producto.name} al carrito"
                            >+</button>
                        </div>
                    </div>
                </article>`;
        }).join("");
    }

    /* ==========================================
    4. CONEXIÓN DE BOTONES
    ========================================== */
    // Botón principal del detalle del producto
    const btnPrincipal = document.getElementById("producto-boton");
    if (btnPrincipal) {
        btnPrincipal.addEventListener("click", (e) => {
            e.preventDefault();
            if (!productoDetalle) {
                alert("No se pudo cargar el producto.");
                return;
            }
            const grupoTallas = document.getElementById("grupo-tallas");
            const tallaSeleccionada = grupoTallas?.querySelector(".talla-activa");
            if (productoDetalle.sizes?.length > 0 && !tallaSeleccionada) {
                alert("Selecciona una talla antes de continuar.");
                return;
            }
            if (typeof window.iniciarFlujoCompra !== "function") {
                console.error("No se cargó compra.js o falta iniciarFlujoCompra().");
                return;
            }
            window.iniciarFlujoCompra({
                id: productoDetalle.id,
                title: productoDetalle.name,
                category: productoDetalle.category,
                price: Number(productoDetalle.price) || 0,
                previousPrice: Number(productoDetalle.previousPrice) || 0,
                image: window.STREETHYPE_IMAGE(productoDetalle.image),
                sizes: Array.isArray(productoDetalle.sizes) ? productoDetalle.sizes : [],
                size: tallaSeleccionada?.textContent || null
            });
        });
    }
    // ==========================================
    // AGREGAR PRODUCTOS DESDE EL CATÁLOGO
    // ==========================================
    if (catalogoGrid) {
        catalogoGrid.addEventListener("click", (e) => {
            const boton = e.target.closest(".add-button");
            if (!boton) return;
            const producto = productosCatalogo.find(
                item => item.id === boton.dataset.productId);
            if (!producto) {
                console.error("No se encontró el producto:", boton.dataset.productId);
                return;
            }
            if (typeof window.iniciarFlujoCompra !== "function") {
                console.error("No se cargó compra.js o falta iniciarFlujoCompra().");
                return;
            }
            window.iniciarFlujoCompra({
                id: producto.id,
                title: producto.name,
                category: producto.category,
                price: Number(producto.price) || 0,
                previousPrice: Number(producto.previousPrice) || 0,
                badge: producto.badge || "",
                image: window.STREETHYPE_IMAGE(producto.image),
                sizes: Array.isArray(producto.sizes) ? producto.sizes : [],
                size: null
            });
        });
    }

    // ==========================================
    // 5. SUSCRIPCIÓN NEWSLETTER
    // ==========================================
    try {
        const btnSuscripcion = document.querySelector('.newsletter__form button');
        const inputSuscripcion = document.querySelector('.newsletter__form input[type="email"]');
        if (btnSuscripcion && inputSuscripcion) {
            btnSuscripcion.addEventListener('click', (e) => {
                e.preventDefault();
                if (inputSuscripcion.value.trim() !== "" && inputSuscripcion.checkValidity()) {
                    const txtOriginal = btnSuscripcion.textContent;
                    btnSuscripcion.textContent = "¡SUSCRITO ✓!";
                    btnSuscripcion.style.background = "#4CAF50"; 
                    setTimeout(() => {
                        btnSuscripcion.textContent = txtOriginal;
                        btnSuscripcion.style.background = "#000"; 
                        inputSuscripcion.value = ""; 
                    }, 2000);
                } else {
                    alert("Por favor ingresa un correo electrónico válido.");
                }
            });
        }
    } catch (e) { console.warn("Error en newsletter", e); }
});