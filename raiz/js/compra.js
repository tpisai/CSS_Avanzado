
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const STORAGE_KEY = "streethype-cart";
    const LIMITE_COMPRA = 4;
    const PRECIO_GARANTIA = 45;

    const modalGarantia = document.getElementById("modal-garantia");
    const modalConfirmacion = document.getElementById("modal-confirmacion");

    if (!modalGarantia || !modalConfirmacion) return;

    let productoPendiente = null;
    let productoCarritoActual = null;

    const obtener = (id) => document.getElementById(id);

    // --------------------------------------------------
    // CARRITO
    // --------------------------------------------------

    function leerCarrito() {
        try {
            const carrito = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(carrito) ? carrito : [];
        } catch (error) {
            console.error("Error al leer el carrito:", error);
            return [];
        }
    }

    function actualizarContadorCarrito() {
        const cantidad = leerCarrito().reduce(
            (total, item) => total + (Number(item.quantity) || 0),
            0
        );

        document.querySelectorAll(".cart-count").forEach((contador) => {
            contador.textContent = cantidad;
        });
    }

    function guardarCarrito(carrito) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
            actualizarContadorCarrito();

            document.dispatchEvent(
                new CustomEvent("streethype:cart-updated")
            );

            return true;
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
            alert("No se pudo actualizar el carrito.");
            return false;
        }
    }

    function contarUnidadesProducto(carrito, id) {
        return carrito
            .filter((item) => String(item.id) === String(id))
            .reduce(
                (total, item) => total + (Number(item.quantity) || 0),
                0
            );
    }

    // Una talla y una garantía distintas representan variantes distintas.
    function buscarVariante(carrito, producto) {
        return carrito.find((item) =>
            String(item.id) === String(producto.id) &&
            String(item.size || "") === String(producto.size || "") &&
            (Number(item.warrantyPrice) || 0) ===
                (Number(producto.warrantyPrice) || 0)
        );
    }

    // --------------------------------------------------
    // TALLAS
    // --------------------------------------------------

    function obtenerTallas(producto) {
        if (!Array.isArray(producto.sizes)) return [];

        return producto.sizes
            .map((talla) => String(talla).trim())
            .filter(Boolean);
    }

    function prepararSelectorTallas() {
        let bloque = obtener("compra-tallas");

        if (!bloque) {
            bloque = document.createElement("div");
            bloque.id = "compra-tallas";
            bloque.className = "compra-tallas";

            const cuerpo = modalGarantia.querySelector(
                ".modal-body-garantia"
            );

            if (cuerpo) {
                cuerpo.prepend(bloque);
            }
        }

        return bloque;
    }

    function mostrarSelectorTallas(producto) {
        const bloque = prepararSelectorTallas();
        const tallas = obtenerTallas(producto);

        bloque.replaceChildren();
        bloque.hidden = tallas.length === 0;

        if (tallas.length === 0) {
            productoPendiente.size = null;
            return true;
        }

        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = "compra-talla-select";
        etiqueta.textContent = "Selecciona tu talla:";

        const selector = document.createElement("select");
        selector.id = "compra-talla-select";
        selector.required = true;

        const opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = "Elige una talla";
        selector.appendChild(opcionInicial);

        tallas.forEach((talla) => {
            const opcion = document.createElement("option");
            opcion.value = talla;
            opcion.textContent = talla;

            if (String(producto.size || "") === talla) {
                opcion.selected = true;
            }

            selector.appendChild(opcion);
        });

        selector.addEventListener("change", () => {
            productoPendiente.size = selector.value || null;
        });

        bloque.append(etiqueta, selector);

        if (producto.size && tallas.includes(String(producto.size))) {
            selector.value = String(producto.size);
            productoPendiente.size = selector.value;
        } else {
            productoPendiente.size = null;
        }

        return true;
    }

    function validarTalla() {
        const selector = obtener("compra-talla-select");

        if (!selector) return true;

        if (!selector.value) {
            alert("Selecciona una talla para continuar.");
            selector.focus();
            return false;
        }

        productoPendiente.size = selector.value;
        return true;
    }

    // --------------------------------------------------
    // MODAL DE GARANTÍA
    // --------------------------------------------------

    function seleccionarProteccionInicial() {
        const opcion = document.querySelector(
            'input[name="warranty"][value="0"]'
        );

        if (opcion) opcion.checked = true;

        mostrarMensajeLimite(false);
    }

    function obtenerProteccion() {
        const seleccion = document.querySelector(
            'input[name="warranty"]:checked'
        );

        const precio = Number(seleccion?.value) || 0;

        return {
            warrantyPrice: precio,
            warranty: precio > 0
        };
    }

    function mostrarMensajeLimite(superado) {
        const mensaje = obtener("modal-limit-msg");

        if (!mensaje) return;

        mensaje.style.color = superado ? "#e53935" : "#888";
        mensaje.style.fontWeight = superado ? "bold" : "normal";
        mensaje.textContent = superado
            ? "Máximo de 4 unidades alcanzado"
            : "Máx. 4 uds.";
    }

    function iniciarFlujoCompra(datos) {
        if (!datos || datos.id == null) {
            console.error("Los datos del producto no son válidos.");
            return;
        }

        productoPendiente = {
            id: String(datos.id),
            title: datos.title || datos.name || "Producto",
            category: datos.category || "Sin categoría",
            price: Number(datos.price) || 0,
            previousPrice: Number(datos.previousPrice) || 0,
            badge: datos.badge || "",
            image: datos.image || "",
            sizes: Array.isArray(datos.sizes) ? datos.sizes : [],
            size: datos.size == null || datos.size === ""
                ? null
                : String(datos.size)
        };

        mostrarSelectorTallas(productoPendiente);
        seleccionarProteccionInicial();

        modalConfirmacion.style.display = "none";
        modalGarantia.style.display = "flex";
    }

    // Función compartida por catálogo y detalle de producto.
    window.iniciarFlujoCompra = iniciarFlujoCompra;

    // --------------------------------------------------
    // CONFIRMAR COMPRA
    // --------------------------------------------------

    function confirmarAlCarrito() {
        if (!productoPendiente || !validarTalla()) return;

        const { warrantyPrice, warranty } = obtenerProteccion();
        const carrito = leerCarrito();

        const cantidadTotal = contarUnidadesProducto(
            carrito,
            productoPendiente.id
        );

        if (cantidadTotal >= LIMITE_COMPRA) {
            mostrarMensajeLimite(true);
            alert("Has alcanzado el máximo de 4 unidades de este producto.");
            return;
        }

        const existente = buscarVariante(carrito, {
            ...productoPendiente,
            warrantyPrice
        });

        if (existente) {
            existente.quantity = (Number(existente.quantity) || 0) + 1;
            existente.name = productoPendiente.title;
            existente.category = productoPendiente.category;
            existente.image = productoPendiente.image;
            existente.previousPrice = productoPendiente.previousPrice;
            existente.badge = productoPendiente.badge;
            existente.size = productoPendiente.size;
            existente.basePrice = productoPendiente.price;
            existente.price = productoPendiente.price + warrantyPrice;
            existente.warranty = warranty;
        } else {
            carrito.push({
                id: productoPendiente.id,
                name: productoPendiente.title,
                category: productoPendiente.category,
                price: productoPendiente.price + warrantyPrice,
                basePrice: productoPendiente.price,
                previousPrice: productoPendiente.previousPrice,
                badge: productoPendiente.badge,
                warrantyPrice,
                warranty,
                quantity: 1,
                image: productoPendiente.image,
                size: productoPendiente.size
            });
        }

        const itemActual = buscarVariante(carrito, {
            ...productoPendiente,
            warrantyPrice
        });

        if (!guardarCarrito(carrito)) return;

        productoCarritoActual = {
            id: productoPendiente.id,
            size: productoPendiente.size,
            warrantyPrice
        };

        modalGarantia.style.display = "none";

        const modalImagen = obtener("modal-img");
        const modalTitulo = obtener("modal-title");

        if (modalImagen) {
            modalImagen.src = productoPendiente.image || "";
            modalImagen.alt = productoPendiente.title;
        }

        if (modalTitulo) {
            const talla = productoPendiente.size
                ? ` · Talla ${productoPendiente.size}`
                : "";

            modalTitulo.textContent =
                `${productoPendiente.title}${talla}`;
        }

        actualizarModalCantidad(itemActual);
        mostrarMensajeLimite(false);
        modalConfirmacion.style.display = "flex";
    }

    // --------------------------------------------------
    // CANTIDAD EN MODAL DE CONFIRMACIÓN
    // --------------------------------------------------

    function actualizarModalCantidad(item) {
        if (!item) return;

        const cantidad = Number(item.quantity) || 1;
        const precio = Number(item.price) || 0;

        const modalCantidad = obtener("modal-qty");
        const modalPrecio = obtener("modal-price");

        if (modalCantidad) modalCantidad.textContent = cantidad;

        if (modalPrecio) {
            modalPrecio.textContent =
                `S/ ${(precio * cantidad).toFixed(2)}`;
        }
    }

    function modificarCantidad(cambio) {
        if (!productoCarritoActual) return;

        const carrito = leerCarrito();

        const item = buscarVariante(carrito, {
            ...productoCarritoActual
        });

        if (!item) return;

        const cantidadTotal = contarUnidadesProducto(
            carrito,
            productoCarritoActual.id
        );

        if (cambio > 0 && cantidadTotal >= LIMITE_COMPRA) {
            mostrarMensajeLimite(true);
            return;
        }

        if (cambio < 0 && Number(item.quantity) <= 1) return;

        item.quantity = (Number(item.quantity) || 0) + cambio;

        if (!guardarCarrito(carrito)) return;

        actualizarModalCantidad(item);
        mostrarMensajeLimite(false);
    }

    // --------------------------------------------------
    // EVENTOS DE LOS MODALES
    // --------------------------------------------------

    obtener("cerrar-garantia")?.addEventListener("click", () => {
        modalGarantia.style.display = "none";
    });

    obtener("cerrar-confirmacion")?.addEventListener("click", () => {
        modalConfirmacion.style.display = "none";
    });

    obtener("btn-seguir-comprando")?.addEventListener("click", () => {
        modalConfirmacion.style.display = "none";
    });

    [modalGarantia, modalConfirmacion].forEach((modal) => {
        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) {
                modal.style.display = "none";
            }
        });
    });

    obtener("btn-sin-proteccion")?.addEventListener("click", () => {
        const opcion = document.querySelector(
            'input[name="warranty"][value="0"]'
        );

        if (opcion) opcion.checked = true;

        confirmarAlCarrito();
    });

    obtener("btn-con-proteccion")?.addEventListener("click", () => {
        const opcion = document.querySelector(
            `input[name="warranty"][value="${PRECIO_GARANTIA}"]`
        );

        if (opcion) opcion.checked = true;

        confirmarAlCarrito();
    });

    obtener("modal-plus")?.addEventListener("click", () => {
        modificarCantidad(1);
    });

    obtener("modal-minus")?.addEventListener("click", () => {
        modificarCantidad(-1);
    });

    actualizarContadorCarrito();
});
