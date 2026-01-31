import { redirect } from 'next/navigation'

export default function AdminEbooksEditRedirectPage({
  params,
}: {
  params: { id: string }
}) {
  redirect(`/admin/produtos-digitais/${params.id}/edit`)
}
