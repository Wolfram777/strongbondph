import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { HiArrowRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import logo from '../assets/images/logo2.png'

type NavItem = {
  label: string
  href: string
  external?: boolean
}

const navLinks: NavItem[] = [
  { label: 'PROJECTS', href: '/projects' },
  { label: 'SERVICES', href: '/services' },
  { label: 'PRODUCTS', href: '/products' },
  { label: 'ABOUT US', href: '/about-us' },
]

const menuLinks: NavItem[] = [
  { label: 'CLIENTS', href: '/clients' },
  {
    label: 'APPLY FOR A JOB',
    href: 'https://strongbondhr.com/home',
    external: true,
  },
  { label: 'CONTACT US', href: '/contact-us' },
]

const navLinkClass = (scrolled: boolean) =>
  `group relative flex h-full items-center justify-center rounded-none px-8 text-lg font-medium transition-all duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:origin-left after:scale-x-0 after:bg-brand-gold after:transition-transform after:duration-300 hover:bg-white hover:text-brand-plum hover:shadow-sm hover:after:scale-x-100 ${
    scrolled ? 'text-gray-700' : 'text-brand-plum'
  }`

const menuLinkClass =
  'group flex cursor-pointer items-center justify-between gap-4 px-6 py-3 text-lg font-medium text-white transition-colors duration-300 hover:bg-white/10'

function MenuItem({
  link,
  onClose,
}: {
  link: NavItem
  onClose: () => void
}) {
  const content = (
    <>
      <span>{link.label}</span>
      <span className="relative h-5 w-5 shrink-0 overflow-hidden">
        <HiArrowRight
          className="absolute inset-0 h-5 w-5 text-brand-lavender transition-all duration-300 ease-out group-hover:translate-x-full group-hover:opacity-0"
          aria-hidden="true"
        />
        <HiArrowRight
          className="absolute inset-0 h-5 w-5 -translate-x-full text-brand-gold opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden="true"
        />
      </span>
    </>
  )

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className={menuLinkClass}
      >
        {content}
      </a>
    )
  }

  return (
    <Link to={link.href} onClick={onClose} className={menuLinkClass}>
      {content}
    </Link>
  )
}

const MENU_ANIMATION_MS = 250

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuShown, setMenuShown] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useLenis((lenis) => {
    setScrolled(lenis.scroll > 20)
  })

  const openMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setMenuClosing(false)
    setMenuShown(true)
  }

  const closeMenu = () => {
    if (!menuShown || menuClosing) return

    setMenuClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      setMenuShown(false)
      setMenuClosing(false)
      closeTimeoutRef.current = null
    }, MENU_ANIMATION_MS)
  }

  const toggleMenu = () => {
    if (menuShown) closeMenu()
    else openMenu()
  }

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!menuShown || menuClosing) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuShown, menuClosing])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <nav className="flex h-24 w-full items-stretch justify-between px-4 md:px-24">
        <Link to="/" className="flex shrink-0 items-center self-center">
          <img
            src={logo}
            alt="StrongBond PH"
            className="h-14 w-auto object-contain"
          />
        </Link>

        <div className="flex h-full items-stretch">
          <ul className="hidden h-full items-stretch md:flex">
            {navLinks.map((link) => (
              <li key={link.label} className="h-full">
                <Link to={link.href} className={navLinkClass(scrolled)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div ref={menuRef} className="relative flex h-full items-center px-2 md:px-4">
            <button
              type="button"
              aria-label={menuShown ? 'Close menu' : 'Open menu'}
              aria-expanded={menuShown && !menuClosing}
              onClick={toggleMenu}
              className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ${
                menuShown
                  ? 'border-brand-gold bg-brand-gold text-white'
                  : scrolled
                    ? 'border-transparent bg-transparent text-gray-700 hover:border-brand-gold hover:bg-brand-gold hover:text-white'
                    : 'border-transparent bg-transparent text-brand-plum hover:border-brand-lavender hover:bg-brand-lavender hover:text-brand-plum'
              }`}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {menuShown ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>

            {menuShown && (
              <div
                className={`absolute top-full right-0 min-w-64 origin-top overflow-hidden rounded-b-2xl bg-brand-menu py-2 shadow-lg ${
                  menuClosing
                    ? 'animate-menu-dropdown-close'
                    : 'animate-menu-dropdown'
                }`}
              >
                <ul>
                  {navLinks.map((link) => (
                    <li key={link.label} className="md:hidden">
                      <MenuItem link={link} onClose={closeMenu} />
                    </li>
                  ))}
                  {menuLinks.map((link) => (
                    <li key={link.label}>
                      <MenuItem link={link} onClose={closeMenu} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
