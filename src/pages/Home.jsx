import Hero from '@/components/Hero'
import Roster from '@/components/Roster'
import TeamStats from '@/components/TeamStats'
import EventCard from '@/components/EventCard'
import Contact from '@/components/Contact'
import DiagonalDivider from '@/components/ui/DiagonalDivider'
import { useReveal } from '@/hooks/useReveal'

export default function Home() {
  const rootRef = useReveal()

  return (
    <div ref={rootRef}>
      <Hero />

      <div className="container">
        <DiagonalDivider label="Effectif" />
      </div>

      <Roster />

      <div className="container">
        <DiagonalDivider label="Statistiques" />
      </div>

      <TeamStats />

      <div className="container">
        <DiagonalDivider label="Prochain événement" />
      </div>

      <EventCard />

      <div className="container">
        <DiagonalDivider label="Contact" />
      </div>

      <Contact />
    </div>
  )
}
