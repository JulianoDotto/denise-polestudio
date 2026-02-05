import Link from 'next/link'
import { Instagram, MapPin, Phone, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <>
      <footer className="border-t border-white/10 bg-[#5b1524] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-white/10 p-2">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div className="leading-relaxed">
                <p>Rua Rafael Citro, 42</p>
                <p>Jardim Rafael, Caçapava/SP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/10 p-2">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <p>(12) 98815-3159</p>
            </div>
            <Link
              href="https://www.instagram.com/denisegarcia.polestudio/"
              target="_blank"
              className="flex items-center gap-3"
            >
              <div className="rounded-full bg-white/10 p-2">
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <span>@denisegarcia.polestudio</span>
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10 bg-white/5 px-6 py-3 text-center text-xs text-white/70">
          Copyright ©2025 • Todos os direitos reservados
        </div>
      </footer>

      <Link
        href="https://wa.me/5512988153159"
        target="_blank"
        aria-label="Abrir WhatsApp"
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5"
      >
        <MessageCircle className="h-6 w-6" />
      </Link>
    </>
  )
}
