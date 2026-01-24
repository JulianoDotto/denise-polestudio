# Denise Pole Studio – Catálogo com WhatsApp

MVP em **Next.js (App Router)** + **Prisma** + **Tailwind** + **shadcn/ui** para catálogo de produtos, aulas, ebooks e eventos com redirecionamento para WhatsApp.

## Requisitos

- Node.js 18+
- Banco PostgreSQL

## Configuração

1. Crie o arquivo `.env` na raiz (ou edite o existente):

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
WHATSAPP_PHONE="553591397374"
NEXT_PUBLIC_WHATSAPP_PHONE="553591397374"
ADMIN_EMAIL="admin@local"
ADMIN_PASSWORD="admin123"
AUTH_SECRET="change-me"
```

2. Instale dependências:

```bash
npm install
```

3. Rode as migrations ou `db push`:

```bash
npm run db:migrate
# ou
npm run db:push
```

4. Rode o seed:

```bash
npm run db:seed
```

5. Inicie o projeto:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Admin

- Acesse `http://localhost:3000/admin/login`
- Use `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env`
- Apenas usuários com role `ADMIN` acessam `/admin/*`
- Menus: Dashboard, Produtos, Aulas, Ebooks, Eventos, Categorias, Usuários

## Scripts úteis

- `npm run db:generate` – gera o Prisma Client
- `npm run db:migrate` – cria e aplica migrations
- `npm run db:push` – sincroniza schema sem migrations
- `npm run db:seed` – popula dados fake

## Estrutura

- `app/` – páginas (Home, Lojas, Produtos, Aulas, Ebooks, Eventos)
- `app/(admin)/admin` – painel admin + CRUDs
- `components/` – UI, carrinho, header/footer
- `lib/` – acesso a dados, auth e helpers
- `prisma/` – schema + seed
