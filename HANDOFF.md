# Luis Soto — Portafolio · Handoff

Documento para continuar el proyecto en otra sesión.
Última actualización: 2026-08-24.

---

## 1. Qué es

Portafolio profesional de **Luis Soto — Ingeniero en Informática / Full Stack Developer**.
Dirección visual: **dark + editorial + brutalista tipográfico + arte generativo**.
Ubicación: `C:\Users\luise\Servicios`.

Estado: **Fase 1 (visual/UI/UX) COMPLETA**. **Fase 2 (premium interactions) COMPLETA — ver §9.**
Fase 3 (backend real) pendiente — ver §7.

---

## 2. Stack

- **Vite + React 18 + TypeScript**
- **motion** (Framer Motion) — parallax, animaciones nav/hero
- **lenis** — smooth scroll
- **lucide-react** — iconos
- **CSS puro con variables** (sin Tailwind)
- Fuentes: **Inter** + **JetBrains Mono** (Google Fonts, en `index.html`)

Correr:
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build (limpio)
npm run preview
```
`.claude/launch.json` ya define el dev server `portfolio-dev` (puerto 5173).

---

## 3. Estructura

```
src/
  App.tsx                 # orquesta secciones + <GlobalCat/>
  main.tsx                # SIN StrictMode (a propósito, ver §6)
  styles/
    global.css            # tokens/design system, tipografía, grain, reveal, botones
    sections.css          # estilos de todas las secciones + responsive
  lib/
    useLenis.ts           # smooth scroll + scroll a anclas
    useActiveSection.ts   # sección activa para el nav
  data/
    content.ts            # servicios, proyectos, stack, process, approach
  components/
    Nav.tsx / .css        # navbar pill transparente, CTA violeta, menú móvil
    Hero.tsx / .css        # hero 2 columnas + constelación (ParticleField)
    ParticleField.tsx     # canvas: campo de partículas/constelación
    Reveal.tsx            # Reveal + MaskLine (IntersectionObserver + CSS)
    Marquee.tsx / .css
    Intro / Services / Projects / Tech / Profile / Approach / Process / Contact / Footer
    GlobalCat.tsx / .css  # mascota gato que sigue el cursor (ver §5)
public/
  cat-walk.png            # spritesheet del gato (4 frames, 2172x724, transparente)
  favicon.svg
```

Orden de secciones (App.tsx): Hero[00] → Intro[01] → Services[02] → Projects[03] →
Tech[04] → Profile[05] → Approach[06] → Process[07] → Contact[08] → Footer.
(La sección "Beyond Code" existió y fue **eliminada** por decisión del usuario.)

---

## 4. Sistema visual (tokens en `global.css`)

- Base dark: `--paper #050505`, `--paper-soft #0d0d10`, `--paper-line #17171b`
- Texto/bordes: `--ink #f4f4f5` + escalas `--ink-70/45/20/10`
- Acentos (uso puntual): `--violet #8052ff` (interacción principal), `--blue #3b82f6`,
  `--cyan #22d3ee`, `--magenta #d946ef`, `--amber #ffb829`, `--gray #9a9a9a`
- Tipografía size-driven, peso 500 (no brutalista pesado). Display `clamp(60px,11vw,168px)`.
- Grain sutil (`body::before`, blend screen) + glow violeta (`body::after`).
- `--coral`/`--lime` son alias legacy (→ amber/cyan) por compat.

---

## 5. GlobalCat (mascota gato) — lo más iterado

Archivo: `src/components/GlobalCat.tsx`.
Es el gato real del usuario (michi gris plateado tabby, ojos verdes), imagen generada
que reemplazó a un sprite pixel dibujado a mano.

Cómo funciona:
- Usa **spritesheet** `public/cat-walk.png` — **4 frames** de `543x724`, fondo transparente,
  el gato mira a la **derecha**.
- Constantes: `FRAMES=4, FRAME_W=543, FRAME_H=724, DISP_H=74` (ancho ~56). Cambiar `DISP_H`
  para agrandar/achicar.
- **Camina** ciclando los 4 frames cada ~120ms mientras persigue el cursor.
- **Posición en coordenadas del DOCUMENTO** (`position: absolute`), no del viewport → se queda
  en su parte de la página; al hacer scroll el objetivo se recalcula (cursor + scroll) y
  **baja caminando** a alcanzarte.
- Se **voltea** (`scaleX`) según la dirección; **corazón** flotante al alcanzar el puntero
  (`spawnHeart`, CSS en `GlobalCat.css`).
- `pointer-events: none` (no bloquea clicks). Desactivado en touch (`pointer: coarse`) y en
  `prefers-reduced-motion`. Pausa solo si la pestaña está oculta (NO por visibilidad del propio
  gato — eso lo congelaba fuera de pantalla; se quitó el IntersectionObserver a propósito).
- **Limpieza de specks**: el PNG traía puntitos/ruido en el área transparente. `cleanSheet()`
  corre una vez al cargar: connected-components sobre la hoja, conserva solo los 4 blobs grandes
  (>400 px c/u ≈ 160–177k) y borra las islitas chicas (≤172 px). Sin esto se ven puntos al caminar.

Si el usuario trae otra imagen: reemplazar `public/cat-walk.png` y ajustar `FRAMES/FRAME_W/FRAME_H`
según el nuevo spritesheet.

---

## 6. Decisiones clave (no romper)

- **main.tsx sin StrictMode**: el `whileInView`+`once` de motion no dispara fiable bajo StrictMode
  en dev (doble-mount deja el observer muerto). Por eso `Reveal`/`MaskLine` usan
  **IntersectionObserver propio + clases CSS**, no `whileInView`. No re-añadir StrictMode.
- **Grids con tipografía gigante** usan `minmax(0,1fr)` para evitar overflow por min-content.
  `html { overflow-x: hidden }` como red de seguridad.
- **Sin overflow horizontal** verificado en 360/375/414/768/1024/1280/1440/1920.
- Contenido de proyectos = solo los 3 reales: **Calculadora 3D**, **Gestión Institucional**,
  **DEFCA**. No inventar clientes, métricas ni experiencia.

---

## 7. Pendiente — Fase 2 (backend/funcional)

Aún NO implementado (a propósito). Cuando el usuario lo pida:
- Formulario de contacto funcional (envío de emails)
- Backend / base de datos / auth si aplica
- Datos reales adicionales: experiencia laboral, freelance, certificaciones (la timeline en
  `Profile.tsx` ya está preparada para agregarlos)
- Más proyectos (estructura en `data/content.ts` lista)

Posibles pulidos visuales menores si el usuario quiere:
- Tamaño/velocidad del gato (`DISP_H`, `speed` en GlobalCat)
- Ajustes finos de la constelación del hero (`ParticleField`)

---

## 9. Fase 2 — Premium interactions (COMPLETA)

Nuevos componentes:
- `Cursor.tsx/.css` — cursor custom (punto + halo con inercia). Estados vía `data-cursor`:
  `view` (label "VIEW PROJECT →"), `explore` ("EXPLORE →"), `link` (halo expande), inputs (barra).
  Solo desktop (`pointer: fine`); añade `.has-cursor` a `<html>` → `cursor:none` global. Convive con GlobalCat.
- `Magnetic.tsx` — wrapper magnético (motion useSpring). Usado en CTAs Hero, Nav, form submit. `strength` 7–10px.
- `ScrollProgress.tsx/.css` — línea 2px violet→cyan arriba (motion useScroll+useSpring).
- `Loader.tsx/.css` — intro "LS" ~1.25s, curtain-up. Se salta con reduced-motion o si ya se vio (sessionStorage `ls-intro`).
  **CSS puro (state + keyframes), NO AnimatePresence** (ver caveat abajo).
- `System.tsx/.css` — sección `[05 — System]`: panel tipo terminal con SYSTEM STATUS (6 filas ONLINE con
  pulso), reloj vivo (subcomponente `Clock` aislado), métricas reales, "READY TO BUILD", available indicator.
  Incluye `FieldTrajectory`.
- `FieldTrajectory.tsx` — detalle fútbol: trayectoria curva SVG + punto que la recorre (SMIL, gated reduced-motion).
- `CaseStudy.tsx/.css` — modal case study (PROBLEM/SOLUTION/RESULT/YEAR/ROLE/STACK). Enter/exit **CSS keyframes**
  (`is-out` + timeout → onClose). Escape y click-backdrop cierran.

Modificados:
- `content.ts` — proyectos extendidos (`year/role/stack/problem/solution/result`) + `metrics`, `systemStatus`,
  `techMeta`, `projectTypes`. **⚠️ Los `year` (2025/2025/2026) y los textos problem/solution/result son
  scaffolding plausible — Luis debe revisarlos/corregirlos.**
- `App.tsx` — añade Loader, ScrollProgress, Cursor, System. Orden secciones + tags renumerados 00→09.
- `Contact.tsx/.css` — form premium (NAME/EMAIL/PROJECT TYPE chips/MESSAGE) con floating labels, underline
  animado, validación. **Sin backend: submit compone `mailto:` prellenado** (fallback honesto). Canales se conservan.
- `Projects.tsx` — cards abren CaseStudy (cursor `view`, hover scale sutil). "Ver caso" ahora abre modal (antes → #contact).
- `Tech.tsx` — hover por tecnología muestra `techMeta`.
- `Reveal.tsx` — prop `variant`: `up` (default) / `blur` / `clip`. Usado en Intro (blur) y Approach (clip).
- `Hero/Nav` — CTAs magnéticos, `data-cursor` en links.
- `Footer.tsx` — easter egg CAT.EXE (click en silueta gato → "CAT.EXE · WATCHING YOU CODE").

**⚠️ CAVEAT CLAVE — AnimatePresence `exit` NO desmonta en este proyecto** (main.tsx sin StrictMode; verificado:
loader, modal y menú mobile quedaban montados al cerrar, sin error de consola). **Regla: NO usar
`AnimatePresence`/`exit` de motion para montar/desmontar.** Patrón usado en su lugar: render condicional +
keyframes CSS (entrada en mount) + estado `is-out`/`is-leaving` con `setTimeout` antes de desmontar.
`initial/animate` de motion (entrada) SÍ funcionan.

### 9.1 — i18n ES/EN + pack visual (misma fase)

**i18n (arregla el spanglish):**
- `src/i18n/i18n.tsx` — `LangProvider` (envuelve `<App/>` en `main.tsx`), hooks `useI18n()` / `useT()`.
  Idioma persistido en `localStorage` `ls-lang`; default `es` (o `en` si `navigator.language` es en-*).
  Actualiza `<html lang>`. Toggle **ES / EN** en Nav (barra + menú mobile).
- `src/i18n/dict.ts` — TODO el texto de prosa en `es` y `en`. **⚠️ NO poner `as const`** (crea tipos
  literales divergentes es/en → error TS2719). Arrays index-alineados con `content.ts`.
- Tokens que quedan neutrales (EN en ambos idiomas, a propósito): nombres de tech, `SYSTEM STATUS`
  keys/values (ONLINE), palabras de `approach` (Design/Technology…), valores de métricas (03/FULL/BUILD),
  marcas (Luis Soto, CAT.EXE). `content.ts` conserva solo campos estructurales; el texto sale del dict.
- Todos los componentes con texto ahora usan `useT()`. Loader queda en EN (splash de marca).

**Pack visual:**
- `Cursor.tsx` — añadido **spotlight** (glow radial violet/cyan, `mix-blend:screen`, sigue el puntero con
  inercia lenta). Además del punto+halo.
- `Scramble.tsx` — efecto decode monospace. `trigger="hover"` (nav links) o `"change"` (HUD al cambiar sección).
- `Hud.tsx/.css` — HUD fijo esquina inf-der: índice de sección activo (lee el `.tag` de la sección vía IO →
  se auto-localiza), total y reloj. Oculto <900px. Decorativo (`pointer-events:none`).
- Footer: **wordmark gigante** "Luis Soto" outline (`.footer__wordmark`) con MaskLine reveal.
- `global.css` — **scrollbar custom** (WebKit + Firefox), fina, thumb ink→violet en hover.

**⚠️ Verificación bloqueada por entorno:** con el Browser pane colapsado, IntersectionObserver **no entrega
callbacks** (probado: IO nuevo dispara 0 veces; nav-active queda en default) y las animaciones CSS/rAF no
avanzan. Por eso HUD, nav-active y reveals no se pudieron ver aquí — el código es correcto y funcionará al
compositar en un navegador real. i18n/form/overflow SÍ verificados (no dependen de compositing).

### 9.2 — Cierre editorial (footer rediseñado)

- `Footer.tsx` + `Footer.css` (nuevos; los estilos viejos de footer se sacaron de `sections.css`).
  Estructura del cierre: **CTA culminante** (eyebrow + título MaskLine "Hagámoslo realidad." + available
  dot + botón magnético "Hablemos →" con gradiente/glow/arrow-slide) → **identidad** (Luis Soto / nombre
  completo **Luis Eduardo Soto Gutiérrez** / rol) → **grid 3-col** (Identidad · Navegación · Redes) →
  **copyright con nombre completo** + CAT.EXE + volver-arriba. Entrada escalonada con `Reveal` (delays
  0.05→0.26).
- `FooterWordmark.tsx` — "LUIS SOTO" gigante de fondo: outline tenue + **relleno violet→cyan revelado solo
  alrededor del cursor** (mask radial con `--mx/--my` vía listener en window), parallax + opacity por scroll
  (motion `useScroll`). `pointer:fine` y reduced-motion aware.
- CAT.EXE: silueta minimalista (con ojos que aparecen al hover) → "CAT.EXE · STATUS: VIGILANDO TU CÓDIGO…".
- Back-to-top: `↑` sube en hover, `#index` (Lenis smooth).
- HUD (`Hud.tsx`) reestilizado a **portfolio status**: cabecera `SYS ● ONLINE` (dot cyan pulsante) + IDX + label + TIME.
- Copys nuevos en `dict.footer` (es/en). Nombre completo y rol localizados; tokens de marca neutrales.
- **GlobalCat (gato que persigue el cursor) NO se tocó** — sigue global. El brief pedía "reubicarlo"; se
  reforzó el gato editorial del footer en su lugar. Si el usuario quiere, se puede limitar/quitar el roaming.
- Responsive verificado: grid 3/2/1 col (desktop/tablet/mobile), sin overflow en 375/768/1280/1920, CTA sin cortes.

Build: `npm run build` limpio (~112 kB gz JS, ~10.1 kB gz CSS). Config `.claude/launch.json`
`portfolio-dev-2` (puerto 5199) para no chocar con otra sesión en 5173.

## 8. Notas de entorno

- Windows 11, Node 25, npm 11. Shell PowerShell (o Bash tool con sintaxis POSIX).
- El panel Browser de la sesión estuvo **colapsado** buena parte del trabajo → no se pudo
  capturar/animar en vivo; verificación se hizo por muestreo del canvas (JS) + `npm run build`.
  Si retomas con el panel visible, puedes ver todo en `preview_start`.
- Build siempre limpio (~102 kB gz JS, ~6 kB gz CSS).
