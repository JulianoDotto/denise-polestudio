# Dados

Banco PostgreSQL via Prisma 7 (`prisma/schema.prisma`). O cliente fica em `lib/prisma.ts` e usa
o adapter `pg`. `lib/postgres.ts` troca `sslmode` `prefer`, `require` ou `verify-ca` por
`verify-full`; sem `sslmode` na URL, nada muda.

## Modelos

### `Item`: aulas, workshops, eventos e produtos digitais
Uma tabela só, separada pelo campo `type` (enum `ItemType`).

| `type` | Página | Campos usados |
|---|---|---|
| `CLASS` | `/aulas` | `title`, `description`, `coverUrl` (foto), `order`, `whatsappTextTemplate` |
| `WORKSHOP` | `/workshops` | `title`, `description`, `coverUrl` (só exibida; o admin não envia foto), `whatsappTextTemplate` |
| `EVENT` | `/eventos` | `title`, `description`, `eventDate`, `whatsappTextTemplate` |
| `EBOOK`, `VIDEO` | `/produtos-digitais` (uma lista só) | `title`, `description`, `hotmartUrl`, `order` |
| `PRODUCT` | nenhuma | legado: só o seed cria. A loja usa `StorePost`, não `Item` |

Campos comuns: `slug` (único, gerado do título por `lib/admin/slug.ts`. Se repetir, ganha `-2`,
`-3`… em `lib/admin/create-item.ts`) e `isActive` (as páginas só mostram `true`. O admin sempre
cria com `true` e não há botão para desativar).

`whatsappTextTemplate` substitui a mensagem padrão do WhatsApp, mas **não tem campo no admin**.
Só dá para preencher pelo banco ou pelo seed.

Campos sem uso no site hoje: `priceCents`, `scheduleOnlineUrl`, `schedulePresentialUrl`,
`storeSectionId`/`storeSection` (em `Item`) e o modelo `ItemImage`.

### `StorePost`: produto da loja
`title`, `description`, `priceCents` (centavos, opcional), `imageUrl`, `isPinned`, `expiresAt`,
`storeSectionId` (categoria, opcional).
- Aparece na loja se `isPinned` ou se `expiresAt` ainda não passou (`activeFeedPostWhere` em
  `lib/feed-groups.ts`). Expirado não é apagado, só some.
- **Post sem categoria não aparece** (`groupFeedPostsByCategory` ignora). O formulário permite
  "Sem categoria", e esse post fica invisível.

### `StoreSection`: categoria (fileira) da loja
`title`, `slug` (único), `order`. Uma categoria só aparece se tiver pelo menos um post ativo.
`isAdult`, `isActive` e `bannerUrl` existem, mas o site não usa: só o seed preenche.

### `User`
`email` (único, minúsculo), `passwordHash` (bcrypt), `role` (`ADMIN` | `USER`), `isActive`. Não
há cadastro pelo site: o admin é criado pelo seed (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) ou direto no
banco. `USER` não tem nenhum uso hoje.

## Ordem das listas

- **Aulas e produtos digitais:** `order`, depois `createdAt`, depois `id` (`ITEM_ORDER_BY` em
  `lib/db.ts`). O admin reordena com setas. Itens novos entram no fim
  (`lib/admin/next-order.ts`).
- **Categorias da loja:** `order`, depois título (`compareStoreSections` em `lib/feed-groups.ts`).
  O admin reordena com setas. Categoria nova entra no fim.
- **Posts dentro da categoria:** fixados primeiro, depois os mais novos (`app/loja/page.tsx`).
  Sem reordenação manual.
- **Workshops:** mesma ordenação de `ITEM_ORDER_BY`, mas **sem setas**, e o workshop novo é
  criado com `order` 0.
- **Eventos:** `eventDate` crescente, depois o mais novo; sem data fica no fim. Não há filtro de
  data: eventos passados continuam aparecendo (no topo) até o admin apagar.

A reordenação regrava a lista inteira como 0, 1, 2… num único `UPDATE` e pula os itens que não
aparecem na tela (`moveVisible` em `lib/admin/reorder.ts`). Design:
`docs/superpowers/specs/2026-11-21-reordenar-admin-design.md`.

## Fotos

- **Onde:** Vercel Blob (`lib/admin/image-store.ts`). Pastas `aulas/` e `loja/`. Fora de produção
  vão para `dev/aulas/` e `dev/loja/`, e só produção pode apagar fotos de produção
  (`canRemoveBlob` em `lib/admin/image-file.ts`).
- **No navegador:** a foto é reduzida para no máximo 1600 px, com qualidade 0,82, antes de subir
  (`lib/admin/resize-image.ts`).
- **No servidor:** aceita só JPEG, PNG ou WebP, conferindo os bytes e não a extensão, até 3 MB
  (`parseImageBytes`).
- **Ciclo:** sobe a foto, salva o registro e, se salvar falhar, apaga a foto nova. Ao trocar,
  apaga a antiga. Ao excluir o item, apaga a foto (`lib/admin/image-flow.ts`).
- **Sem foto:** a loja usa `/images/fallback-dg.svg` (`IMAGES.SITE_FALLBACK_1`). As aulas mostram
  o card sem imagem.
- Design: `docs/superpowers/specs/2026-11-18-fotos-vercel-blob-design.md`.

## O que não está no banco

- **`hardcoded/texts.ts`:** todo texto fixo do site (títulos, botões, mensagens de erro, mensagens
  do WhatsApp, endereço, telefone). Chaves em MAIÚSCULAS com sufixo `_1`, `_2`. Para mudar um
  texto, mude aqui.
- **`hardcoded/images.ts`:** fotos fixas da home e a imagem de reserva. Os arquivos ficam em
  `public/images/`.
- **`hardcoded/event-types.ts`:** os 6 formatos de evento de `/eventos`. O admin não edita.

## Seed

`npm run db:seed` (`prisma/seed.ts`) **apaga todas as tabelas** e recria exemplos: 2 categorias,
itens `PRODUCT`, `CLASS`, `EBOOK`, `EVENT` e `WORKSHOP` (nenhum `VIDEO`) e o usuário admin
(`ADMIN_EMAIL`/`ADMIN_PASSWORD`, ou `admin@local`/`admin123` sem as variáveis). **Não cria
`StorePost`**, então a loja fica vazia depois do seed. `assertLocalDatabase` (`lib/seed-guard.ts`) bloqueia
qualquer banco que não seja `localhost`, `127.0.0.1` ou `[::1]`.
