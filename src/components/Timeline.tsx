import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import './Timeline.css'

const ease = [0.22, 1, 0.36, 1] as const

export type TimelineItem = {
  year: string
  title: string
  place: string
  tag: string
}

/**
 * Editorial career timeline. Vertical on mobile (rail on the left, content on the
 * right), horizontal on desktop (a thin rail with nodes, content dropping below).
 * A scroll-linked progress fill traces the rail (violet → cyan), a small metadata
 * counter tracks position, and each entry reveals year → title → org → tag.
 *
 * `items` must already be in chronological (oldest → newest) display order.
 */
export function Timeline({
  items,
  eduTag,
  label,
}: {
  items: readonly TimelineItem[]
  eduTag: string
  label: string
}) {
  const reduce = useReducedMotion()
  const railRef = useRef<HTMLDivElement>(null)
  const n = items.length

  // Scroll drives the rail fill + the position counter. The window is generous so
  // the fill completes a little before the section leaves the viewport.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 82%', 'end 55%'],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })

  const [scrollIdx, setScrollIdx] = useState(0)
  useMotionValueEvent(fill, 'change', (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.round(v * (n - 1))))
    setScrollIdx(i)
  })

  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const active = hoverIdx ?? scrollIdx

  // Reveal choreography — rapid + smooth, no bounce. Reduced motion keeps opacity.
  const list: Variants = {
    out: {},
    in: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.05 } },
  }
  const entry: Variants = {
    out: {},
    in: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
  }
  const node: Variants = reduce
    ? { out: { opacity: 0 }, in: { opacity: 1 } }
    : {
        out: { scale: 0, opacity: 0 },
        in: { scale: 1, opacity: 1, transition: { duration: 0.4, ease } },
      }
  const field: Variants = reduce
    ? { out: { opacity: 0 }, in: { opacity: 1 } }
    : {
        out: { opacity: 0, y: 8 },
        in: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
      }

  return (
    <div className="tline">
      <div className="tline__head">
        <span className="meta tline__label">{label}</span>
        <span className="meta tline__counter" aria-hidden>
          {String(active + 1).padStart(2, '0')} <i>/</i> {String(n).padStart(2, '0')}
        </span>
      </div>

      <motion.div
        ref={railRef}
        className="tline__grid"
        style={{ ['--p' as string]: fill, ['--n' as string]: n }}
        variants={list}
        initial="out"
        whileInView="in"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* base rail + scroll-linked progress fill (transform-driven) */}
        <span className="tline__rail" aria-hidden>
          <span className="tline__rail-fill" />
        </span>

        {items.map((it, i) => {
          const isEdu = it.tag === eduTag
          return (
            <motion.article
              key={it.title}
              className={`tline__item ${i === active ? 'is-active' : ''} ${
                hoverIdx !== null && hoverIdx !== i ? 'is-dim' : ''
              }`}
              variants={entry}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <motion.span className="tline__node" variants={node} aria-hidden>
                <span className="tline__node-core" />
              </motion.span>
              <span className="tline__connector" aria-hidden />

              <motion.div className="tline__body" variants={entry}>
                <motion.span className="tline__year" variants={field}>
                  {it.year}
                </motion.span>
                <motion.h3 className="tline__title" variants={field}>
                  {it.title}
                </motion.h3>
                <motion.span className="tline__place meta" variants={field}>
                  {it.place}
                </motion.span>
                <motion.span
                  className={`tline__tag ${isEdu ? 'tline__tag--edu' : ''}`}
                  variants={field}
                >
                  {it.tag}
                </motion.span>
              </motion.div>
            </motion.article>
          )
        })}
      </motion.div>
    </div>
  )
}
