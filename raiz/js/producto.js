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
                        const categoriaProducto = producto.getAttribute('data-category');
                        if (categoriaSeleccionada === 'todos' || categoriaProducto === categoriaSeleccionada) {
                            producto.style.display = 'flex';
                        } else {
                            producto.style.display = 'none';
                        }
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
    const DATOS_PRODUCTOS = {
              // ROPA
        "camiseta-magica": { titulo: "Camiseta Mágica", precio: "S/ 89.00", descripcion: "Camiseta de algodón pima, suave y ligera para el verano.", imagen: "../assets/img/camiseta.magica.jpg", categoria: "ropa", tallas: ["S", "M", "L", "XL"] },
        "polo-azul": { titulo: "Polo Azul Urbano", precio: "S/ 99.00", descripcion: "Polo azul con cuello, estilo casual perfecto para salidas.", imagen: "../assets/img/polo.azul.jpg", categoria: "ropa", tallas: ["S", "M", "L", "XL"] },
        "polo-crema": { titulo: "Polo Crema Essential", precio: "S/ 99.00", descripcion: "Polo color crema básico, combina con cualquier estilo.", imagen: "../assets/img/polo.crema.jpg", categoria: "ropa", tallas: ["S", "M", "L", "XL"] },
        "polo-verde-militar": { titulo: "Polo Verde Militar", precio: "S/ 99.00", descripcion: "Polo de algodón grueso en tono verde militar.", imagen: "../assets/img/polo.verde.militar.jpg", categoria: "ropa", tallas: ["S", "M", "L", "XL"] },
        "jogger-mujer": { titulo: "Jogger Beige Mujer", precio: "S/ 129.00", descripcion: "Pantalón jogger cómodo y estilizado de cintura alta.", imagen: "../assets/img/Jogger Para Mujer.jpg", categoria: "ropa", tallas: ["28", "30", "32"] },
        "chaqueta-hype": { titulo: "Chaqueta de Cuero Hype", precio: "S/ 249.00", descripcion: "Chaqueta estilo urbano para climas templados a fríos.", imagen: "../assets/img/chaquetas.jpg", categoria: "ropa", tallas: ["S", "M", "L"] },

        // ZAPATILLAS
        "zapatillas-nike-rojas": { titulo: "Nike Running Rojas", precio: "S/ 389.00", descripcion: "Zapatillas ligeras diseñadas para alto rendimiento.", imagen: "../assets/img/Zapatillas Nike Rojas.jpg", categoria: "zapatillas", tallas: ["39", "40", "41", "42"] },
        "botines-rojos-nike": { titulo: "Botines Air Jordan", precio: "S/ 529.00", descripcion: "Diseño clásico tipo botín para el mejor look urbano.", imagen: "../assets/img/Botines rojos Nike.jpg", categoria: "zapatillas", tallas: ["40", "41", "42", "43"] },
        "adidas-id3711": { titulo: "Adidas Gazelle ID3711", precio: "S/ 349.00", descripcion: "Clásicas zapatillas blancas con las tres tiras negras.", imagen: "../assets/img/Zapatillas adidadas id3711.jpg", categoria: "zapatillas", tallas: ["39", "40", "41", "42"] },
        "adidas-running-azul": { titulo: "Adidas Running Azul", precio: "S/ 299.00", descripcion: "Zapatillas azules deportivas para running diario.", imagen: "../assets/img/Zapatillas Running azul.jpg", categoria: "zapatillas", tallas: ["39", "40", "41", "42"] },

        // ACCESORIOS
        "gorra-blanca": { titulo: "Gorra Básica Blanca", precio: "S/ 49.00", descripcion: "Gorra blanca con diseño de malla transpirable.", imagen: "../assets/img/Gorra Blanca.jpg", categoria: "accesorios", tallas: [] },
        "gorra-crema": { titulo: "Gorra Vintage Crema", precio: "S/ 55.00", descripcion: "Gorra en tono crema deslavado, estilo vintage 90s.", imagen: "../assets/img/gorra crema.jpg", categoria: "accesorios", tallas: [] },
        "gorra-deportiva": { titulo: "Gorra Deportiva Under", precio: "S/ 65.00", descripcion: "Gorra negra de secado rápido ideal para entrenar.", imagen: "../assets/img/Gorra Deportiva.jpg", categoria: "accesorios", tallas: [] },
        "gorra-dunkelvolk": { titulo: "Gorra Dunkelvolk Khaki", precio: "S/ 79.00", descripcion: "Gorra urbana bicolor marca Dunkelvolk original.", imagen: "../assets/img/Gorra para Hombre DUNKELVOLK.jpg", categoria: "accesorios", tallas: [] }
    };

    try {
        const parametrosURL = new URLSearchParams(window.location.search);
        const idProducto = parametrosURL.get('id') || 'zapatillas-nike-rojas';
        const producto = DATOS_PRODUCTOS[idProducto];

        if (producto) {
            const imgEl = document.getElementById('producto-imagen');
            const titEl = document.getElementById('producto-titulo');
            const preEl = document.getElementById('producto-precio');
            const descEl = document.getElementById('producto-descripcion');
            
            if(imgEl) { imgEl.src = producto.imagen; imgEl.alt = producto.titulo; }
            if(titEl) titEl.textContent = producto.titulo;
            if(preEl) preEl.textContent = producto.precio;
            if(descEl) descEl.textContent = producto.descripcion;

            const bloqueTallas = document.getElementById('bloque-tallas');
            const grupoTallas = document.getElementById('grupo-tallas');

            if (bloqueTallas && grupoTallas) {
                if (!producto.tallas || producto.tallas.length === 0) {
                    bloqueTallas.style.display = 'none';
                } else {
                    bloqueTallas.style.display = 'block';
                    grupoTallas.innerHTML = '';
                    producto.tallas.forEach((talla, index) => {
                        const boton = document.createElement('button');
                        boton.type = 'button';
                        boton.className = 'btn-talla' + (index === 0 ? ' talla-activa' : '');
                        boton.textContent = talla;
                        boton.addEventListener('click', () => {
                            grupoTallas.querySelectorAll('.btn-talla').forEach(b => b.classList.remove('talla-activa'));
                            boton.classList.add('talla-activa');
                        });
                        grupoTallas.appendChild(boton);
                    });
                }
            }
        }
    } catch (error) {
        console.warn("Error cargando detalles del producto principal:", error);
    }

    // ==========================================
    // 3. CARRITO Y MODALES (Garantía y Confirmación)
    // ==========================================
    const LÍMITE_COMPRA = 4;
    const STORAGE_KEY = "streethype-cart";
    
    const readCart = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } 
        catch { return []; }
    };

    const updateCartCount = () => {
        const countEl = document.querySelector(".cart-count");
        if (countEl) countEl.textContent = readCart().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    };
    updateCartCount();

    let productoPendiente = null;
    const modalGarantia = document.getElementById('modal-garantia');
    const modalConfirmacion = document.getElementById('modal-confirmacion');

    const iniciarFlujoCompra = (productoData) => {
        productoPendiente = productoData;
        if (modalGarantia) modalGarantia.style.display = 'flex';
    };

    const confirmarAlCarrito = () => {
        if (modalGarantia) modalGarantia.style.display = 'none'; 

        let cart = readCart();
        let item = cart.find(i => i.id === productoPendiente.id);

        if (item) {
            if (item.quantity < LÍMITE_COMPRA) item.quantity += 1;
        } else {
            cart.push({
                id: productoPendiente.id, 
                name: productoPendiente.title, 
                price: productoPendiente.price, 
                quantity: 1, 
                image: productoPendiente.image
            });
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        updateCartCount();

        if (modalConfirmacion) {
            document.getElementById('modal-img').src = productoPendiente.image;
            document.getElementById('modal-title').textContent = productoPendiente.title;
            document.getElementById('modal-price').textContent = productoPendiente.priceText;
            document.getElementById('modal-qty').textContent = readCart().find(i => i.id === productoPendiente.id).quantity;
            
            const limitMsg = document.getElementById('modal-limit-msg');
            if(limitMsg) {
                limitMsg.style.color = "#888";
                limitMsg.style.fontWeight = "normal";
            }
            modalConfirmacion.style.display = 'flex';
        }
    };

    // Funciones de cierre de modales
    document.getElementById('cerrar-garantia')?.addEventListener('click', () => modalGarantia.style.display = 'none');
    document.getElementById('cerrar-confirmacion')?.addEventListener('click', () => modalConfirmacion.style.display = 'none');
    document.getElementById('btn-seguir-comprando')?.addEventListener('click', () => modalConfirmacion.style.display = 'none');

    // Botones de continuar compra
    document.getElementById('btn-sin-proteccion')?.addEventListener('click', confirmarAlCarrito);
    document.getElementById('btn-con-proteccion')?.addEventListener('click', confirmarAlCarrito);

    // Sumar y restar en el modal
    document.getElementById('modal-plus')?.addEventListener('click', () => {
        let cart = readCart();
        let item = cart.find(i => i.id === productoPendiente.id);
        const limitMsg = document.getElementById('modal-limit-msg');
        
        if (item && item.quantity < LÍMITE_COMPRA) {
            item.quantity += 1;
            document.getElementById('modal-qty').textContent = item.quantity;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            updateCartCount();
            if(limitMsg) { limitMsg.style.color = "#888"; limitMsg.style.fontWeight = "normal"; }
        } else {
            if(limitMsg) { limitMsg.style.color = "red"; limitMsg.style.fontWeight = "bold"; }
        }
    });

    document.getElementById('modal-minus')?.addEventListener('click', () => {
        let cart = readCart();
        let item = cart.find(i => i.id === productoPendiente.id);
        const limitMsg = document.getElementById('modal-limit-msg');
        
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            document.getElementById('modal-qty').textContent = item.quantity;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            updateCartCount();
            if(limitMsg) { limitMsg.style.color = "#888"; limitMsg.style.fontWeight = "normal"; }
        }
    });

    // ==========================================
    // 4. CONEXIÓN DE BOTONES ("Añadir" y "+")
    // ==========================================
    try {
        const btnPrincipal = document.getElementById("producto-boton") || document.querySelector(".add-button"); 
        if (btnPrincipal) {
            btnPrincipal.addEventListener("click", (e) => {
                e.preventDefault();
                const titleElement = document.getElementById("producto-titulo") || document.querySelector(".product-title");
                const priceElement = document.getElementById("producto-precio") || document.querySelector(".product-price");
                const imageElement = document.getElementById("producto-imagen") || document.querySelector(".product-image-main");

                const title = titleElement ? titleElement.textContent.trim() : "Producto Principal";
                const priceText = priceElement ? priceElement.textContent : "S/ 0.00";
                const price = Number(priceText.replace(/[^\d.]/g, "")) || 0;
                
                let productId = new URLSearchParams(window.location.search).get("id");
                if (!productId) productId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                
                const image = imageElement ? imageElement.src : "";
                iniciarFlujoCompra({ id: productId, title: title, priceText: priceText, price: price, image: image });
            });
        }
    } catch (e) { console.warn("Error en el botón principal", e); }

    try {
        const botonesAddCatalogo = document.querySelectorAll('.btn-circle');
        botonesAddCatalogo.forEach(boton => {
            boton.addEventListener('click', (e) => {
                e.preventDefault(); 
                const card = boton.closest('.product-card');
                const title = card.querySelector('.product-card-title').textContent.trim();
                const priceText = card.querySelector('strong').textContent;
                const price = Number(priceText.replace(/[^\d.]/g, "")) || 0;
                const image = card.querySelector('img').src;
                const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                
                iniciarFlujoCompra({ id: id, title: title, priceText: priceText, price: price, image: image });
            });
        });
    } catch (e) { console.warn("Error en botones del catálogo", e); }

    // ==========================================
    // 5. SUSCRIPCIÓN NEWSLETTER
    // ==========================================
    try {
        const btnSuscripcion = document.querySelector('section form button');
        const inputSuscripcion = document.querySelector('section form input[type="email"]');
        if (btnSuscripcion && inputSuscripcion) {
            btnSuscripcion.addEventListener('click', (e) => {
                e.preventDefault();
                if(inputSuscripcion.value.trim() !== "") {
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