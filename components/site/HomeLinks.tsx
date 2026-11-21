import Link from 'next/link'
import { ArrowUpRight, MonitorPlay } from 'lucide-react'

export type HomeLink = {
  href: string
  title: string
  description: string
  // Without a photo the thumbnail is a wine tile with an icon.
  imageUrl?: string
}

type HomeLinksProps = {
  eyebrow: string
  title: string
  links: HomeLink[]
}

// The home's index of the site: one row per page, read top to bottom like a contents list.
export default function HomeLinks({ eyebrow, title, links }: HomeLinksProps) {
  return (
    <section className="px-3 py-3">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-tinta">
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-28 -z-10 h-80 w-80 rounded-full bg-vinho opacity-70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-72 w-72 rounded-full bg-vinho/40 blur-3xl" />
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-marfim/60">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-[2.1rem] leading-[1.08] tracking-[0.005em] text-marfim sm:text-5xl">
        {title}
      </h2>

      <ul className="mt-8 border-t border-marfim/10">
        {links.map((link, index) => (
          <li key={link.href} className="border-b border-marfim/10">
            <Link
              href={link.href}
              className="group relative flex flex-wrap items-center gap-x-3.5 gap-y-3 py-4 transition-transform duration-150 active:scale-[0.985] motion-reduce:active:scale-100 focus-visible:outline-none sm:flex-nowrap sm:gap-7 sm:py-5"
            >
              {/* Wine wash behind the row on hover and focus. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-1 -inset-x-3 rounded-2xl bg-vinho/0 ring-marfim/0 transition duration-300 group-hover:bg-vinho/45 group-active:bg-vinho/60 group-focus-visible:bg-vinho/45 group-focus-visible:ring-2 group-focus-visible:ring-marfim/80 motion-reduce:transition-none sm:-inset-x-4"
              />

              {/* Frame in the photos' own 358:156 shape, so cover never crops them. */}
              <span className="relative aspect-[358/156] w-full overflow-hidden rounded-2xl ring-1 ring-marfim/10 sm:w-44 sm:shrink-0">
                {link.imageUrl ? (
                  <img
                    src={link.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[linear-gradient(150deg,#6e2235_0%,#3a101c_100%)]">
                    <MonitorPlay aria-hidden="true" className="h-7 w-7 text-marfim/80" strokeWidth={1.4} />
                  </span>
                )}
              </span>

              <span className="relative min-w-0 flex-1">
                <span aria-hidden="true" className="block text-[11px] tracking-[0.32em] text-marfim/45">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mt-1 block font-display text-xl uppercase leading-tight tracking-[0.16em] sm:tracking-[0.18em] text-marfim transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:text-3xl">
                  {link.title}
                </span>
                <span className="mt-1 block text-sm leading-snug text-marfim/65 sm:mt-1.5 sm:text-[15px]">
                  {link.description}
                </span>
              </span>

              <span
                aria-hidden="true"
                className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-marfim/30 text-marfim transition duration-300 ease-out group-hover:border-marfim group-hover:bg-marfim group-hover:text-tinta group-active:bg-marfim group-active:text-tinta group-focus-visible:bg-marfim group-focus-visible:text-tinta motion-reduce:transition-none"
              >
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      </div>
      </div>
    </section>
  )
}
