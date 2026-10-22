export default function DiagonalDivider({ label }) {
  return (
    <div className="diag-divider" aria-hidden={label ? undefined : 'true'}>
      <span className="diag-divider__line" />
      {label && <span className="diag-divider__label mono">{label}</span>}
      <span className="diag-divider__line diag-divider__line--flip" />
    </div>
  )
}
