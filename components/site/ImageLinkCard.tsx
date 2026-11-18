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
      className={`image-link-card relative flex min-h-[120px] items-center justify-center overflow-hidden ${className ?? ''}`.trim()}
    >
      <img
        src={imageUrl}
        alt={title}
        className="image-link-card-photo absolute inset-0 h-full w-full object-cover"
      />
      <div className="image-link-card-veil absolute inset-0" />
      <span className="image-link-card-title relative z-10 font-display text-xl font-semibold uppercase text-zinc-300">
        {title}
      </span>
    </Link>
  )
}
