import Link from 'next/link'
import { TEXTS } from '@/hardcoded/texts'

export default async function Header() {
  return (
    <header className="border-b border-vinho/10 bg-[#d8bfb6]">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-5">
        <Link
          href="/"
          translate="no"
          className="rounded-full px-2 font-display text-base uppercase tracking-[0.45em] text-vinho transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vinho focus-visible:ring-offset-4 focus-visible:ring-offset-[#d8bfb6]"
        >
          {TEXTS.SITE_HEADER_LOGO_1}
        </Link>
      </div>
    </header>
  )
}
