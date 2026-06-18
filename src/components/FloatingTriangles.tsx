const TRIANGLE_COLORS = [
  '#cfc3d7',
  '#d6b450',
  '#efc66c',
  '#6b2b5e',
] as const

type FloatingTriangle = {
  size: number
  top: number
  left: number
  color: string
  duration: number
  delay: number
  rotation: number
  animation: 'float-triangle' | 'float-triangle-alt'
}

const triangles: FloatingTriangle[] = [
  {
    size: 340,
    top: 8,
    left: 2,
    color: TRIANGLE_COLORS[0],
    duration: 24,
    delay: 0,
    rotation: 12,
    animation: 'float-triangle',
  },
  {
    size: 220,
    top: 18,
    left: 28,
    color: TRIANGLE_COLORS[1],
    duration: 18,
    delay: 1.2,
    rotation: -18,
    animation: 'float-triangle-alt',
  },
  {
    size: 280,
    top: 5,
    left: 52,
    color: TRIANGLE_COLORS[3],
    duration: 22,
    delay: 0.5,
    rotation: 25,
    animation: 'float-triangle',
  },
  {
    size: 185,
    top: 35,
    left: 72,
    color: TRIANGLE_COLORS[2],
    duration: 16,
    delay: 2,
    rotation: -10,
    animation: 'float-triangle-alt',
  },
  {
    size: 400,
    top: 58,
    left: 82,
    color: TRIANGLE_COLORS[0],
    duration: 28,
    delay: 0.8,
    rotation: 8,
    animation: 'float-triangle',
  },
  {
    size: 155,
    top: 72,
    left: 8,
    color: TRIANGLE_COLORS[1],
    duration: 19,
    delay: 2.5,
    rotation: -22,
    animation: 'float-triangle-alt',
  },
  {
    size: 310,
    top: 65,
    left: 38,
    color: TRIANGLE_COLORS[3],
    duration: 21,
    delay: 1.5,
    rotation: 15,
    animation: 'float-triangle',
  },
  {
    size: 235,
    top: 42,
    left: 12,
    color: TRIANGLE_COLORS[2],
    duration: 17,
    delay: 3,
    rotation: -14,
    animation: 'float-triangle-alt',
  },
  {
    size: 295,
    top: 22,
    left: 88,
    color: TRIANGLE_COLORS[0],
    duration: 20,
    delay: 1,
    rotation: 20,
    animation: 'float-triangle',
  },
  {
    size: 170,
    top: 80,
    left: 58,
    color: TRIANGLE_COLORS[2],
    duration: 15,
    delay: 0.3,
    rotation: -8,
    animation: 'float-triangle-alt',
  },
]

export default function FloatingTriangles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {triangles.map((triangle, index) => (
        <span
          key={index}
          className={`absolute will-change-transform ${
            triangle.animation === 'float-triangle-alt'
              ? 'animate-float-triangle-alt'
              : 'animate-float-triangle'
          }`}
          style={{
            width: triangle.size,
            height: triangle.size,
            top: `${triangle.top}%`,
            left: `${triangle.left}%`,
            backgroundColor: triangle.color,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            ['--triangle-rotate' as string]: `${triangle.rotation}deg`,
            animationDuration: `${triangle.duration}s`,
            animationDelay: `${triangle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
