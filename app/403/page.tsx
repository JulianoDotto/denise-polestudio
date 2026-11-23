import type { Metadata } from 'next'
import Link from 'next/link'
import { TEXTS } from '@/hardcoded/texts'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">{TEXTS.FORBIDDEN_TITLE_1}</h1>
      <p className="text-sm text-muted-foreground">
        {TEXTS.FORBIDDEN_DESCRIPTION_1}
      </p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {TEXTS.FORBIDDEN_BACK_HOME_1}
      </Link>
    </div>
  )
}
