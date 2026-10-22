import SectionTitle from './ui/SectionTitle'
import PlayerCard from './PlayerCard'
import { players } from '@/data/players'

function getOrgRank(player) {
  const role = player.orgRole || ''

  if (role.includes('Président') && !role.includes('Vice')) return 0
  if (role.includes('Vice-président')) return 1
  if (role.includes('Trésorier')) return 2
  if (role.includes('Secrétaire Général')) return 3
  if (role.includes('Conseiller')) return 4
  return 5
}

function getOrgGroup(player) {
  const rank = getOrgRank(player)

  if (rank === 0) return 'presidence'
  if (rank >= 1 && rank <= 4) return 'bureau'
  return 'joueurs'
}

export default function Roster() {
  const sorted = [...players].sort((a, b) => getOrgRank(a) - getOrgRank(b))

  const president = sorted.filter((p) => getOrgRank(p) === 0)
  const vicePresident = sorted.filter((p) => getOrgRank(p) === 1)
  const bureau = sorted.filter((p) => getOrgRank(p) >= 2 && getOrgRank(p) <= 4)
  const joueurs = sorted.filter((p) => getOrgRank(p) === 5)

  return (
    <section className="section section--deep texture-grid" id="effectif">
      <div className="container">
        <SectionTitle
          eyebrow="L'effectif"
          title="Organigramme KARNYX"
          lead="Direction, bureau exécutif puis effectif. Une structure claire au service de l'équipe."
        />

        <div className="org-chart">
          {president.length > 0 ? (
            <div className="org-level org-level--top">
              <p className="org-level__label">Présidence</p>
              <div className="org-level__grid org-level__grid--single">
                {president.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          ) : null}

          {vicePresident.length > 0 || bureau.length > 0 ? (
            <div className="org-level org-level--middle">
              <p className="org-level__label">Bureau &amp; Responsables</p>
              <div className="org-level__grid org-level__grid--auto">
                {[...vicePresident, ...bureau].map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          ) : null}

          {joueurs.length > 0 ? (
            <div className="org-level org-level--bottom">
              <p className="org-level__label">Joueurs</p>
              <div className="roster">
                {joueurs.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
