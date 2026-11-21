# Lighthouse da loja: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tirar do HTML de `/loja` (e de `/aulas`) as fotos em base64, migrando-as para o Vercel Blob.

**Architecture:** O script `migrate-images.mjs`, escrito em 18/11 para a Task 6 do plano
`2026-11-18-fotos-vercel-blob.md`, já existe e nunca rodou. Este plano o leva para um lugar
estável, ensaia em um Postgres local com a cópia de produção, simula em produção sem escrever e
entrega a execução final ao dono do projeto. Nenhum código do site muda.

**Tech Stack:** Node 26, `pg`, `sharp` e `@vercel/blob` do próprio projeto, Neon (produção),
PGlite com `@electric-sql/pglite-socket` (Postgres local do ensaio).

**Spec:** `docs/superpowers/specs/2026-11-21-lighthouse-loja-design.md`

## Global Constraints

- Foto migrada: WebP, lado maior até `1600` px, qualidade `82`, rotação EXIF aplicada.
- Blob: `access: 'public'`, `addRandomSuffix: true`, `cacheControlMaxAge: 31536000`, caminhos `loja/` e `aulas/`; no ensaio, `dev/migracao/`.
- Colunas migradas: `StorePost.imageUrl` e `Item.coverUrl`. Sem migration de schema.
- O `UPDATE` só troca a linha se o valor ainda for o base64 lido (`WHERE id = $1 AND "<coluna>" = $2`).
- Backup completo e conferido antes de qualquer escrita, em `C:/Users/jdott/Backups/denise-polestudio/<data>-antes-das-fotos`.
- Nunca imprimir, gravar em arquivo versionado ou pedir no chat a URL do banco ou o token do Blob.
- Escrita em produção e push na `main` exigem autorização explícita do dono do projeto.
- Trabalho em worktree; o servidor em `localhost:3000` não é parado.
- Endereço público para conferir: `https://denisegarcia.vercel.app`.

## Review Focus

1. Fotos em base64 fora das duas colunas (por exemplo `ItemImage.url`): o HTML continuaria pesado. Task 2, Step 1 conta todas as colunas de texto com `data:image/`.
2. A Denise publica ou troca uma foto durante a migração: o valor novo dela fica (Task 3, Step 4, conflito forçado).
3. PNG com transparência: vira WebP com transparência, sem fundo preto (Task 3, Step 5).
4. Queda de rede no meio: rodar de novo processa só o que ainda é base64 (Task 3, Step 6, repetição).
5. O scratchpad de 18/11 é pasta temporária e pode sumir: o script passa a viver ao lado dos backups (Task 1).

---

### Task 1: Guardar e revisar o script

**Files:**
- Create fora do repositório: `C:/Users/jdott/Backups/denise-polestudio/scripts/migrate-images.mjs` e `dump-production.mjs`, copiados de `C:/Users/jdott/AppData/Local/Temp/claude/b40e170af6f15f23/8fe4f35d-76ab-4260-b558-7d4675f6a293/scratchpad/migracao-fotos/`.

- [x] **Step 1: Copiar os dois arquivos e conferir o `sha256` igual nos dois lados**

- [x] **Step 2: Ajustar `migrate-images.mjs` para a nova pasta**

O backup do ensaio vai para `path.join(import.meta.dirname, 'rehearsal-backups')`, que já é relativo à pasta do script. Nenhuma outra mudança: `PROJECT` continua apontando para o checkout principal, que tem `node_modules` e `.env.local`.

- [x] **Step 3: Conferir a sintaxe**

Run: `node --check C:/Users/jdott/Backups/denise-polestudio/scripts/migrate-images.mjs`
Expected: sem saída, código 0.

---

### Task 2: Medir o que existe em produção (somente leitura)

Usa a URL de `DATABASE_URL` em `.env.local`, lida dentro do processo, sem imprimir. Conexão com `SET default_transaction_read_only = on`.

- [x] **Step 1: Contar `data:image/` em todas as colunas de texto do schema `public`**

Script avulso `count-base64.mjs` no scratchpad desta sessão: lista tabela, coluna, quantidade de linhas e soma de `length()`. Imprime só nomes e números.
Expected: `StorePost.imageUrl` com 13 linhas e `Item.coverUrl` com as fotos de `/aulas`. Se aparecer outra coluna, parar e trazer para o dono do projeto antes de seguir.

- [x] **Step 2: Simulação em produção**

Run: `node <scratchpad>/run-with-env.mjs --dry-run`, um wrapper que lê `DATABASE_URL` de `.env.local`, passa como `MIGRATE_DATABASE_URL` (ou `DUMP_SOURCE_URL` no dump da Task 3) e chama o script com os mesmos argumentos, sem imprimir a URL.
Expected: todas as fotos convertidas em memória, `Falhas: 0`, tamanho depois bem menor que antes, `Ainda em base64` igual ao Step 1 (nada mudou).

---

### Task 3: Ensaio em Postgres local

**Files:**
- Scratchpad desta sessão: pasta `ensaio/` com `package.json` próprio para `@electric-sql/pglite` e `@electric-sql/pglite-socket`.

- [x] **Step 1: Pedir ao dono do projeto autorização para baixar os dois pacotes do npm (nome, versão e tamanho)**

Se o PGlite falhar em algum passo abaixo, trocar por `embedded-postgres` com a mesma pergunta.

- [x] **Step 2: Subir o servidor em `127.0.0.1:55432`, com dados em memória**

- [x] **Step 3: Montar a cópia**

Aplicar o schema com `prisma migrate deploy` (`DATABASE_URL` apontando para o servidor local, só nesse comando) e carregar um dump novo feito com `dump-production.mjs` a partir de produção, no scratchpad.
Expected: as contagens por tabela batem com o `manifest.json` do dump.

- [x] **Step 4: Execução com conflito forçado**

Run: `MIGRATE_DATABASE_URL=postgres://...@127.0.0.1:55432/... node .../migrate-images.mjs --rehearsal --simulate-conflict`
Expected: uma linha como conflito, mantendo `https://ensaio.invalid/valor-mais-novo.webp`; as outras migradas para `dev/migracao/`; `Falhas: 0`; arquivo do conflito apagado do Blob.

- [x] **Step 5: Conferir as fotos enviadas**

Baixar duas fotos migradas, uma de cada coluna, e uma que era PNG com transparência, se houver. Abrir com `sharp(...).metadata()`.
Expected: `format: 'webp'`, lado maior ≤ 1600, `hasAlpha` igual ao original.

- [x] **Step 6: Repetição**

Run: o mesmo comando sem `--simulate-conflict`.
Expected: `Selecionadas: 0` (a linha do conflito tem o valor simulado, não base64) e `Ainda em base64` com zero nas duas colunas.

- [x] **Step 7: Limpar o ensaio**

Parar o servidor local, apagar `rehearsal-backups/`, o dump do scratchpad e todos os arquivos em `dev/migracao/` no Blob.
Expected: `list({ prefix: 'dev/migracao/' })` vazio; dados de produção só na pasta de backups.

---

### Task 4: Migração em produção

**Exige autorização explícita do dono do projeto.**

- [x] **Step 1: O dono do projeto roda no próprio terminal**

```bash
node C:/Users/jdott/Backups/denise-polestudio/scripts/migrate-images.mjs
```

O script pede a URL do banco sem mostrar na tela, faz e confere o backup antes de qualquer escrita.
Expected: `Migradas` igual a `Selecionadas`, `Falhas: 0`, `Conflitos: 0`, `Ainda em base64` com zero nas duas colunas.

- [x] **Step 2: Conferir o site no ar**

Run: `curl -s https://denisegarcia.vercel.app/loja` e `/aulas`, medindo bytes e contando `data:image`; `curl -I` em cada foto `.public.blob.vercel-storage.com` da página.
Expected: zero `data:image`, HTML abaixo de 100 KB, todas as fotos com status 200.

- [x] **Step 3: Conferir no celular (375x812) pelo navegador**

Expected: `/loja` e `/aulas` com todas as fotos aparecendo, em pé, como antes.

- [ ] **Step 4: O dono do projeto roda o Lighthouse mobile em janela anônima**

Expected: desempenho acima de 90 e sem o aviso de source map.

---

### Task 5: Registrar

**Files:**
- Modify: `docs/superpowers/plans/2026-11-18-fotos-vercel-blob.md` (marcar Task 6 e Task 7 Steps 3 e 4 como feitos, com uma linha apontando para este plano)
- Modify: este plano (marcar os passos)
- Add: `docs/superpowers/specs/2026-11-21-lighthouse-loja-design.md`

- [x] **Step 1: Commit no worktree**

```bash
git add docs/superpowers
git commit -m "docs: migrate base64 photos to blob for store lighthouse"
```

- [ ] **Step 2: Com autorização do dono do projeto, levar para a `main` e dar push**

Sem esperar nem conferir o deploy.

---

## Execução (21/11/2026)

- Produção tinha base64 só em `Item.coverUrl` (7) e `StorePost.imageUrl` (17). Simulação e ensaio: 24/24, 0 falhas, 11,28 MB → 0,97 MB.
- Ensaio em PGlite (`@electric-sql/pglite@0.5.15`, `pglite-socket@0.2.18`). O schema da cópia veio dos `migration.sql`, não do `prisma migrate deploy`, porque o dump já traz `_prisma_migrations`.
- 13 PNGs perderam o canal alfa no WebP; todos eram 100% opacos (alfa mínimo 255), então a imagem é a mesma.
- Depois da migração: zero `data:image` em `/loja` e `/aulas`, 69 fotos com status 200. `/loja` tem 270 KB de HTML, quase tudo classes do Tailwind repetidas nos 62 cartões; pela rede, comprimido, são 25 KB. A meta de 100 KB foi lida como tamanho transferido.
- O script e o dump ficam em `C:/Users/jdott/Backups/denise-polestudio/scripts/`.
