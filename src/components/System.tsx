import { useEffect, useRef, useState } from 'react'
import { Reveal, MaskLine } from './Reveal'
import { systemStatus, metrics } from '../data/content'
import { FieldTrajectory } from './FieldTrajectory'
import { useT } from '../i18n/i18n'
import './System.css'

/** Isolated live clock so only this node re-renders each second. */
function Clock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    <span className="system__clock">
      {p(t.getHours())}:{p(t.getMinutes())}:<span className="c-violet">{p(t.getSeconds())}</span>
    </span>
  )
}

export function System() {
  const t = useT()
  const panelRef = useRef<HTMLDivElement>(null)

  return (
    <section id="system" className="section system">
      <div className="shell">
        <div className="system__head">
          <Reveal>
            <span className="tag">{t.system.tag}</span>
          </Reveal>
          <h2 className="display-2 system__title">
            <MaskLine>{t.system.title1}</MaskLine>
            <MaskLine delay={0.06}>
              / <span className="c-violet">Luis Eduardo</span>
            </MaskLine>
          </h2>
        </div>

        <Reveal>
          <div className="system__panel" ref={panelRef}>
            <FieldTrajectory className="system__field" />

            {/* window chrome */}
            <div className="system__topbar">
              <span className="system__dotset">
                <i /><i /><i />
              </span>
              <span className="system__path">~/luis-soto/system.status</span>
              <Clock />
            </div>

            <div className="system__grid">
              {/* left — status readout */}
              <div className="system__col">
                <span className="system__legend meta">{t.system.status}</span>
                <ul className="sysstatus">
                  {systemStatus.map((s, i) => (
                    <li
                      key={s.key}
                      className="sysstatus__row"
                      style={{ '--d': `${i * 90}ms` } as React.CSSProperties}
                    >
                      <span className="sysstatus__key">{s.key}</span>
                      <span className="sysstatus__lead" aria-hidden />
                      <span className="sysstatus__val">
                        <span className="sysstatus__pulse" />
                        {s.value}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="system__ready">
                  <span className="meta">{t.system.statusLabel}</span>
                  <span className="system__readytxt">
                    {t.system.ready1}{' '}
                    <span className="system__readyend">
                      <span className="c-violet">{t.system.ready2}</span>
                      <span className="system__caret" />
                    </span>
                  </span>
                </div>
              </div>

              {/* right — metrics + availability */}
              <div className="system__col system__col--right">
                <span className="system__legend meta">{t.system.signals}</span>
                <div className="sysmetrics">
                  {metrics.map((m, i) => (
                    <div key={m.label} className="sysmetric">
                      <span className="sysmetric__val">{m.value}</span>
                      <span className="sysmetric__label">{t.system.metrics[i].label}</span>
                      <span className="sysmetric__sub meta">{t.system.metrics[i].sub}</span>
                    </div>
                  ))}
                </div>

                <div className="system__avail">
                  <span className="system__availdot" />
                  <span className="system__availtxt">
                    {t.system.available}
                    <em className="meta">{t.system.availableSub}</em>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
