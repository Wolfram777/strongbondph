import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

const lenisOptions = {
  lerp: 0.08,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.2,
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  )
}
