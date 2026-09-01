import { useEffect, useState } from 'react'
import './Loader.css'

/**
 * Brief premium intro: "LS" monogram + a hairline progress sweep, then a clean
 * curtain-up. ~900ms then it lifts away. Skipped for reduced-motion or repeat
 * visits within the session, so it never feels like a real loading screen.
 * Pure state + CSS transitions (no AnimatePresence) for reliable unmount.
 */
export function Loader() {
  const skip =
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ls-intro') === '1')

  const [mounted, setMounted] = useState(!skip)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = 'hidden'
    try {
      sessionStorage.setItem('ls-intro', '1')
    } catch {
      /* ignore */
    }
    const lift = setTimeout(() => setLeaving(true), 700)
    const unmount = setTimeout(() => {
      setMounted(false)
      document.body.style.overflow = ''
    }, 1250)
    return () => {
      clearTimeout(lift)
      clearTimeout(unmount)
      document.body.style.overflow = ''
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className={`loader ${leaving ? 'is-leaving' : ''}`}>
      <div className="loader__inner">
        <span className="loader__mark">
          L<span className="c-violet">E</span>
        </span>
        <span className="loader__name">Luis Eduardo — Engineer / Developer</span>
        <span className="loader__bar">
          <span className="loader__fill" />
        </span>
      </div>
    </div>
  )
}
