import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks, team } from '@/data/team'
import { asset } from '@/lib/assets'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  const isHome = location.pathname === '/'
  const activeHash = location.hash.replace('#', '')

  const linkTo = (id) => (isHome ? `#${id}` : `/#${id}`)

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="nav__brand" aria-label="KARNYX — accueil">
            <img src={asset('emblem.jpg')} alt="" className="nav__mark" width="38" height="38" />
            <span className="nav__wordmark">
              KARNYX
              <span>eFootball</span>
            </span>
          </Link>

          <nav className="nav__links" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={linkTo(link.id)}
                className={`nav__link ${isHome && activeHash === link.id ? 'is-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav__actions">
            <Link to={linkTo('contact')} className="btn btn--primary nav__cta">
              Rejoindre l'équipe
            </Link>
            <button
              type="button"
              className={`nav__burger ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`nav__mobile ${open ? 'is-open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.id}
            to={linkTo(link.id)}
            className={isHome && activeHash === link.id ? 'is-active' : ''}
          >
            {link.label}
          </Link>
        ))}
        <Link to={linkTo('contact')}>Rejoindre l'équipe</Link>
        <span className="mono" style={{ color: 'var(--text-low)', fontSize: '0.7rem' }}>
          {team.region} · {team.competition} · {team.rank}e
        </span>
      </div>
    </>
  )
}
