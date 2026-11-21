import Link from 'next/link'
import { TEXTS } from '@/hardcoded/texts'

export default async function Header() {
  return (
    <header className="border-b border-vinho/10 bg-[#d8bfb6]">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-5">
        <Link
          href="/"
          className="font-display text-base uppercase tracking-[0.45em] text-vinho"
        >
          {TEXTS.SITE_HEADER_LOGO_1}
        </Link>
      </div>
    </header>
  )
}
