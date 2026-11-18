'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import ActionButton from '@/components/site/ActionButton'
import AdminModal from '@/components/site/AdminModal'
import ContentFields from '@/components/admin/ContentFields'
import { createWorkshopInline } from '@/lib/admin/actions'
import { CONTENT_FORMS } from '@/lib/admin/content-forms'

const initialState = { success: false, error: '', requestId: '' }
const config = CONTENT_FORMS.workshop

export default function WorkshopCreateModal() {
  const [state, setState] = useState(initialState)
  const [requestId, setRequestId] = useState('')
  const [pending, startTransition] = useTransition()
  const submitting = useRef(false)

  useEffect(() => setRequestId(crypto.randomUUID()), [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current || !requestId) return

    const formData = new FormData(event.currentTarget)
    submitting.current = true
    setState(initialState)
    startTransition(async () => {
      try {
        const result = await createWorkshopInline(state, formData)
        setState(result)
        if (result.success) setRequestId(crypto.randomUUID())
      } catch {
        setState({ success: false, error: 'network', requestId: '' })
      } finally {
        submitting.current = false
      }
    })
  }

  return (
    <AdminModal
      title={config.create.title}
      description={config.create.description}
      error={state.error}
      success={state.success && !pending}
      actionState={state}
      errorMessages={config.errors}
      successMessage={config.create.success}
      trigger={
        <ActionButton type="button" size="lg" className="w-full max-w-md">
          {config.create.trigger}
        </ActionButton>
      }
    >
      <form
        key={requestId}
        onSubmit={handleSubmit}
        onInput={() => {
          if (state.success) setState(initialState)
        }}
        className="grid gap-4"
      >
        <input type="hidden" name="requestId" value={requestId} />
        <input type="hidden" name="isActive" value="on" />
        <ContentFields kind="workshop" />
        <ActionButton
          type="submit"
          size="sm"
          disabled={pending || !requestId}
          className="self-start"
        >
          {pending ? config.create.pending : config.create.submit}
        </ActionButton>
      </form>
    </AdminModal>
  )
}
