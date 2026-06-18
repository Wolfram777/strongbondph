import { useEffect, useRef, useState, useCallback } from 'react'
import { HiArrowRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import hero from '../assets/images/hero2.jpg'
import kalilayan from '../assets/images/kalilayan.jpg'
import grandhyatt from '../assets/images/grandhyatt.jpg'
import vertisnorth from '../assets/images/vertisnorth.jpg'
import FloatingTriangles from '../components/FloatingTriangles.tsx'
import ProductCardScroller from '../components/ProductCardScroller.tsx'
import { featuredProducts, type FeaturedProduct } from '../data/featuredProducts.ts'

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
  const productsSectionRef = useRef<HTMLElement>(null)
  const [cardsVisible, setCardsVisible] = useState(false)
  const [productsVisible, setProductsVisible] = useState(false)
  const [activeProduct, setActiveProduct] = useState(featuredProducts[0])

  const handleActiveProductChange = useCallback(
    (_index: number, product: FeaturedProduct) => {
      setActiveProduct(product)
    },
    [],
  )

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

  useEffect(() => {
    const section = productsSectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProductsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
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
          className="absolute top-[58%] left-0 flex w-fit flex-col items-start text-left animate-hero-headline-slide-in py-4 pl-4 pr-5 sm:top-[62%] sm:py-5 sm:pl-6 sm:pr-8 md:top-[65%] md:py-6 md:pl-8 md:pr-10 lg:pr-12"
        >
          <h1 className="text-2xl leading-tight font-bold tracking-tight text-brand-menu sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl">
            INTEGRITY BEYOND
            <br />
            STRUCTURE
          </h1>
          <p className="mt-3 text-xs leading-snug text-brand-menu sm:mt-4 sm:text-sm md:text-base md:whitespace-nowrap lg:text-lg">
            Retrofitting the foundations of a first-world Philippines,
            <br className="md:hidden" />
            &nbsp; one building at a time.
          </p>
          <Link
            to="/contact-us"
            className="group mt-4 inline-flex items-center gap-2 rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-plum transition-colors duration-300 hover:bg-brand-yellow sm:mt-5 sm:gap-2.5 sm:px-8 sm:py-3.5 sm:text-base"
          >
            Start Your Project
            <HiArrowRight
              className="h-4 w-4 animate-cta-arrow-nudge sm:h-5 sm:w-5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <section
        ref={sectionRef}
        className="relative flex min-h-screen flex-col gap-2 bg-white px-4 py-10 sm:py-12 md:gap-3 md:px-24 md:py-8"
      >
        <FloatingTriangles />
        <div
          className={`relative z-10 mx-auto w-fit bg-white px-4 py-3 text-center sm:px-6 sm:py-4 ${
            cardsVisible ? 'animate-projects-header-enter' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl font-bold uppercase tracking-tight text-brand-menu sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            OUR PROJECTS
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-brand-menu sm:mt-2 sm:text-base md:text-lg">
            A look at the structures we've strengthened across the Philippines
          </p>
        </div>
        <div className="relative z-10 flex flex-col gap-4 sm:gap-5 md:flex-row md:gap-8">
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
            <HiArrowRight
              strokeWidth={3}
              className="absolute top-4 right-4 z-10 h-8 w-8 text-white transition-colors duration-300 group-hover:animate-card-arrow-nudge group-hover:text-brand-plum sm:top-5 sm:right-5 sm:h-10 sm:w-10 md:top-8 md:right-8 md:h-12 md:w-12"
              aria-hidden="true"
            />
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
        </div>
      </section>

      <section ref={productsSectionRef} className="bg-brand-gold">
        <div className="flex flex-col gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-12 md:px-8 lg:grid lg:h-screen lg:grid-cols-5 lg:gap-0 lg:px-0 lg:py-0">
          <div className="relative lg:col-span-2 lg:min-h-0">
            <div
              className={`lg:absolute lg:left-24 lg:top-8 lg:z-10 ${
                productsVisible
                  ? 'animate-products-slide-in-left'
                  : 'opacity-0 -translate-x-12'
              }`}
            >
              <h2 className="text-3xl font-bold uppercase tracking-tight text-brand-menu sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                FEATURED PRODUCTS
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-brand-menu sm:mt-2 sm:text-base md:text-lg">
                The trusted products behind every structure we strengthen
              </p>
            </div>
            <div
              className={`hidden lg:flex lg:h-full lg:items-center lg:px-24 ${
                productsVisible
                  ? 'animate-products-slide-in-left'
                  : 'opacity-0 -translate-x-12'
              }`}
              style={
                productsVisible ? { animationDelay: '0.15s' } : undefined
              }
            >
              <p className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                {activeProduct.name}
              </p>
            </div>
            <div
              className={`hidden lg:absolute lg:bottom-[calc((100vh-min(72vh,600px))/2)] lg:left-24 lg:z-10 lg:block ${
                productsVisible
                  ? 'animate-products-rise-in'
                  : 'opacity-0 translate-y-8'
              }`}
              style={
                productsVisible ? { animationDelay: '0.45s' } : undefined
              }
            >
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-md bg-brand-plum px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-brand-plum sm:gap-2.5 sm:px-8 sm:py-3.5 sm:text-base"
              >
                View More Products
                <HiArrowRight
                  className="h-4 w-4 animate-cta-arrow-nudge sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
          <div
            className={`lg:col-span-3 lg:flex lg:min-h-0 lg:min-w-0 lg:items-center lg:pl-4 lg:pr-24 ${
              productsVisible
                ? 'animate-products-slide-in-right'
                : 'opacity-0 translate-x-12'
            }`}
            style={
              productsVisible ? { animationDelay: '0.3s' } : undefined
            }
          >
            <ProductCardScroller
              products={featuredProducts}
              onActiveChange={handleActiveProductChange}
            />
          </div>
          <div className="flex flex-col items-start gap-6 lg:hidden">
            <p
              className={`text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl ${
                productsVisible
                  ? 'animate-products-slide-in-left'
                  : 'opacity-0 -translate-x-12'
              }`}
              style={
                productsVisible ? { animationDelay: '0.35s' } : undefined
              }
            >
              {activeProduct.name}
            </p>
            <Link
              to="/products"
              className={`group inline-flex w-fit items-center gap-2 rounded-md bg-brand-plum px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-brand-plum sm:gap-2.5 sm:px-8 sm:py-3.5 sm:text-base ${
                productsVisible
                  ? 'animate-products-rise-in'
                  : 'opacity-0 translate-y-8'
              }`}
              style={
                productsVisible ? { animationDelay: '0.5s' } : undefined
              }
            >
              View More Products
              <HiArrowRight
                className="h-4 w-4 animate-cta-arrow-nudge sm:h-5 sm:w-5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
