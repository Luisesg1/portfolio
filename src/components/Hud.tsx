import { useEffect, useState } from 'react'
import { Scramble } from './Scramble'
import './Hud.css'

/**
 * Fixed corner HUD — an editorial "interface" detail. Shows the active section
 * index/label (read live from each section's `.tag`, so it stays localized) and
 * a running clock. Desktop-only (hidden under 900px). Decorative, inert.
 */
export function Hud() {
  const [label, setLabel] = useState('')
  const [num, setNum] = useState('00')
  const [total, setTotal] = useState(0)
  const [time, setTime] = useState('')
  const [atFooter, setAtFooter] = useState(false)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main section'))
    setTotal(sections.length)

    const parse = (el: Element) => {
      const tag = el.querySelector('.tag')?.textContent ?? ''
      // "[05 — Sistema]" → ["05", "Sistema"]
      const m = tag.replace(/[[\]]/g, '').split('—')
      const n = (m[0] || '').trim()
      const l = (m[1] || m[0] || '').trim()
      return { n, l }
    }

    let current = ''
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]?.target as HTMLElement | undefined
        if (top) {
          const id = top.dataset.hud
          if (id !== current) {
            current = id || ''
            // 1-based position (so the last section reads 10 / 10), not the tag number
            setNum(String(Number(id) + 1).padStart(2, '0'))
            const { l } = parse(top)
            if (l) setLabel(l.toUpperCase())
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] },
    )
    sections.forEach((s, i) => {
      ;(s as HTMLElement).dataset.hud = String(i)
      io.observe(s)
    })

    const clock = () => {
      const d = new Date()
      const p = (x: number) => String(x).padStart(2, '0')
      setTime(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`)
    }
    clock()
    const id = setInterval(clock, 1000)

    // hide the HUD once the giant footer wordmark is on screen, so it never
    // covers it (fall back to the footer element if the wordmark isn't found)
    const wm = document.querySelector('.footer__wm') || document.querySelector('#footer')
    let footerIO: IntersectionObserver | null = null
    if (wm) {
      footerIO = new IntersectionObserver(
        (entries) => setAtFooter(entries.some((e) => e.isIntersecting)),
        { threshold: 0.01 },
      )
      footerIO.observe(wm)
    }

    return () => {
      io.disconnect()
      footerIO?.disconnect()
      clearInterval(id)
    }
  }, [])

  return (
    <aside className={`hud ${atFooter ? 'is-hidden' : ''}`} aria-hidden>
      <div className="hud__head">
        <span className="hud__sys">
          <span className="hud__dot" />
          SYS
        </span>
        <span className="hud__online">ONLINE</span>
      </div>
      <div className="hud__row">
        <span className="hud__k">IDX</span>
        <span className="hud__v">
          {num} <span className="hud__slash">/</span> {String(total).padStart(2, '0')}
        </span>
      </div>
      <div className="hud__row hud__row--label">
        <Scramble text={label} trigger="change" speed={1.4} />
      </div>
      <div className="hud__row">
        <span className="hud__k">TIME</span>
        <span className="hud__v hud__time">{time}</span>
      </div>
    </aside>
  )
}
