# Guia de componentização

Descreve o padrão que o código **já segue**. A seção "Desvios atuais" lista onde ele foge do
padrão. Ao mexer num desses pontos, aproxime-o do padrão, mas não refatore só por refatorar.

## Onde cada coisa mora

| Pasta | O que vai lá | Exemplos |
|---|---|---|
| `app/<rota>/page.tsx` | A página: busca os dados no servidor, verifica se é admin e monta os componentes. Não tem lógica de regra | `app/aulas/page.tsx` |
| `components/site/` | Peças que o **visitante** vê | `ActionButton`, `GlowCard`, `PageHero`, `PageIntro`, `StoreProductRow` |
| `components/admin/` | Peças que **só o admin** vê: modais, campos, botões de editar, excluir e reordenar | `ContentFormModal`, `AdminModal`, `ReorderButtons` |
| `components/ui/` | Primitivos do shadcn/ui, sem regra do projeto | `dialog.tsx` (Radix Dialog) |
| `lib/*.ts` | Lógica **pura** usada pelo site (formatar preço, agrupar a loja, montar a mensagem do WhatsApp) | `format.ts`, `feed-groups.ts`, `store-product.ts` |
| `lib/admin/*.ts` | Lógica do admin: validar formulários, slug, fotos, ordem | `item-updates.ts`, `reorder.ts`, `image-file.ts` |
| `lib/admin/actions/*.ts` | **Server Actions** (`'use server'`), uma por arquivo de assunto | `classes.ts`, `store-posts.ts` |
| `lib/auth/` | Sessão e permissão | `requireAdmin.ts`, `authOptions.ts` |
| `hardcoded/` | Todo texto e imagem fixos | `texts.ts`, `images.ts`, `event-types.ts` |
| `lib/*.test.ts` | Testes (`npm test`), todos na raiz de `lib/`, inclusive os de `lib/admin/` | `reorder.test.ts` |

## Regras

1. **Página é Server Component.** Ela busca os dados (`lib/db.ts` ou `prisma`) e decide
   `isAdmin` com `getServerSession(authOptions)`. Os componentes de admin só são renderizados
   quando `isAdmin` é verdadeiro.
2. **`'use client'` só quando precisa:** estado, eventos ou `useActionState`. Peças de layout
   (`GlowCard`, `PageIntro`, `HomeHero`) ficam no servidor.
3. **Slots em vez de condicionais dentro do componente.** O card do site não sabe que existe
   admin: ele recebe `adminControls`, `reorderControls`, `action` e `media` como `ReactNode`, e a
   página preenche (ver `GlowCard` e `StoreProductRow`).
4. **Regra de negócio vai para `lib/`, numa função pura e testada.** Ação, página e componente
   só chamam. Exemplos: `moveVisible`, `parsePriceToCents`, `groupFeedPostsByCategory`,
   `parseImageBytes`. Quando a regra depende do banco, injete as dependências (veja
   `persistFeedPostWithCategory` e `persistWorkshopCreation`) para poder testar sem banco.
5. **Toda Server Action começa com `await requireAdmin()`**, valida a entrada com um `parse*` de
   `lib/admin/`, grava, chama `revalidatePath` e devolve `{ success, error }` com uma chave
   curta de erro.
6. **Conteúdo novo no padrão "card editável"** (título, descrição…) entra em
   `CONTENT_FORMS` (`lib/admin/content-forms.ts`): campos, textos e erros. Assim
   `ContentFormModal`, `ContentFields` e `ContentDeleteButton` funcionam sem componente novo.
7. **Nenhum texto escrito direto no JSX.** Ele vai para `hardcoded/texts.ts`, com chave
   `PAGINA_ASSUNTO_N` e o texto em português.
8. **Botões:** use `ActionButton` (`components/site/ActionButton.tsx`), que aceita link ou botão,
   `size` sm/md/lg, `variant` solid/outline, `tone` dark/light e tem o efeito de toque. As
   classes vêm de `getActionButtonClasses` (`lib/action-button-styles.ts`). Botões só de ícone do
   admin usam `contentIconButtonClass` (`components/admin/ContentFields.tsx`).
9. **Cores e fontes:** use os tokens de `app/globals.css` (`vinho`, `vinho-hover`, `marfim`,
   `areia`, `tinta`, `font-display`, `font-body`) em vez de hex soltos. Para combinar classes,
   use `cn()` de `lib/utils.ts`.
10. **Mobile first:**
    - alvos de toque de pelo menos 44 px (`h-11 w-11`, `min-h-12`);
    - nada que só funcione no hover;
    - layout de uma coluna que abre em `sm:` (largura máxima do conteúdo: 738 px);
    - respeitar `motion-reduce`.
11. **Fotos enviadas pelo admin** passam por `ImageUploadField` (reduz no navegador) e por
    `readImageField` + `persistWithImage` no servidor. Não faça upload por outro caminho.
12. **Ícones:** `lucide-react`.

## Ao criar um componente novo

- [ ] Ele é do visitante (`site/`), do admin (`admin/`) ou é um primitivo genérico (`ui/`)?
- [ ] Precisa ser `'use client'`? Se não, deixe no servidor.
- [ ] Os textos estão em `hardcoded/texts.ts`?
- [ ] A regra está numa função de `lib/` com teste em `lib/*.test.ts`?
- [ ] Usa `ActionButton` e os tokens de cor?
- [ ] Funciona no celular, com toque, antes do desktop?
- [ ] Atualizou a página correspondente em `docs/superpowers/specs/site/paginas/`?

## Desvios atuais (não corrigir só por corrigir)

- **Textos soltos no JSX:**
  - `app/loja/page.tsx`: mensagens de erro de categoria, "Não foi possível publicar no feed…";
  - `components/admin/FeedCategoryField.tsx`: "Categoria", "Cadastrar nova categoria", "Sem
    categoria", "Nome da nova categoria";
  - `app/login/LoginForm.tsx`, `app/logout/page.tsx` e o contador "N eventos na agenda" em
    `app/eventos/page.tsx`.
- **Hex soltos em vez de tokens:** fundo `#d8bfb6` (`app/layout.tsx`, `Header.tsx`), rosa
  `#c97a8c`/`#e4aab8` e degradês em vários componentes de `components/site/`.
- **`app/eventos/page.tsx` tem o card de ingresso inteiro inline** (cerca de 70 linhas). Os
  outros cards são componentes. Candidato a um `EventTicket` em `components/site/`.
- **O formulário da loja fica dentro de `app/loja/page.tsx`**, e não num componente de
  `components/admin/` nem no `CONTENT_FORMS`. Ele devolve erros por `redirect` com query string,
  enquanto o resto usa `useActionState`.
- **`components/site/StoreProductRow.tsx`** (cerca de 280 linhas) mistura carrossel, modal de
  detalhes e o diálogo de exclusão do admin, contra a regra 3.
- **Botão de salvar ao editar:** `ContentFormModal` usa um `<button>` com estilo próprio em vez
  de `ActionButton`, exceto para workshops.
- **`createWorkshopInline`** chama `revalidatePath('/')`, e a home não mostra workshops.
- O comentário de `GlowCard.tsx` cita produtos digitais e workshops, mas as aulas também usam o
  componente.
- `Header` é `async` sem precisar.
