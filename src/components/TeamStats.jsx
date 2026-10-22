import SectionTitle from './ui/SectionTitle'
import StatBar from './ui/StatBar'
import Standings from './Standings'
import { teamStats, team } from '@/data/team'
import { useCountUp } from '@/hooks/useCountUp'

function Kpi({ value, label, delta, suffix, text }) {
  const [display, ref] = useCountUp(value ?? 0)

  return (
    <div className="kpi reveal" ref={ref}>
      <b className="kpi__value">
        {text ?? display}
        {suffix && <small>{suffix}</small>}
      </b>
      <span className="kpi__label">{label}</span>
      {delta && <span className="kpi__delta">{delta}</span>}
    </div>
  )
}

function Bar({ item }) {
  const [display, ref] = useCountUp(item.value, 1200, item.decimals ?? 0)

  return (
    <div className="reveal" ref={ref}>
      <StatBar label={item.label} value={item.value} display={display} suffix={item.suffix} max={item.max} />
    </div>
  )
}

export default function TeamStats() {
  return (
    <section className="section texture-grid" id="statistiques">
      <div className="container">
        <SectionTitle
          eyebrow="Statistiques"
          title="Le bilan de la saison"
          lead={`Dix-huit matchs de ${team.competition} — ${team.division}, ${team.season.toLowerCase()}. Troisième place du classement final, avec 34 points.`}
        />

        <div className="stats__kpis">
          <Kpi value={teamStats.matches} label="Matchs joués" delta={teamStats.season} />
          <Kpi value={teamStats.wins} label="Victoires" delta={`${teamStats.draws} nul · ${teamStats.losses} défaites`} />
          <Kpi value={teamStats.points} label="Points" delta={`${teamStats.teams} équipes`} />
          <Kpi text={`${team.rank}e`} label="Classement" delta={team.division} />
        </div>

        <div className="stats__bars">
          {teamStats.progression.map((item) => (
            <Bar key={item.label} item={item} />
          ))}
        </div>

        <div className="stats__detail reveal">
          {teamStats.detail.map((cell) => (
            <div className="stats__cell" key={cell.label}>
              <b>{cell.value}</b>
              <span>{cell.label}</span>
            </div>
          ))}
        </div>

        <div className="stats__standings">
          <Standings />
        </div>
      </div>
    </section>
  )
}
