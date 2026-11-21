# Eventos (`/eventos`)

**Arquivos:** `app/eventos/page.tsx` · formatos em `components/site/EventFormats.tsx` +
`hardcoded/event-types.ts` · admin: `components/admin/ContentFormModal.tsx`,
`components/admin/ContentDeleteButton.tsx` · ações em `lib/admin/actions/events.ts` ·
formulário em `CONTENT_FORMS.event` (`lib/admin/content-forms.ts`).

## O que mostra
1. Topo "Eventos" (04 / 05) e abertura "Dança e sensualidade para celebrar junto".
2. **"Formatos para levar até você":** lista fixa de 6 formatos (Chá de Lingerie, Reunião de
   amigas, Apresentações e Performances, Pole Canto, Palestras, Vivência O despertar da Deusa).
   Cada um abre ao toque, mostra a descrição e o botão "Quero no meu evento".
3. **"Próximos eventos" (agenda):** contador "N eventos na agenda" e um card em formato de
   ingresso por evento (`Item` com `type = EVENT`), com a data em destaque (dia, mês, ano),
   título, descrição e "Ver detalhes do evento".
   - Evento sem data mostra "--" no canhoto.
   - Sem eventos, aparece o card "Novas datas em breve" com o botão "Falar no WhatsApp".
   - Com eventos, aparece no fim o botão "Consultar próximos eventos".

## Visitante pode
- Pedir um formato pelo WhatsApp ("Olá! Quero saber sobre {formato} para o meu evento.").
- Pedir detalhes de um evento da agenda ("Olá, quero informações sobre o evento {título}.", ou o
  `whatsappTextTemplate` do evento).
- Perguntar pelos próximos eventos em geral.

## Admin pode
| Ação | Onde | Função |
|---|---|---|
| Criar evento (título, descrição, data) | "+ Adicionar evento" no fim da agenda | `createEventInline` |
| Editar evento | lápis no ingresso | `updateEventInline` |
| Excluir evento (com confirmação) | lixeira no ingresso | `deleteEventInline` |

Os 6 formatos **não** são editáveis pelo site. Para mudá-los, edite `hardcoded/event-types.ts`.

## Regras
- Ordem: data em ordem crescente (`eventDate` asc), depois o criado mais recentemente. Eventos
  sem data ficam no fim. Sem setas de reordenação.
- **Eventos que já passaram continuam aparecendo**, e no topo da lista (a data mais antiga vem
  primeiro), até o admin excluir. Se isso é desejado: **a confirmar**.
- A data é só dia, mês e ano, sem horário. É gravada em UTC e exibida em UTC, para não virar o
  dia anterior.
- Dois eventos com o mesmo título geram slugs `-2`, `-3`…. Depois de 20 tentativas aparece o erro
  "Já existe um evento com esse título".
- Eventos não têm foto.
