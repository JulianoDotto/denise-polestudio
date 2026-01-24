'use client'

import { useFormStatus } from 'react-dom'

type DeleteAction = (formData: FormData) => Promise<void>

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs uppercase tracking-[0.2em] text-red-500 disabled:opacity-50"
    >
      Excluir
    </button>
  )
}

export default function DeleteButton({
  action,
  id,
}: {
  action: DeleteAction
  id: string
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm('Tem certeza que deseja excluir?')) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  )
}
