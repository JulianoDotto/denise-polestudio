type HomeIntroProps = {
  title: string
  text: string
  className?: string
}

export default function HomeIntro({ title, text, className }: HomeIntroProps) {
  return (
    <section
      className={`mx-auto flex w-full max-w-3xl flex-col items-center bg-[#FDFDFD] py-12 gap-4 px-6 text-center ${className ?? ''}`.trim()}
    >
      <h2 className="font-display text-2xl uppercase tracking-[0.4em] text-zinc-700">
        {title}
      </h2>
      <p className="text-base leading-relaxed text-zinc-600">{text}</p>
    </section>
  )
}
