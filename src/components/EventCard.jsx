import { nextEvent } from '@/data/event'
import { team } from '@/data/team'
import { asset } from '@/lib/assets'

export default function EventCard() {
  return (
    <section className="section section--deep texture-grid" id="evenement">
      <div className="container">
        <div className="event">
          <figure className="event__poster reveal">
            <img
              src={asset(nextEvent.poster)}
              alt={`Affiche officielle ${nextEvent.title} — ${nextEvent.competition}`}
              width="1600"
              height="1279"
            />
            <figcaption className="event__caption">
              Affiche officielle {nextEvent.organizer}
            </figcaption>
          </figure>

          <div className="event__body reveal">
            <p className="event__eyebrow">
              <span className="event__dot" />
              Prochain événement
            </p>

            <h2 className="event__title">{nextEvent.title}</h2>
            <p className="event__competition">{nextEvent.competition}</p>
            <p className="event__organizer">{nextEvent.organizer}</p>

            <div className="event__status">
              <span className="event__chip">{nextEvent.status}</span>
              <span className="event__chip event__chip--ghost">{team.division}</span>
            </div>

            <h3 className="event__teams-title">Équipes engagées</h3>
            <ul className="event__teams">
              {nextEvent.teams.map((entry) => (
                <li key={entry.name} className={entry.isTeam ? 'is-team' : undefined}>
                  {entry.name}
                </li>
              ))}
            </ul>

            <blockquote className="event__motto">
              <p>{nextEvent.motto}</p>
              <footer>KARNYX</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
