import { motion, useScroll, useSpring } from 'motion/react'
import './ScrollProgress.css'

/** Ultra-thin top scroll indicator: faint full-width track + violet→cyan fill. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <div className="scrollprogress-track" aria-hidden>
      <motion.div className="scrollprogress" style={{ scaleX }} />
    </div>
  )
}
