document.addEventListener('DOMContentLoaded', () => {
    
  // ==========================================
  // 1. SISTEMA DE CARRITO Y NOTIFICACIONES
  // ==========================================
  
  // Función para guardar en el carrito (Local Storage)
  function agregarAlCarrito(nombreProducto, precioProducto) {
      // Obtenemos el carrito actual o creamos uno nuevo vacío
      let carrito = JSON.parse(localStorage.getItem('carritoStore')) || [];
      
      // Añadimos el nuevo producto
      carrito.push({
          producto: nombreProducto,
          precio: parseFloat(precioProducto),
          fecha: new Date().toLocaleDateString()
      });
      
      // Guardamos de nuevo en el navegador
      localStorage.setItem('carritoStore', JSON.stringify(carrito));
      
      // Mostramos la notificación visual
      mostrarNotificacion(`¡Añadido al carrito: ${nombreProducto}! 🛒`);
  }

  // Notificación flotante animada
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

  // ==========================================
  // 2. LÓGICA DE LAS SECCIONES LESS Y SASS
  // ==========================================

  // Botones de la sección LESS (Catálogo de Novedades)
  document.querySelectorAll('.btn-novedad').forEach(boton => {
      boton.addEventListener('click', function() {
          const producto = this.getAttribute('data-producto');
          const precio = this.getAttribute('data-precio');
          const textoOriginal = this.innerText;
          
          this.innerText = '¡Añadido! ✓';
          this.style.backgroundColor = '#2ed573'; 
          
          agregarAlCarrito(producto, precio);

          setTimeout(() => {
              this.innerText = textoOriginal;
              this.style.backgroundColor = ''; 
          }, 2000);
      });
  });

  // Tarjetas de la sección SASS (Drops Exclusivos)
  document.querySelectorAll('.producto-nuevo').forEach(producto => {
      producto.addEventListener('click', function() {
          const nombre = this.getAttribute('data-producto');
          const precio = this.getAttribute('data-precio');
          
          this.style.transform = 'scale(0.95)';
          setTimeout(() => { this.style.transform = ''; }, 150);
          
          agregarAlCarrito(nombre, precio);
      });
  });

  // ==========================================
  // 3. LÓGICA DE TU HTML ORIGINAL (MODALES Y TIMER)
  // ==========================================

  // Lógica de Modales de Reserva (Próximas Entregas)
  const reservaModal = document.getElementById('reserva-modal');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');
  const formReserva = document.getElementById('form-reserva');
  const modalProductoNombre = document.getElementById('modal-producto-nombre');
  const modalProductoPrecio = document.getElementById('modal-producto-precio'); // Input oculto
  
  document.querySelectorAll('.btn-reserva').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const producto = e.target.getAttribute('data-producto');
      const precio = e.target.getAttribute('data-precio');
      
      if(modalProductoNombre) modalProductoNombre.textContent = producto;
      if(modalProductoPrecio) modalProductoPrecio.value = precio; // Guardamos el precio en el modal
      if(reservaModal) reservaModal.classList.add('active');
    });
  });

  // Cuando el usuario confirma el formulario en el modal
  if(formReserva) {
      formReserva.addEventListener('submit', (e) => {
          e.preventDefault(); // Evita que la página recargue
          
          const producto = modalProductoNombre.textContent;
          const precio = modalProductoPrecio.value;
          
          // Cerramos el modal
          reservaModal.classList.remove('active');
          
          // Enviamos el pedido al carrito
          agregarAlCarrito(producto, precio);
          
          // Limpiamos el formulario
          formReserva.reset();
      });
  }

  if(btnCerrarModal && reservaModal) {
      btnCerrarModal.addEventListener('click', () => reservaModal.classList.remove('active'));
  }

  // Lógica del Chat Modal
  const chatModal = document.getElementById('chat-modal');
  const btnChat = document.getElementById('btn-chat');
  const btnCerrarChat = document.getElementById('btn-cerrar-chat');

  if(btnChat && chatModal) {
      btnChat.addEventListener('click', (e) => {
        e.preventDefault(); chatModal.classList.add('active');
      });
  }
  if(btnCerrarChat && chatModal) {
      btnCerrarChat.addEventListener('click', () => chatModal.classList.remove('active'));
  }

  // Lógica del Countdown (Timer)
  const countDownDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000); // +3 días
  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    if(document.getElementById("dias")) {
        document.getElementById("dias").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById("horas").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById("minutos").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById("segundos").innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    }
  }, 1000);
});