export function parseCheckbox(value: FormDataEntryValue | null) {
  return value === 'on'
}

export function parseDateTime(value: FormDataEntryValue | null) {
  if (!value) return null
  const date = new Date(value.toString())
  if (Number.isNaN(date.getTime())) return null
  return date
}
