# Portfolio Luis Eduardo — Continuación (handoff)

Doc para retomar en otro chat. Estado a **2026-08-25**. Ver también `HANDOFF.md` (más viejo, base).

## Qué es
Portafolio personal de **Luis Eduardo Soto Gutiérrez** — Ingeniero en Informática / Full Stack.
Dirección visual: **dark + editorial + brutalista tipográfico + arte generativo (cosmos)**.
Ubicación: `C:\Users\luise\Servicios`. Fase 1 (visual) y Fase 2 (premium interactions) **completas + muchos refinamientos**.

## Stack / correr
Vite + React 18 + TypeScript. Libs: `motion` (Framer Motion), `lenis` (smooth scroll), `lucide-react`. CSS puro con variables (sin Tailwind). Fuentes Inter + JetBrains Mono.
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build   (SIEMPRE dejar limpio)
```
`.claude/launch.json`: `portfolio-dev` (5173) y `portfolio-dev-2` (5199, usado en estas sesiones para no chocar).

## Identidad / naming (CANÓNICO — no cambiar sin pedir)
- **Marca visual corta = LUIS EDUARDO** (nav, Hero "Luis"/"Eduardo" con violet en "do", System "Sistema / Luis Eduardo", FooterWordmark gigante, Loader monograma "LE", favicon "LE", og:site_name).
- **Nombre profesional completo = Luis Eduardo Soto Gutiérrez** (`<title>`, meta/OG/Twitter, About firma, Contact firma, footer identidad, copyright).
- Profesión: **Ingeniero en Informática** (EN: Computer Engineer). Rol: **Engineer / Developer**.
- `<title>` exacto: `Luis Eduardo Soto Gutiérrez — Ingeniero en Informática`.

## Datos reales (del CV, `public/cv.pdf`; ver memoria `luis-cv-data.md`)
- Email: **luiseduardosotoguti@gmail.com** (SIN "4" — confirmado; la auto-memory `userEmail` del sistema dice `...guti4@`, ESA está mal para el sitio).
- GitHub: **https://github.com/Luisesg1** · WhatsApp: **wa.me/56988823245** · LinkedIn: perfil real (encodeado `%C3%A9`).
- IG (usadas en frases del footer): **@Luchoesg_** y **@LeDu3D_**.
- Educación (INACAP): Analista Programador 2021–2023; Ingeniero titulado 2026 (2024–2025).
- Experiencia: Profesor de Tecnología (reemplazo) Liceo Bicentenario J.H. Jaque 2026; NTT Data Talent Lab 2023 (Java/Spring Boot).
- Proyectos reales (NO inventar más): Calculadora 3D, Gestión Institucional, DEFCA.

## Secciones (10 total, tags 00–09; HUD IDX 1-based → llega a 10/10)
Hero[00] · Intro[01] · Services[02] · Projects[03] (case study modal) · Tech[04] · System[05] · Profile[06] · Approach[07] · **Process[08] = "Cómo trabajo / HOW I WORK"** (5 pasos Discover·Design·Build·Deploy·Improve, timeline vertical con **línea de progreso scroll-driven**) · Contact[09] · Footer.
> Se probó "Outside the code" (Space/Football/Cats) → el usuario la **descartó**, no reponer.

## Features clave (fase 2 + refinamientos)
- **i18n ES/EN completo** (`src/i18n/`): `LangProvider`, hooks `useT`/`useI18n`, dict `es`/`en`. Toggle en Nav. **dict SIN `as const`** (rompe tipos). Default `es`, persist `localStorage ls-lang`.
- **Cursor custom** + spotlight (`data-cursor="view|explore|link"`), **magnetic buttons**, **loader "LE"**, **scroll progress** (riel + fill violet→cyan), **HUD** "portfolio status" (SYS ONLINE, IDX, sección, reloj).
- **Projects**: modal case study con **focus-trap** (Tab atrapado, foco al abrir, restaura al cerrar, Escape/backdrop). Textos PROBLEM/SOLUTION/RESULT reales.
- **Profile**: firma nombre completo + **timeline HORIZONTAL cronológico** (izq viejo → der nuevo, nodo actual violeta) + certificaciones reales.
- **Tech**: incluye Java/Spring Boot/Kotlin/Android (del CV).
- **Contact**: form premium (mailto, SIN backend aún), canales alineados (form y canales misma altura, contenido centrado), botón **Descargar CV** (`/cv.pdf`), firma.
- **Footer editorial**: CTA "Hagámoslo realidad" (magnético) → identidad (nombre completo) → grid 3-col (Identidad/Navegación/Redes) → **bloque "Gracias por llegar hasta aquí" CENTRADO** con botones **Copiar email** y **Sorpréndeme** → copyright (nombre completo) + CAT.EXE + volver-arriba. **Wordmark "LUIS EDUARDO"** gigante de fondo (letras separadas `letter-spacing 0.06em`, cursor-reveal del relleno, centrado, banda propia abajo).
- **Sorpréndeme**: efecto RANDOM cada click (evita repetir), **llenan todo el viewport** (usan `window.innerWidth/innerHeight`), 5 efectos: burst (flash + dots), lluvia, corazones, anillos, "fortune" (frase random — incluye IG @Luchoesg_/@LeDu3D_, chistosas, motivadoras, "toma agua"). Todo respeta reduced-motion.
- **Tito (GlobalCat)**: gato que persigue el cursor. **Click derecho → "¿Ocultar a Tito?"** (persiste en `localStorage tito-hidden`). Traer de vuelta: **chip flotante "Traer a Tito"** (abajo-izq, aparece solo si oculto) o el gato del footer. Reaparece en la vista actual y camina al cursor. Evento `window 'tito:show'`.
- **A11y**: skip-link "Saltar al contenido" (→ `#main`), focus-trap modal, `focus-visible`, `aria-label`s, reduced-motion, lang dinámico.
- **SEO**: `<title>`, description, OG, Twitter card, theme-color `#050505`, favicon LE.

## Pendiente (prioridad)
1. **DEPLOY** (Vercel/Netlify + dominio) — sigue solo local. Paso natural para compartir.
2. **Backend del form real** — hoy mailto. Ideal **Resend + función serverless** al desplegar en Vercel (todo en un paso).
3. **Analytics privacy-first** — snippet Plausible/Umami **ya comentado en `index.html`**; activar tras deploy (crear sitio con dominio + descomentar + poner dominio). Cookieless, sin banner.
4. **Proyectos** — case study quedó **sin screenshots** (usuario los encontró feos: chocaban con el dark editorial; se probó galería y híbrido mockup+carrusel, ambos descartados y revertidos). Preview = **mockup abstracto** on-brand (como siempre). Se mantuvo: botones `repo`/`demo` condicionales cerca del CTA (i18n `viewRepo/viewDemo`) + mini-link GitHub en tarjeta si `repo`. `content.ts` proyectos tienen `repo`/`demo` (sin `images`). Demo activa: **DEFCA `https://defca.app`**. Gestión demo real = `sistema.liceojhj.cl` (logueado, sin link). Calc3D = app **Android (Kotlin/Jetpack Compose/Material3/Hilt)**, sin demo web (tech/desc corregidos Electron→Android; carpeta `supabase` vista en repo Android pero NO en stack — confirmar, ver luis-cv-data). **Pendiente**: repos GitHub `Luisesg1` (ninguno público → `repo` vacío). Si en el futuro quiere imágenes, hay que buscar un tratamiento que combine con el dark editorial (frame/duotono), no capturas crudas.
5. **Lighthouse real** (ya desplegado) + pulidos menores.

## Gotchas (NO tropezar)
- **`AnimatePresence` `exit` NO desmonta en este proyecto** (main.tsx sin StrictMode). Para montar/desmontar: render condicional + keyframes CSS + estado `is-out`/`is-leaving` con `setTimeout`. `initial/animate` de entrada SÍ.
- **Browser pane suele colapsar** (`window.innerWidth` da 0 → medidas basura tipo `overflowX 118`, fuentes `min()` a 0) y **no composita** → IntersectionObserver NO entrega callbacks (reveals/nav-active/HUD no se ven), animaciones CSS/rAF no avanzan, **`setTimeout` throttled a ~1s** (cierres tardan más en el pane), screenshots fallan. Verificar por DOM/JS a ancho fijo (resize 1280); simular reveals con `.reveal{transform:none;opacity:1}`. Todo funciona en navegador real.
- **Buffer de consola del pane persiste** (muestra errores HMR viejos con `?t=` antiguos). No confiar; confiar en `tsc` limpio + que el componente renderice.
- **`.display`/`.display-2` (clamp gigante) pisan tamaños por igual especificidad** → subir especificidad (`.hero .hero__title .display`, `.profile .profile__title`, `.cs .cs__title`) y las palabras largas en español se cortan si no achicas (maskline tiene `overflow:hidden`).
- **FooterWordmark**: `scrollWidth` mide el span full-width, no el texto → medir texto con `Range`. Letras separadas para que el outline no se vea "glitch".
- Grids con tipografía gigante: `minmax(0,1fr)`. `html/body { overflow-x: hidden }`.

## Memorias relacionadas
`servicios-portfolio.md` (proyecto, decisiones, identidad) y `luis-cv-data.md` (datos reales + contacto confirmado) en `~/.claude/projects/C--Users-luise-Servicios/memory/`.
