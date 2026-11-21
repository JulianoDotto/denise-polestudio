# Produtos digitais (`/produtos-digitais`)

**Arquivos:** `app/produtos-digitais/page.tsx` · `components/site/GlowCard.tsx` · admin:
`components/admin/ContentFormModal.tsx`, `components/admin/ContentDeleteButton.tsx`,
`components/admin/ReorderButtons.tsx` · ações em `lib/admin/actions/digital-products.ts` e
`lib/admin/actions/reorder.ts` · formulário em `CONTENT_FORMS.digitalProduct`
(`lib/admin/content-forms.ts`).

## O que mostra
- Topo "Produtos digitais" (03 / 05) e abertura "Aprenda no seu ritmo, de onde estiver".
- Uma lista única com e-books (`EBOOK`) e aulas gravadas (`VIDEO`), misturados na ordem que o
  admin definiu. Cada card tem selo "E-book" ou "Aula digital", título, descrição e o botão
  **"Conhecer o conteúdo"**.
- Os cards não têm foto.

## Visitante pode
- Tocar em "Conhecer o conteúdo":
  - se o produto tem link, abre o link (se faltar `https://`, ele é acrescentado por
    `lib/externalUrl.ts`);
  - sem link, abre o WhatsApp com "Olá! Tenho interesse no produto digital {título}…";
  - sem link e sem WhatsApp, aparece o aviso "Configurar link ou WhatsApp".

## Admin pode
| Ação | Onde | Função |
|---|---|---|
| Criar (título, descrição, link, tipo E-book/Aula digital) | "+ ADICIONAR" no fim | `createDigitalProductInline` |
| Editar (mesmos campos, inclusive trocar o tipo) | lápis no card | `updateDigitalProductInline` |
| Excluir (com confirmação) | lixeira no card | `deleteDigitalProductInline` |
| Mover para cima / para baixo (e-books e vídeos na mesma lista) | setas no card | `moveItem` com `list = digitalProduct` |

## Regras
- O título é obrigatório e o tipo tem que ser `EBOOK` ou `VIDEO`.
- O campo do link se chama `hotmartUrl`, mas aceita qualquer endereço.
- Produto novo entra no fim da lista.
