import { cn } from '@/lib/utils'

type PageHeroProps = {
  imageUrl: string
  title: string
  eyebrow?: string
  className?: string
  contentClassName?: string
}

export default function PageHero({
  imageUrl,
  title,
  eyebrow,
  className,
  contentClassName,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative isolate h-[520px] overflow-hidden bg-stone-950 sm:h-[640px]',
        className,
      )}
    >
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div
        className={cn(
          'relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-14',
          contentClassName,
        )}
      >
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.5em] text-zinc-300/70">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 font-display text-4xl uppercase tracking-[0.35em] text-zinc-300 sm:text-5xl">
          {title}
        </h1>
      </div>
    </section>
  )
}
