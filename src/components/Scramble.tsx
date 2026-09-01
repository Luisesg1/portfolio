import { useEffect, useRef, useState } from 'react'

const GLYPHS = '01<>/{}[]#*+=—$%&ABCDEFGHKLMNPRSTXZ'

function scrambleTo(
  target: string,
  onFrame: (s: string) => void,
  onDone: () => void,
  speed = 1,
) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    onFrame(target)
    onDone()
    return () => {}
  }
  let frame = 0
  const total = target.length
  let raf = 0
  const tick = () => {
    let out = ''
    const revealed = Math.floor(frame / (2 / speed))
    for (let i = 0; i < total; i++) {
      const ch = target[i]
      if (ch === ' ') {
        out += ' '
      } else if (i < revealed) {
        out += ch
      } else {
        out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
    }
    onFrame(out)
    frame++
    if (revealed >= total) {
      onFrame(target)
      onDone()
      return
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

type Props = {
  text: string
  className?: string
  /** 'hover' scrambles on pointer enter; 'change' scrambles whenever text changes */
  trigger?: 'hover' | 'change'
  speed?: number
}

/** Monospace decode/scramble effect. Fits the technical, editorial aesthetic. */
export function Scramble({ text, className, trigger = 'hover', speed = 1 }: Props) {
  const [display, setDisplay] = useState(text)
  const cancelRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (trigger !== 'change') {
      setDisplay(text)
      return
    }
    cancelRef.current?.()
    cancelRef.current = scrambleTo(text, setDisplay, () => {}, speed)
    return () => cancelRef.current?.()
  }, [text, trigger, speed])

  const run = () => {
    if (trigger !== 'hover') return
    cancelRef.current?.()
    cancelRef.current = scrambleTo(text, setDisplay, () => {}, speed)
  }

  return (
    <span className={className} onPointerEnter={run}>
      {display}
    </span>
  )
}
