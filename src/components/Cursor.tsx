import { useEffect, useRef } from 'react'
import { useI18n } from '../i18n/i18n'
import './Cursor.css'

/**
 * Premium custom cursor: a small precise dot + a soft trailing halo with
 * slight inertia. Reacts to interactive elements via `data-cursor`:
 *   data-cursor="view"    → label "VIEW PROJECT →" (project cards)
 *   data-cursor="explore" → label "EXPLORE →"      (images / media)
 *   data-cursor="link"    → halo expands           (text links)
 * Falls back sensibly for raw <a>/<button>. Desktop-only; fully disabled on
 * touch devices and when the user prefers reduced motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  // localized cursor labels; ref stays current so the once-run effect reads
  // the active language without re-binding listeners
  const { t } = useI18n()
  const labels = useRef(t.cursor)
  labels.current = t.cursor

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine) return

    const dot = dotRef.current!
    const halo = haloRef.current!
    const label = labelRef.current!
    const spot = spotRef.current!

    document.documentElement.classList.add('has-cursor')

    // target (real pointer) + eased halo/spotlight positions
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let hx = tx
    let hy = ty
    let sx = tx
    let sy = ty
    let raf = 0
    let visible = false

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        halo.style.opacity = '1'
        spot.style.opacity = '1'
      }
      // dot tracks 1:1 (precision); halo + spotlight ease in the loop
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`
    }

    const loop = () => {
      const ease = reduce ? 1 : 0.18
      hx += (tx - hx) * ease
      hy += (ty - hy) * ease
      halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%)`
      const sEase = reduce ? 1 : 0.08
      sx += (tx - sx) * sEase
      sy += (ty - sy) * sEase
      spot.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const setState = (state: string, text = '') => {
      halo.dataset.state = state
      // The dot is near-white for the dark site; over screenshots
      // (data-cursor="shot") swap it to violet so it stays visible on both
      // light shots (DEFCA/Gestión) and dark ones (Calc3D).
      dot.style.background = state === 'shot' ? 'var(--violet)' : ''
      if (text) {
        label.textContent = text
        label.dataset.on = '1'
      } else {
        delete label.dataset.on
      }
    }

    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(
        '[data-cursor],a,button,input,textarea,select,label',
      ) as HTMLElement | null
      if (!t) return setState('default')
      const kind = t.getAttribute('data-cursor')
      if (kind === 'view') return setState('view', labels.current.view)
      if (kind === 'explore') return setState('explore', labels.current.explore)
      if (kind === 'explore-app') return setState('explore', labels.current.exploreApp)
      if (kind === 'shot') return setState('shot')
      if (kind === 'link') return setState('link')
      const tag = t.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return setState('text')
      if (tag === 'button' || tag === 'a' || tag === 'label') return setState('button')
      setState('default')
    }

    const onDown = () => (halo.dataset.press = '1')
    const onUp = () => delete halo.dataset.press
    const onLeave = () => {
      dot.style.opacity = '0'
      halo.style.opacity = '0'
      spot.style.opacity = '0'
      visible = false
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={spotRef} className="cursor-spot" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={haloRef} className="cursor-halo" aria-hidden data-state="default">
        <div ref={labelRef} className="cursor-label" />
      </div>
    </>
  )
}
