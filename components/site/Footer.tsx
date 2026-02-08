import Link from 'next/link'
import { Instagram, MapPin, Phone, MessageCircle } from 'lucide-react'
import { TEXTS } from '@/hardcoded/texts'

export default function Footer() {
  return (
    <>
      <footer className="border-t border-white/10 bg-[#62192A] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-white/10 p-2">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div className="leading-relaxed">
                <p>{TEXTS.SITE_FOOTER_ADDRESS_LINE_1}</p>
                <p>{TEXTS.SITE_FOOTER_ADDRESS_LINE_2}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/10 p-2">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <p>{TEXTS.SITE_FOOTER_PHONE_1}</p>
            </div>
            <Link
              href={TEXTS.SITE_FOOTER_INSTAGRAM_URL_1}
              target="_blank"
              className="flex items-center gap-3"
            >
              <div className="rounded-full bg-white/10 p-2">
                <Instagram className="h-4 w-4 text-white" />
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
        <MessageCircle className="h-6 w-6" />
      </Link>
    </>
  )
}
