export type WorkshopCreation = {
  requestId: string
  title: string
  description: string | null
  isActive: boolean
}

export type PersistedWorkshop = WorkshopCreation & { id: string }

export class WorkshopRequestConflictError extends Error {}

type WorkshopCreationStore = {
  findByRequestId: (requestId: string) => Promise<PersistedWorkshop | null>
  create: (creation: WorkshopCreation) => Promise<PersistedWorkshop>
}

function matchesRequest(existing: PersistedWorkshop, creation: WorkshopCreation) {
  return existing.id === creation.requestId
    && existing.title === creation.title
    && existing.description === creation.description
    && existing.isActive === creation.isActive
}

export async function persistWorkshopCreation(
  store: WorkshopCreationStore,
  creation: WorkshopCreation,
) {
  const existing = await store.findByRequestId(creation.requestId)
  if (existing) {
    if (!matchesRequest(existing, creation)) throw new WorkshopRequestConflictError()
    return { workshop: existing, replayed: true }
  }

  try {
    const workshop = await store.create(creation)
    return { workshop, replayed: false }
  } catch (error) {
    const persisted = await store.findByRequestId(creation.requestId)
    if (!persisted) throw error
    if (!matchesRequest(persisted, creation)) throw new WorkshopRequestConflictError()
    return { workshop: persisted, replayed: true }
  }
}
