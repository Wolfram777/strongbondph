type CircleConfig = {
  color: string
  size?: 'large' | 'small'
  align?: 'left' | 'right'
  top?: string
  left?: string
  right?: string
  rotation?: number
  animation?: 'float-triangle' | 'float-triangle-alt'
  duration?: number
  delay?: number
}

type FloatingOutlinedCircleLayerProps = {
  circles: CircleConfig[]
  className?: string
}

const SIZE_STYLES = {
  large: { width: 'min(75%, 480px)', height: 'min(75%, 480px)' },
  small: { width: 'min(38%, 200px)', height: 'min(38%, 200px)' },
} as const

function OutlinedCircle({
  color,
  size = 'large',
  align = 'left',
  top = '14%',
  left,
  right,
  rotation,
  animation = 'float-triangle',
  duration = 26,
  delay = 0,
}: CircleConfig) {
  const defaultRotation = align === 'right' ? -8 : 10
  const position =
    align === 'right'
      ? { top, right: right ?? '6%', left: 'auto' }
      : { top, left: left ?? '8%', right: 'auto' }

  const animationName =
    animation === 'float-triangle-alt'
      ? 'float-triangle-alt'
      : 'float-triangle'

  return (
    <span
      className={`float-circle-orbit absolute rounded-full bg-transparent will-change-transform ${
        size === 'small' ? 'border-[5px]' : 'border-[7px]'
      }`}
      style={{
        ...SIZE_STYLES[size],
        ...position,
        borderColor: color,
        ['--triangle-rotate' as string]: `${rotation ?? defaultRotation}deg`,
        animation: `${animationName} ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  )
}

export default function FloatingOutlinedCircleLayer({
  circles,
  className,
}: FloatingOutlinedCircleLayerProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
      aria-hidden="true"
    >
      {circles.map((circle, index) => (
        <OutlinedCircle key={index} {...circle} />
      ))}
    </div>
  )
}
