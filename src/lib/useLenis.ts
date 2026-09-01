import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Smooth scrolling + in-page anchor navigation. Lenis is skipped under reduced
 * motion, but the anchor handler is always installed (falling back to native
 * smooth scrollIntoView) so clicking "#contact" etc. always scrolls the page
 * and never triggers a default navigation/reload.
 */
export function useLenis() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let lenis: Lenis | null = null
    let raf = 0
    if (!reduce) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      const loop = (time: number) => {
        lenis!.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }
    // expose so overlays (mobile menu) can stop/start scrolling
    ;(window as unknown as { lenis?: Lenis | null }).lenis = lenis

    // anchor links -> controlled scroll (never a native jump/reload)
    const onClick = (e: MouseEvent) => {
      // let the browser handle modifier-clicks (open in new tab, etc.)
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return
      const el = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!el) return
      const id = el.getAttribute('href')!
      if (id.length < 2) return
      const target = document.querySelector(id) as HTMLElement | null
      if (!target) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target, { offset: -20 })
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    document.addEventListener('click', onClick)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis?.destroy()
      ;(window as unknown as { lenis?: Lenis | null }).lenis = null
    }
  }, [])
}
