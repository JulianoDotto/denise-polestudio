import Link from 'next/link'
import { Instagram, MapPin, MessageCircle } from 'lucide-react'
import { TEXTS } from '@/hardcoded/texts'

const SITE_LINKS = [
  { title: TEXTS.HOME_LINK_AULAS_TITLE_1, href: '/aulas' },
  { title: TEXTS.HOME_LINK_LOJA_TITLE_1, href: '/loja' },
  { title: TEXTS.HOME_LINK_PRODUTOS_DIGITAIS_TITLE_1, href: '/produtos-digitais' },
  { title: TEXTS.HOME_LINK_EVENTOS_TITLE_1, href: '/eventos' },
  { title: TEXTS.HOME_LINK_WORKSHOPS_TITLE_1, href: '/workshops' },
]

const underlineClass =
  'bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size,color] duration-300 hover:bg-[length:100%_1px] hover:text-marfim focus-visible:bg-[length:100%_1px] focus-visible:text-marfim focus-visible:outline-none motion-reduce:transition-none'

const contactClass = 'flex items-start gap-3'
const iconClass = 'mt-0.5 h-4 w-4 shrink-0 text-marfim/60'

export default function Footer() {
  return (
    <>
      <footer className="bg-vinho text-marfim">
        <div className="mx-auto grid w-full max-w-[738px] gap-10 px-6 py-12 sm:grid-cols-[1fr_auto] sm:gap-16">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.3em]">{TEXTS.SITE_HEADER_LOGO_1}</p>
            <p className="mt-3 text-sm text-marfim/70">{TEXTS.HOME_HERO_HEADLINE_1}</p>
          </div>

          <ul className="grid gap-4 text-sm">
            <li className={contactClass}>
              <MapPin aria-hidden="true" className={iconClass} />
              <span className="leading-relaxed">
                {TEXTS.SITE_FOOTER_ADDRESS_LINE_1}
                <br />
                {TEXTS.SITE_FOOTER_ADDRESS_LINE_2}
              </span>
            </li>
            <li>
              <a href={TEXTS.SITE_FOOTER_WHATSAPP_URL_1} target="_blank" rel="noopener noreferrer" className={contactClass}>
                <MessageCircle aria-hidden="true" className={iconClass} />
                <span className={underlineClass}>{TEXTS.SITE_FOOTER_PHONE_1}</span>
              </a>
            </li>
            <li>
              <a href={TEXTS.SITE_FOOTER_INSTAGRAM_URL_1} target="_blank" rel="noopener noreferrer" className={contactClass}>
                <Instagram aria-hidden="true" className={iconClass} />
                <span className={underlineClass}>{TEXTS.SITE_FOOTER_INSTAGRAM_HANDLE_1}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="border-t border-marfim/15">
          <div className="mx-auto flex w-full max-w-[738px] flex-col gap-4 px-6 py-5 text-xs text-marfim/60 sm:flex-row sm:items-center sm:justify-between">
            <p>{TEXTS.SITE_FOOTER_COPYRIGHT_1}</p>
            <nav aria-label={TEXTS.SITE_FOOTER_NAV_ARIA_1} className="flex flex-wrap gap-x-5 gap-y-2">
              {SITE_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={underlineClass}>
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>

      <Link
        href={TEXTS.SITE_FOOTER_WHATSAPP_URL_1}
        target="_blank"
        aria-label={TEXTS.SITE_FOOTER_WHATSAPP_ARIA_1}
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="block h-8 w-8 shrink-0 fill-current"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93a7.898 7.898 0 0 0-2.327-5.607ZM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.25a6.568 6.568 0 0 1-1.007-3.498c0-3.627 2.956-6.584 6.591-6.584a6.54 6.54 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.929 4.66c-.004 3.627-2.961 6.584-6.593 6.584Zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.066-.315-.099-.445.1-.133.197-.513.646-.627.775-.116.133-.232.15-.43.05-.197-.1-.836-.308-1.592-.984-.59-.525-.986-1.173-1.102-1.371-.116-.198-.012-.305.087-.404.089-.088.198-.23.297-.345.1-.116.133-.198.198-.33.066-.133.033-.248-.017-.347-.05-.099-.445-1.073-.61-1.47-.16-.388-.326-.335-.445-.341a7.59 7.59 0 0 0-.38-.007.729.729 0 0 0-.528.248c-.182.198-.692.677-.692 1.654 0 .977.71 1.916.81 2.049.099.132 1.4 2.137 3.39 2.997.474.204.844.326 1.13.418.475.15.907.129 1.25.078.38-.057 1.17-.479 1.336-.943.165-.462.165-.858.116-.943-.05-.083-.182-.132-.38-.23Z" />
        </svg>
      </Link>
    </>
  )
}
