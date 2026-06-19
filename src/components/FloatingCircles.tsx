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
  rotation: number
  animation: 'float-triangle' | 'float-triangle-alt'
}

const circles: FloatingCircle[] = [
  {
    size: 340,
    top: 8,
    left: 2,
    color: CIRCLE_COLORS[0],
    duration: 24,
    delay: 0,
    rotation: 12,
    animation: 'float-triangle',
  },
  {
    size: 220,
    top: 18,
    left: 28,
    color: CIRCLE_COLORS[1],
    duration: 18,
    delay: 1.2,
    rotation: -18,
    animation: 'float-triangle-alt',
  },
  {
    size: 280,
    top: 5,
    left: 52,
    color: CIRCLE_COLORS[3],
    duration: 22,
    delay: 0.5,
    rotation: 25,
    animation: 'float-triangle',
  },
  {
    size: 185,
    top: 35,
    left: 72,
    color: CIRCLE_COLORS[2],
    duration: 16,
    delay: 2,
    rotation: -10,
    animation: 'float-triangle-alt',
  },
  {
    size: 400,
    top: 58,
    left: 82,
    color: CIRCLE_COLORS[0],
    duration: 28,
    delay: 0.8,
    rotation: 8,
    animation: 'float-triangle',
  },
  {
    size: 155,
    top: 72,
    left: 8,
    color: CIRCLE_COLORS[1],
    duration: 19,
    delay: 2.5,
    rotation: -22,
    animation: 'float-triangle-alt',
  },
  {
    size: 310,
    top: 65,
    left: 38,
    color: CIRCLE_COLORS[3],
    duration: 21,
    delay: 1.5,
    rotation: 15,
    animation: 'float-triangle',
  },
  {
    size: 235,
    top: 42,
    left: 12,
    color: CIRCLE_COLORS[2],
    duration: 17,
    delay: 3,
    rotation: -14,
    animation: 'float-triangle-alt',
  },
  {
    size: 295,
    top: 22,
    left: 88,
    color: CIRCLE_COLORS[0],
    duration: 20,
    delay: 1,
    rotation: 20,
    animation: 'float-triangle',
  },
  {
    size: 170,
    top: 80,
    left: 58,
    color: CIRCLE_COLORS[2],
    duration: 15,
    delay: 0.3,
    rotation: -8,
    animation: 'float-triangle-alt',
  },
]

export default function FloatingCircles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden [--circle-scale:0.38] sm:[--circle-scale:0.52] md:[--circle-scale:0.68] lg:[--circle-scale:0.82] xl:[--circle-scale:1]"
      aria-hidden="true"
    >
      {circles.map((circle, index) => {
        const animationName =
          circle.animation === 'float-triangle-alt'
            ? 'float-triangle-alt'
            : 'float-triangle'

        return (
          <span
            key={index}
            className="float-circle-orbit absolute rounded-full border-[4px] bg-transparent will-change-transform sm:border-[5px]"
            style={{
              width: `calc(${circle.size}px * var(--circle-scale))`,
              height: `calc(${circle.size}px * var(--circle-scale))`,
              top: `${circle.top}%`,
              left: `${circle.left}%`,
              borderColor: circle.color,
              ['--triangle-rotate' as string]: `${circle.rotation}deg`,
              animation: `${animationName} ${circle.duration}s ease-in-out ${circle.delay}s infinite`,
            }}
          />
        )
      })}
    </div>
  )
}
