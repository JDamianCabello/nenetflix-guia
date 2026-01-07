# NENETFLIX - Servicio de Streaming Privado

Sitio web informativo para NENETFLIX, un servicio de streaming privado basado en Plex que ofrece acceso a contenido de múltiples plataformas por una fracción del precio.

## Características

- **Diseño profesional y limpio**: Interfaz corporativa en blanco y gris con acentos en azul
- **Totalmente responsive**: Optimizado para PC, tablets y móviles
- **Calculadora de ahorro interactiva**: Compara precios con otras plataformas de streaming
- **Guía de instalación por dispositivo**: Instrucciones paso a paso para PC, móvil y Smart TV
- **Videos tutoriales integrados**: Guías visuales de YouTube para configuración

## Páginas

### 1. Inicio (index.html)
- Presentación del servicio
- Comparación rápida de precios
- Características principales
- Call to action para comenzar

### 2. Guía de Instalación (guide.html)
- Sistema de tabs por dispositivo:
  - PC / Portátil
  - Móvil (iOS/Android)
  - Smart TV
- Instrucciones detalladas paso a paso
- Videos tutoriales integrados
- Sección de preguntas frecuentes (FAQ)

### 3. Comparación de Precios (comparison.html)
- Tabla interactiva con 10 servicios de streaming
- Calculadora de ahorro en tiempo real
- Checkboxes para personalizar la comparación
- Detalles de lo que incluye NENETFLIX

## Tecnologías

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsive con variables CSS y Grid/Flexbox
- **JavaScript vanilla**: Sin dependencias, código limpio y eficiente
- **YouTube embeds**: Videos tutoriales integrados

## Estructura del proyecto

```
nenetflix-guia/
├── index.html           # Página principal
├── guide.html          # Guía de instalación
├── comparison.html     # Comparación de precios
├── styles.css          # Estilos principales
├── app.js             # JavaScript principal
├── favicon.svg        # Icono del sitio
└── README.md          # Este archivo
```

## Características técnicas

### Diseño
- Paleta de colores corporativa profesional
- Logo en rojo (#E50914) estilo Netflix
- Tipografía sans-serif limpia
- Sombras sutiles y bordes redondeados
- Animaciones suaves con CSS transitions

### Responsive
- Breakpoints en 980px y 560px
- Menú hamburguesa en móvil
- Tablas con scroll horizontal en pantallas pequeñas
- Touch targets de mínimo 44px

### Accesibilidad
- Etiquetas ARIA en componentes interactivos
- Navegación por teclado
- Contraste de color adecuado
- Estructura semántica HTML5

### Optimizaciones
- Sin dependencias externas
- Código JavaScript optimizado con requestAnimationFrame
- Intersection Observer para animaciones de scroll
- CSS modular y mantenible

## Servicios comparados

1. Netflix - 7,99€/mes
2. HBO Max - 6,99€/mes
3. Disney+ - 6,99€/mes
4. Prime Video - 4,99€/mes
5. Apple TV+ - 6,99€/mes
6. Movistar Plus+ - 14€/mes
7. Filmin - 7,99€/mes
8. SkyShowtime - 6,99€/mes
9. Paramount+ - 7,99€/mes
10. Crunchyroll - 7,99€/mes

**Total tradicional**: ~947€/año
**NENETFLIX**: 50€/año
**Ahorro**: Hasta 897€/año (94%)

## Instalación y uso

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. No requiere servidor ni build process

## Compatibilidad

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Navegadores móviles modernos

## Licencia

Proyecto privado para uso del servicio NENETFLIX.