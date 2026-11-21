type GlowCardProps = {
  index: number
  eyebrow: string
  title: string
  description: string
  action: React.ReactNode
  adminControls?: React.ReactNode
  media?: React.ReactNode
}

// Dark card with a wine glow, shared by the digital products and workshops pages.
export default function GlowCard({
  index,
  eyebrow,
  title,
  description,
  action,
  adminControls,
  media,
}: GlowCardProps) {
  return (
    <article className="group relative flex rounded-[28px] shadow-[0_24px_48px_-28px_rgba(90,26,42,0.6)] ring-1 ring-marfim/10 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_32px_64px_-28px_rgba(90,26,42,0.8)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative isolate flex w-full flex-col bg-tinta p-7 text-marfim [clip-path:inset(0_round_28px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 -z-10 h-80 w-80 rounded-full bg-vinho opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-72 w-72 rounded-full bg-vinho/40 blur-3xl"
      />
      {adminControls ? (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">{adminControls}</div>
      ) : media ? null : (
        <span
          aria-hidden="true"
          className="absolute right-7 top-5 font-display text-5xl leading-none text-marfim/10"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      {media ? <div className="-mx-7 -mt-7 mb-7 overflow-hidden">{media}</div> : null}
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-marfim/70">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#d4919f]" />
        {eyebrow}
      </p>
      <h2 className="mt-5 font-display text-2xl uppercase leading-tight tracking-[0.12em] text-marfim">
        {title}
      </h2>
      <div
        aria-hidden="true"
        className="mt-5 h-px w-12 bg-marfim/30 transition-all duration-500 group-hover:w-20 motion-reduce:transition-none"
      />
      <p className="mt-5 flex-1 whitespace-pre-line text-[15px] leading-relaxed text-marfim/75">
        {description}
      </p>
      <div className="mt-7">{action}</div>
      </div>
    </article>
  )
}
