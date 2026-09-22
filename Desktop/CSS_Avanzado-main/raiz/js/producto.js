document.addEventListener("DOMContentLoaded", () => {
const DATOS_PRODUCTOS = {
    "low-street": {
    titulo: "Zapatillas Low Street",
    precio: "S/ 399.00",
    descripcion: "Perfil bajo en Black & White. Diseñadas para la calle, estas zapatillas combinan un estilo clásico con materiales de alta durabilidad para resistir el uso diario urbano. Suela de goma antideslizante y capellada reforzada.",
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
    categoria: "zapatillas",
    tallas: ["39", "40", "41", "42"]
    },
    "concrete": {
    titulo: "Zapatillas Concrete",
    precio: "S/ 429.00",
    descripcion: "Suela chunky de gran volumen en tono Off White. Un diseño robusto pensado para destacar en el día a día.",
    imagen: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=85",
    categoria: "zapatillas",
    tallas: ["39", "40", "41", "42"]
    },
    "court": {
    titulo: "Zapatillas Court",
    precio: "S/ 459.00",
    descripcion: "Silueta clásica en color blanco. Un básico atemporal que combina con cualquier outfit urbano.",
    imagen: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&q=85",
    categoria: "zapatillas",
    tallas: ["39", "40", "41", "42"]
    },
    "utility-jacket": {
    titulo: "Oversize Utility Jacket",
    precio: "S/ 349.00",
    descripcion: "Chaqueta oversize en algodón grueso, tono Sand. Edición limitada con múltiples bolsillos utilitarios.",
    imagen: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85",
    categoria: "ropa",
    tallas: ["S", "M", "L"]
    },
    "hoodie-urban": {
    titulo: "Hoodie Urban Essential",
    precio: "S/ 289.00",
    descripcion: "Polerón de fleece en negro, corte urbano essential. Ideal para el día a día.",
    imagen: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85",
    categoria: "ropa",
    tallas: ["S", "M", "L"]
    },
    "polo-graphic": {
    titulo: "Polo Graphic Street",
    precio: "S/ 119.00",
    descripcion: "Polo 100% algodón en blanco con gráfico street. Comodidad y estilo en una sola prenda.",
    imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
    categoria: "ropa",
    tallas: ["S", "M", "L"]
    },
    "jogger-cargo": {
    titulo: "Jogger Cargo Tactical",
    precio: "S/ 229.00",
    descripcion: "Jogger cargo en tono Olive con múltiples bolsillos tácticos. Ajuste cómodo para movimiento libre.",
    imagen: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=85",
    categoria: "ropa",
    tallas: ["S", "M", "L"]
    },
    "cap-classic": {
    titulo: "Cap Classic Hype",
    precio: "S/ 89.00",
    descripcion: "Gorra ajustable en negro, diseño clásico. El accesorio infaltable para cualquier outfit.",
    imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=85",
    categoria: "accesorio",
    tallas: []
    },
    "mochila-urban": {
    titulo: "Mochila Urban Utility",
    precio: "S/ 199.00",
    descripcion: "Mochila impermeable en gris, pensada para el uso diario en la ciudad.",
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
    categoria: "accesorio",
    tallas: []
    }
};

const parametrosURL = new URLSearchParams(window.location.search);
const idProducto = parametrosURL.get('id') || 'low-street';
const producto = DATOS_PRODUCTOS[idProducto];

if (producto) {
    document.getElementById('producto-imagen').src = producto.imagen;
    document.getElementById('producto-imagen').alt = producto.titulo;
    document.getElementById('producto-titulo').textContent = producto.titulo;
    document.getElementById('producto-breadcrumb').textContent = producto.titulo;
    document.getElementById('producto-precio').textContent = producto.precio;
    document.getElementById('producto-descripcion').textContent = producto.descripcion;
    document.getElementById('producto-boton').setAttribute('data-product', producto.titulo);
    document.title = producto.titulo + " | STREETHYPE";

    const bloqueTallas = document.getElementById('bloque-tallas');
    const grupoTallas = document.getElementById('grupo-tallas');
    const tallaLabel = document.getElementById('talla-label');

    if (!producto.tallas || producto.tallas.length === 0) {
    bloqueTallas.style.display = 'none';
    } else {
    bloqueTallas.style.display = 'block';
    tallaLabel.textContent = producto.categoria === 'zapatillas'
        ? 'Selecciona tu talla (PE):'
        : 'Selecciona tu talla:';

    grupoTallas.innerHTML = '';
    producto.tallas.forEach((talla, index) => {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'btn-talla' + (index === 0 ? ' talla-activa' : '');
        boton.textContent = talla;
        
        boton.style.padding = '0.5rem 1.2rem';
        boton.style.cursor = 'pointer';
        boton.style.borderRadius = '4px';

        if (index === 0) {
        boton.style.border = '1px solid #000';
        boton.style.background = '#000';
        boton.style.color = 'white';
        } else {
        boton.style.border = '1px solid #ccc';
        boton.style.background = 'white';
        boton.style.color = 'black';
        }

        boton.addEventListener('click', () => {
        grupoTallas.querySelectorAll('.btn-talla').forEach(b => {
        b.style.background = 'white';
        b.style.color = 'black';
        b.style.borderColor = '#ccc';
        });
        boton.style.background = '#000';
        boton.style.color = '#fff';
        boton.style.borderColor = '#000';
        });

        grupoTallas.appendChild(boton);
    });
    }
}
});