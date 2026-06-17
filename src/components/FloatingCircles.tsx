const CIRCLE_COLORS = [
  '#cfc3d7',
  '#d6b450',
  '#efc66c',
  '#6b2b5e',
] as const

type FloatingCircle = {
  size: number
  top: number
  left: number
  color: string
  duration: number
  delay: number
  opacity: number
}

const circles: FloatingCircle[] = [
  { size: 140, top: 6, left: 4, color: CIRCLE_COLORS[0], duration: 22, delay: 0, opacity: 0.55 },
  { size: 72, top: 18, left: 22, color: CIRCLE_COLORS[1], duration: 16, delay: 1.5, opacity: 0.45 },
  { size: 96, top: 8, left: 48, color: CIRCLE_COLORS[3], duration: 19, delay: 0.5, opacity: 0.35 },
  { size: 56, top: 32, left: 68, color: CIRCLE_COLORS[2], duration: 14, delay: 2, opacity: 0.5 },
  { size: 180, top: 55, left: 78, color: CIRCLE_COLORS[0], duration: 26, delay: 1, opacity: 0.4 },
  { size: 48, top: 72, left: 12, color: CIRCLE_COLORS[1], duration: 18, delay: 3, opacity: 0.45 },
  { size: 110, top: 68, left: 38, color: CIRCLE_COLORS[3], duration: 21, delay: 0.8, opacity: 0.3 },
  { size: 64, top: 42, left: 8, color: CIRCLE_COLORS[2], duration: 15, delay: 2.5, opacity: 0.5 },
  { size: 88, top: 24, left: 85, color: CIRCLE_COLORS[0], duration: 17, delay: 1.2, opacity: 0.45 },
  { size: 120, top: 82, left: 58, color: CIRCLE_COLORS[1], duration: 24, delay: 0.3, opacity: 0.4 },
  { size: 40, top: 48, left: 52, color: CIRCLE_COLORS[2], duration: 13, delay: 4, opacity: 0.55 },
  { size: 76, top: 14, left: 92, color: CIRCLE_COLORS[3], duration: 20, delay: 1.8, opacity: 0.35 },
  { size: 100, top: 88, left: 26, color: CIRCLE_COLORS[0], duration: 23, delay: 2.2, opacity: 0.4 },
  { size: 52, top: 58, left: 94, color: CIRCLE_COLORS[2], duration: 16, delay: 0.6, opacity: 0.5 },
]

export default function FloatingCircles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {circles.map((circle, index) => (
        <span
          key={index}
          className="absolute rounded-full animate-float-circle will-change-transform"
          style={{
            width: circle.size,
            height: circle.size,
            top: `${circle.top}%`,
            left: `${circle.left}%`,
            backgroundColor: circle.color,
            opacity: circle.opacity,
            animationDuration: `${circle.duration}s`,
            animationDelay: `${circle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
