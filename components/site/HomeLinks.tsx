import Link from 'next/link'
import { ArrowUpRight, MonitorPlay } from 'lucide-react'

export type HomeLink = {
  href: string
  title: string
  description: string
  // Without a photo the thumbnail is a wine tile with an icon.
  imageUrl?: string
  // Focal point for the square crop on phones.
  imagePosition?: string
}

type HomeLinksProps = {
  eyebrow: string
  title: string
  links: HomeLink[]
}

// The home's index of the site: one row per page, read top to bottom like a contents list.
export default function HomeLinks({ eyebrow, title, links }: HomeLinksProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-marfim/60">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-3xl uppercase leading-tight tracking-[0.16em] text-marfim sm:text-4xl">
        {title}
      </h2>

      <ul className="mt-8 border-t border-marfim/10">
        {links.map((link, index) => (
          <li key={link.href} className="border-b border-marfim/10">
            <Link
              href={link.href}
              className="group relative flex items-center gap-3.5 py-4 focus-visible:outline-none sm:gap-7 sm:py-5"
            >
              {/* Wine wash behind the row on hover and focus. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-1 -inset-x-3 rounded-2xl bg-vinho/0 ring-marfim/0 transition duration-300 group-hover:bg-vinho/45 group-focus-visible:bg-vinho/45 group-focus-visible:ring-2 group-focus-visible:ring-marfim/80 motion-reduce:transition-none sm:-inset-x-4"
              />

              <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-marfim/10 sm:h-24 sm:w-40">
                {link.imageUrl ? (
                  <img
                    src={link.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: link.imagePosition }}
                    className="h-full w-full object-cover sm:!object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
                <span className="mt-1 block font-display text-lg uppercase leading-tight tracking-[0.18em] text-marfim transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:text-3xl">
                  {link.title}
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-marfim/60 sm:mt-1.5 sm:text-[15px]">
                  {link.description}
                </span>
              </span>

              <span
                aria-hidden="true"
                className="relative inline-flex h-9 w-9 shrink-0 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-marfim/30 text-marfim transition duration-300 ease-out group-hover:border-marfim group-hover:bg-marfim group-hover:text-tinta group-focus-visible:bg-marfim group-focus-visible:text-tinta motion-reduce:transition-none"
              >
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
