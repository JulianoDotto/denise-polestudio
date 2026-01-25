import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Acesso negado</h1>
      <p className="text-sm text-muted-foreground">
        Você não tem permissão para acessar essa área.
      </p>
      <Link
        href="/"
        className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em]"
      >
        Voltar para a Home
      </Link>
    </div>
  )
}
