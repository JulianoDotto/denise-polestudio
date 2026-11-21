# AGENTS.md — Denise Garcia Pole Studio

Site da Denise Garcia, instrutora de pole dance em Caçapava/SP: aulas, workshops, eventos,
produtos digitais e uma loja. Tudo é vendido pelo WhatsApp. O admin (a própria Denise) edita
o conteúdo pelo próprio site, sem painel separado.

**Antes de mexer em qualquer coisa, leia
[`docs/superpowers/specs/site/README.md`](docs/superpowers/specs/site/README.md).** Lá está o
negócio, o que cada página faz, o que o admin pode fazer e o guia de componentes.

## Stack

Next.js 16 (App Router) · React 19 com React Compiler · Prisma 7 + PostgreSQL (adapter `pg`) ·
NextAuth 4 (login por e-mail e senha) · Tailwind 4 · Radix Dialog (shadcn) · Vercel Blob para
fotos · hospedado na Vercel.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento em `localhost:3000` (ver regras abaixo) |
| `npm test` | testes de `lib/*.test.ts` com `tsx --test` |
| `npm run lint` | ESLint |
| `npm run build` | build de produção |
| `npm run db:migrate` / `db:push` | aplica o schema no banco |
| `npm run db:seed` | **apaga tudo** e recria dados de exemplo; só roda em banco local |

## Regras de trabalho

- Mobile first: desenhar e conferir primeiro no celular, toque antes de hover.
- O usuário mantém o servidor em `localhost:3000`: nunca parar; se não estiver no ar, pedir para ele subir.
- Outros agentes usam a mesma pasta: não trocar de branch, trabalhar em worktree.
- Depois do push na `main`, não esperar nem conferir o deploy na Vercel.
- Toda mudança que altera uma página atualiza o arquivo dela em `docs/superpowers/specs/site/` no mesmo commit.

## Como fazer uma mudança

Fluxo do superpowers:

1. Conversa de design (brainstorming).
2. Design datado em `docs/superpowers/specs/AAAA-MM-DD-<tema>-design.md` (o **porquê**).
3. Plano em `docs/superpowers/plans/AAAA-MM-DD-<tema>.md`.
4. Implementação com TDD na lógica pura (`lib/`).
5. Atualizar `docs/superpowers/specs/site/` (o **como é agora**).
