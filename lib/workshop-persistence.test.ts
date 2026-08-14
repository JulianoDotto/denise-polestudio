import assert from 'node:assert/strict'
import test from 'node:test'

import {
  persistWorkshopCreation,
  WorkshopRequestConflictError,
  type PersistedWorkshop,
  type WorkshopCreation,
} from './admin/workshop-persistence'

const creation: WorkshopCreation = {
  requestId: 'request-1', title: 'Workshop teste', description: 'Descrição', isActive: true,
}

test('persists a new workshop', async () => {
  let stored: PersistedWorkshop | null = null
  const result = await persistWorkshopCreation({
    findByRequestId: async () => stored,
    create: async (data) => (stored = { ...data, id: data.requestId }),
  }, creation)
  assert.equal(result.replayed, false)
})

test('reuses the result when the same request is retried', async () => {
  const stored = { ...creation, id: creation.requestId }
  let creates = 0
  const result = await persistWorkshopCreation({
    findByRequestId: async () => stored,
    create: async () => { creates += 1; return stored },
  }, creation)
  assert.equal(result.replayed, true)
  assert.equal(creates, 0)
})

test('recovers when persistence succeeds but its response is lost', async () => {
  let stored: PersistedWorkshop | null = null
  const result = await persistWorkshopCreation({
    findByRequestId: async () => stored,
    create: async (data) => {
      stored = { ...data, id: data.requestId }
      throw new Error('response lost')
    },
  }, creation)
  assert.equal(result.replayed, true)
})

test('propagates a failure that did not persist', async () => {
  await assert.rejects(persistWorkshopCreation({
    findByRequestId: async () => null,
    create: async () => { throw new Error('database unavailable') },
  }, creation), /database unavailable/)
})

test('rejects reuse of a request id with different content', async () => {
  const stored = { ...creation, id: creation.requestId }
  await assert.rejects(persistWorkshopCreation({
    findByRequestId: async () => stored,
    create: async () => stored,
  }, { ...creation, title: 'Outro workshop' }), WorkshopRequestConflictError)
})
