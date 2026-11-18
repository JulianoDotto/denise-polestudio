import { normalizeExternalUrl } from '../externalUrl'

export type ItemUpdateResult<T> = { data: T } | { error: string }

export function parseDate(value: FormDataEntryValue | null) {
  if (!value) return null
  const input = value.toString().trim()
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (Number.isNaN(date.getTime())) return null
  return date
}

function text(form: FormData, key: string) {
  return String(form.get(key) || '').trim()
}

export function parseClassUpdate(
  form: FormData,
): ItemUpdateResult<{ title: string; description: string | null }> {
  const title = text(form, 'title')
  if (!title) return { error: 'title' }
  return {
    data: {
      title,
      description: text(form, 'description') || null,
    },
  }
}

export function parseEventUpdate(
  form: FormData,
): ItemUpdateResult<{ title: string; description: string | null; eventDate: Date | null }> {
  const title = text(form, 'title')
  if (!title) return { error: 'title' }
  return {
    data: {
      title,
      description: text(form, 'description') || null,
      eventDate: parseDate(form.get('eventDate')),
    },
  }
}

export function parseWorkshopUpdate(
  form: FormData,
): ItemUpdateResult<{ title: string; description: string | null }> {
  const title = text(form, 'title')
  if (!title) return { error: 'title' }
  return { data: { title, description: text(form, 'description') || null } }
}

export function parseDigitalProductUpdate(
  form: FormData,
): ItemUpdateResult<{
  title: string
  description: string | null
  hotmartUrl: string | null
  type: 'EBOOK' | 'VIDEO'
}> {
  const title = text(form, 'title')
  if (!title) return { error: 'title' }
  const type = text(form, 'type')
  if (type !== 'EBOOK' && type !== 'VIDEO') return { error: 'type' }
  return {
    data: {
      title,
      description: text(form, 'description') || null,
      hotmartUrl: normalizeExternalUrl(text(form, 'hotmartUrl')) || null,
      type,
    },
  }
}
