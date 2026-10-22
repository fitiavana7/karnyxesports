import { players, getPlayerBySlug, getAdjacentPlayers } from '../src/data/players.js'
import { team, teamStats, navLinks } from '../src/data/team.js'
import { standings, standingsColumns } from '../src/data/standings.js'
import { nextEvent } from '../src/data/event.js'

let errors = 0
const err = (m) => {
  console.log('  ERREUR:', m)
  errors++
}

console.log('--- equipe ---')
console.log(`${team.legalName} / ${team.region} / ${team.competition} ${team.division}`)
console.log(`cree en ${team.foundedLabel} / ${team.rank}e place`)

if (team.founded !== 2025) err(`founded = ${team.founded} (attendu 2025)`)
if (team.rank !== 3) err(`rank = ${team.rank} (attendu 3)`)

console.log('--- statistiques equipe ---')
const sum = teamStats.wins + teamStats.draws + teamStats.losses
if (sum !== teamStats.matches) err(`V+N+D ${sum} != matchs ${teamStats.matches}`)
if (Math.round((teamStats.wins / teamStats.matches) * 100) !== teamStats.winRate)
  err(`taux de victoire incoherent (${teamStats.winRate})`)
if (teamStats.goalsFor - teamStats.goalsAgainst !== teamStats.diff)
  err(`difference de buts incoherent (${teamStats.diff})`)

console.log('--- classement ---')
console.log(`${standings.length} equipes, ${standingsColumns.length} colonnes`)
let previousPoints = Infinity
for (const row of standings) {
  if (row.won + row.drawn + row.lost !== row.played)
    err(`${row.team}: V+N+D != ${row.played}`)
  if (row.won * 3 + row.drawn !== row.points)
    err(`${row.team}: ${row.won}V ${row.drawn}N -> ${row.points} pts (attendu ${row.won * 3 + row.drawn})`)
  if (row.goalsFor - row.goalsAgainst !== row.diff)
    err(`${row.team}: diff ${row.diff} != ${row.goalsFor - row.goalsAgainst}`)
  if (row.points > previousPoints) err(`${row.team}: classement non trie par points`)
  previousPoints = row.points
}
const karnyx = standings.find((r) => r.isTeam)
if (!karnyx) err('KARNYX absent du classement')
else {
  if (karnyx.pos !== team.rank) err(`pos ${karnyx.pos} != team.rank ${team.rank}`)
  if (karnyx.points !== teamStats.points) err(`pts ${karnyx.points} != teamStats ${teamStats.points}`)
  if (karnyx.won !== teamStats.wins) err(`victoires ${karnyx.won} != ${teamStats.wins}`)
  if (karnyx.goalsFor !== teamStats.goalsFor) err(`buts ${karnyx.goalsFor} != ${teamStats.goalsFor}`)
  console.log(`KARNYX : ${karnyx.pos}e / ${karnyx.points} pts / ${karnyx.won}V ${karnyx.drawn}N ${karnyx.lost}P`)
}

console.log('--- evenement ---')
console.log(`${nextEvent.title} / ${nextEvent.competition} / ${nextEvent.teams.length} equipes`)
if (!nextEvent.teams.some((t) => t.isTeam)) err('KARNYX absent de la liste des equipes')

console.log('--- joueurs ---')
console.log('nombre:', players.length)
const slugs = new Set()
const ids = new Set()
for (const p of players) {
  if (slugs.has(p.slug)) err(`slug duplique: ${p.slug}`)
  if (ids.has(p.id)) err(`id duplique: ${p.id}`)
  slugs.add(p.slug)
  ids.add(p.id)
  if (p.slug !== p.tag.replace(/^KARNYX_/, '').toLowerCase()) err(`${p.tag}: slug incoherent (${p.slug})`)
  if (p.nationality !== 'Madagascar') err(`${p.tag}: nationalite ${p.nationality}`)
  if (p.hue < 20 || p.hue > 46) err(`${p.tag}: hue hors plage (${p.hue})`)
  const gpm = Math.round((p.stats.goals / p.stats.matches) * 100) / 100
  if (Math.abs(gpm - p.stats.goalsPerMatch) > 0.011) err(`${p.tag}: goalsPerMatch ${p.stats.goalsPerMatch} != ${gpm}`)
  if (new Set(p.strengths).size !== p.strengths.length) err(`${p.tag}: strengths dupliquees`)
  if (!p.quote || !p.bio) err(`${p.tag}: texte manquant`)
  if (!/202[5-6]/.test(p.joined)) err(`${p.tag}: joined hors saison (${p.joined})`)
  if (!p.orgRole) err(`${p.tag}: role organisation manquant`)
  if (!p.firstName || !p.lastName) err(`${p.tag}: nom manquant`)
  if (p.socials) err(`${p.tag}: champ socials present (aucun compte reseau n'existe)`)
  for (const key of ['overall', 'age', 'foot', 'role', 'roleLabel', 'playStyle', 'playStyleFr', 'teamRole']) {
    if (key in p) err(`${p.tag}: champ ${key} non officiel, a retire`)
  }
}

console.log('--- liens sociaux ---')
if (team.socials) err('team.socials present (aucun compte reseau n\'existe)')
console.log('aucun lien social dans les donnees')

console.log('--- donnees personnelles ---')
const SENSITIVE_KEY = /cin|ident|serial|serie|clause|salary|salaire|contract|contrat|iban|bank|phone|adress|mail/i
const sensitive = []
for (const p of players) {
  for (const key of Object.keys(p)) {
    if (SENSITIVE_KEY.test(key)) sensitive.push(`${p.slug}.${key}`)
  }
}
if (sensitive.length) err(`champs sensibles exposes: ${sensitive.join(', ')}`)
const dump = JSON.stringify(players)
const cinPattern = /\b\d{12}\b/g
const cinIds = dump.match(cinPattern) || []
if (cinIds.length) err(`identifiants numeriques de 12 chiffres dans les donnees: ${cinIds.length}`)
const serialPattern = /\b[A-Z0-9]{10,16}\b/g
const serials = (dump.match(serialPattern) || []).filter((s) => !s.startsWith('KARNYX_'))
if (serials.length) err(`numeros de serie d'appareil suspects: ${serials.join(', ')}`)
console.log(`${players.length} profils, 0 donnee sensible exposee`)

console.log('--- routes ---')
for (const p of players) {
  if (!getPlayerBySlug(p.slug)) err(`getPlayerBySlug(${p.slug}) -> undefined`)
}
const adj = getAdjacentPlayers('marco')
if (adj.previous.slug !== 'dergrosse') err(`precedent de marco = ${adj.previous.slug}`)
if (getAdjacentPlayers('dergrosse').next.slug !== 'marco') err('suivant de dergrosse incorrect')
if (getPlayerBySlug('xyzzy')) err('slug inconnu renvoie un joueur')

console.log('--- nav ---')
console.log(navLinks.map((l) => `${l.id}->${l.label}`).join(' | '))

console.log(errors === 0 ? '\nOK - toutes les verifications passent' : `\n${errors} erreur(s)`)
process.exit(errors === 0 ? 0 : 1)
