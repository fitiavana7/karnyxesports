export default function SectionTitle({ eyebrow, title, lead, align = 'left', id }) {
  const centered = align === 'center'

  return (
    <header className={`section-title ${centered ? 'section-title--center' : ''}`}>
      {eyebrow && <p className="eyebrow reveal">{eyebrow}</p>}
      <h2 className="section-title__title reveal" id={id}>
        {title}
      </h2>
      {lead && <p className="section-title__lead reveal">{lead}</p>}
    </header>
  )
}
