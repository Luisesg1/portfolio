import { useEffect, useState } from 'react'

/**
 * Subtle football-inspired detail: a curved ball trajectory with a slow-moving
 * point tracing it, plus a couple of faint field lines. Decorative only.
 */
export function FieldTrajectory({ className }: { className?: string }) {
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const path = 'M -20 150 C 120 40, 300 40, 440 150'

  return (
    <svg
      className={className}
      viewBox="0 0 440 170"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      fill="none"
    >
      {/* faint field arc + center hint */}
      <circle cx="220" cy="230" r="120" stroke="var(--ink-10)" strokeWidth="1" />
      <line x1="220" y1="0" x2="220" y2="170" stroke="var(--ink-10)" strokeWidth="1" />

      {/* trajectory */}
      <path
        d={path}
        stroke="url(#traj)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        opacity="0.5"
      />
      <defs>
        <linearGradient id="traj" x1="0" y1="0" x2="440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--violet)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--violet)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* traveling ball */}
      <circle r="3" fill="var(--cyan)">
        <animate attributeName="opacity" values="0;1;1;0" dur="6s" repeatCount="indefinite" />
        {animate && (
          <animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" path={path} />
        )}
      </circle>
    </svg>
  )
}
