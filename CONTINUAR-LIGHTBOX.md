# Continuación — Showcase v2: hints, contador, ghost, lightbox pinch/zoom (handoff)

> Doc para retomar en otro chat. Estado a **2026-08-27** (sesión posterior a `CONTINUAR-SHOWCASE.md`, que sigue vigente como base). Portafolio de **Luis Eduardo Soto Gutiérrez**. `C:\Users\luise\Servicios`. Vite + React 18 + TS, CSS puro. Correr: `npm run dev -- --port 5199 --strictPort` (config `portfolio-dev-2`). Verificar: `npm run build` limpio (`tsc -b && vite build`) + navegador real.

## Qué se hizo esta sesión

### 1. Limpieza CSS muerto (`PhoneShowcase.css`)
Eliminados los estilos de la etapa "teléfono": `.ph__device`/botones/`.ph__notch`, `.ph__float`+`phFloat`, `.ph__orbit*`+`phSpin`, `.ph__glare`, `.ph__gloss`, `.ph__right`, `.ph__demowrap`, `.ph__live*`+`phPulse`, `.ph__demo*` y sus refs en responsive + reduced-motion. Cero refs huérfanas (verificado por grep).

### 2. Hero — hint de scroll
`dict.ts` `hero.scroll`: ahora **"Baja hasta el final — hay sorpresa"** / "Scroll to the end — there's a surprise". Empuja al botón **Sorpréndeme** del footer.

### 3. Footer — correo fuera
`Footer.tsx`: eliminado el botón "COPIAR EMAIL · correo" del bloque "Gracias por llegar". Queda solo **Sorpréndeme** (centrado). Quitados estado `copied`, `copyEmail`, const `EMAIL`, imports `Copy`/`Check`. Los `mailto:` de redes (footer + Hero) se dejaron a propósito.
- **Gotcha:** la clase `.footer__copy` la reusa el copyright del bottom row — NO borrar esa regla en `Footer.css`.

### 4. Hint "ver más grande" en las capturas (hover)
- `PhoneShowcase.tsx` (Android) y `SlabShot` (browser): overlay `.ph__hint-chip` / `.cs__shot-hint-chip` centrado, aparece al **hover** sobre la screenshot, con scrim suave. Touch (`hover:none`) lo muestra fijo abajo.
- Texto vía `dict.ts` `projects.zoomHint` = **"Ver más grande"** / "View larger".

### 5. Lightbox también en proyectos browser (02 Gestión, 03 DEFCA)
Antes solo tenían carrusel `SlabShot`. Ahora clic en la captura abre lightbox grande (`.cs__zoom`), con flechas ‹ ›, close, teclado Esc/←/→ (capture).

### 6. Contador de pantalla "0N / 0M"
- Browser (`SlabShot`): franja `.cs__shotbar` **debajo** de la imagen (no la tapa) con contador `01 / 04` (mono) + dots. `.cs__slab-wrap` pasó a `flex-direction: column`.
- Android (`PhoneShowcase`): sigue el texto "PANTALLA 0N / 0M · LABEL" en `.ph__controls` (no se duplicó chip en la imagen; se probó y tapaba la barra de nav de la app, se quitó).

### 7. Número gigante de proyecto ("01" contorno) en Android
El ghost `.cs__preview-ghost` existía solo en el frame browser. Se replicó en `PhoneShowcase`: `<span className="ph__ghost display">{number}</span>` dentro de `.ph__stage`, estilo espejo (`-webkit-text-stroke` accent, opacity 0.4, esquina inferior-derecha, clipeado por `overflow:hidden` del stage). `number={project.n}` pasado desde `CaseStudy`.
- **Nota:** el font-size real lo pisa la clase global `.display` (mismo en browser y Android → consistentes). Es comportamiento esperado, no bug.

### 8. Lightbox: portal + zoom nítido (LO GRANDE de la sesión)
Ambos lightbox (`.cs__zoom` de `SlabShot` y `.ph__zoom` de `PhoneShowcase`) ahora usan **`createPortal(..., document.body)`**.
- **Por qué:** `.cs__panel` tiene un `transform` (animación de entrada del modal), que atrapa cualquier `position:fixed` hijo y **rompe el hit-test** (la X no cerraba en móvil; el tap caía al backdrop `.cs`). Portal a `body` lo saca del panel transformado. Verificado: `parent:BODY`, `closeReachable:true`.

**Zoom de imagen (browser lightbox, componente `PinchImage` en `CaseStudy.tsx`):**
- Modelo final = **tap para acercar / arrastrar para recorrer / tap para alejar** (NO pinch de 2 dedos, aunque el usuario mencionó "pellizcar" al inicio; su modelo mental real era tocar-y-recorrer).
- **Nitidez:** NADA de `transform: scale` (eso hacía blur al agrandar el raster ya reducido). En su lugar:
  - Fit: `<img width:100%>` dentro de `.cs__zoom-imgwrap` (el navegador reduce la fuente 1873px → ~349px, nítido).
  - Tap: se setea `img.style.width = min(naturalWidth, wrapClientWidth*2.6)` px → render **nativo** (nítido), y el wrap pasa a `overflow:auto` → arrastrar = scroll = paneo. Scroll inicial centrado en el punto tocado (rAF).
  - Tap de nuevo → `width:100%`, quita `is-zoomed`.
- Hint **"Toca para acercar" / "Tap to zoom"** (`dict.ts` `projects.pinchHint`, clase `.cs__zoom-hint`): visible hasta el **primer gesto** (`onInteract` → `setHintSeen(true)` → `.is-hidden` fade); reaparece al reabrir (`openZoom` resetea).
- Animación al pasar de imagen = fade opacity (`csZoomFade`) vía `key={index}` (remonta). NO scale (pelearía con el sizing).

## Gotchas nuevos (NO tropezar)
- **`position:fixed` dentro de `.cs__panel` (transformado) queda contenido por el panel** → hit-test y coords rotas. Cualquier overlay fullscreen dentro del case study DEBE ir por `createPortal` a `body`.
- **`img { max-width: 100% }` global** capa cualquier `<img>` a su contenedor → para agrandar por encima hay que `max-width: none` (lo tiene `.cs__zoom-img`).
- **`max-width: 100%` es circular** si el padre es shrink-to-fit (grid `place-items:center` + flex): el wrap crecía a 907px. En móvil el `.cs__zoom-imgwrap` se fija con `width: calc(100vw - 24px)`, no con `%`.
- **El pane MCP miente en px absolutos** cuando emula móvil (escala el viewport): `getBoundingClientRect` devolvía 77 en vez de 351. Verificar **ratios/relaciones** (imgW ≈ wrapW), no valores absolutos. Nitidez/tamaño reales solo se confirman en navegador real (Opera del usuario).
- **Opera del usuario cachea CSS** entre reloads → si "no se ve el cambio", `Ctrl+Shift+R` o incógnito. El dev server 5199 es la única fuente en ese puerto.
- **Buffer de consola del pane** guarda errores HMR viejos (timestamps `?t=` antiguos, p.ej. `Copy is not defined` de Footer) — ignorar; confiar en `tsc` limpio + que renderice.
- Gotchas base siguen vigentes (ver `CONTINUAR-SHOWCASE.md` y `CONTINUAR.md`): AnimatePresence exit no desmonta, cadena de `height:%`, cursor casi-blanco, adjuntos de chat no en disco, HMR cierra el modal.

## Archivos tocados
- `src/components/PhoneShowcase.tsx` / `.css` — limpieza CSS, hint hover, ghost "01", portal lightbox, `number` prop, `key` en img del zoom.
- `src/components/CaseStudy.tsx` / `.css` — `SlabShot`: hint hover, lightbox + portal, `.cs__shotbar` contador/dots, `PinchImage` (tap-zoom/pan nativo), hint "Toca para acercar".
- `src/i18n/dict.ts` — `hero.scroll`; `projects.zoomHint`, `projects.pinchHint`; quitados `demoLabel`/`exploreApp` (muertos).
- `src/components/Footer.tsx` — quitado botón copiar email.

## Pendiente / abierto
- **Confirmar en móvil real** el tap-zoom (el pane no simula multitouch; se validó tap/scroll/reset por DOM, no el gesto físico).
- Actualizar **memoria** del proyecto (`servicios-portfolio` / `luis-cv-data`) con: Calc3D=Android, 4 proyectos + Beast, showcase directo, lightbox pinch/portal. Sigue sin guardarse.
- Pendientes previos intactos: **deploy Vercel**, **backend form (Resend)**, **analytics (Plausible/Umami)**, **Lighthouse real**, **repos GitHub** (privados; Calc3D con secretos `.jks`/keystore — no publicar sin limpiar historial + rotar).
- Confirmar textos/stack de **Beast** (IA que usa, DB).

## Verificación rápida por DOM (pane 5199, tab `seed`)
```js
// abrir browser (Gestión = índice 1) y su lightbox
[...document.querySelectorAll('.pj__open')][1].click()
// luego, en otra llamada:
document.querySelector('.cs__slab-vp').click()   // abre lightbox
// tap-zoom: dispatch pointerdown+pointerup sobre .cs__zoom-imgwrap → img.offsetWidth pasa a ~907
```
