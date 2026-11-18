'use client'

import { useActionState } from 'react'
import { Pencil } from 'lucide-react'

import ActionButton from '@/components/site/ActionButton'
import AdminModal from '@/components/site/AdminModal'
import ContentFields, {
  contentIconButtonClass,
  type ContentTone,
} from '@/components/admin/ContentFields'
import {
  createClassInline,
  createDigitalProductInline,
  createEventInline,
  updateClassInline,
  updateDigitalProductInline,
  updateEventInline,
  updateWorkshopInline,
} from '@/lib/admin/actions'
import {
  CONTENT_FORMS,
  type ContentKind,
  type ContentValues,
} from '@/lib/admin/content-forms'

const initialState = { success: false, error: '' }

const CREATE_ACTIONS = {
  class: createClassInline,
  event: createEventInline,
  digitalProduct: createDigitalProductInline,
}

const UPDATE_ACTIONS = {
  class: updateClassInline,
  event: updateEventInline,
  workshop: updateWorkshopInline,
  digitalProduct: updateDigitalProductInline,
}

// Workshops are created by WorkshopCreateModal, which needs a request id.
type ContentFormModalProps =
  | {
      kind: Exclude<ContentKind, 'workshop'>
      mode: 'create'
      values?: undefined
      tone?: ContentTone
    }
  | {
      kind: ContentKind
      mode: 'edit'
      values: ContentValues
      tone?: ContentTone
    }

export default function ContentFormModal(props: ContentFormModalProps) {
  const { kind, tone } = props
  const config = CONTENT_FORMS[kind]
  const action =
    props.mode === 'create'
      ? CREATE_ACTIONS[props.kind]
      : UPDATE_ACTIONS[props.kind]
  const [state, formAction, pending] = useActionState(action, initialState)

  if (props.mode === 'create') {
    return (
      <AdminModal
        title={config.create.title}
        description={config.create.description}
        error={state.error}
        success={state.success}
        actionState={state}
        closeOnSuccess
        errorMessages={config.errors}
        trigger={
          <ActionButton type="button" size="lg" className="w-full max-w-md">
            {config.create.trigger}
          </ActionButton>
        }
      >
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="isActive" value="on" />
          <ContentFields kind={kind} />
          <ActionButton type="submit" size="sm" className="self-start">
            {config.create.submit}
          </ActionButton>
        </form>
      </AdminModal>
    )
  }

  const { values } = props
  const showPending = pending && Boolean(config.edit.pending)
  const isActive = kind === 'event' ? (values.isActive ?? true) : true

  return (
    <AdminModal
      title={config.edit.title}
      description={config.edit.description}
      error={state.error}
      success={state.success}
      actionState={state}
      closeOnSuccess
      errorMessages={config.errors}
      trigger={
        <button
          type="button"
          className={contentIconButtonClass(kind, tone)}
          aria-label={config.edit.iconAria}
        >
          <Pencil className="h-4 w-4" />
        </button>
      }
    >
      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="id" value={values.id ?? ''} />
        <input type="hidden" name="isActive" value={isActive ? 'on' : ''} />
        <ContentFields kind={kind} values={values} />
        {kind === 'workshop' ? (
          <ActionButton type="submit" size="sm" disabled={pending} className="self-start">
            {pending ? config.edit.pending : config.edit.submit}
          </ActionButton>
        ) : (
          <button
            type="submit"
            disabled={showPending}
            className="self-start rounded-full bg-[#0E0E0E] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {showPending ? config.edit.pending : config.edit.submit}
          </button>
        )}
      </form>
    </AdminModal>
  )
}
