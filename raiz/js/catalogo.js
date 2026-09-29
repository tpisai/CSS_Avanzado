// =====================================================
// CATÁLOGO - STREETHYPE
// =====================================================

// -----------------------------------------------------
// DATOS DE PRODUCTOS
// -----------------------------------------------------

const productosData = [
    {
        id: 1,
        nombre: "Zapatilla Street Runner",
        categoria: "zapatillas",
        descripcion: "Suela chunky / Off White",
        precio: 389,
        badge: "NEW",
        imagen: "../assets/img/Zapatillas Running azul.JPG"
    },

    {
        id: 2,
        nombre: "Polera Oversize Heavyweight",
        categoria: "ropa",
        descripcion: "Heavy cotton / Sand",
        precio: 199,
        badge: "NEW",
        imagen: "../assets/img/polo.crema.jpg"
    },

    {
        id: 3,
        nombre: "Cadena Urban Silver",
        categoria: "accesorios",
        descripcion: "Stainless Steel / Silver",
        precio: 79,
        badge: "NEW",
        imagen: "../assets/img/Gorra Deportiva.jpg"
    },

    {
        id: 4,
        nombre: "Casaca Varsity Black",
        categoria: "sale",
        descripcion: "Overfit / Black",
        precio: 249,
        precioAnterior: 329,
        badge: "SALE",
        imagen: "../assets/img/chaquetas.jpg"
    }
];


// -----------------------------------------------------
// ESTADO DEL CATÁLOGO
// -----------------------------------------------------

let categoriaActual = "todos";
let busquedaActual = "";
let ordenActual = "recientes";


// -----------------------------------------------------
// ELEMENTOS DEL DOM
// -----------------------------------------------------

const grid = document.getElementById("productos-grid");
const buscador = document.getElementById("buscador");
const ordenar = document.getElementById("ordenar");
const cantidadProductos = document.getElementById("cantidad-productos");
const mensajeVacio = document.getElementById("sin-resultados");
const botonesFiltro = document.querySelectorAll(".catalogo__filter");
const limpiarFiltros = document.getElementById("limpiar-filtros");


// -----------------------------------------------------
// FORMATEAR PRECIO
// -----------------------------------------------------

function formatearPrecio(precio) {
    return `S/ ${precio.toFixed(2)}`;
}


// -----------------------------------------------------
// OBTENER PRODUCTOS FILTRADOS
// -----------------------------------------------------

function obtenerProductosFiltrados() {

    let productos = [...productosData];

    // Filtrar por categoría
    if (categoriaActual !== "todos") {
        productos = productos.filter(
            producto => producto.categoria === categoriaActual
        );
    }

    // Filtrar por búsqueda
    if (busquedaActual.trim() !== "") {

        const texto = busquedaActual
            .toLowerCase()
            .trim();

        productos = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(texto) ||
            producto.descripcion.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto)
        );
    }

    // Ordenar
    switch (ordenActual) {

        case "nombre-asc":
            productos.sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            );
            break;

        case "nombre-desc":
            productos.sort((a, b) =>
                b.nombre.localeCompare(a.nombre)
            );
            break;

        case "precio-asc":
            productos.sort((a, b) =>
                a.precio - b.precio
            );
            break;

        case "precio-desc":
            productos.sort((a, b) =>
                b.precio - a.precio
            );
            break;

        case "recientes":
        default:
            productos.sort((a, b) =>
                b.id - a.id
            );
            break;
    }

    return productos;
}


// -----------------------------------------------------
// RENDERIZAR PRODUCTOS
// -----------------------------------------------------

function renderizarProductos() {

    if (!grid) return;

    const productos = obtenerProductosFiltrados();

    grid.innerHTML = "";

    // Actualizar contador
    if (cantidadProductos) {
        cantidadProductos.textContent = productos.length;
    }

    // Mostrar / ocultar mensaje
    if (productos.length === 0) {

        if (mensajeVacio) {
            mensajeVacio.hidden = false;
        }

        return;
    }

    if (mensajeVacio) {
        mensajeVacio.hidden = true;
    }


    // Crear tarjetas
    productos.forEach(producto => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-card__image">

                ${producto.badge
                    ? `<span class="product-card__badge">
                        ${producto.badge}
                       </span>`
                    : ""
                }

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    loading="lazy"
                >

                <button
                    type="button"
                    class="product-card__favorite"
                    data-favorito="${producto.id}"
                    aria-label="Añadir ${producto.nombre} a favoritos"
                >
                    <i class="fa-regular fa-heart"></i>
                </button>

            </div>


            <div class="product-card__info">

                <span class="product-card__category">
                    ${producto.categoria}
                </span>

                <h3 class="product-card__name">
                    ${producto.nombre}
                </h3>

                <div class="product-card__price">

                    ${formatearPrecio(producto.precio)}

                    ${
                        producto.precioAnterior
                        ? `
                            <span class="product-card__old-price">
                                ${formatearPrecio(producto.precioAnterior)}
                            </span>
                          `
                        : ""
                    }

                </div>


                <div class="product-card__actions">

                    <button
                        type="button"
                        class="product-card__button product-card__button--detail"
                        data-detalle="${producto.id}"
                    >
                        Ver producto
                    </button>

                    <button
                        type="button"
                        class="product-card__button product-card__button--cart"
                        data-carrito="${producto.id}"
                    >
                        Agregar
                    </button>

                </div>

            </div>
        `;

        grid.appendChild(card);
    });


    actualizarFavoritos();
}


// -----------------------------------------------------
// FILTROS POR CATEGORÍA
// -----------------------------------------------------

botonesFiltro.forEach(boton => {

    boton.addEventListener("click", () => {

        categoriaActual =
            boton.dataset.categoria;

        botonesFiltro.forEach(btn => {
            btn.classList.remove(
                "catalogo__filter--active"
            );
        });

        boton.classList.add(
            "catalogo__filter--active"
        );

        renderizarProductos();
    });
});


// -----------------------------------------------------
// BUSCADOR
// -----------------------------------------------------

if (buscador) {

    buscador.addEventListener("input", event => {

        busquedaActual =
            event.target.value;

        renderizarProductos();
    });
}


// -----------------------------------------------------
// ORDENAMIENTO
// -----------------------------------------------------

if (ordenar) {

    ordenar.addEventListener("change", event => {

        ordenActual =
            event.target.value;

        renderizarProductos();
    });
}


// -----------------------------------------------------
// LIMPIAR FILTROS
// -----------------------------------------------------

if (limpiarFiltros) {

    limpiarFiltros.addEventListener("click", () => {

        categoriaActual = "todos";
        busquedaActual = "";
        ordenActual = "recientes";

        if (buscador) {
            buscador.value = "";
        }

        if (ordenar) {
            ordenar.value = "recientes";
        }

        botonesFiltro.forEach(btn => {

            btn.classList.remove(
                "catalogo__filter--active"
            );

            if (
                btn.dataset.categoria === "todos"
            ) {
                btn.classList.add(
                    "catalogo__filter--active"
                );
            }
        });

        renderizarProductos();
    });
}


// -----------------------------------------------------
// EVENTOS DE LAS TARJETAS
// -----------------------------------------------------

if (grid) {

    grid.addEventListener("click", event => {

        // -------------------------------
        // FAVORITOS
        // -------------------------------

        const botonFavorito =
            event.target.closest(
                ".product-card__favorite"
            );

        if (botonFavorito) {

            const id =
                Number(
                    botonFavorito.dataset.favorito
                );

            alternarFavorito(id);

            return;
        }


        // -------------------------------
        // VER PRODUCTO
        // -------------------------------

        const botonDetalle = event.target.closest("[data-detalle]");

        if (botonDetalle) {
            const id = botonDetalle.dataset.detalle;

            window.location.href = `producto.html?id=${encodeURIComponent(id)}`;

            return;
        }


        // -------------------------------
        // AGREGAR AL CARRITO
        // -------------------------------

        const botonCarrito =
            event.target.closest(
                "[data-carrito]"
            );

        if (botonCarrito) {

            const id =
                Number(
                    botonCarrito.dataset.carrito
                );

            agregarAlCarrito(id);
        }
    });
}


// -----------------------------------------------------
// FAVORITOS
// -----------------------------------------------------

function obtenerFavoritos() {

    return JSON.parse(
        localStorage.getItem("streethype-favoritos")
    ) || [];
}


function alternarFavorito(id) {

    let favoritos =
        obtenerFavoritos();

    if (favoritos.includes(id)) {

        favoritos =
            favoritos.filter(
                favorito => favorito !== id
            );

    } else {

        favoritos.push(id);
    }

    localStorage.setItem(
        "streethype-favoritos",
        JSON.stringify(favoritos)
    );

    actualizarFavoritos();
}


function actualizarFavoritos() {

    const favoritos =
        obtenerFavoritos();

    document
        .querySelectorAll(
            ".product-card__favorite"
        )
        .forEach(boton => {

            const id =
                Number(
                    boton.dataset.favorito
                );

            if (favoritos.includes(id)) {

                boton.classList.add("active");

                boton.innerHTML =
                    `<i class="fa-solid fa-heart"></i>`;

            } else {

                boton.classList.remove("active");

                boton.innerHTML =
                    `<i class="fa-regular fa-heart"></i>`;
            }
        });
}


// -----------------------------------------------------
// CARRITO
// -----------------------------------------------------

function agregarAlCarrito(id) {

    const producto =
        productosData.find(
            producto => producto.id === id
        );

    if (!producto) return;

    let carrito =
        JSON.parse(
            localStorage.getItem("carrito")
        ) || [];

    const productoExistente =
        carrito.find(
            item => item.id === producto.id
        );

    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    alert(
        `${producto.nombre} fue agregado al carrito.`
    );
}


// -----------------------------------------------------
// INICIALIZAR
// -----------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {
        renderizarProductos();
    }
);