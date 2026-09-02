import { motion, useScroll, useTransform, useMotionTemplate, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react'
import { MaskLine } from './Reveal'
import { ParticleField } from './ParticleField'
import { Magnetic } from './Magnetic'
import { useT } from '../i18n/i18n'
import './Hero.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const t = useT()
  // pick a friendly greeting once per load (by index so it survives ES/EN toggle)
  const [helloIdx] = useState(() => Math.floor(Math.random() * t.hero.hellos.length))
  const hello = t.hero.hellos[helloIdx % t.hero.hellos.length]
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const reduce = useReducedMotion()
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -60])
  const yViz = useTransform(scrollYProgress, [0, 1], [0, 90])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0])
  // On scroll-down the whole hero block softly fades AND blurs out; scrolling
  // back up reverses it (scroll-linked, so it works on touch without hover).
  // Kept readable for most of the scroll — the blur/fade only kick in past the
  // half-way point so the copy can actually be read on the way down.
  const contentFade = useTransform(scrollYProgress, [0.5, 0.92], [1, reduce ? 1 : 0])
  const blurPx = useTransform(scrollYProgress, [0.55, 0.9], [0, reduce ? 0 : 8])
  const contentFilter = useMotionTemplate`blur(${blurPx}px)`

  return (
    <section id="index" ref={ref} className="hero">
      {/* generative constellation */}
      <motion.div className="hero__viz" style={{ y: yViz, opacity: fade }} aria-hidden>
        <ParticleField className="hero__canvas" />
      </motion.div>

      {/* easter egg — a lone star */}
      <button className="hero__egg" aria-label="curious">
        <span className="hero__egg-star" />
        <span className="hero__egg-label">curious</span>
      </button>

      <div className="shell hero__inner">
        <motion.div
          className="hero__content"
          style={{ y: yContent, opacity: contentFade, filter: contentFilter }}
        >
          <motion.div
            className="hero__tagrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <span className="tag">{t.hero.tag}</span>
            <span className="meta hero__avail">
              <span className="hero__availdot" /> {t.hero.available}
            </span>
          </motion.div>

          <h1 className="hero__title">
            <MaskLine className="hero__line">
              <span className="display">Luis</span>
            </MaskLine>
            <MaskLine className="hero__line" delay={0.08}>
              <span className="display">
                Eduar<span className="c-violet">do</span>
              </span>
            </MaskLine>
          </h1>

          <motion.div
            className="hero__role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <span className="hero__roletext">
              {t.hero.role} <span className="hero__slash">/</span> {t.hero.roleAlt}
            </span>
          </motion.div>

          <motion.p
            className="hero__desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease }}
          >
            {t.hero.descA}
            <span className="c-violet">{t.hero.descHi}</span>
          </motion.p>

          <motion.div
            className="hero__meta-labels"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.72 }}
          >
            {t.hero.metaLabels.map((label, i) => (
              <span key={label} style={{ display: 'contents' }}>
                <span className={i === t.hero.metaLabels.length - 1 ? 'c-violet' : undefined}>
                  {label}
                </span>
                {i < t.hero.metaLabels.length - 1 && <span className="hero__sep">·</span>}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease }}
          >
            <Magnetic strength={9}>
              <a href="#work" className="btn btn--violet" data-cursor="link">
                {t.hero.cta1} <span className="arrow" aria-hidden>→</span>
              </a>
            </Magnetic>
            <Magnetic strength={9}>
              <a href="#contact" className="btn btn--ghost" data-cursor="link">
                {t.hero.cta2}
              </a>
            </Magnetic>

            <div className="hero__social">
              <a href="https://github.com/Luisesg1" target="_blank" rel="noreferrer" className="hero__soc" aria-label="GitHub" data-cursor="link">
                <Github size={18} strokeWidth={1.5} />
              </a>
              <a href="https://www.linkedin.com/in/luis-eduardo-soto-guti%C3%A9rrez-99a53a256" target="_blank" rel="noreferrer" className="hero__soc" aria-label="LinkedIn" data-cursor="link">
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
              <a href="mailto:luiseduardosotoguti@gmail.com" className="hero__soc" aria-label="Email" data-cursor="link">
                <Mail size={18} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          <motion.p
            className="hero__hello"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease }}
          >
            <span className="hero__hello-dot" aria-hidden />
            <span className="hero__hello-txt">{hello}</span>
          </motion.p>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero__scroll meta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <ArrowDown size={14} strokeWidth={1.5} /> {t.hero.scroll}
      </motion.a>
    </section>
  )
}
