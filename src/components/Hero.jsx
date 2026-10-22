import { Link } from 'react-router-dom'
import { team, teamStats } from '@/data/team'
import { asset } from '@/lib/assets'

const KPIS = [
  { value: teamStats.matches, label: 'Matchs joués' },
  { value: teamStats.wins, label: 'Victoires' },
  { value: teamStats.points, label: 'Points' },
  { value: `${team.rank}e`, label: 'Division 1' },
]

export default function Hero() {
  return (
    <section className="hero texture-grid" id="accueil">
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="hero__badge anim-fade-in">
            <span className="hero__dot" />
            <b>{team.region}</b> · {team.competition} · Depuis {team.foundedLabel}
          </p>

          <h1 className="hero__title anim-fade-up">
            <span className="metal-text">KARNYX</span>
          </h1>

          <p className="hero__tagline anim-fade-up" style={{ '--reveal-delay': '80ms' }}>
            {team.slogan}
          </p>

          <p className="hero__motto anim-fade-up" style={{ '--reveal-delay': '120ms' }}>
            {team.motto}
          </p>

          <p className="hero__desc anim-fade-up" style={{ '--reveal-delay': '160ms' }}>
            {team.baseline}
          </p>

          <div className="hero__actions anim-fade-up" style={{ '--reveal-delay': '240ms' }}>
            <Link to="/#effectif" className="btn btn--primary">
              Découvrir l'effectif
            </Link>
            <Link to="/#evenement" className="btn btn--ghost">
              Prochain événement
            </Link>
          </div>

          <dl className="hero__stats anim-fade-up" style={{ '--reveal-delay': '320ms' }}>
            {KPIS.map((kpi) => (
              <div className="hero__stat" key={kpi.label}>
                <dt className="visually-hidden">{kpi.label}</dt>
                <dd>
                  <b>{kpi.value}</b>
                  <span>{kpi.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__visual">
          <span className="hero__glow" aria-hidden="true" />
          <span className="hero__ring" aria-hidden="true" />
          <img
            src={asset('emblem.jpg')}
            alt="Emblème KARNYX"
            className="hero__emblem anim-float"
            width="460"
            height="460"
          />
          <div className="hero__ticks corner-ticks" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  )
}
