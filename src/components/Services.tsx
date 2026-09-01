import { useState } from 'react'
import { Reveal, MaskLine } from './Reveal'
import { services } from '../data/content'
import { useT } from '../i18n/i18n'

export function Services() {
  const t = useT()
  const [hover, setHover] = useState<string | null>(null)

  return (
    <section id="services" className="section services">
      <div className="shell">
        <div className="services__head">
          <Reveal>
            <span className="tag">{t.services.tag}</span>
          </Reveal>
          <h2 className="display-2 services__title">
            <MaskLine>{t.services.t1}</MaskLine>
            {t.services.t2 && <MaskLine delay={0.06} className="services__i">{t.services.t2}</MaskLine>}
            <MaskLine delay={0.12}>
              <span className="c-blue">{t.services.t3}</span>
            </MaskLine>
          </h2>
        </div>

        <ul className="services__list">
          {services.map((s, i) => (
            <li
              key={s.n}
              className={`srv ${hover === s.n ? 'is-hover' : ''} ${hover && hover !== s.n ? 'is-dim' : ''}`}
              onMouseEnter={() => setHover(s.n)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="srv__n meta">{s.n} /</span>
              <h3 className="srv__title h3">{t.services.items[i].title}</h3>
              <p className="srv__desc">{t.services.items[i].desc}</p>
              <div className="srv__tags">
                {s.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <span className="srv__arrow" aria-hidden>↗</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
