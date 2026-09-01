import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

type Props = {
  children: ReactNode
  className?: string
  /** max px the element shifts toward the pointer */
  strength?: number
}

/**
 * Magnetic hover: the element drifts a few px toward the pointer while it's
 * near, then springs back on leave. Subtle by design (default 10px).
 * No-op on touch / reduced-motion.
 */
export function Magnetic({ children, className, strength = 10 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 })

  const enabled =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e: React.PointerEvent) => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const relX = e.clientX - (r.left + r.width / 2)
    const relY = e.clientY - (r.top + r.height / 2)
    // clamp pull to `strength`
    const max = Math.max(r.width, r.height)
    mx.set((relX / max) * strength * 2)
    my.set((relY / max) * strength * 2)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y, display: 'inline-flex' }}
    >
      {children}
    </motion.span>
  )
}
