type PageSectionProps = {
  title: string
  paragraphs: string[]
  children?: React.ReactNode
}

export default function PageSection({
  title,
  paragraphs,
  children,
}: PageSectionProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4">
      <h3 className="text-xl uppercase tracking-[0.35em] text-zinc-500">{title}</h3>
      {paragraphs.map((text, index) => (
        <p key={`${title}-${index}`} className="mt-4 text-base leading-relaxed text-zinc-700">
          {text}
        </p>
      ))}
      {children ? <div className="mt-6 flex justify-center">{children}</div> : null}
    </section>
  )
}
