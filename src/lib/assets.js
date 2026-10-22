const base = import.meta.env.BASE_URL ?? '/'

const registry =
  typeof window !== 'undefined' ? window.__KARNYX_ASSET_REGISTRY__ : null

export function asset(name) {
  if (registry && registry[name]) return registry[name]
  return `${base}${name}`.replace(/([^:])\/{2,}/g, '$1/')
}
