import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import './ProjectViewer.css'

type Orient = 'portrait' | 'landscape'

/**
 * Universal project image viewer — a premium fullscreen explorer used by every
 * project regardless of format (phone screenshots, web/ERP dashboards, vertical
 * or horizontal shots). It adapts per image: portrait shots get a device-like
 * frame and fit by height; landscape shots use the available width. Controlled
 * by the parent (index + nav callbacks) so it stays in sync with any inline
 * carousel that opened it.
 *
 * Handles: soft scale/rise open animation, a subtle violet/blue halo, directional
 * fade+slide between images, keyboard (← → Esc), an auto counter, contain-fit so
 * no image ever deforms or crops, lazy neighbours and prefers-reduced-motion.
 */
export function ProjectViewer({
  images,
  screens,
  accent,
  title,
  unit,
  index,
  onPrev,
  onNext,
  onClose,
  labels,
}: {
  images: readonly string[]
  screens: readonly string[]
  accent: string
  title: string
  unit: string
  index: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
  labels: { prev: string; next: string }
}) {
  const n = images.length
  const [orient, setOrient] = useState<Record<number, Orient>>({})
  const prevIndex = useRef(index)
  const dirRef = useRef(0)

  // Direction of the last real index change (captured during render so it
  // survives unrelated re-renders — e.g. when an image reports its orientation).
  if (index !== prevIndex.current) {
    const raw = index > prevIndex.current ? 1 : -1
    // wrap-around: last→first reads as "next", first→last as "prev"
    const wrap = Math.abs(index - prevIndex.current) === n - 1 && n > 1
    dirRef.current = wrap ? -raw : raw
    prevIndex.current = index
  }

  // keyboard — capture Esc/arrows before any underlying handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowRight') {
        e.stopPropagation()
        onNext()
      } else if (e.key === 'ArrowLeft') {
        e.stopPropagation()
        onPrev()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [onNext, onPrev, onClose])

  const pad = (x: number) => String(x).padStart(2, '0')
  const o = orient[index] || 'portrait'
  const slide = dirRef.current > 0 ? 'from-right' : dirRef.current < 0 ? 'from-left' : 'none'

  return createPortal(
    <div
      className="pv"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${screens[index] || `${index + 1}`}`}
      style={{ '--accent': accent } as React.CSSProperties}
    >
      <span className="pv__halo" aria-hidden />

      <button className="pv__close" onClick={onClose} aria-label="Cerrar" data-cursor="link">
        <span className="pv__close-lbl">Close</span>
        <X size={18} strokeWidth={1.6} />
      </button>

      {n > 1 && (
        <button
          className="pv__arr pv__arr--prev"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label={labels.prev}
          data-cursor="link"
        >
          <span aria-hidden>‹</span>
        </button>
      )}

      <figure className={`pv__fig pv__fig--${o}`} onClick={(e) => e.stopPropagation()}>
        <div key={index} className={`pv__slide pv__slide--${slide}`}>
          <img
            className={`pv__img pv__img--${o}`}
            src={images[index]}
            alt={`${title} — ${screens[index] || index + 1}`}
            draggable={false}
            onLoad={(e) => {
              const im = e.currentTarget
              const kind: Orient = im.naturalHeight >= im.naturalWidth ? 'portrait' : 'landscape'
              setOrient((prev) => (prev[index] === kind ? prev : { ...prev, [index]: kind }))
            }}
          />
        </div>
        <figcaption className="pv__cap">
          <span className="pv__count">
            {unit} {pad(index + 1)} <i>/</i> {pad(n)}
          </span>
          {screens[index] && <span className="pv__scrlabel">{screens[index]}</span>}
        </figcaption>
      </figure>

      {n > 1 && (
        <button
          className="pv__arr pv__arr--next"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label={labels.next}
          data-cursor="link"
        >
          <span aria-hidden>›</span>
        </button>
      )}

      {/* preload neighbours so nav feels instant, without mounting them visibly */}
      {n > 1 && (
        <div className="pv__preload" aria-hidden>
          <img src={images[(index + 1) % n]} alt="" loading="lazy" />
          <img src={images[(index - 1 + n) % n]} alt="" loading="lazy" />
        </div>
      )}
    </div>,
    document.body,
  )
}
