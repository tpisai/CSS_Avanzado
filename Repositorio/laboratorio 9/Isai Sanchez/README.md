# MotionLab - Laboratorio Semana 9

Este proyecto cumple con los requisitos establecidos en la Guía de Laboratorio para la Semana 9 sobre Animaciones CSS.

## Estructura
- `index.html`: Estructura semántica, tarjetas y controles (checkboxes).
- `css/styles.css`: Estilos base, grilla, y reglas de animación.
- `evidencias/`: Carpeta preparada para almacenar las capturas de pantalla de la matriz de pruebas.

## Reto de extensión completado (Sección 18)
- **Cuarta tarjeta:** Se agregó la tarjeta "Transformaciones 3D" con `--delay: 360ms`. No se repitieron todas las propiedades de animación porque la cascada y la variable personalizada `--delay` permiten heredar el resto de atributos base eficientemente.
- **Fotograma intermedio (60%):** Se modificó `@keyframes card-enter` añadiendo un fotograma que eleva sutilmente la tarjeta (`translateY(-0.15rem)`) antes de dejarla en su estado base final. Esto añade un ligero rebote fluido (overshoot) a la entrada sin perjudicar la experiencia.

## Ajustes técnicos (Diagnóstico de errores de código de la guía)
- Se corrigió la sintaxis de selectores en el archivo CSS que estaban rotos debido al formato de texto original (ej. se implementó adecuadamente `~ .stage` para seleccionar el contenedor y corregido los brackets `{` y `}`). Esto asegura que el botón de **Activar** y **Pausar** funcionen a la perfección con el HTML.
