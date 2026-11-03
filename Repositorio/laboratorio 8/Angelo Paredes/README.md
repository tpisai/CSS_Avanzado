📋 Consigna
Implementación de un catálogo de talleres con estados, componentes reutilizables en Sass y Less, reglas responsivas y documentación de decisiones.

🛠️ Entorno operativo
HTML único con catálogo de talleres y componente info-panel.
Sass y Less como fuentes de estilos.
Compilación a CSS en dist/css/.
✨ Cambios realizados
Nuevo taller: Animaciones CSS con estado Próximamente y consulta por correo con asunto identificador.

Badge soon: Implementado en Sass con tokens y en Less con guard soon.

Info-panel: Componente bajo el catálogo, reutiliza surface con padding distinto en Sass y Less.

Regla intermedia: Entre 36rem y 48rem se muestran dos columnas; debajo una y desde 48rem tres.

Tokens: Radio y color principal definidos desde tokens, contraste comprobado y foco visible.

README: Documentación de decisiones y trazabilidad.

📑 Decisiones explicadas
Uso de tokens para color y radio  
→ Garantiza consistencia visual en ambas fuentes y facilita cambios globales.
→ Mejora accesibilidad al comprobar contraste de textos.

Regla intermedia de columnas  
→ Optimiza la experiencia en pantallas medianas, evitando espacios vacíos.
→ Sincroniza tokens en Sass y Less para trazabilidad.