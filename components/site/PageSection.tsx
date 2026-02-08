type PageSectionProps = {
  title: string
  paragraphs: string[]
  children?: React.ReactNode
  className?: string
  fontTone?: 'dark' | 'light'
}

export default function PageSection({
  title,
  paragraphs,
  children,
  className,
  fontTone = 'dark',
}: PageSectionProps) {
  const titleTone = fontTone === 'light' ? 'text-zinc-400' : 'text-zinc-500'
  const paragraphTone = fontTone === 'light' ? 'text-zinc-300' : 'text-zinc-700'
  return (
    <section className={`mx-auto w-full max-w-5xl px-4 ${className ?? ''}`.trim()}>
      <h3 className={`text-xl uppercase tracking-[0.35em] ${titleTone}`}>{title}</h3>
      {paragraphs.map((text, index) => (
        <p key={`${title}-${index}`} className={`mt-4 text-base leading-relaxed ${paragraphTone}`}>
          {text}
        </p>
      ))}
      {children ? <div className="mt-6 flex justify-center">{children}</div> : null}
    </section>
  )
}
