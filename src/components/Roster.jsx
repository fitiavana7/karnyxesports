import SectionTitle from './ui/SectionTitle'
import PlayerCard from './PlayerCard'
import { players } from '@/data/players'

export default function Roster() {
  return (
    <section className="section section--deep texture-grid" id="effectif">
      <div className="container">
        <SectionTitle
          eyebrow="L'effectif"
          title="Douze joueurs, une identité"
          lead="Une équipe construite par groupes de fonction, rodée sur les longues sessions mobile et portée par un même exigence de précision."
        />

        <div className="roster">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </section>
  )
}
