# Cambios — Portfolio Luis Eduardo Soto Gutiérrez

Registro de las correcciones y mejoras de esta sesión. Stack: Vite + React 18 + TS, CSS puro con variables, `motion`, `lenis`.

---

## 1. Proyectos — tarjetas de la lista (`Projects.tsx`, `sections.css`)

- **Preview real**: cada tarjeta muestra el screenshot real del proyecto (antes wireframe genérico).
  - Proyectos **web** (Gestión, DEFCA) → marco de **navegador** con barra de ventana, imagen `object-fit: cover`.
  - Proyectos **móvil** (Calculadora 3D, Beast) → **marco de teléfono** real (vertical, aspecto 9/19.5, bezel, esquinas redondeadas), centrado.
- **Efecto teaser**: preview con **desenfoque** suave (`blur` ~3–3.5px) que se **afina** un poco en hover + ligero zoom.
- **Tamaño uniforme**: todas las tarjetas miden igual (682×528 @1440). Antes alternaban 682/504 por `pj--rev` con columnas asimétricas → se corrige invirtiendo también el `grid-template-columns` en las filas reversas.
- **Número ghost detrás**: el número gigante (01–04) va con `z-index:0`, detrás del preview (`z-index:1`). Antes tapaba la imagen.
- Se quitó el "notch" falso del teléfono (se veía como cámara sin blur).
- **Título de tarjeta** (`pj__name`): reducido a `clamp(30px, 4.1vw, 60px)` para que "CALCULADORA"/"INSTITUCIONAL" entren en la columna sin cortarse.

## 2. Case study (modal) (`CaseStudy.tsx/.css`)

- **Zoom lightbox nítido en móvil**: se agranda hasta la resolución nativa de la imagen (antes tope ~880px).
- **Nombre de cada captura** en el lightbox (estilo mono + acento), con contador `01 / 04` en móvil.
- **Título del modal** escala en ≤560px (`clamp(24px, 7vw, 40px)`) para no cortarse.

## 3. Títulos outline — contorno limpio (`OutlineText.tsx`, `FooterWordmark.tsx`, `global.css`)

- Causa raíz: `-webkit-text-stroke` traza cada subtrazo del glifo → costuras internas en N, A, D, R, M…
- **Solución**: componente `<OutlineText>` que rellena el glifo y aplica filtro **`feMorphology`** (erosiona la silueta unificada y resta) → contorno exterior único, sin costuras, en todos los glifos. Radio del outline escala con el font-size.
- Aplica a **PROYECTOS/SELECCIONADOS** y **ENFOQUE/CÓDIGO**, y al **wordmark del footer** (vía CSS `filter`).
- Se quitó `will-change` de `.maskline__in` (evitaba doblado por capa GPU).

## 4. Footer (`FooterWordmark.tsx`, `Footer.css`, `Hud.tsx/.css`)

- Wordmark gigante ahora dice **LUIS EDUARDO SOTO GUTIÉRREZ**, ajustado (`100vw/18.5`) para entrar en una línea en todos los tamaños.
- **HUD** (caja de esquina) se **desvanece** cuando el wordmark entra en pantalla (ya no lo tapa).

## 5. Contacto (`Contact.tsx`, `dict.ts`)

- **Envío real vía Web3Forms** (reemplaza `mailto:` que fallaba sin cliente de correo). Estados inline: enviando / enviado / error. Campos en español ordenados (Nombre, Correo, Tipo de proyecto, Mensaje) + reply-to.
- **Límites de caracteres** con contador visible: Nombre 60, Email 120, Mensaje 800.
- Pendiente al publicar: cambiar el Website URL de `localhost` al dominio real en el panel de Web3Forms.

## 6. Navegación e i18n (`Nav.tsx`, `Cursor.tsx`, `dict.ts`)

- **Menú móvil** ampliado: Trabajo, Servicios, Tech, Estado, Perfil, Proceso, Contacto (desktop sigue en 4).
- **Bloqueo de scroll** con el menú móvil abierto: se detiene Lenis + `overflow:hidden` (antes la página seguía scrolleando detrás).
- **Cursor** personalizado localizado: `VER PROYECTO → / EXPLORAR → / VER APP ↗` (ES) — antes hardcodeado en inglés.

## 7. Hero y fondo (`Hero.tsx/.css`, `App.tsx`, `global.css`)

- **Fondo de estrellas global** continuo y fijo detrás de todas las secciones → el campo del Hero ya no "corta" al pasar a la siguiente sección. Campo del Hero difuminado (opacity + fade arriba y abajo).
- **Frase amigable** en el espacio vacío del Hero móvil (14 frases que rotan al recargar), estilo display en mayúsculas, centrada.
- Indicador "↓ Baja hasta el final" alineado al borde del contenido (`.shell`).

## 8. Correcciones responsive varias (`global.css`, `sections.css`, `System.css`, `Contact.css`, `Footer.css`)

- Títulos display que se cortaban en móvil (HERRAMIENTAS, SELECCIONADOS…) → floor de `--fs-display-2` bajado a `9vw`.
- **System**: "LISTO PARA CONSTRUIR" con el caret pegado (grupo `nowrap`, ya no salta de línea).
- **Process**: línea de timeline oculta en móvil (ya no cruza los números).
- **Contacto** y **Footer**: CTAs centrados en móvil.

## 9. Tito — mascota (`GlobalCat.tsx/.css`)

- **Habilitado en móvil** (antes solo desktop): sigue el toque/scroll.
- **Tocar a Tito** (o clic derecho en desktop) abre el menú "¿Ocultar a Tito?".
- **Tip** una sola vez por visitante: chip con icono de gato + verbo según dispositivo (Toca/Clic), "Tito" en degradado.

## 10. Efectos "Sorpréndeme" (`Footer.tsx/.css`)

- Animaciones más pulidas: fade-in en todas, burst con giro, lluvia con deriva, anillos más finos.
- El mensaje/fortune nace sobre el botón y solo sube (ya no baja).

---

### Notas
- Todo verificado por medición (DOM/JS) en 360 / 375 / 414 / 820 / 1440 / 1920: sin scroll horizontal, sin errores de consola.
- El pane de preview de Claude estaba colapsado/congelado en varios pasos → verificación por geometría + confirmación visual del usuario en su navegador.
- Link de prueba en red local: `http://192.168.100.10:5174` (mismo WiFi, mientras el server corra).
