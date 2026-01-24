export default function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${
        active
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-rose-100 text-rose-700'
      }`}
    >
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}
