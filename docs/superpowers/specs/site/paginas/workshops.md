# Workshops (`/workshops`)

**Arquivos:** `app/workshops/page.tsx` · `components/site/GlowCard.tsx` · admin:
`components/admin/WorkshopCreateModal.tsx` (criar), `components/admin/ContentFormModal.tsx`
(editar), `components/admin/ContentDeleteButton.tsx` · ações em `lib/admin/actions/workshops.ts`,
proteção contra duplicar em `lib/admin/workshop-persistence.ts` · formulário em
`CONTENT_FORMS.workshop` (`lib/admin/content-forms.ts`).

## O que mostra
- Topo "Workshops" (05 / 05) e abertura "Um tema por encontro, para ir mais fundo".
- Um card escuro por workshop (`Item` com `type = WORKSHOP`): selo "Workshop", foto (se houver no
  banco), título, descrição e o botão **"CONHECER O WORKSHOP"**.

## Visitante pode
- Tocar no botão para abrir o WhatsApp com "Olá, quero informações sobre o workshop {título}."
  (ou o `whatsappTextTemplate`).
- Sem número de WhatsApp configurado, o botão aparece desabilitado.

## Admin pode
| Ação | Onde | Função |
|---|---|---|
| Criar workshop (título, descrição) | "+ Adicionar workshop" no fim | `createWorkshopInline` |
| Editar (título, descrição) | lápis no card | `updateWorkshopInline` |
| Excluir (com confirmação) | lixeira no card | `deleteWorkshopInline` |

## Regras
- **Criar não duplica:** o formulário gera um `requestId` (UUID) que vira o `id` do workshop. Se
  a resposta se perder e o admin salvar de novo, o servidor reconhece a mesma tentativa e não
  cria outro. Por isso a criação usa `WorkshopCreateModal` e não `ContentFormModal`.
- Depois de salvar, o modal continua aberto com "Workshop salvo e adicionado à listagem." (os
  outros tipos fecham o modal).
- O admin **não envia foto** de workshop. Se `coverUrl` estiver preenchido no banco, a foto
  aparece.
- **Sem setas de reordenação.** O workshop novo é criado com `order` 0, então a posição dele
  depende da ordem dos que já existem. Se workshops também devem ser reordenáveis:
  **a confirmar**.
