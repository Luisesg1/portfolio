# Prompt para continuar — Pendiente #4: Proyectos reales (imágenes + repos)

Copia esto en un chat nuevo dentro de `C:\Users\luise\Servicios`.

---

Trabajo en mi portfolio (Vite + React 18 + TS, CSS puro con variables, sin Tailwind).
Lee `CONTINUAR.md` y la memoria antes de tocar nada. Fase 1 y 2 completas; ahora quiero el **pendiente #4: proyectos reales**.

## Objetivo
Reemplazar los mockups genéricos y el placeholder del case study por **contenido real** de mis 3 proyectos, y agregar **links a los repos de GitHub**.

## Estado actual (para ubicarte)
- Datos: `src/data/content.ts` → `export const projects` (array `as const`). 3 proyectos: **Calculadora 3D** (01), **Gestión Institucional** (02), **DEFCA** (03). Cada uno: `n, title, category, desc, tech[], accent, year, role, stack[], problem, solution, result`.
- Lista + tarjeta: `src/components/Projects.tsx` (componente `Mockup` = UI falsa dibujada con divs).
- Modal case study: `src/components/CaseStudy.tsx` (bloque `.cs__preview` = placeholder falso, líneas y grid).
- i18n: textos ES/EN en `src/i18n/dict.ts` bajo `projects.items[]`. NO usar `as const` en el dict (rompe tipos).
- Imágenes reales van en `public/` (ej. `public/projects/calc3d-1.png`) y se sirven como `/projects/calc3d-1.png`.

## Qué hacer
1. Agregar campos nuevos a cada proyecto en `content.ts`:
   - `repo?: string` (URL GitHub; mi user es `Luisesg1`)
   - `demo?: string` (URL demo en vivo, si hay)
   - `images?: string[]` (rutas tipo `/projects/xxx.png`)
   Como `projects` es `as const`, ajusta el tipo `Project` en `CaseStudy.tsx` (`(typeof projects)[number]`) — verifica que los opcionales no rompan `tsc`.
2. En **CaseStudy.tsx**: si el proyecto tiene `images`, reemplazar el placeholder `.cs__preview` por una galería real (`<img>` con `loading="lazy"`, `alt`, `max-width:100%`, respeta `overflow-x:auto` si scrollea). Si NO hay imágenes, mantener el mockup actual como fallback.
3. En **CaseStudy.tsx**: agregar botones/links reales a `repo` y `demo` (target `_blank`, `rel="noopener noreferrer"`, `data-cursor="link"`), solo si existen. Ubícalos cerca del CTA de contacto.
4. Opcional: en la tarjeta de `Projects.tsx`, un mini-link a GitHub si `repo` existe.
5. i18n: si agregas labels nuevos ("Ver repositorio", "Ver demo", "View repo", "Live demo"), ponlos en `dict.ts` ES/EN, no hardcodeados.
6. `npm run build` limpio (`tsc -b && vite build`) al final.

## Lo que necesito darte YO (pídemelo primero)
- URL de cada repo en GitHub (o cuáles son privados/no van).
- Screenshots reales de cada proyecto (o dímelo y uso un placeholder decente por ahora).
- Si hay demo en vivo de alguno.

## Gotchas del proyecto (respétalos)
- `AnimatePresence` `exit` NO desmonta aquí (sin StrictMode). El modal ya maneja su salida con estado `closing` + `setTimeout`. No romper eso.
- `.display`/`.display-2` (clamp gigante) pisan tamaños por especificidad — si agregas títulos, sube especificidad.
- Browser pane no compone bien (`innerWidth` 0). Verifica con `tsc` limpio + navegador real, no el pane.
- No inventar proyectos ni métricas falsas. Solo estos 3, datos reales.

Arranca preguntándome los repos e imágenes.
