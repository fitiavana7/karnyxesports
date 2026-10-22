import { standings, standingsColumns } from '@/data/standings'
import { team, teamStats } from '@/data/team'
import { asset } from '@/lib/assets'

export default function Standings() {
  return (
    <div className="standings reveal">
      <div className="standings__head">
        <div>
          <p className="standings__eyebrow">
            Classement final · {team.competition} · {team.division}
          </p>
          <h3 className="standings__title">{team.season}</h3>
        </div>
        <span className="standings__rank">
          <b>{team.rank}e</b>
          <span>sur {teamStats.teams} équipes</span>
        </span>
      </div>

      <div className="standings__scroll">
        <table className="standings__table">
          <caption className="visually-hidden">
            Classement final de la {team.competition} — {team.division}, saison {team.season}.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="standings__pos">
                #
              </th>
              <th scope="col" className="standings__name">
                Équipe
              </th>
              {standingsColumns.map((column) => (
                <th scope="col" key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr key={row.team} className={row.isTeam ? 'is-team' : undefined}>
                <td className="standings__pos">
                  {row.pos}
                  {row.isTeam && <span className="standings__flag">3e</span>}
                </td>
                <th scope="row" className="standings__name">
                  {row.team}
                </th>
                {standingsColumns.map((column) => (
                  <td
                    key={column.key}
                    className={column.key === 'points' ? 'standings__pts' : undefined}
                  >
                    {column.key === 'diff' && row.diff > 0 ? `+${row.diff}` : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="standings__foot">
        <p className="standings__source">
          Source : classement officiel CEM, dernière journée.
        </p>
        <a className="standings__capture" href={asset('classement.jpg')} target="_blank" rel="noreferrer">
          <img src={asset('classement.jpg')} alt="Capture du classement final de la CEM Premier League" />
          <span>Voir la capture</span>
        </a>
      </div>
    </div>
  )
}
