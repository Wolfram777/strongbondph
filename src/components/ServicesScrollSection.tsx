import { useLenis } from 'lenis/react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { HiArrowRight, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import FloatingOutlinedCircleLayer from './FloatingOutlinedCircle.tsx'
import {
  serviceCards,
  type ServiceCard,
} from '../data/serviceCards.ts'

const NAVBAR_HEIGHT_PX = 96
const MOBILE_SCROLL_DURATION_MS = 550

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

function getMobileScrollLeftForCard(
  card: HTMLElement,
  container: HTMLElement,
) {
  const delta =
    card.getBoundingClientRect().left - container.getBoundingClientRect().left
  const target = container.scrollLeft + delta
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth)
  return Math.max(0, Math.min(maxScroll, target))
}

const SERVICES_SUBHEADING =
  'Trusted by property owners, developers, and government agencies across the Philippines'

function ServiceCardTile({
  service,
  className,
  isSelected,
  onSelect,
  compact,
}: {
  service: ServiceCard
  className?: string
  isSelected?: boolean
  onSelect: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative overflow-hidden cursor-pointer text-left transition-shadow duration-300 ${
        compact ? 'h-full w-full' : 'aspect-[7/5]'
      } ${
        isSelected
          ? compact
            ? 'ring-2 ring-inset ring-brand-gold'
            : 'ring-2 ring-brand-gold ring-offset-2 ring-offset-brand-plum'
          : ''
      } ${className ?? ''}`}
    >
      <img
        src={service.image}
        alt={service.label}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div
        className={`absolute inset-x-0 bottom-0 ${
          compact
            ? 'min-h-[42%] px-3 pb-3 pt-10'
            : 'p-4 sm:p-5 lg:p-8'
        }`}
      >
        <p
          className={`font-bold uppercase text-white ${
            compact
              ? 'text-[11px] leading-snug sm:text-xs'
              : 'text-sm leading-tight sm:text-base lg:text-xl lg:tracking-tight xl:text-2xl'
          }`}
        >
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
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const mobileTrailingSpacerRef = useRef<HTMLDivElement>(null)
  const mobileScrollAnimRaf = useRef<number | null>(null)
  const isMobileScrollAnimatingRef = useRef(false)
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

  useLayoutEffect(() => {
    const updateTrailingSpacer = () => {
      const container = mobileScrollRef.current
      const spacer = mobileTrailingSpacerRef.current
      const firstCard = container?.querySelector(
        '[data-service-card]',
      ) as HTMLElement | null
      if (!container || !spacer || !firstCard) return

      spacer.style.width = `${Math.max(
        0,
        container.clientWidth - firstCard.clientWidth,
      )}px`
    }

    updateTrailingSpacer()
    const observer = new ResizeObserver(updateTrailingSpacer)
    if (mobileScrollRef.current) observer.observe(mobileScrollRef.current)
    return () => observer.disconnect()
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

  const activeServiceIndex = serviceCards.findIndex(
    (service) => service.label === activeService.label,
  )

  const stopMobileScrollAnimation = useCallback(() => {
    if (mobileScrollAnimRaf.current !== null) {
      cancelAnimationFrame(mobileScrollAnimRaf.current)
      mobileScrollAnimRaf.current = null
    }
    isMobileScrollAnimatingRef.current = false
  }, [])

  const animateMobileScrollTo = useCallback(
    (target: number) => {
      const container = mobileScrollRef.current
      if (!container) return

      stopMobileScrollAnimation()

      const start = container.scrollLeft
      const distance = target - start

      if (Math.abs(distance) < 1) {
        container.scrollLeft = target
        return
      }

      const startTime = performance.now()
      isMobileScrollAnimatingRef.current = true

      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / MOBILE_SCROLL_DURATION_MS, 1)
        container.scrollLeft = start + distance * easeOutCubic(progress)

        if (progress < 1) {
          mobileScrollAnimRaf.current = requestAnimationFrame(step)
        } else {
          container.scrollLeft = target
          mobileScrollAnimRaf.current = null
          isMobileScrollAnimatingRef.current = false
        }
      }

      mobileScrollAnimRaf.current = requestAnimationFrame(step)
    },
    [stopMobileScrollAnimation],
  )

  const scrollToServiceIndex = useCallback(
    (index: number) => {
      const container = mobileScrollRef.current
      if (!container) return

      const clampedIndex = Math.max(0, Math.min(serviceCards.length - 1, index))
      const card = container.querySelectorAll('[data-service-card]')[
        clampedIndex
      ] as HTMLElement | undefined
      if (!card) return

      setActiveService(serviceCards[clampedIndex])
      animateMobileScrollTo(getMobileScrollLeftForCard(card, container))
    },
    [animateMobileScrollTo],
  )

  const focusAdjacentService = (direction: -1 | 1) => {
    scrollToServiceIndex(activeServiceIndex + direction)
  }

  const syncActiveServiceFromScroll = () => {
    if (isMobileScrollAnimatingRef.current) return

    const container = mobileScrollRef.current
    if (!container) return

    const cards = container.querySelectorAll('[data-service-card]')
    let closestIndex = 0
    let closestDistance = Infinity

    cards.forEach((card, index) => {
      const el = card as HTMLElement
      const target = getMobileScrollLeftForCard(el, container)
      const distance = Math.abs(container.scrollLeft - target)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    const nextService = serviceCards[closestIndex]
    if (nextService.label !== activeService.label) {
      setActiveService(nextService)
    }
  }

  useLayoutEffect(() => {
    return () => stopMobileScrollAnimation()
  }, [stopMobileScrollAnimation])

  useLayoutEffect(() => {
    const container = mobileScrollRef.current
    if (!container) return

    const onScrollEnd = () => {
      if (isMobileScrollAnimatingRef.current) return

      const cards = container.querySelectorAll('[data-service-card]')
      let closestIndex = 0
      let closestDistance = Infinity

      cards.forEach((card, index) => {
        const el = card as HTMLElement
        const target = getMobileScrollLeftForCard(el, container)
        const distance = Math.abs(container.scrollLeft - target)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      if (closestDistance > 1) {
        scrollToServiceIndex(closestIndex)
      }
    }

    container.addEventListener('scrollend', onScrollEnd)
    return () => container.removeEventListener('scrollend', onScrollEnd)
  }, [scrollToServiceIndex])

  return (
    <section aria-label="Services" className="bg-brand-plum">
      <div className="px-4 py-10 sm:px-6 sm:py-12 md:px-24 lg:hidden">
        <h2 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
          OUR SERVICES
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/90 sm:mt-2 sm:text-base md:text-lg">
          {SERVICES_SUBHEADING}
        </p>
        <div className="mt-8 flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => focusAdjacentService(-1)}
            disabled={activeServiceIndex <= 0}
            aria-label="Show previous service"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-gold text-brand-plum shadow-md transition-colors duration-300 hover:bg-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-gold sm:h-10 sm:w-10"
          >
            <HiChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </button>
          <div
            ref={mobileScrollRef}
            onScroll={syncActiveServiceFromScroll}
            className="min-w-0 flex-1 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex gap-4 sm:gap-5">
              {serviceCards.map((service) => (
                <div
                  key={service.label}
                  data-service-card
                  className="h-[188px] w-[252px] shrink-0 overflow-hidden rounded-xl sm:h-[200px] sm:w-[280px]"
                >
                  <ServiceCardTile
                    service={service}
                    compact
                    isSelected={activeService.label === service.label}
                    onSelect={() => {
                      setActiveService(service)
                      scrollToServiceIndex(
                        serviceCards.findIndex((s) => s.label === service.label),
                      )
                    }}
                    className="rounded-xl"
                  />
                </div>
              ))}
              <div
                ref={mobileTrailingSpacerRef}
                className="shrink-0"
                aria-hidden="true"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => focusAdjacentService(1)}
            disabled={activeServiceIndex >= serviceCards.length - 1}
            aria-label="Show next service"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-gold text-brand-plum shadow-md transition-colors duration-300 hover:bg-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-gold sm:h-10 sm:w-10"
          >
            <HiChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </button>
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
