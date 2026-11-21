# Admin reordena categorias da loja, produtos digitais e aulas — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Com o admin logado, setas ↑ ↓ mudam a ordem das aulas, dos produtos digitais e das categorias (fileiras) da loja.

**Architecture:** Uma função pura calcula a nova ordem completa da lista a partir da lista inteira e da parte visível, para que a seta sempre troque com o vizinho que aparece na tela. Ações no servidor (`requireAdmin`) leem a lista na mesma ordem da página, aplicam a função, regravam `order` = 0, 1, 2… numa transação e revalidam a página. Um componente cliente `ReorderButtons` desenha as duas setas.

**Tech Stack:** Next.js 16 (App Router, server actions), Prisma 7 / Postgres, React 19 (`useActionState`), Tailwind 4, lucide-react, testes com `node:test` via `npm test` (`tsx --test lib/*.test.ts`).

**Spec:** `docs/superpowers/specs/2026-11-21-reordenar-admin-design.md`

## Global Constraints

- Sem migração: usar `Item.order` e `StoreSection.order`, que já existem.
- Sem dependência nova.
- Setas só aparecem para o admin, e toda ação chama `requireAdmin()` antes de qualquer leitura.
- Produtos digitais formam uma lista só: `EBOOK` + `VIDEO`.
- Posts dentro de cada categoria da loja, eventos e workshops: não mudam.
- Itens e categorias novos entram no fim: `order` = maior atual + 1 (ou 0 se a lista estiver vazia).
- Área de toque das setas: 44px (`h-11 w-11`). As setas não podem cobrir a imagem nem o botão principal do card.
- Seta ↑ do primeiro e ↓ do último ficam desabilitadas. As duas ficam desabilitadas enquanto uma ação está rodando.
- Textos de interface ficam em `hardcoded/texts.ts` (`TEXTS`), em português.
- Mobile first: conferir primeiro na largura de celular.

## Review Focus

1. Categoria escondida (sem posts ativos) entre duas visíveis: o toque precisa mudar a ordem visível mesmo assim. Teste `skips hidden entries between visible neighbors` (Task 1).
2. Lista com todo mundo em `order` 0 (estado atual do banco): o primeiro toque precisa funcionar. A função trabalha só com ids na ordem exibida, e o servidor ordena igual à página (Task 1, comparador compartilhado; Task 2, `orderBy` compartilhado).
3. Aula ou produto inativo (`isActive: false`) é tratado como escondido, igual à categoria vazia. Teste 1 cobre a lógica; Task 2 passa `isActive` como critério de visibilidade.
4. Página desatualizada: o item foi apagado em outra aba, ou ↑ chega para um item que já é o primeiro. A ação não grava nada e devolve `{ error: 'move' }`, sem quebrar. Teste `returns null for unknown id or edges` (Task 1).
5. Toque duplo rápido: os botões ficam desabilitados enquanto `pending` (conferência manual, Task 3).

---

### Task 1: Lógica pura de reordenar e ordenação compartilhada

**Files:**
- Create: `lib/admin/reorder.ts`
- Modify: `lib/feed-groups.ts` (exportar comparador e filtro de posts ativos; `groupFeedPostsByCategory` passa a usar o comparador)
- Test: `lib/reorder.test.ts`

**Interfaces:**
- Produces:
  - `type MoveDirection = 'up' | 'down'`
  - `moveVisible(all: string[], visible: string[], id: string, direction: MoveDirection): string[] | null`. Recebe `all` com todos os ids na ordem exibida e `visible` como subconjunto de `all` na mesma ordem. Devolve a nova ordem completa, em que `id` troca de lugar com o vizinho visível e os ids escondidos ficam nas mesmas posições. Devolve `null` se `id` não estiver em `visible` ou já estiver na ponta.
  - `parseMoveDirection(value: FormDataEntryValue | null): MoveDirection | null`
  - Em `lib/feed-groups.ts`: `compareStoreSections(a: { order: number; title: string }, b: { order: number; title: string }): number`, que é o comparador atual (`order`, depois `title.localeCompare(…, 'pt-BR')`), e `activeFeedPostWhere(now: Date)`, que devolve `{ OR: [{ isPinned: true }, { expiresAt: { gt: now } }] }`.

- [ ] **Step 1: Escrever os testes que falham** em `lib/reorder.test.ts`:

```ts
test('swaps with the neighbor when everything is visible', () => {
  assert.deepEqual(moveVisible(['a', 'b', 'c'], ['a', 'b', 'c'], 'c', 'up'), ['a', 'c', 'b'])
  assert.deepEqual(moveVisible(['a', 'b', 'c'], ['a', 'b', 'c'], 'a', 'down'), ['b', 'a', 'c'])
})

test('skips hidden entries between visible neighbors', () => {
  assert.deepEqual(moveVisible(['a', 'h', 'b'], ['a', 'b'], 'b', 'up'), ['b', 'h', 'a'])
  assert.deepEqual(moveVisible(['h1', 'a', 'h2', 'b', 'c'], ['a', 'b', 'c'], 'a', 'down'), ['h1', 'b', 'h2', 'a', 'c'])
})

test('returns null for unknown id or edges', () => {
  assert.equal(moveVisible(['a', 'b'], ['a', 'b'], 'a', 'up'), null)
  assert.equal(moveVisible(['a', 'b'], ['a', 'b'], 'b', 'down'), null)
  assert.equal(moveVisible(['a', 'h'], ['a'], 'h', 'up'), null)
  assert.equal(moveVisible(['a', 'b'], ['a', 'b'], 'x', 'up'), null)
})

test('parses only up and down', () => {
  assert.equal(parseMoveDirection('up'), 'up')
  assert.equal(parseMoveDirection('down'), 'down')
  assert.equal(parseMoveDirection('left'), null)
  assert.equal(parseMoveDirection(null), null)
})
```

- [ ] **Step 2: Rodar e ver falhar.** Run: `npm test`. Expected: FAIL, porque o módulo `./admin/reorder` ainda não existe.
- [ ] **Step 3: Implementar `moveVisible` e `parseMoveDirection` em `lib/admin/reorder.ts`.** Abordagem: trocar os dois ids dentro de uma cópia de `visible`, depois percorrer `all` preenchendo as posições dos ids visíveis, em sequência, com a cópia trocada.
- [ ] **Step 4: Em `lib/feed-groups.ts`, extrair e exportar `compareStoreSections` e `activeFeedPostWhere`.** O sort de `groupFeedPostsByCategory` passa a chamar `compareStoreSections`. `app/loja/page.tsx` passa a usar `activeFeedPostWhere(now)` no lugar do `where` inline.
- [ ] **Step 5: Rodar tudo.** Run: `npm test`. Expected: todos PASS, incluindo `lib/feed-groups.test.ts`.
- [ ] **Step 6: Commit.** `git add lib/admin/reorder.ts lib/reorder.test.ts lib/feed-groups.ts app/loja/page.tsx && git commit -m "feat: pure reorder logic that keeps hidden entries in place"`

### Task 2: Ações no servidor e novos itens no fim

**Files:**
- Create: `lib/admin/actions/reorder.ts`
- Create: `lib/admin/next-order.ts`
- Modify: `lib/db.ts` (ordem estável)
- Modify: `lib/admin/actions/classes.ts` (`createClassInline`), `lib/admin/actions/digital-products.ts` (`createDigitalProductInline`), `lib/admin/actions/store-posts.ts` (o `create` de categoria nova)

**Interfaces:**
- Consumes: `moveVisible`, `parseMoveDirection`, `compareStoreSections`, `activeFeedPostWhere` (Task 1).
- Produces:
  - `export const ITEM_ORDER_BY = [{ order: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }] as const` em `lib/db.ts`, usado por `getItemsByType` e `getItemsByTypes` e pela ação.
  - `type ReorderState = { error?: string }`
  - `moveItem(prev: ReorderState, formData: FormData): Promise<ReorderState>`. Lê do form `id`, `direction` e `list` (`'class' | 'digitalProduct'`).
  - `moveStoreSection(prev: ReorderState, formData: FormData): Promise<ReorderState>`. Lê do form `id` e `direction`.
  - `nextItemOrder(types: ItemType[]): Promise<number>` e `nextStoreSectionOrder(): Promise<number>`, ambos com `(_max.order ?? -1) + 1`.

- [ ] **Step 1: Ordem estável em `lib/db.ts`.** Trocar `orderBy: { order: 'asc' }` por `ITEM_ORDER_BY` nas duas funções.
- [ ] **Step 2: Implementar `moveItem`.** Mapa de listas: `class → [CLASS]` com revalidate `/aulas`; `digitalProduct → [EBOOK, VIDEO]` com revalidate `/produtos-digitais`. Buscar todos os itens dos tipos (ativos e inativos), com `ITEM_ORDER_BY`. `all` = ids; `visible` = ids com `isActive`. Se `moveVisible` devolver `null` ou se `list`/`direction` forem inválidos, devolver `{ error: 'move' }` sem gravar. Se não, rodar `prisma.$transaction(next.map((id, order) => prisma.item.update({ where: { id }, data: { order } })))`, revalidar e devolver `{}`. Envolver a transação em try/catch: no erro, `console.error` e `{ error: 'persistence' }`.
- [ ] **Step 3: Implementar `moveStoreSection`.** `all` = todas as `storeSection`, ordenadas com `compareStoreSections`. `visible` = as de `all` cujo id aparece em `storePost.findMany({ where: { ...activeFeedPostWhere(new Date()), storeSectionId: { not: null } }, select: { storeSectionId: true } })`. Mesma transação e mesmos erros do Step 2, em `prisma.storeSection.update`, revalidando `/loja`.
- [ ] **Step 4: Novos no fim.** Em `createClassInline` passar `order: await nextItemOrder(['CLASS'])`. Em `createDigitalProductInline` passar `order: await nextItemOrder(['EBOOK', 'VIDEO'])`. No `create` de categoria nova em `createStorePost`, incluir `order: await nextStoreSectionOrder()` (calcular antes do `persistWithImage`, só quando `category.type === 'new'`).
- [ ] **Step 5: Conferir tipos e testes.** Run: `npx tsc --noEmit && npm test && npm run lint`. Expected: sem erros, todos os testes PASS.
- [ ] **Step 6: Commit.** `git add lib/db.ts lib/admin && git commit -m "feat: admin actions to move items and store categories, new entries go last"`

### Task 3: Setas na interface

**Files:**
- Create: `components/admin/ReorderButtons.tsx`
- Modify: `components/site/GlowCard.tsx` (nova prop `reorderControls`)
- Modify: `components/site/StoreProductRow.tsx` (nova prop `reorderControls`)
- Modify: `app/aulas/page.tsx`, `app/produtos-digitais/page.tsx`, `app/loja/page.tsx`
- Modify: `hardcoded/texts.ts`

**Interfaces:**
- Consumes: `moveItem`, `moveStoreSection`, `ReorderState` (Task 2).
- Produces: `ReorderButtons` com as props `{ target: { kind: 'item'; list: 'class' | 'digitalProduct' } | { kind: 'storeSection' }; id: string; isFirst: boolean; isLast: boolean; tone: 'light' | 'dark' }`.

- [ ] **Step 1: Textos.** Adicionar a `TEXTS`: `ADMIN_REORDER_UP_ARIA_1: 'Mover para cima'`, `ADMIN_REORDER_DOWN_ARIA_1: 'Mover para baixo'`, `ADMIN_REORDER_ERROR_1: 'Não foi possível mudar a ordem. Tente de novo.'`.
- [ ] **Step 2: `ReorderButtons`.** É um componente cliente: um `<form>` com `useActionState` (ação escolhida por `target.kind`), campos ocultos `id` e, para item, `list`, e dois `<button type="submit" name="direction" value="up|down">` com `ChevronUp`/`ChevronDown` e `aria-label` dos TEXTS. Os botões têm `h-11 w-11` e são redondos, com as cores de tom copiadas de `TONE_CLASSES` em `ContentFields.tsx`. Ficam `disabled` quando `pending`, ↑ também quando `isFirst` e ↓ quando `isLast`. Se `state.error` existir, mostrar `ADMIN_REORDER_ERROR_1` em texto pequeno abaixo.
- [ ] **Step 3: `GlowCard`.** Prop opcional `reorderControls?: React.ReactNode`, renderizada numa linha `mt-5 flex justify-end` logo antes do bloco `action`, no corpo do card. Assim não cobre a imagem nem o botão principal. *(Decisão do plano: o spec sugeria colocar as setas ao lado de editar/apagar, mas esses botões ficam por cima da foto da aula, e 44px a mais cobririam a imagem. O spec deixa o lugar exato a critério de quem constrói.)*
- [ ] **Step 4: `StoreProductRow`.** Prop opcional `reorderControls?: React.ReactNode`, renderizada no cabeçalho ao lado do bloco do título, visível também no celular (o grupo das setas do carrossel continua `hidden sm:flex`).
- [ ] **Step 5: Ligar as páginas.** Em `/aulas` e `/produtos-digitais`, quando `isAdmin`, passar `<ReorderButtons target={{ kind: 'item', list: … }} id={item.id} isFirst={index === 0} isLast={index === items.length - 1} tone="light" />`. Em `/loja`, usar `feedGroups.map((group, index) => …)` com `target={{ kind: 'storeSection' }}` e `tone="dark"`.
- [ ] **Step 6: Checar.** Run: `npx tsc --noEmit && npm test && npm run lint`. Expected: sem erros.
- [ ] **Step 7: Conferir no navegador.** O dev server em `localhost:3000` é do Juliano e não deve ser parado. Se não estiver no ar, pedir que ele suba. Entrar como admin com a conta do seed, na largura de celular (375px):
  - em `/aulas`, ↓ no primeiro card troca com o segundo;
  - a ↑ do primeiro e a ↓ do último ficam desabilitadas;
  - repetir em `/produtos-digitais` e, em `/loja`, nas fileiras;
  - deslogado, nenhuma seta aparece;
  - sem erros no console;
  - tirar um screenshot.
- [ ] **Step 8: Commit.** `git add components app hardcoded && git commit -m "feat: admin arrows to reorder classes, digital products and store categories"`
