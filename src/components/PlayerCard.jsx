import { Link } from 'react-router-dom'
import Portrait from './Portrait'

const ARROW = (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
    <path d="M9 1L13 5L9 9M13 5H0" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export default function PlayerCard({ player }) {
  return (
    <Link to={`/${player.slug}`} className="player-card shimmer reveal">
      <div className="player-card__top">
        <span className="player-card__tag">{player.tag}</span>
      </div>

      <div className="player-card__figure">
        <Portrait hue={player.hue} label={`Portrait de ${player.displayName}`} />
      </div>

      <div className="player-card__body">
        <h3 className="player-card__name">{player.displayName}</h3>

        <div className="player-card__foot">
          <span className="player-card__cta">
            Profil {ARROW}
          </span>
        </div>
      </div>
    </Link>
  )
}
