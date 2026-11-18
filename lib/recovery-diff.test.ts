import assert from 'node:assert/strict'
import test from 'node:test'

import { diffRecoverableItems, type RecoverableItem } from './recovery-diff'

function item(overrides: Partial<RecoverableItem> = {}): RecoverableItem {
  return {
    id: '1',
    type: 'CLASS',
    title: 'Aula',
    hotmartUrl: null,
    whatsappTextTemplate: null,
    scheduleOnlineUrl: null,
    schedulePresentialUrl: null,
    ...overrides,
  }
}

test('reports a value that exists only in the backup', () => {
  const changes = diffRecoverableItems([item({ whatsappTextTemplate: 'Oi' })], [item()])
  assert.deepEqual(changes, [{ id: '1', type: 'CLASS', title: 'Aula', field: 'whatsappTextTemplate', value: 'Oi' }])
})

test('never overwrites a value filled in after the backup', () => {
  const changes = diffRecoverableItems(
    [item({ whatsappTextTemplate: 'Antigo' })],
    [item({ whatsappTextTemplate: 'Novo' })],
  )
  assert.deepEqual(changes, [])
})

test('ignores items deleted since the backup', () => {
  assert.deepEqual(diffRecoverableItems([item({ hotmartUrl: 'https://a' })], []), [])
})
