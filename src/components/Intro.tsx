import { Reveal, MaskLine } from './Reveal'
import { useT } from '../i18n/i18n'

export function Intro() {
  const t = useT()
  return (
    <section className="section intro">
      <div className="shell">
        <Reveal>
          <span className="tag">{t.intro.tag}</span>
        </Reveal>

        <h2 className="intro__statement display-2">
          <MaskLine>{t.intro.l1}</MaskLine>
          <MaskLine delay={0.06}>{t.intro.l2}</MaskLine>
          <MaskLine delay={0.12}>
            <span className="c-blue">{t.intro.l3}</span>
          </MaskLine>
        </h2>

        <div className="intro__foot">
          <Reveal delay={0.1} variant="blur">
            <p className="lead intro__lead">{t.intro.lead}</p>
          </Reveal>
          <Reveal delay={0.2} className="intro__side">
            {t.intro.side.map((s) => (
              <span key={s} className="meta">
                {s}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
