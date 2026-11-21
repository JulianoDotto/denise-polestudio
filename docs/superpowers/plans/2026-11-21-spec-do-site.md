# Spec do site para agentes de IA — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Documentar o site como ele é hoje (negócio, páginas, poderes do admin, dados, componentes) e fazer qualquer agente chegar a essa documentação pelo `AGENTS.md`.

**Architecture:** Só Markdown. Pasta viva em `docs/superpowers/specs/site/`, um arquivo por página, mais `AGENTS.md` na raiz e `CLAUDE.md` importando-o. Cada fato vem da leitura do código; o que o código não confirma fica marcado **"a confirmar"**.

**Tech Stack:** Markdown. O site é Next.js 16 (App Router), React 19, Prisma 7 + PostgreSQL, NextAuth 4, Tailwind 4, Vercel Blob.

**Spec:** `docs/superpowers/specs/2026-11-21-spec-do-site-design.md`

## Global Constraints

- Tudo em português, curto, para um agente que vai mexer no código.
- Cada afirmação aponta o arquivo real de onde saiu (caminho entre crases, relativo à raiz).
- Nada inventado: regra de negócio, público ou motivo que o código não mostra → **"a confirmar"**.
- Não alterar código. O guia de componentes descreve o que existe e lista desvios; não refatora.
- Trabalhar na worktree `C:\Users\jdott\Projetos\denise-polestudio-spec`, branch `docs/spec-site`. Não trocar de branch na pasta principal.
- Não iniciar nem parar o servidor de desenvolvimento.

## Review Focus

1. Caminho citado que não existe (arquivo renomeado, digitado errado) → a checagem da Task 7 falha.
2. Poder do admin que existe no código mas não aparece em `admin.md` nem na página → cada task de página faz grep por `requireAdmin` e `lib/admin/actions` usados nela.
3. Página que tem estado só de admin (botões que somem para visitante) descrita como se todo mundo visse → cada página separa "Visitante" de "Admin".
4. Fato de negócio afirmado sem base no código (preço, público, horários) → precisa estar em `hardcoded/` ou no banco; senão "a confirmar".
5. `AGENTS.md` que cita regra contraditória com o design (ex.: pedir para conferir deploy) → Task 1 copia as quatro regras literalmente do design.

---

## Estrutura de arquivos

```
AGENTS.md                                   entrada para agentes + regras de trabalho
CLAUDE.md                                   uma linha: @AGENTS.md
docs/superpowers/specs/site/
  README.md        índice, como usar, regra de manutenção
  negocio.md       Denise, estúdio, oferta, WhatsApp, restrição de idade
  dados.md         modelos Prisma, enums, imagens (Blob), hardcoded/, seed
  admin.md         login, /403, /logout, papéis, lista de todos os poderes
  componentes.md   guia de componentização
  paginas/
    home.md  aulas.md  workshops.md  eventos.md  produtos-digitais.md  loja.md
```

Modelo de cada arquivo de página (seções nesta ordem):
`# <Página> (`/rota`)` · **Arquivos** (page + componentes + libs) · **O que mostra** · **Visitante pode** · **Admin pode** (ação → função/arquivo) · **Regras** (ordem, filtros, limites) · **A confirmar**.

---

### Task 1: Entrada para agentes

**Files:**
- Create: `AGENTS.md`, `CLAUDE.md`, `docs/superpowers/specs/site/README.md`

**Interfaces:**
- Produces: os caminhos de todos os arquivos de `site/` (listados na Estrutura) — os links do README devem bater com eles.

- [ ] **Step 1: Escrever `AGENTS.md`** com: uma linha sobre o projeto; "Antes de mexer, leia `docs/superpowers/specs/site/README.md`"; comandos (`npm run dev`, `npm test`, `npm run lint`, `npm run db:*` de `package.json`); fluxo de mudanças (superpowers: brainstorm → design datado em `docs/superpowers/specs/` → plano em `docs/superpowers/plans/`); e estas regras, literalmente:
  - Mobile first: desenhar e conferir primeiro no celular, toque antes de hover.
  - O usuário mantém o servidor em `localhost:3000`: nunca parar; se não estiver no ar, pedir para ele subir.
  - Outros agentes usam a mesma pasta: não trocar de branch, trabalhar em worktree.
  - Depois do push na `main`, não esperar nem conferir o deploy na Vercel.
  - Toda mudança que altera uma página atualiza o arquivo dela em `docs/superpowers/specs/site/` no mesmo commit.
- [ ] **Step 2: Escrever `CLAUDE.md`** com só a linha `@AGENTS.md`.
- [ ] **Step 3: Escrever `site/README.md`**: para que serve, link para cada arquivo da Estrutura com uma frase cada, regra de manutenção, diferença entre `site/` (como é hoje) e os designs datados (por que mudou), significado de "a confirmar".
- [ ] **Step 4: Commit** — `git add AGENTS.md CLAUDE.md docs/superpowers/specs/site/README.md && git commit -m "docs: agent entry point and site spec index"`

### Task 2: Negócio e dados

**Files:**
- Create: `docs/superpowers/specs/site/negocio.md`, `docs/superpowers/specs/site/dados.md`
- Ler: `README.md`, `hardcoded/texts.ts`, `hardcoded/event-types.ts`, `hardcoded/images.ts`, `prisma/schema.prisma`, `prisma/seed.ts`, `lib/whatsapp.ts`, `components/site/AgeGateModal.tsx`, `lib/admin/image-store.ts`, `lib/seed-guard.ts`

- [ ] **Step 1: `negocio.md`**: quem é a Denise e o estúdio, o que vende (aulas, workshops, eventos, produtos digitais, loja), como a venda acontece (mensagem montada para o WhatsApp, `lib/whatsapp.ts`), por que existe a restrição de idade, tom dos textos (de `hardcoded/texts.ts`). Público, preços e horários só se estiverem no código; senão "a confirmar".
- [ ] **Step 2: `dados.md`**: cada `model` e `enum` do schema (Role, ItemType, StoreSection, Item, ItemImage, User, StorePost) com campos que importam e o que significam no site; quais páginas leem cada um; `order` e regra de reordenação (`lib/admin/reorder.ts`, `lib/admin/next-order.ts`); imagens no Vercel Blob; o que mora em `hardcoded/` e não no banco; seed e `seed-guard`.
- [ ] **Step 3: Commit** — `git commit -m "docs: site spec for business and data"`

### Task 3: Páginas de conteúdo

**Files:**
- Create: `docs/superpowers/specs/site/paginas/{home,aulas,workshops,eventos,produtos-digitais}.md`
- Ler: `app/page.tsx`, `app/aulas/page.tsx`, `app/workshops/page.tsx`, `app/eventos/page.tsx`, `app/produtos-digitais/page.tsx`, componentes que importam, e as actions de `lib/admin/actions/` que chamam.

- [ ] **Step 1:** Para cada página, seguir o modelo de página. Em "Admin pode", listar cada botão/modal (`ContentFormModal`, `WorkshopCreateModal`, `ContentDeleteButton`, `ReorderButtons`…) com a action que ele chama.
- [ ] **Step 2: Conferir cobertura do admin** — `grep -rln "requireAdmin\|getCurrentUser" app/page.tsx app/aulas app/workshops app/eventos app/produtos-digitais components` e confirmar que cada resultado aparece em algum "Admin pode".
- [ ] **Step 3: Commit** — `git commit -m "docs: site spec for content pages"`

### Task 4: Loja

**Files:**
- Create: `docs/superpowers/specs/site/paginas/loja.md`
- Ler: `app/loja/page.tsx`, `components/site/StoreProductRow.tsx`, `components/admin/FeedCategoryField.tsx`, `StorePostDurationFields.tsx`, `StorePostSubmitButton.tsx`, `lib/store-product.ts`, `lib/feed-groups.ts`, `lib/admin/feed-*.ts`, `lib/admin/store-post-details.ts`

- [ ] **Step 1:** Modelo de página, com regras específicas: categorias (StoreSection) e quando aparecem, ordem dos posts (fixados primeiro, depois mais novos), duração/expiração do post, carrossel, reordenação de categorias.
- [ ] **Step 2: Commit** — `git commit -m "docs: site spec for the store"`

### Task 5: Admin

**Files:**
- Create: `docs/superpowers/specs/site/admin.md`
- Ler: `lib/auth/*.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/login/*`, `app/logout/page.tsx`, `app/403/page.tsx`, `next-auth.d.ts`, todo `lib/admin/actions/`

- [ ] **Step 1:** Como entrar (login, credenciais do `.env`, papéis do enum Role), o que acontece sem permissão (`/403`), sair. Tabela "Poder | Onde (página) | Action/arquivo" com **toda** action exportada de `lib/admin/actions/`; cada linha linka o arquivo da página em `paginas/`.
- [ ] **Step 2: Conferir** — listar `export async function` em `lib/admin/actions/` e confirmar que cada nome está na tabela.
- [ ] **Step 3: Commit** — `git commit -m "docs: site spec for admin powers"`

### Task 6: Guia de componentização

**Files:**
- Create: `docs/superpowers/specs/site/componentes.md`
- Ler: `components/{site,admin,ui}/*`, `lib/` (o que é puro e testado vs. o que fala com banco), `components.json`, `eslint.config.mjs`

- [ ] **Step 1:** Descrever o padrão atual: o que vai em `components/site` (visitante), `components/admin` (só admin), `components/ui` (primitivos shadcn); páginas como Server Components que buscam dados; lógica pura em `lib/*.ts` com teste `lib/*.test.ts` (`npm test`); actions de servidor em `lib/admin/actions/` protegidas por `requireAdmin`; textos/imagens fixos em `hardcoded/`; estilo (Tailwind, `cn` de `lib/utils.ts`, estilos de botão em `lib/action-button-styles.ts`); mobile first. Fechar com "Ao criar um componente novo" (checklist curto) e "Desvios atuais" (onde o código foge, sem corrigir).
- [ ] **Step 2: Commit** — `git commit -m "docs: componentization guide"`

### Task 7: Checagem final

- [ ] **Step 1: Todo caminho citado existe** — rodar na raiz da worktree:

```bash
grep -rhoE '`(app|components|lib|prisma|hardcoded|docs)/[^`*{ ]+`' AGENTS.md docs/superpowers/specs/site | tr -d '`' | sort -u | while read p; do [ -e "$p" ] || echo "FALTA: $p"; done
```
Esperado: nenhuma linha `FALTA:`.
- [ ] **Step 2: Links internos** — todo link `](...)` do README e de `admin.md` aponta para arquivo existente.
- [ ] **Step 3: Lista de "a confirmar"** — `grep -rn "a confirmar" docs/superpowers/specs/site` e levar a lista ao Juliano.
- [ ] **Step 4: Commit de correções**, se houver — `git commit -m "docs: fix site spec references"`
