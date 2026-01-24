import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold">403</h1>
      <p className="text-sm text-muted-foreground">Acesso não autorizado.</p>
      <Link href="/" className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em]">
        Voltar
      </Link>
    </div>
  )
}
