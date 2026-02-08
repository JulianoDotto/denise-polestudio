type PageSectionProps = {
  title: string
  paragraphs: string[]
  children?: React.ReactNode
  className?: string
}

export default function PageSection({
  title,
  paragraphs,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={`mx-auto w-full max-w-5xl px-4 ${className ?? ''}`.trim()}>
      <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">{title}</p>
      {paragraphs.map((text, index) => (
        <p key={`${title}-${index}`} className="mt-4 text-base leading-relaxed text-zinc-700">
          {text}
        </p>
      ))}
      {children ? <div className="mt-6 flex justify-center">{children}</div> : null}
    </section>
  )
}
