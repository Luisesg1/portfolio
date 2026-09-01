# Continuación — Proyectos reales + Showcase Android (handoff)

> Doc para retomar en otro chat. Estado a **2026-08-27**. Complementa a `CONTINUAR.md` (base) y `HANDOFF.md` (más viejo). Portafolio de **Luis Eduardo Soto Gutiérrez** — Ing. en Informática / Full Stack. Ubicación: `C:\Users\luise\Servicios`. Stack: Vite + React 18 + TS, CSS puro con variables (sin Tailwind), libs `motion`/`lenis`/`lucide-react`.

## Correr
```bash
npm run dev      # 5173
npm run build    # tsc -b && vite build (SIEMPRE dejar limpio)
```
En estas sesiones se usó **puerto 5199** (`.claude/launch.json` → `portfolio-dev-2`) para no chocar con el 5173 del usuario.

---

## Qué se hizo esta sesión

### 1. Pendiente #4 — Proyectos reales (CERRADO)
- Se agregó un **4º proyecto real**: **Beast** (app de gym Android con coach IA "BRUX", registro de sesiones, PRs/1RM, dashboard, logros, rutinas, comunidad). Acento **cyan** (`var(--cyan)`, alias `--lime`).
- Los 4 proyectos (`src/data/content.ts` → `export const projects as const`, orden 01–04):
  1. **Calculadora 3D** (01) — `device:'phone'`, Fitness/Costing, **Android** (Kotlin/Jetpack Compose/Material 3/Hilt), acento `--blue`. Corregido de Electron→Android. 4 screenshots.
  2. **Gestión Institucional** (02) — `device:'browser'`, Django/PostgreSQL/REST, acento `--violet`. 4 screenshots. Demo = artifact `https://claude.ai/code/artifact/53966726-...`.
  3. **DEFCA** (03) — `device:'browser'`, Python/Computer Vision/Data, acento `--coral`. 3 screenshots. Demo real `https://defca.app`.
  4. **Beast** (04) — `device:'phone'`, Kotlin/Jetpack Compose/Material 3/IA, acento `--cyan`. **5 screenshots**.
- Todos con badge **"En desarrollo"** (`wip:true`, i18n `projects.wip`). Ninguno tiene repo público (`repo:''`).
- **Screenshots** en `public/projects/`: `calc3d-1..4.webp`, `gestion-1..4.png`, `defca-1..3.png`, `beast-1.jpg`+`beast-2..5.png`. Beast: `1`=Home (recortado sin barra estado), `5`=Menú (todas las secciones), `2`=Dashboard, `3`=BRUX IA, `4`=Progreso/Records.

### 2. Campos nuevos en `content.ts` (por proyecto, `as string`/`as string[]` para no romper `as const`)
`repo`, `demo`, `images[]`, `wip`, `device: 'phone'|'browser'`, `screens: string[]` (labels de pantalla por imagen).

### 3. Case study editorial (`src/components/CaseStudy.tsx` + `.css`)
- Header: cat + badge wip, título, **subtítulo** (`text.desc`), facts (Año/Rol/Stack). Close con hover **"Close"** + icono rota.
- **Story numerado**: `[01] PROBLEMA · [02] SOLUCIÓN · [03] RESULTADO · [04] STACK` — números outline gigantes con tinte accent, **reveal on scroll** (IntersectionObserver, root=`.cs__scroll`). Stack editorial numerado (`01 Kotlin`…), NO badges.
- Preview condicional por `device`:
  - `phone` → `<PhoneShowcase>` (ver abajo).
  - `browser` → frame on-brand + `<SlabShot>` (carrusel slab 3D existente, sin tocar).

### 4. `PhoneShowcase` (`src/components/PhoneShowcase.tsx` + `.css`) — ESTADO ACTUAL
Iteró mucho por feedback del usuario. **Versión final = presentación DIRECTA de la app, SIN teléfono:**
- **Quitado**: mockup de teléfono (bisel, notch, botones laterales, gloss/reflejos, sombra de dispositivo), **tilt 3D**, **float idle**, cursor "EXPLORE APP", indicador LIVE/INTERACTIVE, botón "Demo interactivo" (autoplay). Órbitas del fondo también.
- **Queda**: la screenshot como **pieza central** (`.ph__screen` = `<button>`, `aspect-ratio 9/19.5`, `height: min(94%, 620px)`, `border-radius 26px`, borde sutil `--ink-10`, sombra suave — NO de dispositivo). Fondo `.ph__space` con **glow radial sutil** (accent+violet) + **dust** mínimo (partículas). Centrada con aire.
- **Transiciones de pantalla** (crossfade + slide ±16px + scale + blur ligero, ~0.5s) al cambiar con flechas.
- **Controles editoriales**: `PANTALLA 0N / 0M · <label>` (mono) + `← ANTERIOR   SIGUIENTE →` (hover: underline + shift de flecha). Sin demo.
- **Click en la screenshot → lightbox** (`.ph__zoom`, z-index 10060): imagen grande (max-height 84vh, contain), caption, flechas ‹ ›, close, teclado Esc/←/→ (listener en **capture** para no cerrar el modal). 
- **Launch**: entrada `.ph__launch` (scale/blur/opacity, 2D). Respeta `prefers-reduced-motion`. Touch **swipe** para cambiar pantalla en móvil.
- Labels i18n en `dict.ts` (ES/EN): `screen, prevScreen, nextScreen, demoLabel, exploreApp` (demoLabel/exploreApp ya NO se usan — quedaron por si se reponen).
- **Nota**: quedó CSS muerto de la etapa con teléfono (`.ph__device`, `.ph__notch`, `.ph__gloss`, `.ph__glare`, `.ph__float`, `.ph__orbit*`, `.ph__demo*`, `.ph__live*`, botones laterales). No renderiza; se puede limpiar.

---

## Gotchas de esta sesión (NO tropezar)
- **Adjuntos de chat NO están en disco** → no se pueden servir como `/projects/*`. El usuario debe guardarlos como archivo; sus capturas suelen ir a `C:\Users\luise\OneDrive - INACAP\Pictures\Screenshots\` (Snipping) o Desktop. Buscar con `find ... -newermt`.
- **Dev server no alcanzable por curl** desde el shell (aislamiento de red); verificar por el **pane MCP** (`javascript_tool` en tab `seed` de 5199) por DOM, NO por screenshot (el pane **no compone** → `rAF`/IntersectionObserver no corren, `is-live` queda false, animaciones/tilt no se ven ahí).
- **Screenshots reales** solo por **Opera + PowerShell** (`SetForegroundWindow` + `SendKeys`/`mouse_event` + `Graphics.CopyFromScreen`). Problemas: Opera tiene **varias tabs** y el **foco salta** (a ChatGPT/Spotify/Android Studio); el hwnd de Opera **cambia** al recrearse (re-enumerar ventanas). Abrir modal = navegar `localhost:5199/#work`, scroll con `{PGDN}`/`{PGUP}`, click "VER CASO".
- **HMR cierra el modal** al editar TSX (Fast Refresh remonta) → reabrir para verificar.
- **Cadena de `height:%`**: un wrapper sin altura definida entre stage y screen colapsa el `height:min(...,%)` a 0 (el teléfono se volvía invisible). Si se agregan wrappers, darles `height:100%`.
- **Cursor custom** (`src/components/Cursor.tsx`): el dot es casi blanco (`--ink`), invisible sobre fondos claros. Estados: `data-cursor="shot"` (violeta, para screenshots claras), `explore-app` (ya no se usa). Sobre `.ph__screen` (button) el cursor cae al estado `button`.
- **`.cs`/CaseStudy**: `AnimatePresence exit` NO desmonta aquí — el modal cierra con `closing`+`setTimeout(420)`. El focus-trap + Esc del modal viven en un listener de `document`; el lightbox intercepta Esc en fase **capture** para cerrarse primero.
- **Race sync al verificar por DOM**: click abre modal/lightbox async (React) → leer en un `javascript_tool` **separado**, no en el mismo.

---

## Pendiente / decisiones abiertas
- **Segunda pasada visual del showcase directo**: el usuario pidió "intentar nuevamente" el reenvío de la captura; confirmar si la presentación directa (sin teléfono) le gusta o quiere ajustes (tamaño/aire/glow/legibilidad).
- ¿Agrandar más la screenshot o dejar el "aire" actual? (usuario: generosa pero con aire, no full-width).
- **Limpiar CSS muerto** de PhoneShowcase.css (estilos de teléfono/demo/live/órbitas).
- **Repos GitHub** (`Luisesg1`): todos privados; `Calculadora-3D` tiene **secretos** (`cotiza3d-upload.jks`, `keystore.properties`, carpeta `supabase`) — NO publicar sin limpiar historial + rotar llaves. Si se publican, rellenar `repo` (aparecen botón "Ver repositorio" + mini-link en tarjeta).
- **Supabase en Calc3D**: hay carpeta `supabase` en el repo Android; memoria `luis-cv-data` dice que Supabase se quitó del stack — confirmar con el usuario antes de añadirlo. Stack actual usa Hilt.
- **Stack/textos de Beast**: redactados por el asistente desde las pantallas; confirmar fidelidad y la IA que usa (API propia/Gemini/OpenAI) + DB.
- Pendientes previos de `CONTINUAR.md`: **deploy** (Vercel), **backend del form** (Resend), **analytics** (Plausible/Umami), **Lighthouse real**.
- **Memoria**: aún no se guardó el estado nuevo (Calc3D=Android, 4 proyectos, Beast, demos). Considerar actualizar memorias `servicios-portfolio` / `luis-cv-data`.

---

## Verificación rápida por DOM (pane 5199, tab `seed`)
```js
// abrir Beast (índice 3) o Calc3D (0)
[...document.querySelectorAll('.pj__open')][3]?.click()
// luego, en otra llamada:
({ scr: !!document.querySelector('.ph__screen'),
   screens: document.querySelectorAll('.ph__scr').length,
   hasDevice: !!document.querySelector('.ph__device'),  // debe ser false
   count: document.querySelector('.ph__count')?.textContent })
```
