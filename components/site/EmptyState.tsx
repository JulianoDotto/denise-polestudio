type EmptyStateProps = {
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

// Shown when a list has nothing published yet: a dashed ticket stub, so the page
// still says what comes next instead of ending on a blank section.
export default function EmptyState({ title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-dashed border-vinho/30 bg-white/70 px-6 py-10 text-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-dashed border-vinho/30 bg-areia"
      />
      <span
        aria-hidden="true"
        className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-dashed border-vinho/30 bg-areia"
      />
      <h3 className="font-display text-2xl uppercase tracking-[0.12em] text-vinho">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-600">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
