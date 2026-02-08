import Link from 'next/link'
import { TEXTS } from '@/hardcoded/texts'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">{TEXTS.FORBIDDEN_TITLE_1}</h1>
      <p className="text-sm text-muted-foreground">
        {TEXTS.FORBIDDEN_DESCRIPTION_1}
      </p>
      <Link
        href="/"
        className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em]"
      >
        {TEXTS.FORBIDDEN_BACK_HOME_1}
      </Link>
    </div>
  )
}
