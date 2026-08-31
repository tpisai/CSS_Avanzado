document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. LÓGICA DEL TEMPORIZADOR (COUNTDOWN)
       ========================================== */
    // Configuramos la fecha del Drop (Lanzamiento) para 5 días en el futuro
    const fechaLanzamiento = new Date();
    fechaLanzamiento.setDate(fechaLanzamiento.getDate() + 5);

    function actualizarTemporizador() {
        const ahora = new Date().getTime();
        const distancia = fechaLanzamiento.getTime() - ahora;

        if (distancia < 0) {
            document.getElementById("countdown").innerHTML = "¡EL DROP YA ESTÁ DISPONIBLE!";
            return;
        }

        // Cálculos de tiempo
        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        // Mostrar en el HTML asegurando 2 dígitos (ej: 09 en vez de 9)
        document.getElementById("dias").innerText = dias.toString().padStart(2, '0');
        document.getElementById("horas").innerText = horas.toString().padStart(2, '0');
        document.getElementById("minutos").innerText = minutos.toString().padStart(2, '0');
        document.getElementById("segundos").innerText = segundos.toString().padStart(2, '0');
    }

    // Actualizar cada segundo
    setInterval(actualizarTemporizador, 1000);
    actualizarTemporizador();


    /* ==========================================
       2. LÓGICA DEL MODAL DE RESERVAS
       ========================================== */
    const botonesReserva = document.querySelectorAll('.btn-reserva');
    const modalReserva = document.getElementById('reserva-modal');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const productoNombreSpan = document.getElementById('modal-producto-nombre');
    const formReserva = document.getElementById('form-reserva');

    // Abrir modal al hacer clic en reservar
    botonesReserva.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const nombreProducto = e.target.getAttribute('data-producto');
            productoNombreSpan.innerText = nombreProducto;
            modalReserva.classList.add('activo');
        });
    });

    // Cerrar modal
    btnCerrarModal.addEventListener('click', () => {
        modalReserva.classList.remove('activo');
    });

    // Manejar el envío del formulario del modal
    formReserva.addEventListener('submit', (e) => {
        e.preventDefault();
        const producto = productoNombreSpan.innerText;
        modalReserva.classList.remove('activo');

        // Usamos una pequeña alerta visual rápida
        setTimeout(() => {
            alert(`¡Reserva confirmada para: ${producto}! Revisa tu correo.`);
            formReserva.reset();
        }, 300);
    });


    /* ==========================================
       3. LÓGICA DEL CHAT FLOTANTE
       ========================================== */
    const btnChat = document.getElementById('btn-chat');
    const modalChat = document.getElementById('chat-modal');
    const btnCerrarChat = document.getElementById('btn-cerrar-chat');

    if (btnChat) {
        btnChat.addEventListener('click', (e) => {
            e.preventDefault();
            modalChat.classList.add('activo');
        });
    }

    if (btnCerrarChat) {
        btnCerrarChat.addEventListener('click', () => {
            modalChat.classList.remove('activo');
        });
    }
});