import { useState } from 'react'
import SectionTitle from './ui/SectionTitle'

export default function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSent(true)
    event.target.reset()
  }

  return (
    <section className="section section--deep texture-grid" id="contact">
      <div className="container">
        <SectionTitle
          eyebrow="Contact"
          title="Rejoindre la structure"
          lead="Les recrutions sont ouvertes toute l'année. Laissez un message avec vos statistiques de la saison en cours — on répond sous 48 h."
        />

        <div className="contact">
          <form className="contact__form reveal" onSubmit={handleSubmit}>
            <div className="contact__row">
              <div className="field">
                <label htmlFor="name">Pseudo</label>
                <input id="name" name="name" type="text" placeholder="KARNYX_..." required />
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" placeholder="pseudo@exemple.mg" required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="subject">Sujet</label>
              <input id="subject" name="subject" type="text" placeholder="Recrutement — test en ligne" />
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Parlez-nous de votre niveau, de votre poste et de vos disponibilités."
                required
              />
            </div>

            {sent && (
              <p className="contact__success" role="status">
                Message envoyé. L'équipe revient vers vous très vite.
              </p>
            )}

            <button type="submit" className="btn btn--primary">
              Envoyer la candidature
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
