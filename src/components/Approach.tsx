import { Reveal, MaskLine } from './Reveal'
import { OutlineText } from './OutlineText'
import { useT } from '../i18n/i18n'

export function Approach() {
  const t = useT()
  return (
    <section className="section approach">
      <div className="shell">
        <Reveal>
          <span className="tag">{t.approach.tag}</span>
        </Reveal>

        <h2 className="display approach__title">
          <MaskLine>{t.approach.t1}</MaskLine>
          <MaskLine delay={0.08}>
            <OutlineText>{t.approach.t2}</OutlineText>
          </MaskLine>
          <MaskLine delay={0.16}>
            <span className="c-coral">{t.approach.t3}</span>
          </MaskLine>
        </h2>

        <ul className="approach__list">
          {t.approach.words.map((a, i) => (
            <Reveal key={a} as="li" delay={i * 0.05} className="approach__item">
              <span className="approach__n meta">0{i + 1}</span>
              <span className="approach__word">{a}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
