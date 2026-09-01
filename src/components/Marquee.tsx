import type { ReactNode } from 'react'
import './Marquee.css'

type Props = {
  children: ReactNode
  reverse?: boolean
  speed?: number
}

/** CSS-only infinite marquee; duplicates content for a seamless loop. */
export function Marquee({ children, reverse = false, speed = 34 }: Props) {
  return (
    <div className="marquee" aria-hidden>
      <div
        className={`marquee__track ${reverse ? 'marquee__track--rev' : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="marquee__group">{children}</div>
        <div className="marquee__group">{children}</div>
      </div>
    </div>
  )
}
