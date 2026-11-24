# FrameworkLab Material

Catálogo adaptable de talleres construido con HTML, CSS, JavaScript, Vite y componentes Material Web.

## Requisitos

- Node.js compatible con Vite 8.
- npm.

## Instalación y ejecución

```bash
npm ci
npm run dev
```

Abrí la URL local que informa Vite. Para compilar y previsualizar la versión de producción:

```bash
npm run build
npm run preview
```

No incluyas `node_modules/` en el entregable. `package-lock.json` permite reproducir la instalación mediante `npm ci`.

## Uso y restricciones

El catálogo permite filtrar talleres, consultar detalles en un diálogo, inscribirse durante la sesión actual y alternar entre temas claro y oscuro. Las inscripciones son temporales y no se guardan en un servidor. La búsqueda se realiza sobre el texto visible y las palabras clave de cada tarjeta.

## Decisiones de diseño

La grilla usa una columna en pantallas estrechas, dos desde 42rem y tres desde 62rem. Se conservan intactos los datos de los tres talleres originales; el cuarto, «Variables CSS y temas», participa de las mismas interacciones.

Los tokens semánticos `--md-sys-color-surface-container` y `--md-sys-color-on-surface` expresan respectivamente el fondo de superficie y el color de texto, y cambian con el tema. `--taller-borde` es un token específico de componente que se puede ajustar sin afectar otros elementos; se eligió para hacer configurable el borde de las tarjetas. Centralizar estos valores reduce duplicación y la deuda de mantener paletas divergentes.

Se usa CSS nativo para la grilla, adaptación y tokens, junto con Material Web para los controles. No se incorporan Bootstrap ni Tailwind: en este catálogo acotado sumar otro sistema duplicaría estilos. Material 3 orienta la paleta y los componentes; la implementación de componentes proviene de Material Web.

## Verificación y evidencia pendiente

`npm run build` compila la aplicación. Para completar la entrega visual, capturá en el navegador los anchos estrecho y amplio, foco visible, tema oscuro y diálogo/búsqueda; agregá también una comparación en claro y oscuro del reto. La matriz T01–T12 y la matriz comparativa detallada de CSS nativo, Bootstrap, Tailwind CSS y Material 3 deben adjuntarse con resultados observados: no se presentan aquí como pruebas ejecutadas.
