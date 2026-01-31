import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'

const workshops = [
  {
    title: 'Workshop de Sensualidade',
    description: 'Técnicas de expressão corporal, musicalidade e confiança no movimento.',
  },
  {
    title: 'Workshop de Flexibilidade',
    description: 'Sequências guiadas para ampliar mobilidade e força com segurança.',
  },
  {
    title: 'Workshop Coreográfico',
    description: 'Criação de coreografias com foco em presença e interpretação.',
  },
]

export default async function WorkshopsPage() {
  const phone = getWhatsAppPhone()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Workshops</h1>
      <p className="text-sm text-muted-foreground">
        Encontros intensivos para aprofundar técnicas, explorar temas específicos e viver
        experiências únicas.
      </p>

      <div className="grid gap-4">
        {workshops.map((workshop) => {
          const message = `Olá, quero informações sobre o workshop ${workshop.title}.`
          const url = phone ? buildWhatsAppUrl(phone, message) : ''

          return (
            <div key={workshop.title} className="flex flex-col gap-4 rounded-3xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">{workshop.title}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Workshop
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{workshop.description}</p>
              {url ? (
                <Button asChild>
                  <a href={url} target="_blank" rel="noreferrer">
                    QUERO PARTICIPAR
                  </a>
                </Button>
              ) : (
                <Button disabled>QUERO PARTICIPAR</Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
