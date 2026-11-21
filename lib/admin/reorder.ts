export type MoveDirection = 'up' | 'down'

export function parseMoveDirection(value: FormDataEntryValue | null): MoveDirection | null {
  return value === 'up' || value === 'down' ? value : null
}

// Moves `id` past its visible neighbor. Hidden ids keep their slots, so a tap
// always changes what is on screen even when hidden entries sit in between.
export function moveVisible(
  all: string[],
  visible: string[],
  id: string,
  direction: MoveDirection,
): string[] | null {
  const from = visible.indexOf(id)
  if (from === -1) return null
  const to = direction === 'up' ? from - 1 : from + 1
  if (to < 0 || to >= visible.length) return null

  const reordered = [...visible]
  reordered[from] = visible[to]
  reordered[to] = id

  const visibleSet = new Set(visible)
  let next = 0
  return all.map((entry) => (visibleSet.has(entry) ? reordered[next++] : entry))
}
