# Refatoração e acabamento Vinho: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover o código morto do site, corrigir a perda de dados na edição, enxugar a administração e o banco, e aplicar o acabamento visual Vinho sem mudar a estrutura das páginas.

**Architecture:** O trabalho acontece em cinco etapas independentes, cada uma em branch própria, publicada só depois de verificada. A lógica testável sai das server actions para funções puras em `lib/admin/`. A administração nas páginas passa a usar um formulário configurado por tipo de conteúdo.

**Tech Stack:** Next.js 16 (App Router), React 19, Prisma 7, PostgreSQL (Neon), NextAuth 4, Tailwind 4, `node:test` com `tsx`.

**Spec:** `docs/superpowers/specs/2026-11-18-refatoracao-e-acabamento-vinho-design.md`

## Global Constraints

- Site mobile first, na coluna de 738 px, também no desktop.
- O `/login` continua sem link público.
- Toda action administrativa chama `requireAdmin()` antes de qualquer outra operação.
- Nenhuma biblioteca nova de animação ou de interface.
- Push na `main` publica na Vercel: só fazer merge na `main` com autorização explícita do dono do projeto.
- Migrations em produção são manuais, feitas depois de backup e com autorização explícita, antes de publicar o código que depende delas.
- Tokens: vinho `#5a1a2a`, vinho hover `#6e2235`, marfim `#f3ece2`, tinta `#0e0b0b`.
- Curva padrão de animação: `cubic-bezier(.16, 1, .3, 1)`.
- Testes novos ficam em `lib/*.test.ts`, no estilo `node:test` com `node:assert/strict`.
- Cada etapa termina com `npm test`, `npm run lint` e `npm run build` passando.
- Mensagens de commit terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Título só com espaços ao editar: a edição é recusada com o erro `title` e nada é gravado. Teste na Task 2.
2. Data apagada ao editar um evento: `eventDate` passa a `null`, e uma data inválida também não derruba a action. Teste na Task 2.
3. Link de produto digital sem `https://`: é salvo com `https://` na frente. Teste na Task 2.
4. Seed apontando para o Neon ou com URL malformada: a execução é recusada antes de apagar qualquer tabela. Teste na Task 3.
5. Valor preenchido depois do backup: a recuperação nunca sobrescreve um campo que já tem valor em produção. Teste na Task 1.

---

## Etapa 0: recuperação dos dados

### Task 1: Comparar o backup com a produção

**Branch:** `chore/recuperacao-dados`

**Pré-requisito humano:** o dono do projeto cria no Neon uma branch a partir do ponto de restauração mais antigo disponível e fornece duas URLs somente leitura, `RECOVERY_SOURCE_URL` (backup) e `PRODUCTION_READ_URL` (produção). Sem elas, pare e peça.

**Files:**
- Create: `lib/recovery-diff.ts`
- Create: `lib/recovery-diff.test.ts`
- Create: `scripts/recovery-compare.ts`

**Interfaces:**
- Produces: `type RecoverableField = 'hotmartUrl' | 'whatsappTextTemplate' | 'scheduleOnlineUrl' | 'schedulePresentialUrl'`
- Produces: `type RecoverableItem = { id: string; type: string; title: string } & Record<RecoverableField, string | null>`
- Produces: `type RecoveryChange = { id: string; type: string; title: string; field: RecoverableField; value: string }`
- Produces: `diffRecoverableItems(backup: RecoverableItem[], current: RecoverableItem[]): RecoveryChange[]`

- [ ] **Step 1: Escrever os testes que falham**

```ts
test('reports a value that exists only in the backup', () => {
  const changes = diffRecoverableItems([item({ whatsappTextTemplate: 'Oi' })], [item()])
  assert.deepEqual(changes, [{ id: '1', type: 'CLASS', title: 'Aula', field: 'whatsappTextTemplate', value: 'Oi' }])
})

test('never overwrites a value filled in after the backup', () => {
  const changes = diffRecoverableItems(
    [item({ whatsappTextTemplate: 'Antigo' })],
    [item({ whatsappTextTemplate: 'Novo' })],
  )
  assert.deepEqual(changes, [])
})

test('ignores items deleted since the backup', () => {
  assert.deepEqual(diffRecoverableItems([item({ hotmartUrl: 'https://a' })], []), [])
})
```

`item(overrides)` é um helper local que devolve `{ id: '1', type: 'CLASS', title: 'Aula' }` com os quatro campos em `null`.

- [ ] **Step 2: Rodar os testes e confirmar a falha**

Run: `npx tsx --test lib/recovery-diff.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 3: Implementar `diffRecoverableItems` em `lib/recovery-diff.ts`**

Só entra no resultado o campo com valor no backup e `null` no item atual de mesmo `id`.

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npx tsx --test lib/recovery-diff.test.ts`
Expected: PASS.

- [ ] **Step 5: Criar `scripts/recovery-compare.ts`**

Conecta com `pg` nas duas URLs, executa só `SELECT` em `"Item"` com `type IN ('CLASS','EVENT')` e grava o resultado de `diffRecoverableItems` no caminho recebido como primeiro argumento. O arquivo de saída fica fora do repositório.

- [ ] **Step 6: Gerar o relatório e entregar ao dono do projeto**

Run: `npx tsx scripts/recovery-compare.ts <caminho-fora-do-repositório>/recovery-changes.json`
Expected: JSON gerado. Apresente as diferenças em lista legível e registre quais foram aprovadas. A restauração acontece na Task 6.

- [ ] **Step 7: Commit**

```bash
git add lib/recovery-diff.ts lib/recovery-diff.test.ts scripts/recovery-compare.ts
git commit -m "chore: add production data recovery comparison"
```

---

## Etapa 1: limpeza e correção dos bugs

**Branch:** `refactor/etapa-1-limpeza`, criada a partir de `chore/recuperacao-dados`, porque a Task 6 usa as ferramentas de recuperação.

### Task 2: Edição preserva os campos que o formulário não envia

**Files:**
- Create: `lib/admin/item-updates.ts`
- Create: `lib/item-updates.test.ts`
- Modify: `lib/admin/actions.ts` (`updateClassInline`, `updateEventInline`, `updateWorkshopInline`, `updateDigitalProductInline`)
- Modify: `hardcoded/texts.ts`, `components/site/WorkshopEditModal.tsx`, `components/site/EventEditModal.tsx`

**Interfaces:**
- Produces: `type ItemUpdateResult<T> = { data: T } | { error: string }`
- Produces: `parseClassUpdate(form: FormData): ItemUpdateResult<{ title: string; description: string | null; coverUrl: string | null }>`
- Produces: `parseEventUpdate(form: FormData): ItemUpdateResult<{ title: string; description: string | null; eventDate: Date | null }>`
- Produces: `parseWorkshopUpdate(form: FormData): ItemUpdateResult<{ title: string; description: string | null }>`
- Produces: `parseDigitalProductUpdate(form: FormData): ItemUpdateResult<{ title: string; description: string | null; hotmartUrl: string | null; type: 'EBOOK' | 'VIDEO' }>`

- [ ] **Step 1: Escrever os testes que falham**

```ts
test('class update only contains the fields the form edits', () => {
  const result = parseClassUpdate(form({ title: ' Pole ', description: '', coverUrl: '/capa.jpg' }))
  assert.deepEqual(result, { data: { title: 'Pole', description: null, coverUrl: '/capa.jpg' } })
})

test('event update keeps the custom WhatsApp message out of the payload', () => {
  const result = parseEventUpdate(form({ title: 'Evento', description: 'Detalhes', eventDate: '2026-12-05' }))
  assert.ok('data' in result)
  assert.deepEqual(Object.keys(result.data).sort(), ['description', 'eventDate', 'title'])
  assert.equal(result.data.eventDate?.toISOString(), '2026-12-05T00:00:00.000Z')
})

test('blank title is rejected', () => {
  assert.deepEqual(parseClassUpdate(form({ title: '   ' })), { error: 'title' })
  assert.deepEqual(parseEventUpdate(form({ title: '   ' })), { error: 'title' })
  assert.deepEqual(parseWorkshopUpdate(form({ title: '   ' })), { error: 'title' })
  assert.deepEqual(parseDigitalProductUpdate(form({ title: '   ', type: 'EBOOK' })), { error: 'title' })
})

test('cleared or invalid event date becomes null', () => {
  for (const eventDate of ['', 'amanhã']) {
    const result = parseEventUpdate(form({ title: 'Evento', eventDate }))
    assert.ok('data' in result)
    assert.equal(result.data.eventDate, null)
  }
})

test('digital product link gets https and type is validated', () => {
  const result = parseDigitalProductUpdate(form({ title: 'E-book', hotmartUrl: 'hotmart.com/x', type: 'EBOOK' }))
  assert.ok('data' in result)
  assert.equal(result.data.hotmartUrl, 'https://hotmart.com/x')
  assert.deepEqual(parseDigitalProductUpdate(form({ title: 'E-book', type: 'CLASS' })), { error: 'type' })
})
```

`form(values)` é um helper local que monta um `FormData`.

- [ ] **Step 2: Rodar os testes e confirmar a falha**

Run: `npx tsx --test lib/item-updates.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 3: Implementar os parsers em `lib/admin/item-updates.ts`**

Mova `parseDate` de `lib/admin/actions.ts` para este arquivo. O arquivo não usa `'use server'`.

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npx tsx --test lib/item-updates.test.ts`
Expected: PASS.

- [ ] **Step 5: Usar os parsers nas quatro actions de edição**

Cada action grava somente `result.data`. Nenhuma delas envia `slug`, `isActive`, `type` (exceto produto digital), `hotmartUrl` de aula, `scheduleOnlineUrl`, `schedulePresentialUrl` ou `whatsappTextTemplate`. `updateClassInline` mantém `validateClassCoverUrl` e o erro `persistence`. `updateWorkshopInline` mantém o erro `update`.

- [ ] **Step 6: Remover a mensagem de título repetido na edição**

Apague `WORKSHOPS_EDIT_ERROR_SLUG_1` e as entradas `slug` de `errorMessages` em `WorkshopEditModal` e `EventEditModal`. `EVENTOS_ADMIN_ERROR_SLUG_1` continua na criação de eventos até a Task 11.

- [ ] **Step 7: Verificar e fazer commit**

Run: `npm test`
Expected: todos os testes passam.

```bash
git add lib/admin/item-updates.ts lib/item-updates.test.ts lib/admin/actions.ts hardcoded/texts.ts components/site/WorkshopEditModal.tsx components/site/EventEditModal.tsx
git commit -m "fix: preserve hidden fields when editing content"
```

### Task 3: Seed só roda em banco local

**Files:**
- Create: `lib/seed-guard.ts`
- Create: `lib/seed-guard.test.ts`
- Modify: `prisma/seed.ts`

**Interfaces:**
- Produces: `assertLocalDatabase(connectionString: string): void`, que lança `Error` quando o host não é local.

- [ ] **Step 1: Escrever os testes que falham**

```ts
test('allows local hosts', () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    assert.doesNotThrow(() => assertLocalDatabase(`postgresql://u:p@${host}:5432/db`))
  }
})

test('rejects remote hosts', () => {
  assert.throws(() => assertLocalDatabase('postgresql://u:p@ep-x.sa-east-1.aws.neon.tech/db'))
})

test('rejects a malformed url', () => {
  assert.throws(() => assertLocalDatabase('nao-e-url'))
})
```

- [ ] **Step 2: Rodar os testes e confirmar a falha**

Run: `npx tsx --test lib/seed-guard.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 3: Implementar `assertLocalDatabase` e chamá-la em `prisma/seed.ts`**

A chamada vem antes da criação do `Pool`. A mensagem de erro não pode conter a URL.

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npx tsx --test lib/seed-guard.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/seed-guard.ts lib/seed-guard.test.ts prisma/seed.ts
git commit -m "fix: prevent seed from wiping remote databases"
```

### Task 4: Remover páginas, módulos e actions mortos

**Files:**
- Delete: `app/aulas/[slug]/page.tsx`
- Delete: `components/admin/AdminTabs.tsx`, `DeleteButton.tsx`, `ImageUrlField.tsx`, `ProductImagesFields.tsx`, `StatusBadge.tsx`
- Delete: `components/site/AdultGate.tsx`, `StorePostFormShell.tsx`, `StoreUpload.tsx`
- Delete: `components/ui/separator.tsx`, `sheet.tsx`, `tabs.tsx`
- Delete: `lib/auth/requireAdminApi.ts`, `lib/auth/session.ts`, `lib/format.ts`
- Modify: `lib/admin/actions.ts`, `lib/db.ts`, `lib/whatsapp.ts`

- [ ] **Step 1: Apagar os arquivos listados**

- [ ] **Step 2: Remover de `lib/admin/actions.ts` as 28 actions listadas na seção "Etapa 1" do spec**

Remova junto os helpers e imports que ficarem sem uso, como `hash`, `getServerSession`, `authOptions`, `parseNumber`, `parseLines` e `buildImageList`.

- [ ] **Step 3: Remover as funções sem uso**

Em `lib/db.ts`: `getStoreSections`, `getStoreSectionBySlug`, `getItemsBySection` e `getItemBySlug`. Em `lib/whatsapp.ts`: `buildItemMessage`.

- [ ] **Step 4: Verificar**

Run: `npm test && npm run lint && npm run build`
Expected: tudo passa, e a rota `/aulas/[slug]` não aparece na saída do build.

- [ ] **Step 5: Commit**

```bash
git add -A app components lib
git commit -m "refactor: remove dead admin panel code"
```

### Task 5: Remover arquivos, dependências, textos e CSS sem uso

**Files:**
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, `public/images/home/home_about.png`, `public/images/home/home_hero.png`, `public/fonts/apple-sd-gothic-neo-regular.otf`
- Modify: `package.json`, `package-lock.json`, `hardcoded/texts.ts`, `hardcoded/images.ts`, `app/globals.css`, `README.md`
- Delete: `yarn.lock`, somente depois do Step 3

- [ ] **Step 1: Apagar os arquivos de `public/`**

- [ ] **Step 2: Ajustar as dependências**

Run: `npm uninstall zustand @radix-ui/react-separator @radix-ui/react-tabs && npm install --save-dev dotenv`
Expected: `package.json` e `package-lock.json` atualizados.

- [ ] **Step 3: Confirmar o comando de instalação da Vercel com o dono do projeto**

Se for npm ou automático, apague `yarn.lock`. Se for yarn, pare e pergunte antes de remover qualquer lockfile.

- [ ] **Step 4: Remover chaves sem referência em `hardcoded/texts.ts` e `hardcoded/images.ts`**

Uma chave sai quando `TEXTS.<CHAVE>` ou `IMAGES.<CHAVE>` não aparece em `app`, `components` nem `lib`. Repita até nenhuma chave ficar órfã.

- [ ] **Step 5: Limpar `app/globals.css`**

Remova `@custom-variant dark`, o bloco `.dark`, os tokens `sidebar-*` e `chart-*` (em `@theme` e `:root`) e os utilitários `soft-card`, `light-panel` e `tracking-caps`.

- [ ] **Step 6: Atualizar a seção "Estrutura" e os comandos do `README.md`**

Tire as menções a carrinho e páginas que não existem.

- [ ] **Step 7: Verificar e testar no navegador**

Run: `npm test && npm run lint && npm run build`
Expected: tudo passa. Com banco local e seed, abra as páginas públicas em 390 px e desktop. Adicione, edite e exclua aula, evento, workshop, produto digital e publicação da loja. Confirme que editar uma aula com `whatsappTextTemplate` preenchido mantém o valor.

- [ ] **Step 8: Commit**

```bash
git add -A public package.json package-lock.json yarn.lock hardcoded app/globals.css README.md
git commit -m "chore: remove unused assets, dependencies and styles"
```

### Task 6: Publicar a etapa 1 e restaurar os dados aprovados

**Pré-requisito humano:** autorização para o merge na `main`, e lista de valores aprovados na Task 1.

**Files:**
- Create: `scripts/recovery-apply.ts`
- Delete ao final: `scripts/recovery-apply.ts`, `scripts/recovery-compare.ts`, `lib/recovery-diff.ts`, `lib/recovery-diff.test.ts`

- [ ] **Step 1: Fazer o merge na `main` e confirmar que o deploy da Vercel terminou**

- [ ] **Step 2: Criar `scripts/recovery-apply.ts`**

Recebe o JSON aprovado. Em uma transação, executa para cada mudança `UPDATE "Item" SET "<campo>" = $1 WHERE id = $2 AND "<campo>" IS NULL`. O campo só é aceito se pertencer a `RecoverableField`.

- [ ] **Step 3: Fazer backup e aplicar com autorização explícita**

Expected: o número de linhas atualizadas é igual ao de mudanças aprovadas.

- [ ] **Step 4: Conferir os botões de WhatsApp de uma aula e de um evento restaurados**

- [ ] **Step 5: Remover as ferramentas de recuperação e fazer commit**

```bash
git add -A scripts lib
git commit -m "chore: remove temporary data recovery tools"
```

---

## Etapa 2: administração com menos código

**Branch:** `refactor/etapa-2-admin`

### Task 7: Formulário e exclusão configurados por tipo

**Files:**
- Create: `lib/admin/content-forms.ts`
- Create: `lib/content-forms.test.ts`
- Create: `components/admin/ContentFields.tsx`
- Create: `components/admin/ContentFormModal.tsx`
- Create: `components/admin/ContentDeleteButton.tsx`
- Create: `components/admin/WorkshopCreateModal.tsx`

**Interfaces:**
- Produces: `type ContentKind = 'class' | 'event' | 'workshop' | 'digitalProduct'`
- Produces: `type ContentField = 'title' | 'description' | 'cover' | 'link' | 'digitalType' | 'eventDate'`
- Produces: `type ContentValues = { id?: string; title?: string; description?: string | null; coverUrl?: string | null; hotmartUrl?: string | null; type?: 'EBOOK' | 'VIDEO'; eventDate?: string }`
- Produces: `CONTENT_FORMS: Record<ContentKind, { fields: ContentField[]; labels: ...; create: ...; edit: ...; delete: ...; errors: Record<string, string> }>`, reunindo os textos atuais de `TEXTS`
- Produces: `<ContentFormModal kind mode="create" | "edit" values? tone? />`
- Produces: `<ContentDeleteButton kind id title tone? />`
- Produces: `<ContentFields kind values? />`, usado também por `WorkshopCreateModal`

- [ ] **Step 1: Escrever os testes que falham**

```ts
test('each content type keeps its current fields', () => {
  assert.deepEqual(CONTENT_FORMS.class.fields, ['title', 'description', 'cover'])
  assert.deepEqual(CONTENT_FORMS.event.fields, ['title', 'description', 'eventDate'])
  assert.deepEqual(CONTENT_FORMS.workshop.fields, ['title', 'description'])
  assert.deepEqual(CONTENT_FORMS.digitalProduct.fields, ['title', 'description', 'link', 'digitalType'])
})

test('each content type keeps its current messages', () => {
  assert.equal(CONTENT_FORMS.class.errors.imageSize, TEXTS.AULAS_ADMIN_ERROR_IMAGE_SIZE_1)
  assert.equal(CONTENT_FORMS.workshop.errors.update, TEXTS.WORKSHOPS_EDIT_ERROR_UPDATE_1)
  assert.equal(CONTENT_FORMS.digitalProduct.errors.type, TEXTS.PRODUTOS_DIGITAIS_ADMIN_ERROR_TYPE_1)
  assert.equal(CONTENT_FORMS.event.delete.confirm, TEXTS.EVENTOS_DELETE_CONFIRM_1)
})
```

- [ ] **Step 2: Rodar os testes e confirmar a falha**

Run: `npx tsx --test lib/content-forms.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 3: Implementar `lib/admin/content-forms.ts`**

O arquivo só importa `TEXTS` e não importa actions nem componentes.

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npx tsx --test lib/content-forms.test.ts`
Expected: PASS.

- [ ] **Step 5: Implementar os componentes**

`ContentFormModal` e `ContentDeleteButton` escolhem a action por `kind` e `mode` com `useActionState`. `WorkshopCreateModal` é a versão atual de `WorkshopAdminModal`, mantendo `requestId`, `useTransition` e a proteção contra envio duplo. Use `ContentFields` no lugar dos campos copiados. Para criar workshop, `ContentFormModal` não é usado.

- [ ] **Step 6: Commit**

```bash
git add lib/admin/content-forms.ts lib/content-forms.test.ts components/admin
git commit -m "refactor: add configurable content admin forms"
```

### Task 8: Migrar as páginas e separar as peças de administração

**Files:**
- Modify: `app/aulas/page.tsx`, `app/eventos/page.tsx`, `app/workshops/page.tsx`, `app/produtos-digitais/page.tsx`, `app/loja/page.tsx`, `components/site/StoreCarousel.tsx`
- Move para `components/admin/`: `AdminModal.tsx`, `ClassCoverField.tsx`, `FeedCategoryField.tsx`, `StorePostDurationFields.tsx`, `StorePostImageField.tsx`
- Delete: `components/site/{Aulas,Event,Workshop,DigitalProduct}AdminModal.tsx` (os nomes exatos de cada tipo), `*EditModal.tsx`, `*DeleteButton.tsx` desses quatro tipos

- [ ] **Step 1: Trocar os 12 componentes por `ContentFormModal`, `ContentDeleteButton` e `WorkshopCreateModal` nas páginas**

Mantenha `tone="light"` em produtos digitais.

- [ ] **Step 2: Mover as peças administrativas, atualizar imports e apagar os 12 arquivos**

- [ ] **Step 3: Verificar**

Run: `npm test && npm run lint && npm run build`
Expected: tudo passa.

- [ ] **Step 4: Testar no navegador com banco local**

Expected: para cada um dos quatro tipos e para a loja, adicionar, editar e excluir funciona, com os mesmos rótulos e mensagens de antes. Enviar duas vezes seguidas o formulário de workshop cria um único item.

- [ ] **Step 5: Commit**

```bash
git add -A app components
git commit -m "refactor: unify inline content administration"
```

### Task 9: Organizar as actions por tipo

**Files:**
- Create: `lib/admin/actions/classes.ts`, `events.ts`, `workshops.ts`, `digital-products.ts`, `store-posts.ts`
- Create: `lib/admin/create-item.ts`
- Delete: `lib/admin/actions.ts`
- Modify: `components/admin/ContentFormModal.tsx`, `ContentDeleteButton.tsx`, `WorkshopCreateModal.tsx`, `components/site/StoreCarousel.tsx`, `app/loja/page.tsx`

**Interfaces:**
- Produces: `createItemWithUniqueSlug` em `lib/admin/create-item.ts`, sem `'use server'`
- Produces: as 14 actions mantêm nomes e assinaturas atuais

- [ ] **Step 1: Mover cada action para o arquivo do seu tipo, com `'use server'` no topo**

Em `events.ts`, `createEventInline` passa a usar `createItemWithUniqueSlug` e devolve `{ success: false, error: 'slug' }` quando o helper falhar.

- [ ] **Step 2: Confirmar que toda action chama `requireAdmin`**

Run: `npx tsx --test lib/*.test.ts`
Expected: PASS. Depois, confira com busca que há uma chamada de `requireAdmin()` para cada `export async function` em `lib/admin/actions/`.

- [ ] **Step 3: Verificar e fazer commit**

Run: `npm run lint && npm run build`
Expected: tudo passa.

```bash
git add -A lib components app
git commit -m "refactor: organize admin actions by content type"
```

---

## Etapa 3: banco de dados

**Branch:** `refactor/etapa-3-banco`

### Task 10: Auditar a produção

**Pré-requisito humano:** URL somente leitura de produção.

- [ ] **Step 1: Conferir o histórico de migrations**

Run: `npx prisma migrate status`
Expected: nenhuma migration pendente ou divergente. Se houver divergência, pare e apresente o resultado.

- [ ] **Step 2: Executar as consultas somente leitura e registrar os números**

```sql
SELECT COUNT(*) FROM "ItemImage";
SELECT type, COUNT(*) FROM "Item" GROUP BY type;
SELECT
  COUNT(*) FILTER (WHERE "priceCents" IS NOT NULL) AS price,
  COUNT(*) FILTER (WHERE "scheduleOnlineUrl" IS NOT NULL) AS online,
  COUNT(*) FILTER (WHERE "schedulePresentialUrl" IS NOT NULL) AS presential,
  COUNT(*) FILTER (WHERE "storeSectionId" IS NOT NULL) AS section,
  COUNT(*) FILTER (WHERE NOT "isActive") AS inactive,
  COUNT(DISTINCT "order") AS distinct_orders
FROM "Item";
SELECT id, type, title FROM "Item" WHERE NOT "isActive";
SELECT
  COUNT(*) FILTER (WHERE "isAdult") AS adult,
  COUNT(*) FILTER (WHERE "bannerUrl" IS NOT NULL) AS banner,
  COUNT(*) FILTER (WHERE NOT "isActive") AS inactive
FROM "StoreSection";
```

- [ ] **Step 3: Apresentar a tabela de candidatos ao dono do projeto e registrar a decisão de cada um**

Itens do tipo `PRODUCT`, itens inativos e seções com dados exigem decisão explícita. As Tasks 11 e 12 só tratam dos candidatos aprovados.

### Task 11: Primeira entrega: o código para de usar as colunas

**Files:**
- Modify: `prisma/schema.prisma`, `prisma/seed.ts`, `lib/db.ts`, `lib/admin/create-item.ts`, `lib/admin/actions/*.ts`, `lib/admin/workshop-persistence.ts`, `lib/workshop-persistence.test.ts`, `hardcoded/texts.ts`, `lib/admin/content-forms.ts`, `components/admin/*`
- Create: `prisma/migrations/<timestamp>_make_item_slug_optional/migration.sql`
- Delete: `lib/admin/slug.ts`, somente se `lib/admin/feed-category.ts` deixar de importá-lo

- [ ] **Step 1: Tornar `Item.slug` opcional no schema e gerar a migration**

Run: `npx prisma migrate dev --name make_item_slug_optional --create-only`
Expected: migration com `ALTER COLUMN "slug" DROP NOT NULL`, sem remover dados.

- [ ] **Step 2: Remover do código os candidatos aprovados**

Tire as leituras e gravações de `slug`, `isActive`, `priceCents`, `scheduleOnlineUrl`, `schedulePresentialUrl`, `storeSectionId`, `ItemImage` e dos filtros `isActive`. `createItemWithUniqueSlug` vira um `prisma.item.create` simples. Remova `isActive` de `WorkshopCreation` e dos testes. Apague `EVENTOS_ADMIN_ERROR_SLUG_1` e os campos ocultos `isActive`.

- [ ] **Step 3: Definir a ordenação**

Se a Task 10 mostrar um único valor de `order`, as listagens passam a ordenar por `createdAt: 'asc'`. Se houver valores diferentes, mantenha `order` e acrescente `createdAt: 'asc'` como desempate.

- [ ] **Step 4: Atualizar o seed para os campos que continuam em uso**

- [ ] **Step 5: Testar a migration em uma branch do Neon e verificar o código**

Run: `npm test && npm run lint && npm run build`
Expected: tudo passa, e criar, editar e excluir funciona na cópia do banco.

- [ ] **Step 6: Commit**

```bash
git add -A prisma lib components hardcoded
git commit -m "refactor: stop using obsolete item columns"
```

- [ ] **Step 7: Publicar com autorização explícita**

Faça backup, aplique com `npx prisma migrate deploy` e só depois faça o merge na `main`. Confirme que o deploy terminou.

### Task 12: Segunda entrega: remover colunas e tabelas

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_remove_unused_columns/migration.sql`

- [ ] **Step 1: Remover do schema os candidatos aprovados**

Inclui o modelo `ItemImage`, as colunas de `Item` e `StoreSection`, a relação `StoreSection.items` e o valor `PRODUCT` de `ItemType`. Se `order` foi mantido na Task 11, ele continua no schema.

- [ ] **Step 2: Gerar a migration e revisar o SQL**

Run: `npx prisma migrate dev --name remove_unused_columns --create-only`
Expected: o SQL só remove os candidatos aprovados. A remoção do enum `PRODUCT` recria o tipo sem tocar nos outros valores.

- [ ] **Step 3: Testar em uma branch do Neon e verificar**

Run: `npm test && npm run lint && npm run build`
Expected: tudo passa, e as páginas públicas carregam na cópia do banco.

- [ ] **Step 4: Commit**

```bash
git add -A prisma
git commit -m "refactor: remove unused database columns"
```

- [ ] **Step 5: Publicar com autorização explícita**

Nesta entrega a ordem se inverte: faça o merge na `main` e espere o deploy terminar, porque o Prisma da versão anterior ainda consulta essas colunas. Depois, faça backup e aplique com `npx prisma migrate deploy`.

---

## Etapa 4: acabamento Vinho

**Branch:** `feat/etapa-4-vinho`

### Task 13: Botões

**Files:**
- Create: `lib/action-button-styles.ts`
- Create: `lib/action-button-styles.test.ts`
- Modify: `components/site/ActionButton.tsx`, `app/globals.css`, `app/workshops/page.tsx`
- Delete: `components/ui/button.tsx`, se ficar sem uso

**Interfaces:**
- Produces: `getActionButtonClasses(options: { size: 'sm' | 'md' | 'lg'; variant: 'solid' | 'outline'; tone: 'dark' | 'light' }): string`
- Produces: tokens Tailwind `vinho`, `vinho-hover`, `marfim` e `tinta` em `@theme` de `app/globals.css`

- [ ] **Step 1: Escrever os testes que falham**

```ts
test('solid dark is the wine pill', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'solid', tone: 'dark' })
  for (const name of ['rounded-full', 'bg-vinho', 'text-marfim', 'hover:bg-vinho-hover', 'min-h-12']) {
    assert.ok(classes.includes(name), name)
  }
})

test('solid light is the ivory pill for dark backgrounds', () => {
  const classes = getActionButtonClasses({ size: 'md', variant: 'solid', tone: 'light' })
  assert.ok(classes.includes('bg-marfim'))
  assert.ok(classes.includes('text-[#1b1212]'))
  assert.ok(!classes.includes('bg-vinho'))
})

test('outline keeps the pill shape', () => {
  const classes = getActionButtonClasses({ size: 'sm', variant: 'outline', tone: 'dark' })
  assert.ok(classes.includes('rounded-full'))
  assert.ok(classes.includes('border'))
})
```

- [ ] **Step 2: Rodar os testes e confirmar a falha**

Run: `npx tsx --test lib/action-button-styles.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 3: Implementar os estilos e usá-los em `ActionButton`**

Valores: contorno interno `shadow-[inset_0_0_0_1px_rgba(243,236,226,.2)]` no sólido vinho, hover `-translate-y-px`, toque `active:scale-[.98]`, caixa alta com `tracking-[0.14em]`, foco visível.

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npx tsx --test lib/action-button-styles.test.ts`
Expected: PASS.

- [ ] **Step 5: Trocar `Button` por `ActionButton` em `app/workshops/page.tsx`**

Sem telefone configurado, use `ActionButton` com `disabled`. Apague `components/ui/button.tsx` e remova `@radix-ui/react-slot` se ficarem sem uso.

- [ ] **Step 6: Verificar e fazer commit**

Run: `npm test && npm run lint && npm run build`
Expected: tudo passa.

```bash
git add -A lib components app package.json package-lock.json
git commit -m "feat: apply wine finish to buttons"
```

### Task 14: Heros, cards e animações

**Files:**
- Modify: `app/globals.css`, `components/site/HomeHero.tsx`, `components/site/PageHero.tsx`, `components/site/ImageLinkCard.tsx`

- [ ] **Step 1: Adicionar a camada e as animações em `app/globals.css`**

Crie as classes `hero-veil`, `hero-image` e `hero-title` com os valores da tabela "Animações" do spec. `hero-title` termina em `letter-spacing: .24em`. Dentro de `@media (prefers-reduced-motion: reduce)`, desligue animações e transições dessas classes e dos cards.

- [ ] **Step 2: Aplicar em `HomeHero` e `PageHero`**

Troque a camada escura pela `hero-veil` e o `tracking-[0.35em]` do título por `hero-title`. Não adicione botão ao hero.

- [ ] **Step 3: Aplicar em `ImageLinkCard`**

Raio `rounded-[16px]`, camada `linear-gradient(90deg, rgba(58,16,28,.55), rgba(14,11,11,.4))`. Em hover e `focus-visible`: foto com `scale(1.04)` em .7 s e título com espaçamento `.42em` em .5 s, partindo do `.35em` atual.

- [ ] **Step 4: Verificar no navegador**

Run: `npm run build`
Expected: build sem erros. No navegador: a entrada do hero acontece uma vez ao carregar, nada anima ao rolar, sem rolagem horizontal em 320 px, títulos legíveis sobre as fotos, foco visível nos cards e nos botões, e nenhuma animação com movimento reduzido.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css components/site/HomeHero.tsx components/site/PageHero.tsx components/site/ImageLinkCard.tsx
git commit -m "feat: apply wine finish to heroes and cards"
```

### Task 15: Verificação final e publicação

- [ ] **Step 1: Rodar a verificação completa**

Run: `npm test && npm run lint && npm run build`
Expected: tudo passa.

- [ ] **Step 2: Percorrer todas as páginas em 320 px, 390 px e desktop**

Expected: home, aulas, loja, produtos digitais, eventos, workshops, login e 403 sem quebras. Botões marfim em aulas e produtos digitais, vinho nas demais.

- [ ] **Step 3: Testar a administração logada**

Expected: adicionar, editar e excluir funciona em todos os tipos de conteúdo.

- [ ] **Step 4: Publicar com autorização explícita**

Faça o merge na `main` e confirme que o deploy da Vercel terminou.
