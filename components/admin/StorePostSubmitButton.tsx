'use client'

import { useFormStatus } from 'react-dom'

import ActionButton from '@/components/site/ActionButton'
import { TEXTS } from '@/hardcoded/texts'

export default function StorePostSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <ActionButton type="submit" size="sm" className="self-start" disabled={pending}>
      {TEXTS.LOJA_ADMIN_SUBMIT_1}
    </ActionButton>
  )
}
