import { useEffect, useRef, useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { ProjectViewer } from './ProjectViewer'
import './PhoneShowcase.css'

/**
 * Android app showcase — the interface presented directly (no device frame).
 * - Launch animation (scale 0.92→1, blur→sharp, opacity, staggered controls).
 * - Screen navigation with crossfade + directional slide + scale + blur.
 * - Editorial controls (SCREEN 0N / 0M · ← PREVIOUS / NEXT →).
 * - Click the screenshot to open it full-size in a lightbox.
 */
export function PhoneShowcase({
  images,
  screens,
  accent,
  title,
  labels,
}: {
  images: readonly string[]
  screens: readonly string[]
  accent: string
  title: string
  labels: { screen: string; prev: string; next: string; hint: string }
}) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const n = images.length

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + n) % n)

  // touch swipe (mobile / tablet)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let x0 = 0
    let y0 = 0
    const start = (e: TouchEvent) => {
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
    }
    const end = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - x0
      const dy = e.changedTouches[0].clientY - y0
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
    }
    stage.addEventListener('touchstart', start, { passive: true })
    stage.addEventListener('touchend', end, { passive: true })
    return () => {
      stage.removeEventListener('touchstart', start)
      stage.removeEventListener('touchend', end)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n])

  const pad = (x: number) => String(x).padStart(2, '0')

  return (
    <div className="ph" style={{ '--accent': accent } as React.CSSProperties}>
      <div className="ph__stage" ref={stageRef}>
        <div className="ph__space" aria-hidden>
          <span className="ph__glow" />
          <span className="ph__dust" />
        </div>
        <div className="ph__launch">
          <button
            className="ph__screen"
            onClick={() => setZoom(true)}
            aria-label={`${title} — ${screens[active] || `screen ${active + 1}`}`}
          >
            {images.map((src, i) => (
              <img
                key={src}
                className={`ph__scr ${
                  i === active ? 'is-cur' : i < active ? 'is-past' : 'is-future'
                }`}
                src={src}
                alt={`${title} — ${screens[i] || `screen ${i + 1}`}`}
                loading={i === 0 ? undefined : 'lazy'}
                draggable={false}
              />
            ))}
            <span className="ph__hint" aria-hidden>
              <span className="ph__hint-chip">
                <Maximize2 size={14} strokeWidth={1.7} />
                {labels.hint}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div className="ph__controls">
        <div className="ph__meta">
          <span className="ph__count">
            {labels.screen} {pad(active + 1)} <i>/</i> {pad(n)}
          </span>
          {screens[active] && <span className="ph__scrlabel">{screens[active]}</span>}
        </div>

        <div className="ph__nav">
          <button className="ph__navbtn" onClick={() => go(-1)} data-cursor="link" aria-label={labels.prev}>
            <span className="ph__arr ph__arr--l" aria-hidden>←</span>
            <span>{labels.prev}</span>
          </button>
          <button className="ph__navbtn" onClick={() => go(1)} data-cursor="link" aria-label={labels.next}>
            <span>{labels.next}</span>
            <span className="ph__arr ph__arr--r" aria-hidden>→</span>
          </button>
        </div>
      </div>

      {zoom && (
        <ProjectViewer
          images={images}
          screens={screens}
          accent={accent}
          title={title}
          unit={labels.screen}
          index={active}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          onClose={() => setZoom(false)}
          labels={{ prev: labels.prev, next: labels.next }}
        />
      )}
    </div>
  )
}
