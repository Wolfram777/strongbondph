import { useEffect, useRef, useState } from 'react'
import hero from '../assets/images/hero.jpg'
import kalilayan from '../assets/images/kalilayan.jpg'
import grandhyatt from '../assets/images/grandhyatt.jpg'
import vertisnorth from '../assets/images/vertisnorth.jpg'

const categories = [
  {
    label: 'BRIDGES',
    description:
      'Structural engineering for infrastructure that connects communities.',
    image: kalilayan,
    href: '#',
  },
  {
    label: 'RESIDENTIAL',
    description: 'Quality construction for homes built to last.',
    image: grandhyatt,
    href: '#',
  },
  {
    label: 'COMMERCIAL',
    description: 'Expert solutions for commercial and mixed-use developments.',
    image: vertisnorth,
    href: '#',
  },
]

export default function Home() {
  const sectionRef = useRef<HTMLElement>(null)
  const [cardsVisible, setCardsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <section className="relative h-screen w-full">
        <img
          src={hero}
          alt="StrongBond PH"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute top-[58%] left-0 w-fit animate-hero-headline-slide-in bg-black/40 py-4 pr-5 pl-4 sm:top-[62%] sm:py-5 sm:pr-8 sm:pl-6 md:top-[65%] md:py-6 md:pr-10 md:pl-8 lg:pr-12"
        >
          <h1 className="text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl">
            INTEGRITY BEYOND
            <br />
            STRUCTURE
          </h1>
        </div>
      </section>

      <section
        ref={sectionRef}
        className="flex min-h-screen flex-col gap-4 px-4 py-10 sm:gap-5 sm:py-12 md:h-screen md:flex-row md:items-center md:gap-8 md:px-24 md:py-8"
      >
        {categories.map((category, index) => (
          <a
            key={category.label}
            href={category.href}
            style={
              cardsVisible ? { animationDelay: `${index * 200}ms` } : undefined
            }
            className={`group relative min-h-[200px] w-full flex-1 cursor-pointer overflow-hidden rounded-xl opacity-0 sm:min-h-[240px] md:h-[75vh] md:max-h-[75vh] md:rounded-2xl ${
              cardsVisible ? 'animate-category-card-enter' : ''
            }`}
          >
            <img
              src={category.image}
              alt={category.label}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 md:p-8">
              <p
                className="text-2xl font-bold uppercase text-white transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:text-3xl md:text-5xl md:group-hover:-translate-y-3 lg:text-6xl"
              >
                {category.label}
              </p>
              <div
                className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]"
              >
                <div className="overflow-hidden">
                  <p
                    className="max-w-md translate-y-full pt-1.5 text-xs leading-relaxed text-white/90 transition-transform duration-500 ease-out group-hover:translate-y-0 sm:pt-2 sm:text-sm md:text-base"
                  >
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </section>
    </div>
  )
}
