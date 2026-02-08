import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ItemType } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { getItemBySlug } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

export default async function AulaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await getItemBySlug(slug)
  if (!item || item.type !== ItemType.CLASS) return notFound()

  const imageUrl = item.coverUrl || item.images[0]?.url || IMAGES.AULA_DETAIL_PLACEHOLDER_1
  const phone = getWhatsAppPhone()
  const baseMessage =
    item.whatsappTextTemplate ||
    TEXTS.AULAS_WHATSAPP_TEMPLATE_1.replace('{title}', item.title)

  const onlineMessage = `${baseMessage} (${TEXTS.AULAS_WHATSAPP_ONLINE_SUFFIX_1})`
  const presentialMessage = `${baseMessage} (${TEXTS.AULAS_WHATSAPP_PRESENTIAL_SUFFIX_1})`

  const onlineUrl = phone ? buildWhatsAppUrl(phone, onlineMessage) : ''
  const presentialUrl = phone ? buildWhatsAppUrl(phone, presentialMessage) : ''

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-6">
        <img
          src={imageUrl}
          alt={item.title}
          className="h-72 w-full rounded-3xl object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{item.title}</h1>
          <p className="text-sm text-muted-foreground">
            {item.description || TEXTS.AULA_DETAIL_DEFAULT_DESC_1}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border bg-white p-5">
            <h2 className="text-base font-semibold">
              {TEXTS.AULA_DETAIL_SECTION_ABOUT_TITLE_1}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description || TEXTS.AULA_DETAIL_DEFAULT_DESC_1}
            </p>
          </div>
          <div className="rounded-3xl border bg-white p-5">
            <h2 className="text-base font-semibold">
              {TEXTS.AULA_DETAIL_SECTION_HOW_TITLE_1}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {TEXTS.AULA_DETAIL_SECTION_HOW_TEXT_1}
            </p>
          </div>
          <div className="rounded-3xl border bg-white p-5">
            <h2 className="text-base font-semibold">
              {TEXTS.AULA_DETAIL_SECTION_INFO_TITLE_1}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {TEXTS.AULA_DETAIL_SECTION_INFO_TEXT_1}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {item.hotmartUrl ? (
            <Button asChild>
              <Link href={item.hotmartUrl} target="_blank">
                {TEXTS.AULA_DETAIL_HOTMART_LABEL_1}
              </Link>
            </Button>
          ) : null}

          {onlineUrl ? (
            <Button asChild variant="outline">
              <Link href={onlineUrl} target="_blank">
                {TEXTS.AULA_DETAIL_BUTTON_ONLINE_1}
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              {TEXTS.AULA_DETAIL_BUTTON_ONLINE_1}
            </Button>
          )}

          {presentialUrl ? (
            <Button asChild variant="outline">
              <Link href={presentialUrl} target="_blank">
                {TEXTS.AULA_DETAIL_BUTTON_PRESENTIAL_1}
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              {TEXTS.AULA_DETAIL_BUTTON_PRESENTIAL_1}
            </Button>
          )}

          {!phone ? (
            <p className="text-xs text-muted-foreground">
              {TEXTS.AULA_DETAIL_WHATSAPP_MISSING_1}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
