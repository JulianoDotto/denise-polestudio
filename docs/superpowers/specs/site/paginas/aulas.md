# Aulas (`/aulas`)

**Arquivos:** `app/aulas/page.tsx` · cards em `components/site/GlowCard.tsx` · admin:
`components/admin/ContentFormModal.tsx`, `components/admin/ContentDeleteButton.tsx`,
`components/admin/ReorderButtons.tsx` · ações em `lib/admin/actions/classes.ts` e
`lib/admin/actions/reorder.ts` · formulário configurado em `lib/admin/content-forms.ts`
(`CONTENT_FORMS.class`).

## O que mostra
- Topo "Aulas" (01 / 05) e abertura com o selo "Pole dance em Caçapava/SP", o título "Do
  primeiro giro à sua melhor versão" e três parágrafos para a aluna nova (`AULAS_INTRO_TEXT_1` a
  `_3`): o estúdio em Caçapava e o começo pelo seu nível, a formação da Denise e a proximidade de
  São José dos Campos e Taubaté.
- **No Google:** título "Aulas de pole dance em Caçapava/SP · Denise Garcia" e descrição
  `META_AULAS_DESCRIPTION_1`. Esse texto é de busca local (ver [seo.md](../seo.md)): ao mudar,
  manter "pole dance" e "Caçapava".
- Um card escuro por aula (`Item` com `type = CLASS` e `isActive`): selo "Aula", foto (se
  houver), título, descrição e botão **"Ver horários e valores"**.
- A foto ocupa um quadro 3:2 reservado antes de carregar (`aspect-[3/2] object-cover`), para a
  página não pular. As fotos atuais são de paisagem perto dessa proporção.
- Sem descrição, o card usa o texto padrão `AULAS_DEFAULT_DESC_1`.
- **Sem nenhuma aula publicada**, aparece o card tracejado "Turmas no WhatsApp"
  (`components/site/EmptyState.tsx`) com o botão "Falar no WhatsApp".

## Visitante pode
- Tocar em "Ver horários e valores" para abrir o WhatsApp com "Olá! Quero conhecer a aula de
  {título}. Pode me passar os horários e valores?". Se a aula tiver `whatsappTextTemplate`, essa
  mensagem é usada no lugar.
- Sem número de WhatsApp configurado, o botão não aparece.

## Admin pode
| Ação | Onde | Função |
|---|---|---|
| Criar aula (título, descrição, foto) | botão "+ Adicionar nova aula" no fim da lista | `createClassInline` |
| Editar aula (título, descrição, trocar foto) | lápis no card | `updateClassInline` |
| Excluir aula (com confirmação; apaga a foto) | lixeira no card | `deleteClassInline` |
| Mover para cima / para baixo | setas no card | `moveItem` com `list = class` |

## Regras
- O título é obrigatório. A foto é opcional: JPEG, PNG ou WebP, reduzida no navegador (ver
  [dados.md](../dados.md#fotos)).
- Aula nova entra no fim da lista.
- A seta do primeiro card não sobe e a do último não desce.
- Preço e horário não ficam no site: a pessoa pergunta pelo WhatsApp.
