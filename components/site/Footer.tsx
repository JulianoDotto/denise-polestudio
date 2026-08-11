import Link from 'next/link'
import { Instagram, MapPin, Phone } from 'lucide-react'
import { TEXTS } from '@/hardcoded/texts'

export default function Footer() {
  return (
    <>
      <footer className="border-t border-white/10 bg-[#62192A] text-zinc-300">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-white/10 p-2">
                <MapPin className="h-4 w-4 text-zinc-300" />
              </div>
              <div className="leading-relaxed">
                <p>{TEXTS.SITE_FOOTER_ADDRESS_LINE_1}</p>
                <p>{TEXTS.SITE_FOOTER_ADDRESS_LINE_2}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/10 p-2">
                <Phone className="h-4 w-4 text-zinc-300" />
              </div>
              <p>{TEXTS.SITE_FOOTER_PHONE_1}</p>
            </div>
            <Link
              href={TEXTS.SITE_FOOTER_INSTAGRAM_URL_1}
              target="_blank"
              className="flex items-center gap-3"
            >
              <div className="rounded-full bg-white/10 p-2">
                <Instagram className="h-4 w-4 text-zinc-300" />
              </div>
              <span>{TEXTS.SITE_FOOTER_INSTAGRAM_HANDLE_1}</span>
            </Link>
          </div>
        </div>
        <div className="border-t border-black/10 bg-[#FDFDFD] px-6 py-3 text-center text-xs text-zinc-600">
          {TEXTS.SITE_FOOTER_COPYRIGHT_1}
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
