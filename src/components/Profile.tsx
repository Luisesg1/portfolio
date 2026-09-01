import { Reveal, MaskLine } from './Reveal'
import { useT } from '../i18n/i18n'

export function Profile() {
  const t = useT()
  return (
    <section id="about" className="section profile">
      <div className="shell">
        <Reveal>
          <span className="tag">{t.profile.tag}</span>
        </Reveal>

        <div className="profile__grid">
          <h2 className="display-2 profile__title">
            <MaskLine>{t.profile.t[0]}</MaskLine>
            <MaskLine delay={0.06}>
              <span className="c-blue">{t.profile.t[1]}</span>
            </MaskLine>
            <MaskLine delay={0.12}>{t.profile.t[2]}</MaskLine>
            <MaskLine delay={0.18}>{t.profile.t[3]}</MaskLine>
          </h2>

          <div className="profile__side">
            <Reveal delay={0.06} className="profile__id">
              <span className="profile__id-name">{t.footer.fullName}</span>
              <span className="meta profile__id-role">{t.footer.role}</span>
            </Reveal>
            <Reveal delay={0.1} variant="blur">
              <p className="lead">{t.profile.lead}</p>
            </Reveal>

            <div className="profile__block">
              <span className="meta profile__block-label">{t.profile.certsLabel}</span>
              <ul className="profile__certs">
                {t.profile.certs.map((c) => (
                  <li key={c} className="profile__cert">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* horizontal trajectory timeline (full width) */}
        <div className="profile__block profile__block--tl">
          <span className="meta profile__block-label">{t.profile.timelineLabel}</span>
          <div className="profile__timeline">
            <span className="profile__timeline-line" aria-hidden />
            {[...t.profile.timeline].reverse().map((tl, i) => (
              <Reveal key={tl.title} delay={0.08 + i * 0.05} className="tl">
                <span className="tl__node" aria-hidden />
                <span className="tl__year">{tl.year}</span>
                <h3 className="tl__title">{tl.title}</h3>
                <span className="meta tl__place">{tl.place}</span>
                <span className={`tl__tag ${tl.tag === t.profile.timeline[1].tag ? 'tl__tag--edu' : ''}`}>
                  {tl.tag}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
