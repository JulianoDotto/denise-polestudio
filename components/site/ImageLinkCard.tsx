import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

type ImageLinkCardProps = {
  href: string
  title: string
  imageUrl: string
  index: number
}

export default function ImageLinkCard({ href, title, imageUrl, index }: ImageLinkCardProps) {
  return (
    <Link
      href={href}
      aria-label={title}
      className="group relative flex h-32 items-center overflow-hidden focus-visible:outline-none [clip-path:inset(0_round_24px)]"
    >
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-right transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,11,11,0.92)_0%,rgba(58,16,28,0.7)_45%,rgba(58,16,28,0.15)_100%)] transition-opacity duration-500 group-hover:opacity-85 motion-reduce:transition-none" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-marfim/15 transition group-hover:ring-marfim/30 group-focus-visible:ring-2 group-focus-visible:ring-marfim"
      />
      <div className="relative z-10 flex w-full items-center justify-between gap-4 px-6 sm:px-8">
        <div className="grid gap-2">
          <span className="text-[11px] tracking-[0.32em] text-marfim/60">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-display text-xl uppercase tracking-[0.28em] text-marfim transition-[letter-spacing] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:tracking-[0.34em] group-focus-visible:tracking-[0.34em] motion-reduce:transition-none motion-reduce:group-hover:tracking-[0.28em] sm:text-2xl">
            {title}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-marfim/40 text-marfim transition duration-300 ease-out group-hover:border-marfim group-hover:bg-marfim group-hover:text-tinta group-focus-visible:bg-marfim group-focus-visible:text-tinta motion-reduce:transition-none"
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
        </span>
      </div>
    </Link>
  )
}
