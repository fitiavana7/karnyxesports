export default function StatBar({ label, value, display, suffix = '%', max = 100 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div className="bar">
      <div className="bar__head">
        <span className="bar__label">{label}</span>
        <span className="bar__value mono">
          {display}
          {suffix}
        </span>
      </div>
      <div
        className="bar__track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <span className="bar__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
