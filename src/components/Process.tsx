import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Reveal, MaskLine } from './Reveal'
import { process } from '../data/content'
import { useT } from '../i18n/i18n'

export function Process() {
  const t = useT()
  const listRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 70%', 'end 60%'],
  })
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="process" className="section process">
      <div className="shell">
        <div className="process__head">
          <Reveal>
            <span className="tag">{t.process.tag}</span>
          </Reveal>
          <h2 className="display-2 process__title">
            <MaskLine>{t.process.t1}</MaskLine>
            <MaskLine delay={0.06}>
              <span className="c-violet">{t.process.t2}</span>
            </MaskLine>
          </h2>
        </div>

        <div className="process__list" ref={listRef}>
          <span className="process__line" aria-hidden />
          <motion.span className="process__line-fill" style={{ scaleY: fillScale }} aria-hidden />
          {process.map((p, i) => (
            <Reveal key={p.n} className="proc" y={40} delay={i * 0.06}>
              <span className="proc__node" aria-hidden />
              <span className="proc__n">{p.n}</span>
              <div className="proc__body">
                <h3 className="proc__title h3">{t.process.items[i].title}</h3>
                <p className="proc__desc">{t.process.items[i].desc}</p>
              </div>
              <span className="proc__bar" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
