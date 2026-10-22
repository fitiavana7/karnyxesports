import { Link } from 'react-router-dom'
import { team, navLinks } from '@/data/team'
import { players } from '@/data/players'
import { asset } from '@/lib/assets'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <img src={asset('emblem.jpg')} alt="" className="footer__mark" width="48" height="48" />
              <span className="nav__wordmark">
                KARNYX
                <span>eFootball Mobile</span>
              </span>
            </div>
            <p className="footer__tagline">{team.slogan}</p>
            <p className="footer__league">
              {team.competition} — {team.division} · {team.rank}e place
            </p>
          </div>

          <div>
            <h4 className="footer__title">Navigation</h4>
            <nav className="footer__links" aria-label="Navigation de pied de page">
              <Link to="/">Accueil</Link>
              {navLinks.map((link) => (
                <Link key={link.id} to={`/#${link.id}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="footer__title">Effectif</h4>
            <nav className="footer__links" aria-label="Liste des joueurs">
              {players.slice(0, 6).map((player) => (
                <Link key={player.id} to={`/${player.slug}`}>
                  {player.displayName}
                </Link>
              ))}
              <Link to="/#effectif" style={{ color: 'var(--gold-500)' }}>
                Voir les 12 joueurs →
              </Link>
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {team.legalName} — {team.region}. Tous droits réservés.
          </span>
          <span>Créée en {team.foundedLabel}</span>
        </div>
      </div>
    </footer>
  )
}
