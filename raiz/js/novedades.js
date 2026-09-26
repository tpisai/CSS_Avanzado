document.addEventListener('DOMContentLoaded', () => {
  // Lógica del Countdown (Ejemplo de tiempo futuro)
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

  // Lógica de Modales de Reserva
  const reservaModal = document.getElementById('reserva-modal');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');
  const modalProductoNombre = document.getElementById('modal-producto-nombre');
  
  document.querySelectorAll('.btn-reserva').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const producto = e.target.getAttribute('data-producto');
      modalProductoNombre.textContent = producto;
      reservaModal.classList.add('active');
    });
  });

  btnCerrarModal?.addEventListener('click', () => reservaModal.classList.remove('active'));

  // Lógica del Chat Modal
  const chatModal = document.getElementById('chat-modal');
  const btnChat = document.getElementById('btn-chat');
  const btnCerrarChat = document.getElementById('btn-cerrar-chat');

  btnChat?.addEventListener('click', (e) => {
    e.preventDefault();
    chatModal.classList.add('active');
  });

  btnCerrarChat?.addEventListener('click', () => chatModal.classList.remove('active'));
});