import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

function useInView<T extends HTMLElement>(margin = '0px 0px -10% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // If IntersectionObserver unsupported, reveal immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // Reveal when in view, OR when the element is already above the
          // viewport (e.g. after an anchor jump to a lower section) so content
          // that was skipped past never stays stuck hidden.
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            setInView(true)
            io.disconnect()
          }
        })
      },
      { rootMargin: margin, threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])

  return { ref, inView }
}

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'span' | 'li' | 'p' | 'section'
  /** motion flavor — 'up' (default), 'blur' (fade+deblur), 'clip' (wipe up) */
  variant?: 'up' | 'blur' | 'clip'
}

/** Scroll-triggered reveal via IntersectionObserver + CSS. Variant-driven. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 34,
  as = 'div',
  variant = 'up',
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const Tag = as as 'div'
  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal--${variant} ${inView ? 'is-in' : ''} ${className ?? ''}`}
      style={{ '--rv-y': `${y}px`, transitionDelay: `${delay}s` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}

/** Masked line reveal — clips a block and slides content up from the edge. */
export function MaskLine({ children, className, delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLSpanElement>('0px 0px -6% 0px')
  return (
    <span ref={ref} className={`maskline ${className ?? ''}`}>
      <span
        className={`maskline__in ${inView ? 'is-in' : ''}`}
        style={{ transitionDelay: `${delay}s` }}
      >
        {children}
      </span>
    </span>
  )
}
