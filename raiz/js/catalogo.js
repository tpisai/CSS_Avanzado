
document.addEventListener("DOMContentLoaded", () => {
    const productos = window.STREETHYPE_PRODUCTS || [];

    const grid = document.getElementById("productos-grid");
    const buscador = document.getElementById("buscador");
    const ordenar = document.getElementById("ordenar");
    const cantidadProductos = document.getElementById("cantidad-productos");
    const mensajeVacio = document.getElementById("sin-resultados");
    const botonesFiltro = document.querySelectorAll(".catalogo__filter");
    const limpiarFiltros = document.getElementById("limpiar-filtros");

    const FAVORITES_KEY = "streethype-favoritos";

    let categoriaActual = "todos";
    let busquedaActual = "";
    let ordenActual = "recientes";

    if (!grid) return;

    function leerFavoritos() {
        try {
            const favoritos = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
            return Array.isArray(favoritos) ? favoritos : [];
        } catch {
            return [];
        }
    }

    function guardarFavoritos(favoritos) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
    }

    function alternarFavorito(id) {
        let favoritos = leerFavoritos();

        favoritos = favoritos.includes(id)
            ? favoritos.filter(favorito => favorito !== id)
            : [...favoritos, id];

        guardarFavoritos(favoritos);
        actualizarFavoritos();
    }

    function actualizarFavoritos() {
        const favoritos = leerFavoritos();

        grid.querySelectorAll("[data-favorito]").forEach(boton => {
            const activo = favoritos.includes(boton.dataset.favorito);

            boton.classList.toggle("active", activo);
            boton.setAttribute(
                "aria-label",
                activo ? "Quitar de favoritos" : "Añadir a favoritos"
            );

            boton.innerHTML = activo
                ? '<i class="fa-solid fa-heart"></i>'
                : '<i class="fa-regular fa-heart"></i>';
        });
    }

    function formatearPrecio(precio) {
        return `S/ ${Number(precio).toFixed(2)}`;
    }

    function obtenerProductosFiltrados() {
        let resultado = [...productos];

        if (categoriaActual !== "todos") {
            resultado = resultado.filter(
                producto => producto.category === categoriaActual
            );
        }

        const texto = busquedaActual.trim().toLowerCase();

        if (texto) {
            resultado = resultado.filter(producto =>
                `${producto.name} ${producto.description || ""} ${producto.category}`
                    .toLowerCase()
                    .includes(texto)
            );
        }

        switch (ordenActual) {
            case "nombre-asc":
                resultado.sort((a, b) => a.name.localeCompare(b.name));
                break;

            case "nombre-desc":
                resultado.sort((a, b) => b.name.localeCompare(a.name));
                break;

            case "precio-asc":
                resultado.sort((a, b) => a.price - b.price);
                break;

            case "precio-desc":
                resultado.sort((a, b) => b.price - a.price);
                break;

            case "recientes":
            default:
                resultado.sort(
                    (a, b) => productos.indexOf(b) - productos.indexOf(a)
                );
                break;
        }

        return resultado;
    }

    function crearTarjeta(producto) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "product-card";
        tarjeta.dataset.category = producto.category;

        const id = String(producto.id);
        const imagen = window.STREETHYPE_IMAGE
            ? window.STREETHYPE_IMAGE(producto.image)
            : producto.image;

        const enlaceDetalle = `producto.html?id=${encodeURIComponent(id)}`;

        tarjeta.innerHTML = `
            <div class="product-card__image">
                ${producto.badge
                    ? `<span class="product-card__badge">${producto.badge}</span>`
                    : ""}

                <a href="${enlaceDetalle}"
                   aria-label="Ver ${producto.name}">
                    <img src="${imagen}"
                         alt="${producto.name}"
                         loading="lazy">
                </a>

                <button type="button"
                        class="product-card__favorite"
                        data-favorito="${id}"
                        aria-label="Añadir a favoritos">
                    <i class="fa-regular fa-heart"></i>
                </button>
            </div>

            <div class="product-card__info">
                <span class="product-card__category">
                    ${producto.category}
                </span>

                <h3 class="product-card-title">
                    <a href="${enlaceDetalle}">${producto.name}</a>
                </h3>

                <div class="product-card__price">
                    <strong>${formatearPrecio(producto.price)}</strong>
                    ${producto.previousPrice
                        ? `<span class="product-card__old-price">
                            ${formatearPrecio(producto.previousPrice)}
                           </span>`
                        : ""}
                </div>

                <div class="product-card__actions">
                    <button type="button"
                            class="add-button"
                            data-product-id="${id}"
                            aria-label="Añadir ${producto.name} al carrito"
                            title="Añadir al carrito">+</button>
                </div>
            </div>
        `;

        return tarjeta;
    }

    function renderizarProductos() {
        const resultado = obtenerProductosFiltrados();

        grid.replaceChildren();

        resultado.forEach(producto => {
            grid.appendChild(crearTarjeta(producto));
        });

        if (cantidadProductos) {
            cantidadProductos.textContent = resultado.length;
        }

        if (mensajeVacio) {
            mensajeVacio.hidden = resultado.length > 0;
        }

        actualizarFavoritos();
    }

    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            categoriaActual = boton.dataset.categoria || "todos";

            botonesFiltro.forEach(filtro => {
                const activo = filtro === boton;
                filtro.classList.toggle("catalogo__filter--active", activo);
                filtro.setAttribute("aria-pressed", String(activo));
            });

            renderizarProductos();
        });
    });

    buscador?.addEventListener("input", evento => {
        busquedaActual = evento.target.value;
        renderizarProductos();
    });

    ordenar?.addEventListener("change", evento => {
        ordenActual = evento.target.value;
        renderizarProductos();
    });

    limpiarFiltros?.addEventListener("click", () => {
        categoriaActual = "todos";
        busquedaActual = "";
        ordenActual = "recientes";

        if (buscador) buscador.value = "";
        if (ordenar) ordenar.value = "recientes";

        botonesFiltro.forEach(boton => {
            const activo = boton.dataset.categoria === "todos";
            boton.classList.toggle("catalogo__filter--active", activo);
            boton.setAttribute("aria-pressed", String(activo));
        });

        renderizarProductos();
    });

    // Filtro inicial desde enlaces como catalogo.html?categoria=ropa
    const categoriaURL = new URLSearchParams(window.location.search)
        .get("categoria");

    const filtroInicial = [...botonesFiltro].find(
        boton => boton.dataset.categoria === categoriaURL
    );

    if (filtroInicial) {
        categoriaActual = categoriaURL;

        botonesFiltro.forEach(boton => {
            const activo = boton === filtroInicial;
            boton.classList.toggle("catalogo__filter--active", activo);
            boton.setAttribute("aria-pressed", String(activo));
        });
    } else {
        botonesFiltro.forEach(boton => {
            boton.setAttribute(
                "aria-pressed",
                String(boton.dataset.categoria === "todos")
            );
        });
    }

    // Favoritos: el botón + no se procesa aquí.      
    grid.addEventListener("click", (evento) => {
        // Favoritos
        const botonFavorito = evento.target.closest("[data-favorito]");
        if (botonFavorito) {
            alternarFavorito(botonFavorito.dataset.favorito);
            return;
        }
        // Añadir al carrito
        const botonAgregar = evento.target.closest(".add-button");
        if (!botonAgregar) return;
        const producto = productos.find(
            (item) => String(item.id) === botonAgregar.dataset.productId);
        if (!producto) {
            console.error("No se encontró el producto:", botonAgregar.dataset.productId);
            return;
        }
        if (typeof window.iniciarFlujoCompra !== "function") {
            console.error("No está disponible iniciarFlujoCompra(). Revisa compra.js.");
            alert("No se pudo iniciar la compra. Recarga la página.");
            return;
        }
        const imagen = window.STREETHYPE_IMAGE ? window.STREETHYPE_IMAGE(producto.image)
            : producto.image;
        window.iniciarFlujoCompra({
            id: producto.id,
            title: producto.name,
            category: producto.category,
            price: Number(producto.price) || 0,
            previousPrice: Number(producto.previousPrice) || 0,
            badge: producto.badge || "",
            image: imagen,
            sizes: Array.isArray(producto.sizes) ? producto.sizes : [],
            size: null
        });
    });
    renderizarProductos();
});
