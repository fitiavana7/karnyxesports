import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Portrait from '@/components/Portrait'
import StatBar from '@/components/ui/StatBar'
import { IconArrowLeft, IconArrowRight } from '@/components/Icon'
import { getAdjacentPlayers, getPlayerBySlug } from '@/data/players'
import { useCountUp } from '@/hooks/useCountUp'
import { useReveal } from '@/hooks/useReveal'

function StatTile({ value, label }) {
  const [display, ref] = useCountUp(value, 1100)

  return (
    <div className="stat-tile reveal" ref={ref}>
      <b>{display}</b>
      <span>{label}</span>
    </div>
  )
}

function Bar({ label, value, max = 100, suffix = '%' }) {
  const [display, ref] = useCountUp(value, 1100)

  return (
    <div className="reveal" ref={ref}>
      <StatBar label={label} value={value} display={display} suffix={suffix} max={max} />
    </div>
  )
}

export default function PlayerPage() {
  const { slug } = useParams()
  const player = getPlayerBySlug(slug)
  const rootRef = useReveal()

  useEffect(() => {
    if (!player) return
    document.title = `${player.displayName} — KARNYX`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', `${player.displayName} — ${player.orgRole} chez KARNYX.`)
  }, [player])

  if (!player) {
    return (
      <div className="notfound">
        <div className="container">
          <p className="notfound__code">404</p>
          <h2>Joueur introuvable</h2>
          <p style={{ margin: '18px 0 30px' }}>
            Ce profil n'existe pas ou n'est plus dans l'effectif.
          </p>
          <Link to="/#effectif" className="btn btn--primary">
            Retour à l'effectif
          </Link>
        </div>
      </div>
    )
  }

  const { previous, next } = getAdjacentPlayers(slug)

  const stats = player.stats

  const tiles = stats && [
    { label: 'Matchs joués', value: player.stats.matches },
    { label: 'Buts', value: player.stats.goals },
    { label: 'Passes décisives', value: player.stats.assists },
    { label: 'Clean sheets', value: player.stats.cleanSheets },
  ]

  const bars = stats && [
    { label: 'Taux de victoire', value: player.stats.winRate },
    { label: 'Précision des passes', value: player.stats.passAccuracy },
    { label: 'Duels gagnés', value: player.stats.duelsWon },
  ]

  const meta = [
    { label: 'Nation', value: `${player.flag} ${player.nationality}` },
    { label: 'Numéro', value: player.number },
    { label: 'Arrivé le', value: player.joined },
  ]

  return (
    <div ref={rootRef}>
      <section className="player-hero texture-grid">
        <div className="container">
          <Link
            to="/#effectif"
            className="player-nav__label"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 26 }}
          >
            <IconArrowLeft /> Retour à l'effectif
          </Link>

          <div className="player-hero__grid">
            <div className="player-hero__figure reveal">
              <span className="player-hero__ghost" aria-hidden="true">
                {player.number}
              </span>
              {player.photo ? <img src={player.photo} alt={'Photo de ' + player.displayName} className="player-page__photo" /> : <Portrait hue={player.hue} label={`Portrait de ${player.displayName}`} />}
            </div>

            <div>
              <p className="player-hero__tag">{player.tag}</p>
              <h1 className="player-hero__name">
                {player.firstName} <span className="metal-text">{player.lastName}</span>
              </h1>
              <p className="player-hero__org">
                <span className="player-hero__org-label">Organisation</span>
                {player.orgRole}
              </p>

              <dl className="player-hero__meta">
                {meta.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container player-body">
          <div>
            <p className="eyebrow reveal">Biographie</p>
            <h2 className="reveal" style={{ marginTop: 14 }}>
              {player.displayName}
            </h2>

            {player.bio && (
              <p className="reveal" style={{ marginTop: 22, fontSize: '1.05rem', lineHeight: 1.85 }}>
                {player.bio}
              </p>
            )}

            {player.quote && (
              <blockquote className="quote reveal">
                <p>{player.quote}</p>
                <footer>
                  {player.displayName} — {player.tag}
                </footer>
              </blockquote>
            )}

            {player.strengths?.length > 0 && (
              <div className="chips reveal">
                {player.strengths.map((strength) => (
                  <span className="chip" key={strength}>
                    {strength}
                  </span>
                ))}
              </div>
            )}

            <div className="player-nav reveal">
              <Link to={`/${previous.slug}`} className="player-nav__link">
                <IconArrowLeft />
                <span>
                  <span className="player-nav__label">Joueur précédent</span>
                  <span className="player-nav__name">{previous.displayName}</span>
                </span>
              </Link>

              <Link to={`/${next.slug}`} className="player-nav__link player-nav__link--next">
                <span>
                  <span className="player-nav__label">Joueur suivant</span>
                  <span className="player-nav__name">{next.displayName}</span>
                </span>
                <IconArrowRight />
              </Link>
            </div>
          </div>

          {stats && (
          <div>
            <p className="eyebrow reveal">Statistiques</p>
            <h2 className="reveal" style={{ marginTop: 14 }}>
              Performances
            </h2>

            <div className="stat-grid reveal" style={{ marginTop: 30 }}>
              {tiles.map((tile) => (
                <StatTile key={tile.label} value={tile.value} label={tile.label} />
              ))}
            </div>

            <div
              className="stats__bars reveal"
              style={{ gridTemplateColumns: '1fr', marginTop: 26, padding: '26px 24px' }}
            >
              {bars.map((bar) => (
                <Bar key={bar.label} {...bar} />
              ))}
            </div>

            <div className="stats__detail reveal">
              {[
                { label: 'Tirs / match', value: player.stats.shotsPerGame },
                { label: 'Buts / match', value: player.stats.goalsPerMatch },
                { label: 'Numéro', value: player.number },
                { label: 'Expérience', value: player.stats.matches },
              ].map((cell) => (
                <div className="stats__cell" key={cell.label}>
                  <b>{cell.value}</b>
                  <span>{cell.label}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </section>
    </div>
  )
}
