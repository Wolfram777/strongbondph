import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import type { FeaturedProduct } from '../data/featuredProducts.ts'

const DRAG_SENSITIVITY = 0.55
const MOMENTUM_MULTIPLIER = 8
const MOMENTUM_FRICTION = 0.72
const MOMENTUM_MIN_VELOCITY = 0.25
const SNAP_DURATION_MS = 550

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

function getLogicalIndex(physicalIndex: number, count: number) {
  return ((physicalIndex % count) + count) % count
}

export default function ProductCardScroller({
  products,
  onActiveChange,
}: {
  products: FeaturedProduct[]
  onActiveChange?: (index: number, product: FeaturedProduct) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const leadingSpacerRef = useRef<HTMLDivElement>(null)
  const trailingSpacerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ pageX: 0, scrollLeft: 0 })
  const lastMove = useRef({ pageX: 0, time: 0 })
  const velocity = useRef(0)
  const momentumRaf = useRef<number | null>(null)
  const snapRaf = useRef<number | null>(null)
  const activeIndexRef = useRef(0)
  const isSnappingRef = useRef(false)
  const hasInitialFocusRef = useRef(false)
  const onActiveChangeRef = useRef(onActiveChange)
  const productCount = products.length
  const extendedProducts =
    productCount > 0
      ? [...products, ...products, ...products]
      : []

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange
  }, [onActiveChange])

  const getCards = useCallback(() => {
    const container = scrollRef.current
    if (!container) return []
    return Array.from(
      container.querySelectorAll<HTMLElement>('[data-product-card]'),
    )
  }, [])

  const getCardCenter = useCallback(
    (card: HTMLElement, container: HTMLElement) => {
      const containerRect = container.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()
      return (
        cardRect.left - containerRect.left + container.scrollLeft + cardRect.width / 2
      )
    },
    [],
  )

  const getSnapScrollForCard = useCallback(
    (card: HTMLElement, container: HTMLElement) => {
      const target = getCardCenter(card, container) - container.clientWidth / 2
      const maxScroll = container.scrollWidth - container.clientWidth
      return Math.max(0, Math.min(target, maxScroll))
    },
    [getCardCenter],
  )

  const updateEdgeSpacers = useCallback(() => {
    const container = scrollRef.current
    const leadingSpacer = leadingSpacerRef.current
    const trailingSpacer = trailingSpacerRef.current
    const cards = getCards()
    if (!container || !leadingSpacer || !trailingSpacer || cards.length === 0) {
      return
    }

    const spacerWidth = Math.max(
      0,
      (container.clientWidth - cards[0].offsetWidth) / 2,
    )
    leadingSpacer.style.width = `${spacerWidth}px`
    trailingSpacer.style.width = `${spacerWidth}px`
  }, [getCards])

  const repositionToMiddleCopy = useCallback(() => {
    const container = scrollRef.current
    const cards = getCards()
    if (!container || productCount === 0) return

    const physical = activeIndexRef.current
    if (physical >= productCount && physical < 2 * productCount) return

    const middlePhysical =
      productCount + getLogicalIndex(physical, productCount)
    activeIndexRef.current = middlePhysical

    const card = cards[middlePhysical]
    if (!card) return
    container.scrollLeft = getSnapScrollForCard(card, container)
  }, [getCards, getSnapScrollForCard, productCount])

  const stopSnapAnimation = useCallback(() => {
    if (snapRaf.current !== null) {
      cancelAnimationFrame(snapRaf.current)
      snapRaf.current = null
    }
    isSnappingRef.current = false
  }, [])

  const animateScrollTo = useCallback(
    (target: number) => {
      const container = scrollRef.current
      if (!container) return

      stopSnapAnimation()

      const start = container.scrollLeft
      const distance = target - start

      if (Math.abs(distance) < 1) {
        container.scrollLeft = target
        repositionToMiddleCopy()
        return
      }

      const startTime = performance.now()
      isSnappingRef.current = true

      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / SNAP_DURATION_MS, 1)
        container.scrollLeft = start + distance * easeOutCubic(progress)

        if (progress < 1) {
          snapRaf.current = requestAnimationFrame(step)
        } else {
          snapRaf.current = null
          isSnappingRef.current = false
          repositionToMiddleCopy()
        }
      }

      snapRaf.current = requestAnimationFrame(step)
    },
    [repositionToMiddleCopy, stopSnapAnimation],
  )

  const snapToCard = useCallback(
    (index: number, smooth: boolean) => {
      const container = scrollRef.current
      const cards = getCards()
      if (!container || !cards[index] || productCount === 0) return

      activeIndexRef.current = index
      const logicalIndex = getLogicalIndex(index, productCount)
      onActiveChangeRef.current?.(logicalIndex, products[logicalIndex])
      const target = getSnapScrollForCard(cards[index], container)

      if (smooth) {
        animateScrollTo(target)
      } else {
        stopSnapAnimation()
        container.scrollLeft = target
        repositionToMiddleCopy()
      }
    },
    [
      animateScrollTo,
      getCards,
      getSnapScrollForCard,
      productCount,
      products,
      repositionToMiddleCopy,
      stopSnapAnimation,
    ],
  )

  const snapToNearestCard = useCallback(
    (smooth: boolean) => {
      const container = scrollRef.current
      const cards = getCards()
      if (!container || cards.length === 0) return

      const viewportCenter = container.scrollLeft + container.clientWidth / 2
      let nearestIndex = 0
      let nearestDistance = Infinity

      cards.forEach((card, index) => {
        const cardCenter = getCardCenter(card, container)
        const distance = Math.abs(cardCenter - viewportCenter)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      snapToCard(nearestIndex, smooth)
    },
    [getCardCenter, getCards, snapToCard],
  )

  const stopMomentum = useCallback(() => {
    if (momentumRaf.current !== null) {
      cancelAnimationFrame(momentumRaf.current)
      momentumRaf.current = null
    }
  }, [])

  const startMomentum = useCallback(() => {
    stopMomentum()
    let v = velocity.current * MOMENTUM_MULTIPLIER * DRAG_SENSITIVITY

    const step = () => {
      const el = scrollRef.current
      if (!el || Math.abs(v) < MOMENTUM_MIN_VELOCITY) {
        momentumRaf.current = null
        snapToNearestCard(true)
        return
      }

      el.scrollLeft -= v
      v *= MOMENTUM_FRICTION
      momentumRaf.current = requestAnimationFrame(step)
    }

    if (Math.abs(v) >= MOMENTUM_MIN_VELOCITY) {
      momentumRaf.current = requestAnimationFrame(step)
    } else {
      snapToNearestCard(true)
    }
  }, [snapToNearestCard, stopMomentum])

  useLayoutEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const syncLayout = () => {
      updateEdgeSpacers()

      if (!hasInitialFocusRef.current) {
        activeIndexRef.current = productCount
        requestAnimationFrame(() => {
          snapToCard(productCount, true)
          hasInitialFocusRef.current = true
        })
        return
      }

      snapToCard(activeIndexRef.current, false)
    }

    syncLayout()
    const observer = new ResizeObserver(syncLayout)
    observer.observe(container)
    return () => observer.disconnect()
  }, [productCount, snapToCard, updateEdgeSpacers])

  useLayoutEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !scrollRef.current) return
      e.preventDefault()

      const now = performance.now()
      if (lastMove.current.time > 0) {
        const dt = now - lastMove.current.time
        if (dt > 0) {
          velocity.current =
            ((e.pageX - lastMove.current.pageX) / dt) * DRAG_SENSITIVITY
        }
      }
      lastMove.current = { pageX: e.pageX, time: now }

      const delta = (e.pageX - dragStart.current.pageX) * DRAG_SENSITIVITY
      scrollRef.current.scrollLeft = dragStart.current.scrollLeft - delta
    }

    const endDrag = () => {
      if (!isDragging.current) return
      isDragging.current = false
      if (scrollRef.current) scrollRef.current.style.removeProperty('cursor')
      startMomentum()
    }

    const onScrollEnd = () => {
      if (isSnappingRef.current) return
      if (!isDragging.current && momentumRaf.current === null) {
        snapToNearestCard(true)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', endDrag)
    container.addEventListener('scrollend', onScrollEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', endDrag)
      container.removeEventListener('scrollend', onScrollEnd)
      stopMomentum()
      stopSnapAnimation()
    }
  }, [snapToNearestCard, startMomentum, stopMomentum, stopSnapAnimation])

  const focusAdjacent = (direction: -1 | 1) => {
    stopMomentum()
    stopSnapAnimation()
    snapToCard(activeIndexRef.current + direction, true)
  }

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return
    stopMomentum()
    stopSnapAnimation()
    isDragging.current = true
    velocity.current = 0
    lastMove.current = { pageX: e.pageX, time: performance.now() }
    dragStart.current = {
      pageX: e.pageX,
      scrollLeft: scrollRef.current.scrollLeft,
    }
    scrollRef.current.style.cursor = 'grabbing'
  }

  return (
    <div className="flex w-full items-center gap-1.5 sm:gap-2 lg:gap-3">
      <button
        type="button"
        onClick={() => focusAdjacent(-1)}
        aria-label="Show previous product"
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-plum text-white shadow-md transition-colors duration-300 hover:bg-white hover:text-brand-plum hover:shadow-lg sm:h-10 sm:w-10 lg:h-12 lg:w-12"
      >
        <HiChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" aria-hidden="true" />
      </button>
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="flex min-w-0 flex-1 cursor-grab gap-3 overflow-x-auto pb-2 select-none sm:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div ref={leadingSpacerRef} className="shrink-0" aria-hidden="true" />
        {extendedProducts.map((product, index) => {
          const logicalIndex = getLogicalIndex(index, productCount)
          return (
          <div
            key={`${product.name}-${index}`}
            data-product-card
            className={`group relative h-[min(42vh,280px)] w-52 shrink-0 overflow-hidden rounded-xl sm:h-[min(48vh,320px)] sm:w-56 md:h-[min(55vh,400px)] md:w-64 lg:h-[min(72vh,600px)] lg:w-64 xl:w-80 2xl:w-96 ${
              logicalIndex % 2 === 0 ? 'bg-brand-lavender' : 'bg-brand-plum'
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-contain p-4 sm:p-6 lg:p-8 ${
                product.imageRotated ? '-rotate-90' : ''
              } group-hover:scale-105 group-hover:transition-transform group-hover:duration-500 group-hover:ease-out`}
              draggable={false}
            />
          </div>
          )
        })}
        <div ref={trailingSpacerRef} className="shrink-0" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={() => focusAdjacent(1)}
        aria-label="Show next product"
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-plum text-white shadow-md transition-colors duration-300 hover:bg-white hover:text-brand-plum hover:shadow-lg sm:h-10 sm:w-10 lg:h-12 lg:w-12"
      >
        <HiChevronRight className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" aria-hidden="true" />
      </button>
    </div>
  )
}
