import { useEffect, useRef } from 'react'

/**
 * Pose la classe .is-visible sur les éléments .reveal dès qu'ils entrent
 * dans le viewport. Applique un décalage progressif entre siblings.
 */
export function useReveal() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll('.reveal')).filter(
      (el) => !el.classList.contains('is-visible')
    )

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i, 8) * 60}ms`)
      observer.observe(el)
    })

    return () => observer.disconnect()
  })

  return rootRef
}
