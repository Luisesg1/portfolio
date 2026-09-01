import { useId, useLayoutEffect, useRef } from 'react'

/**
 * Clean outline title. `-webkit-text-stroke` AND a plain SVG stroke both trace
 * every glyph *contour*, so where a font builds a letter from overlapping
 * sub-shapes (Inter does this for N, A, D, R, M…) the hidden overlap seams show
 * up as stray internal line segments at the junctions.
 *
 * Fix: don't stroke the contours. Fill the glyph (which unions all sub-shapes
 * into one silhouette), erode that silhouette with `feMorphology`, and subtract
 * the eroded copy — leaving only a uniform outer-edge ring. Because morphology
 * works on the merged alpha, there are no internal seams on any glyph.
 *
 * The erode radius is scaled to the rendered font-size so the outline reads the
 * same relative weight from mobile to huge desktop titles. An invisible HTML
 * copy owns the layout (size, responsive scaling, reveal); the SVG overlays the
 * exact same box, so it can never clip or break the rhythm.
 */
export function OutlineText({ children }: { children: string }) {
  const glyphs = children.toUpperCase()
  const uid = useId().replace(/[:]/g, '')
  const filterId = `outline-${uid}`
  const textRef = useRef<SVGTextElement>(null)
  const morphRef = useRef<SVGFEMorphologyElement>(null)

  useLayoutEffect(() => {
    const sync = () => {
      const t = textRef.current
      const m = morphRef.current
      if (!t || !m) return
      const fs = parseFloat(getComputedStyle(t).fontSize) || 0
      // outline thickness ≈ 1.4% of the font size, clamped to stay a clean thin
      // ring at both extremes
      const r = Math.max(0.9, Math.min(2.4, fs * 0.0135))
      m.setAttribute('radius', r.toFixed(2))
    }
    sync()
    window.addEventListener('resize', sync)
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(sync).catch(() => {})
    }
    return () => window.removeEventListener('resize', sync)
  }, [glyphs])

  return (
    <span className="outline-text" aria-label={children}>
      <span className="outline-text__space" aria-hidden>
        {glyphs}
      </span>
      <svg className="outline-text__svg" aria-hidden>
        <defs>
          <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
            {/* shrink the merged silhouette, then keep only the part of the
                original the shrunk copy doesn't cover → the outline ring */}
            <feMorphology ref={morphRef} in="SourceAlpha" operator="erode" radius="1.3" result="eroded" />
            <feComposite in="SourceGraphic" in2="eroded" operator="out" />
          </filter>
        </defs>
        {/* y=50% + central baseline centres the glyphs in the reserved box */}
        <text ref={textRef} x="0" y="50%" dominantBaseline="central" filter={`url(#${filterId})`}>
          {glyphs}
        </text>
      </svg>
    </span>
  )
}
