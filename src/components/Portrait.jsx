import { useId } from 'react'

const BODY =
  'M28 292 L50 224 L104 185 L133 170 L150 181 L167 170 L196 185 L250 224 L272 292 Z'
const HEAD = 'M150 32 L187 57 L197 100 L182 135 L150 154 L118 135 L103 100 L113 57 Z'

export default function Portrait({ hue = 34, label = 'Portrait du joueur' }) {
  const uid = useId().replace(/:/g, '')

  const bodyFill = `url(#body-${uid})`
  const rimFill = `url(#rim-${uid})`
  const visorFill = `url(#visor-${uid})`

  return (
    <svg viewBox="0 0 300 300" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 30% 24%)`} />
          <stop offset="48%" stopColor="#161c24" />
          <stop offset="100%" stopColor="#0d1218" />
        </linearGradient>

        <linearGradient id={`rim-${uid}`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#e4c39b" />
          <stop offset="40%" stopColor="#c09060" />
          <stop offset="100%" stopColor="#825b30" />
        </linearGradient>

        <linearGradient id={`visor-${uid}`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#e4c39b" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#d9ae7e" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ad8257" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <g transform="translate(8 -7)">
        <path d={BODY} fill={rimFill} opacity="0.9" />
        <path d={HEAD} fill={rimFill} opacity="0.9" />
      </g>

      <path d={BODY} fill={bodyFill} />
      <path d={HEAD} fill={bodyFill} />

      <path
        d="M112 86 L150 75 L188 86 L183 101 L150 110 L117 101 Z"
        fill={visorFill}
        stroke="rgba(228,195,155,0.55)"
        strokeWidth="1"
      />

      <path d="M113 57 L150 32 L187 57" fill="none" stroke="rgba(228,195,155,0.5)" strokeWidth="1.2" />
      <path
        d="M118 135 L150 154 L182 135"
        fill="none"
        stroke="rgba(192,144,96,0.45)"
        strokeWidth="1.2"
      />

      <path d="M133 170 L150 191 L167 170" fill="none" stroke="rgba(192,144,96,0.7)" strokeWidth="1.6" />

      <g stroke="rgba(192,144,96,0.4)" strokeWidth="1" fill="none">
        <path d="M78 215 L104 196 L128 187" />
        <path d="M222 215 L196 196 L172 187" />
      </g>

      <path
        d="M28 292 L50 224 L104 185 L133 170 L150 181 L167 170 L196 185 L250 224 L272 292"
        fill="none"
        stroke="rgba(228,195,155,0.35)"
        strokeWidth="1"
      />

      <g fill="rgba(228,195,155,0.55)">
        <rect x="14" y="286" width="34" height="3" />
        <rect x="252" y="286" width="34" height="3" />
      </g>
    </svg>
  )
}
