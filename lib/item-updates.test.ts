import assert from 'node:assert/strict'
import test from 'node:test'

import {
  parseClassUpdate,
  parseDigitalProductUpdate,
  parseEventUpdate,
  parseWorkshopUpdate,
} from './admin/item-updates'

function form(values: Record<string, string>) {
  const data = new FormData()
  for (const [key, value] of Object.entries(values)) data.set(key, value)
  return data
}

test('class update only contains the fields the form edits', () => {
  const result = parseClassUpdate(form({ title: ' Pole ', description: '', coverUrl: '/capa.jpg' }))
  assert.deepEqual(result, { data: { title: 'Pole', description: null, coverUrl: '/capa.jpg' } })
})

test('event update keeps the custom WhatsApp message out of the payload', () => {
  const result = parseEventUpdate(form({ title: 'Evento', description: 'Detalhes', eventDate: '2026-12-05' }))
  assert.ok('data' in result)
  assert.deepEqual(Object.keys(result.data).sort(), ['description', 'eventDate', 'title'])
  assert.equal(result.data.eventDate?.toISOString(), '2026-12-05T00:00:00.000Z')
})

test('blank title is rejected', () => {
  assert.deepEqual(parseClassUpdate(form({ title: '   ' })), { error: 'title' })
  assert.deepEqual(parseEventUpdate(form({ title: '   ' })), { error: 'title' })
  assert.deepEqual(parseWorkshopUpdate(form({ title: '   ' })), { error: 'title' })
  assert.deepEqual(parseDigitalProductUpdate(form({ title: '   ', type: 'EBOOK' })), { error: 'title' })
})

test('cleared or invalid event date becomes null', () => {
  for (const eventDate of ['', 'amanhã']) {
    const result = parseEventUpdate(form({ title: 'Evento', eventDate }))
    assert.ok('data' in result)
    assert.equal(result.data.eventDate, null)
  }
})

test('digital product link gets https and type is validated', () => {
  const result = parseDigitalProductUpdate(form({ title: 'E-book', hotmartUrl: 'hotmart.com/x', type: 'EBOOK' }))
  assert.ok('data' in result)
  assert.equal(result.data.hotmartUrl, 'https://hotmart.com/x')
  assert.deepEqual(parseDigitalProductUpdate(form({ title: 'E-book', type: 'CLASS' })), { error: 'type' })
})
