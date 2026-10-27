import { Link } from 'react-router-dom'
import Portrait from './Portrait'

const ARROW = (
  <svg width="12" height="8" viewBox="0 0 14 10" fill="none" aria-hidden="true">
    <path d="M9 1L13 5L9 9M13 5H0" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

function getShortRole(role = '') {
  if (!role) return ''
  let r = role
  r = r.replace(' et Joueur', '')
  r = r.replace('Joueur et ', '')
  r = r.replace('Vice-président', 'Vice-prés.')
  r = r.replace('Secrétaire Général', 'Secr. Général')
  return r.trim()
}

export default function PlayerCard({ player }) {
  const shortRole = getShortRole(player.orgRole)

  return (
    <Link to={`/${player.slug}`} className="player-card player-card--org shimmer reveal">
      <div className="player-card__top">
        <span className="player-card__tag">{player.tag}</span>
        {shortRole ? <span className="player-card__role-badge">{shortRole}</span> : null}
      </div>

      <div className="player-card__figure">
        {player.photo ? <img src={player.photo} alt={'Photo de ' + player.displayName} className="player-card__photo" /> : <Portrait hue={player.hue} label={`Portrait de ${player.displayName}`} />}
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
