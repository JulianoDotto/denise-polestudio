export type RecoverableField =
  | 'hotmartUrl'
  | 'whatsappTextTemplate'
  | 'scheduleOnlineUrl'
  | 'schedulePresentialUrl'

export type RecoverableItem = { id: string; type: string; title: string } & Record<
  RecoverableField,
  string | null
>

export type RecoveryChange = {
  id: string
  type: string
  title: string
  field: RecoverableField
  value: string
}

export const RECOVERABLE_FIELDS: readonly RecoverableField[] = [
  'hotmartUrl',
  'whatsappTextTemplate',
  'scheduleOnlineUrl',
  'schedulePresentialUrl',
]

/** Lists values present in the backup that are null in the current item with the same id. */
export function diffRecoverableItems(
  backup: RecoverableItem[],
  current: RecoverableItem[],
): RecoveryChange[] {
  const currentById = new Map(current.map((item) => [item.id, item]))
  const changes: RecoveryChange[] = []

  for (const old of backup) {
    const now = currentById.get(old.id)
    if (!now) continue

    for (const field of RECOVERABLE_FIELDS) {
      const value = old[field]
      if (value !== null && now[field] === null) {
        changes.push({ id: old.id, type: old.type, title: old.title, field, value })
      }
    }
  }

  return changes
}
