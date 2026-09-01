import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

/**
 * Oversized editorial wordmark behind the footer. Very faint outline by default;
 * the fill is revealed only around the pointer (radial mask driven by CSS vars)
 * and the whole thing drifts with a subtle scroll parallax. Decorative / inert.
 */
export function FooterWordmark({ text = 'Luis Eduardo Soto Gutiérrez' }: { text?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -20])
  const opacity = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0.55, 1])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        // only bother updating while the footer is near the viewport
        if (r.bottom < 0 || r.top > window.innerHeight) return
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <motion.div ref={ref} className="footer__wm" style={{ y, opacity }} aria-hidden>
      {/* feMorphology filter: erode the filled silhouette and subtract it → a
          clean outer-edge outline with no per-glyph stroke seams (same fix as
          the section titles, applied here via a CSS filter so the HTML text
          keeps driving the centred full-width layout + hover reveal). */}
      <svg width="0" height="0" className="footer__wm-defs" aria-hidden>
        <filter id="footer-wm-outline" x="-5%" y="-5%" width="110%" height="110%">
          <feMorphology in="SourceAlpha" operator="erode" radius="1" result="eroded" />
          <feComposite in="SourceGraphic" in2="eroded" operator="out" />
        </filter>
      </svg>
      <span className="footer__wm-outline">{text}</span>
      <span className="footer__wm-fill">{text}</span>
    </motion.div>
  )
}
