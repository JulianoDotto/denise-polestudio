import Link from 'next/link'
import { TEXTS } from '@/hardcoded/texts'

export default async function Header() {
  return (
    <header className="border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-5">
        <Link
          href="/"
          className="font-display text-base uppercase tracking-[0.45em] text-white/90"
        >
          {TEXTS.SITE_HEADER_LOGO_1}
        </Link>
      </div>
    </header>
  )
}
