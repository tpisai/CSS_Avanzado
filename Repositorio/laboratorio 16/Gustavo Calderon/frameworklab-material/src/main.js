import '@material/web/button/filled-button.js'; 
import '@material/web/button/outlined-button.js'; 
import '@material/web/button/text-button.js'; 
import '@material/web/textfield/outlined-text-field.js'; 
import '@material/web/dialog/dialog.js'; 
  
const raiz = document.documentElement; 
const tarjetas = [...document.querySelectorAll('.tarjeta')]; 
const buscar = document.querySelector('#buscar'); 
const vacio = document.querySelector('#sin-resultados'); 
const estado = document.querySelector('#estado'); 
const botonTema = document.querySelector('#cambiar-tema'); 
const dialogo = document.querySelector('#dialogo'); 
const tituloDialogo = document.querySelector('#dialogo-titulo'); 
const contenidoDialogo = document.querySelector('#dialogo-contenido'); 
const inscritos = new Set(); // Estado temporal de esta sesión. 
  
function normalizar(texto) { 
  return texto.toLocaleLowerCase('es')  .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); 
} 
  
function actualizarFiltro() { 
  const consulta = normalizar(buscar.value.trim()); 
  let visibles = 0; 
  for (const tarjeta of tarjetas) { 
    const contenido = `${tarjeta.textContent} ${tarjeta.dataset.palabras}`; 
    const coincide = normalizar(contenido).includes(consulta); 
    tarjeta.hidden = !coincide; 
    if (coincide) visibles += 1; 
  } 
  vacio.hidden = visibles > 0; 
} 
  
buscar.addEventListener('input', actualizarFiltro); 
  
for (const tarjeta of tarjetas) { 
  const titulo = tarjeta.querySelector('h3').textContent; 
  const descripcion = tarjeta.querySelector('p').textContent; 
  const botonDetalle = tarjeta.querySelector('.detalle'); 
  const botonInscribir = tarjeta.querySelector('.inscribir'); 
  
  botonDetalle.addEventListener('click', () => { 
    tituloDialogo.textContent = titulo; 
    contenidoDialogo.textContent = descripcion; 
    dialogo.show(); 
  }); 
  
  botonInscribir.addEventListener('click', () => { 
    if (inscritos.has(titulo)) return; 
    inscritos.add(titulo); 
    botonInscribir.disabled = true; 
    botonInscribir.textContent = 'Inscrito'; 
    estado.textContent = `Inscripciones registradas: ${inscritos.size}.`; 
  }); 
} 
  
document.querySelector('#cerrar-dialogo') 
  .addEventListener('click', () => dialogo.close()); 
  
botonTema.addEventListener('click', () => { 
  const oscuro = raiz.dataset.theme !== 'dark'; 
  raiz.dataset.theme = oscuro ? 'dark' : 'light'; 
  botonTema.textContent = oscuro ? 'Tema claro' : 'Tema oscuro'; 
}); 