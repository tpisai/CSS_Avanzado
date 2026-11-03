# FrameworkLab — Laboratorio 13

## Estructura

- `nativo.html`: catálogo con CSS propio.
- `framework.html`: catálogo con clases de Bootstrap.
- `css/nativo.css`: estilos de la versión nativa.
- `css/ajustes.css`: personalización separada de Bootstrap.
- `vendor/bootstrap.min.css`: dependencia Bootstrap 5.3.8 (debes copiarla aquí).

## Instalar Bootstrap 5.3.8 local

1. Descarga la distribución compilada desde:
   https://getbootstrap.com/docs/5.3/getting-started/download/
2. Descomprime el paquete.
3. Copia el archivo `css/bootstrap.min.css` del paquete a la carpeta `vendor` de este proyecto.
4. Verifica que la ruta final sea `frameworklab13/vendor/bootstrap.min.css`.

No edites el archivo original de Bootstrap. `framework.html` carga primero Bootstrap y después `css/ajustes.css`, para que los ajustes del proyecto puedan sobrescribir sus valores.

## Ejecutar

Abre `nativo.html` o `framework.html` en el navegador. También puedes usar Live Server desde VS Code.

## Pruebas de la guía

Comprueba ambos archivos en anchos de 360px, 800px y 1200px. Verifica:
- Las columnas cambian de 1 a 2 y a 3.
- Los enlaces de cada tarjeta llegan a la lectura correspondiente.
- La navegación permite cambiar de versión.
- Tab muestra el foco y el enlace “Saltar al contenido” funciona.
- El zoom al 200% no recorta el contenido.
- El movimiento reducido elimina la transición del botón.
- La página conserva textos y destinos si se retira temporalmente su hoja de estilos.
- Con Bootstrap local, la hoja sigue disponible al desconectar la red.

Registra los resultados reales de las pruebas en la matriz de la guía; no marques como aprobado algo que no hayas comprobado.
