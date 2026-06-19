import { useLenis } from 'lenis/react'
import {
  FaFacebookF,
  FaGoogle,
  FaLinkedinIn,
} from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo2.png'

const navLinks = [
  { label: 'Our Projects', href: '/projects' },
  { label: 'Our Products', href: '/products' },
  { label: 'Our Services', href: '/services' },
  { label: 'Contact Us', href: '/contact-us' },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com',
    icon: FaFacebookF,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com',
    icon: FaLinkedinIn,
  },
  {
    label: 'Google Workspace',
    href: 'https://workspace.google.com',
    icon: FaGoogle,
  },
]

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()
  const lenis = useLenis()

  const scrollToHomeTop = () => {
    if (location.pathname === '/') {
      lenis?.scrollTo(0, { duration: 1.1 })
      return
    }

    navigate('/')
  }

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="px-4 py-12 sm:px-6 md:px-24">
        <div className="grid gap-6 md:grid-cols-3 md:gap-x-8 md:gap-y-10 lg:gap-x-12">
          <button
            type="button"
            onClick={scrollToHomeTop}
            className="cursor-pointer rounded-md transition-opacity hover:opacity-80 md:col-start-1 md:row-start-1 md:self-center"
            aria-label="Go to homepage top"
          >
            <img
              src={logo}
              alt="StrongBond PH"
              className="h-16 w-auto object-contain sm:h-20"
            />
          </button>

          <div className="flex items-center justify-between gap-3 md:contents">
            <nav
              className="flex min-w-0 flex-1 flex-nowrap items-center justify-between gap-x-1 text-[11px] font-semibold text-brand-menu min-[400px]:gap-x-3 min-[400px]:text-xs min-[520px]:justify-start min-[520px]:gap-x-4 min-[520px]:text-sm md:col-start-2 md:row-start-1 md:flex-none md:self-center md:gap-x-5 md:text-base lg:gap-x-6 lg:text-lg"
              aria-label="Footer"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="shrink-0 whitespace-nowrap transition-colors hover:text-brand-plum hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div
              className="flex shrink-0 items-center gap-3 sm:gap-4 md:col-start-3 md:row-start-1 md:justify-end md:self-center"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-brand-plum transition-colors hover:border-brand-plum hover:bg-brand-plum hover:text-white sm:h-11 sm:w-11"
                >
                  <social.icon
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          <p
            className="max-w-xs text-xs leading-relaxed text-gray-600 sm:text-sm md:col-start-1 md:row-start-2 md:self-start"
          >
            © 2026 Strongbond Philippines Inc. (formerly Strongbond Products
            Philippines Inc.) All Rights Reserved
          </p>
          <p
            className="max-w-md text-xs leading-relaxed text-gray-600 sm:text-sm md:col-start-2 md:row-start-2 md:self-start"
          >
            Integrity beyond structure. Engineering solutions that strengthen
            buildings and infrastructure across the Philippines.
          </p>
          <p
            className="text-right text-xs leading-relaxed text-gray-600 sm:text-sm md:col-start-3 md:row-start-2 md:self-start"
          >
            Get a quote:{' '}
            <a
              href="tel:+639171526843"
              className="transition-colors hover:text-brand-plum"
            >
              +63 0917 152 6843
            </a>{' '}
            <a
              href="tel:+63286545853"
              className="transition-colors hover:text-brand-plum"
            >
              (02) 8654-5853
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
