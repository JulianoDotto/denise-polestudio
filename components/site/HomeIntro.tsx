type HomeIntroProps = {
  title: string
  text: string
  className?: string
}

export default function HomeIntro({ title, text, className }: HomeIntroProps) {
  return (
    <section
      className={`mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 text-center ${className ?? ''}`.trim()}
    >
      <h2 className="font-display text-base uppercase tracking-[0.4em] text-zinc-700">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-zinc-600">{text}</p>
    </section>
  )
}
