document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. SISTEMA DE CARRITO Y REDIRECCIÓN
  // ==========================================
  
  function agregarAlCarrito(nombreProducto, precioProducto, talla = 'Única', garantia = 'Ninguna') {
      let carrito = JSON.parse(localStorage.getItem('carritoStore')) || [];
      
      carrito.push({
          producto: nombreProducto,
          precio: parseFloat(precioProducto),
          talla: talla,
          garantia: garantia,
          fecha: new Date().toLocaleDateString()
      });
      
      localStorage.setItem('carritoStore', JSON.stringify(carrito));
      
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
          cartCount.textContent = carrito.length;
      }
      
      mostrarNotificacion(`¡Añadido: ${nombreProducto} (Talla: ${talla})! Redirigiendo al carrito... 🛒`, '#10ac84');
  }

  function mostrarNotificacion(mensaje, color = '#10ac84') {
      const toast = document.createElement('div');
      toast.innerText = mensaje;
      
      Object.assign(toast.style, {
          position: 'fixed', bottom: '30px', right: '30px',
          backgroundColor: color, color: 'white',
          padding: '15px 30px', borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          fontWeight: 'bold', zIndex: '9999',
          opacity: '0', transform: 'translateY(50px)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      });

      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 50);
      setTimeout(() => {
          toast.style.opacity = '0'; toast.style.transform = 'translateY(50px)';
          setTimeout(() => toast.remove(), 400);
      }, 3500);
  }

  const carritoInicial = JSON.parse(localStorage.getItem('carritoStore')) || [];
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
      cartCount.textContent = carritoInicial.length;
  }

  // ==========================================
  // 2. MODAL DE SELECCIÓN DE TALLA Y GARANTÍA + REDIRECCIÓN
  // ==========================================

  const reservaModal = document.getElementById('reserva-modal');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');
  const spanNombre = document.getElementById('modal-producto-nombre');
  const spanPrecioBase = document.getElementById('modal-producto-precio-base');
  const selectTalla = document.getElementById('compra-talla-select');
  const btnSinProt = document.getElementById('btn-sin-proteccion');
  const btnConProt = document.getElementById('btn-con-proteccion');

  let productoSeleccionado = '';
  let precioSeleccionado = 0;

  document.querySelectorAll('.btn-reserva').forEach(btn => {
      btn.addEventListener('click', (e) => {
          e.preventDefault();
          productoSeleccionado = btn.getAttribute('data-producto');
          precioSeleccionado = parseFloat(btn.getAttribute('data-precio'));

          if (spanNombre) spanNombre.textContent = productoSeleccionado;
          if (spanPrecioBase) spanPrecioBase.textContent = precioSeleccionado;
          if (selectTalla) selectTalla.value = "";

          if (reservaModal) reservaModal.classList.add('active');
      });
  });

  if (btnCerrarModal && reservaModal) {
      btnCerrarModal.addEventListener('click', () => {
          reservaModal.classList.remove('active');
      });
  }

  function procesarSeleccion(conGarantia) {
      const talla = selectTalla ? selectTalla.value : '';
      if (!talla) {
          mostrarNotificacion('Por favor, elige una talla antes de continuar', '#ff4757');
          if (selectTalla) selectTalla.focus();
          return;
      }

      const costoGarantia = conGarantia ? 45 : 0;
      const precioFinal = precioSeleccionado + costoGarantia;
      const garantiaTexto = conGarantia ? '1 Año de Reparación' : 'Sin Garantía';

      agregarAlCarrito(productoSeleccionado, precioFinal, talla, garantiaTexto);

      if (reservaModal) reservaModal.classList.remove('active');

      // Redirección automática al carrito para ver el producto seleccionado
      setTimeout(() => {
          window.location.href = 'carrito.html';
      }, 1200);
  }

  if (btnSinProt) {
      btnSinProt.addEventListener('click', (e) => {
          e.preventDefault();
          procesarSeleccion(false);
      });
  }

  if (btnConProt) {
      btnConProt.addEventListener('click', (e) => {
          e.preventDefault();
          procesarSeleccion(true);
      });
  }

  // ==========================================
  // 3. ASISTENTE VIRTUAL BASADO EN REGLAS (ÁRBOL DE DECISIONES)
  // ==========================================

  const chatModal = document.getElementById('chat-modal');
  const btnChat = document.getElementById('btn-chat');
  const btnCerrarChat = document.getElementById('btn-cerrar-chat');
  const chatMessages = document.getElementById('chat-messages');
  const chatOptions = document.getElementById('chat-options');

  // Definición del árbol de decisiones del asistente
  const arbolDecision = {
      inicio: {
          texto: "¡Hola! Bienvenido a STREETHYPE. ¿En qué podemos ayudarte hoy?",
          opciones: [
              { texto: "📦 Consultar envíos y plazos", siguiente: "envios" },
              { texto: "📏 Guía de tallas", siguiente: "tallas" },
              { texto: "🛡️ Información de garantía", siguiente: "garantia" }
          ]
      },
      envios: {
          texto: "Realizamos envíos a todo el país. Los pedidos en preventa o drops tardan de 3 a 5 días hábiles en despacharse.",
          opciones: [
              { texto: "↩️ Volver al menú principal", siguiente: "inicio" },
              { texto: "❌ Cerrar chat", siguiente: "cerrar" }
          ]
      },
      tallas: {
          texto: "Trabajamos con cortes oversize y estándar. Puedes revisar las tallas (S, M, L, XL) directamente al hacer clic en 'Reservar' en cualquier producto.",
          opciones: [
              { texto: "↩️ Volver al menú principal", siguiente: "inicio" },
              { texto: "❌ Cerrar chat", siguiente: "cerrar" }
          ]
      },
      garantia: {
          texto: "Ofrecemos una garantía opcional de 1 año por S/ 45 que incluye diagnóstico gratuito, reparación experta y recambios originales.",
          opciones: [
              { texto: "↩️ Volver al menú principal", siguiente: "inicio" },
              { texto: "❌ Cerrar chat", siguiente: "cerrar" }
          ]
      }
  };

  function mostrarPasoChat(clavePaso) {
      if (!chatMessages || !chatOptions) return;
      chatMessages.innerHTML = '';
      chatOptions.innerHTML = '';

      const paso = arbolDecision[clavePaso];
      if (!paso) return;

      // Burbuja de mensaje del bot
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-bubble bot';
      msgDiv.innerText = paso.texto;
      chatMessages.appendChild(msgDiv);

      // Botones de opciones del árbol de decisiones
      paso.opciones.forEach(op => {
          const btn = document.createElement('button');
          btn.className = 'chat-option-btn';
          btn.innerText = op.texto;
          btn.addEventListener('click', () => {
              if (op.siguiente === 'cerrar') {
                  chatModal.classList.remove('active');
              } else {
                  mostrarPasoChat(op.siguiente);
              }
          });
          chatOptions.appendChild(btn);
      });
  }

  if (btnChat && chatModal) {
      btnChat.addEventListener('click', (e) => {
          e.preventDefault(); 
          chatModal.classList.add('active');
          mostrarPasoChat('inicio'); // Iniciar asistente en el nodo raíz
      });
  }

  if (btnCerrarChat && chatModal) {
      btnCerrarChat.addEventListener('click', () => {
          chatModal.classList.remove('active');
      });
  }

  // Countdown timer
  const countDownDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
  setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      if (document.getElementById("dias")) {
          document.getElementById("dias").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
          document.getElementById("horas").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
          document.getElementById("minutos").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
          document.getElementById("segundos").innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
      }
  }, 1000);

});