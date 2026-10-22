export default function NotchCard({ as: Tag = 'div', variant = 'panel', className = '', children, ...rest }) {
  return (
    <Tag className={`notch-card notch-card--${variant} ${className}`} {...rest}>
      <span className="notch-card__sheen" aria-hidden="true" />
      {children}
    </Tag>
  )
}
