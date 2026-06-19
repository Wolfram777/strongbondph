import { useLenis } from 'lenis/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { HiArrowRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import FloatingOutlinedCircleLayer from './FloatingOutlinedCircle.tsx'
import {
  serviceCards,
  type ServiceCard,
} from '../data/serviceCards.ts'

const NAVBAR_HEIGHT_PX = 96

const SERVICES_SUBHEADING =
  'Trusted by property owners, developers, and government agencies across the Philippines'

function ServiceCardTile({
  service,
  className,
  isSelected,
  onSelect,
}: {
  service: ServiceCard
  className?: string
  isSelected?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative aspect-[7/5] overflow-hidden cursor-pointer text-left transition-shadow duration-300 ${
        isSelected ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-brand-plum' : ''
      } ${className ?? ''}`}
    >
      <img
        src={service.image}
        alt={service.label}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-8">
        <p className="text-sm font-bold uppercase leading-tight text-white sm:text-base lg:text-xl lg:tracking-tight xl:text-2xl">
          {service.label}
        </p>
      </div>
    </button>
  )
}

export default function ServicesScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollRange, setScrollRange] = useState(0)
  const [activeService, setActiveService] = useState(serviceCards[0])
  const layoutMetricsRef = useRef({ start: 0, maxScroll: 0 })
  const lastTranslateRef = useRef(0)

  useLayoutEffect(() => {
    const measure = () => {
      const section = sectionRef.current
      const track = trackRef.current
      const pin = pinRef.current
      if (!section || !track || !pin) return

      const maxScroll = Math.max(0, track.scrollHeight - pin.clientHeight)
      layoutMetricsRef.current = {
        start: section.offsetTop - NAVBAR_HEIGHT_PX,
        maxScroll,
      }
      setScrollRange(maxScroll)
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (sectionRef.current) observer.observe(sectionRef.current)
    if (trackRef.current) observer.observe(trackRef.current)
    if (pinRef.current) observer.observe(pinRef.current)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useLenis((lenis) => {
    const update = () => {
      const track = trackRef.current
      if (!track) return

      const { start, maxScroll } = layoutMetricsRef.current
      if (maxScroll <= 0) return

      const scroll = lenis.scroll
      let translateY = 0

      if (scroll > start) {
        const progress = Math.min((scroll - start) / maxScroll, 1)
        translateY = -progress * maxScroll
      }

      if (translateY === lastTranslateRef.current) return

      lastTranslateRef.current = translateY
      track.style.transform = `translate3d(0, ${translateY}px, 0)`
    }

    update()
    lenis.on('scroll', update)
    return () => lenis.off('scroll', update)
  })

  const sectionHeight =
    scrollRange > 0
      ? `calc(100vh - ${NAVBAR_HEIGHT_PX}px + ${scrollRange}px)`
      : undefined

  return (
    <section aria-label="Services" className="bg-brand-plum">
      <div className="px-4 py-10 sm:px-6 sm:py-12 md:px-24 lg:hidden">
        <h2 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
          OUR SERVICES
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/90 sm:mt-2 sm:text-base md:text-lg">
          {SERVICES_SUBHEADING}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {serviceCards.map((service) => (
            <ServiceCardTile
              key={service.label}
              service={service}
              isSelected={activeService.label === service.label}
              onSelect={() => setActiveService(service)}
              className="rounded-xl"
            />
          ))}
        </div>
        <p className="mt-8 text-base leading-relaxed text-white/90 sm:mt-10 sm:text-lg md:text-xl">
          {activeService.description}
        </p>
        <Link
          to="/services"
          className="group mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-plum transition-colors duration-300 hover:bg-white sm:gap-2.5 sm:px-8 sm:py-3.5 sm:text-base"
        >
          View All Services
          <HiArrowRight
            className="h-4 w-4 animate-cta-arrow-nudge sm:h-5 sm:w-5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div
        ref={sectionRef}
        className="hidden lg:block"
        style={{ height: sectionHeight }}
      >
        <div
          ref={pinRef}
          className="sticky top-24 grid h-[calc(100vh-6rem)] grid-cols-5 overflow-hidden"
        >
          <div className="col-span-3 overflow-hidden">
            <div
              ref={trackRef}
              className="grid grid-cols-2 gap-x-6 gap-y-10 pl-8 pr-6 pt-16 pb-32 xl:gap-x-10 xl:gap-y-14 xl:pl-24 xl:pr-10 xl:pt-20 xl:pb-40"
            >
              {serviceCards.map((service) => (
                <ServiceCardTile
                  key={service.label}
                  service={service}
                  isSelected={activeService.label === service.label}
                  onSelect={() => setActiveService(service)}
                  className="w-full rounded-2xl lg:min-w-[280px]"
                />
              ))}
            </div>
          </div>
          <div className="relative col-span-2 flex h-full flex-col items-end px-8 text-right xl:px-24">
            <FloatingOutlinedCircleLayer
              circles={[
                { color: '#efc66c', size: 'large', align: 'right' },
                {
                  color: '#cfc3d7',
                  size: 'small',
                  align: 'right',
                  top: '62%',
                  right: '40%',
                  rotation: 12,
                  animation: 'float-triangle-alt',
                  duration: 18,
                  delay: 1.2,
                },
              ]}
            />
            <h2 className="relative z-10 mt-28 text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              OUR SERVICES
            </h2>
            <p className="relative z-10 mt-1 w-fit max-w-xl text-sm leading-relaxed text-white/90 sm:mt-2 sm:text-base md:text-lg">
              {SERVICES_SUBHEADING}
            </p>
            <p className="relative z-10 mt-14 w-fit max-w-lg text-xl leading-relaxed text-white/90 md:mt-16 md:text-2xl">
              {activeService.description}
            </p>
            <div className="relative z-10 mt-auto pb-12">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-plum transition-colors duration-300 hover:bg-white sm:gap-2.5 sm:px-8 sm:py-3.5 sm:text-base"
              >
                View All Services
                <HiArrowRight
                  className="h-4 w-4 animate-cta-arrow-nudge sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
