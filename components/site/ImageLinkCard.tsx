import Link from 'next/link'

type ImageLinkCardProps = {
  href: string
  title: string
  imageUrl: string
  className?: string
}

export default function ImageLinkCard({
  href,
  title,
  imageUrl,
  className,
}: ImageLinkCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[120px] items-center justify-center overflow-hidden rounded-3xl ${className ?? ''}`.trim()}
    >
      <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/45 transition group-hover:bg-black/55" />
      <span className="relative z-10 font-display text-lg uppercase tracking-[0.35em] text-white">
        {title}
      </span>
    </Link>
  )
}
