# Refatoração e acabamento Vinho: design

Data: 2026-11-18

## Intenção

O maior incômodo com o site hoje é a quantidade de código morto. Ele sobrou do painel de admin antigo, que foi retirado para reduzir a curva de aprendizado de quem publica conteúdo. O objetivo é deixar o projeto pequeno e fácil de manter, conferir se o banco de dados é de fato utilizado e dar ao site um acabamento mais moderno, sem mudar o que ele é.

## Objetivos

1. Remover todo o código, arquivo, dependência e texto sem uso.
2. Corrigir os bugs que apagam dados ao editar conteúdo.
3. Reduzir a duplicação da administração nas páginas, sem mudar a experiência da administradora.
4. Deixar no banco somente o que o site usa, com base nos dados reais de produção.
5. Aplicar o acabamento Vinho em botões, heros, cards e microanimações.

## Fora do escopo

- Criar painel de admin, novas páginas ou novas funcionalidades.
- Mudar o layout: o site continua mobile first, na coluna de 738 px, também no desktop.
- Mudar a navegação, a fonte Aboreto, a Work Sans, os textos de venda ou as fotos.
- Tirar as imagens em base64 do banco e movê-las para um serviço de arquivos. Fica como projeto separado.
- Limpar automaticamente publicações expiradas da loja.

## O que não pode acontecer

- A administradora perder a capacidade de adicionar, editar ou excluir conteúdo direto nas páginas.
- Dados de produção serem removidos sem conferência, backup e autorização explícita.
- O site parecer outro. A mudança deve ser percebida como refinamento.
- Animações que atrapalhem a leitura ou deixem o celular lento.

## Restrições

- Stack atual: Next.js 16 (App Router), React 19, Prisma 7 com PostgreSQL (Neon), NextAuth 4 e Tailwind 4.
- O `/login` continua sem link público, acessado diretamente pela URL.
- Não há `.env` no repositório. O acesso de leitura à produção precisa ser fornecido pelo dono do projeto antes da etapa 3.
- Migrations em produção só rodam com autorização explícita, depois de um backup.

## Abordagens consideradas

| Abordagem | Vantagem | Custo | Decisão |
|---|---|---|---|
| Limpeza primeiro, em etapas | Cada etapa vai ao ar e pode ser desfeita sozinha; o visual só é aplicado no código que fica | A mudança visível aparece no final | **Escolhida pelo dono do projeto** |
| Visual primeiro | Resultado visível logo no início | Retrabalho nos modais e bugs ativos por mais tempo | Descartada |
| Tudo de uma vez | Uma única entrega | Difícil de revisar; banco e visual teriam de ser desfeitos juntos | Descartada |

## Publicação

- O site está na Vercel, e todo push na `main` publica automaticamente. Por isso, cada etapa é feita em branch própria e só chega à `main` depois de verificada.
- As migrations não rodam no deploy. Elas são aplicadas manualmente em produção, com autorização explícita, antes de publicar o código que depende delas.

## Etapa 0: recuperação dos dados apagados pelo bug

Esta etapa vem primeiro porque os pontos de restauração do Neon expiram.

1. Identificar o ponto de restauração mais antigo disponível no Neon.
2. Comparar, somente em leitura, os campos `hotmartUrl`, `whatsappTextTemplate`, `scheduleOnlineUrl` e `schedulePresentialUrl` de aulas e eventos entre esse ponto e a produção atual.
3. Exportar as diferenças e apresentá-las ao dono do projeto, que aprova o que deve voltar.
4. Restaurar os valores aprovados somente depois que a correção do bug (etapa 1) estiver no ar, para que uma nova edição não os apague de novo.

Os campos `hotmartUrl` de aulas e os campos de agendamento não aparecem em nenhuma tela depois da remoção de `/aulas/[slug]`. A prioridade da restauração é `whatsappTextTemplate`, que define a mensagem enviada pelos botões de aulas e eventos.

## Etapa 1: remoção do código morto e correção dos bugs

### Remover

**Página sem nenhum link:** `app/aulas/[slug]/page.tsx`.

**Módulos inalcançáveis a partir de `app/`:**

- `components/admin/`: `AdminTabs`, `DeleteButton`, `ImageUrlField`, `ProductImagesFields`, `StatusBadge`
- `components/site/`: `AdultGate`, `StorePostFormShell`, `StoreUpload`
- `components/ui/`: `separator`, `sheet`, `tabs`
- `lib/auth/requireAdminApi.ts`, `lib/auth/session.ts`, `lib/format.ts`

**Server actions sem chamada em `lib/admin/actions.ts` (28):** `createProduct`, `updateProduct`, `toggleProductStatus`, `deleteProduct`, `createClass`, `updateClass`, `toggleClassStatus`, `deleteClass`, `createWorkshop`, `updateWorkshop`, `toggleWorkshopStatus`, `deleteWorkshop`, `createEbook`, `updateEbook`, `toggleEbookStatus`, `deleteEbook`, `createEvent`, `updateEvent`, `toggleEventStatus`, `deleteEvent`, `createCategory`, `updateCategory`, `toggleCategoryStatus`, `deleteCategory`, `createUser`, `updateUser`, `toggleUserStatus`, `toggleUserRole`. Os helpers que ficarem sem uso saem junto.

**Funções sem uso:** em `lib/db.ts`, `getStoreSections`, `getStoreSectionBySlug` e `getItemsBySection`; em `lib/whatsapp.ts`, `buildItemMessage`. `getItemBySlug` também sai, pois só a página removida a usa.

**Arquivos em `public/`:** `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`, `images/home/home_about.png`, `images/home/home_hero.png`, `fonts/apple-sd-gothic-neo-regular.otf`.

**Dependências:** `zustand`, `@radix-ui/react-separator`, `@radix-ui/react-tabs`. Declarar `dotenv` em `devDependencies`, pois `prisma.config.ts` e o seed o importam diretamente.

**Textos:** as chaves de `hardcoded/texts.ts` sem referência, incluindo as que ficarem órfãs depois das remoções acima. Em `hardcoded/images.ts`, `PRODUTOS_DIGITAIS_PLACEHOLDER_1` e as chaves que ficarem órfãs.

**CSS em `app/globals.css`:** variante e tema `.dark`, tokens `sidebar-*` e `chart-*`, utilitários `soft-card`, `light-panel` e `tracking-caps`.

**Lockfile:** manter um único gerenciador. O README usa npm, então a escolha padrão é manter `package-lock.json` e remover `yarn.lock`, depois de confirmar nas configurações da Vercel qual comando de instalação está em uso.

### Corrigir

1. **Editar aula apaga dados:** `updateClassInline` grava `null` em `hotmartUrl`, `scheduleOnlineUrl`, `schedulePresentialUrl` e `whatsappTextTemplate`, porque o formulário não envia esses campos.
2. **Editar evento apaga dados:** `updateEventInline` faz o mesmo com `whatsappTextTemplate`.
3. **Regra da correção:** uma action de edição só altera os campos que o formulário de fato envia. Cada correção recebe um teste automatizado.
   **Decisão de design sobre títulos repetidos:** editar deixa de regenerar o `slug`, então títulos repetidos passam a ser aceitos, como já acontece ao criar um item. As mensagens `EVENTOS_ADMIN_ERROR_SLUG_1` e `WORKSHOPS_EDIT_ERROR_SLUG_1` saem.
4. **Seed destrutivo:** `prisma/seed.ts` apaga todas as tabelas. Ele deve recusar a execução fora de um banco local. O seed também é atualizado para refletir o schema final.

## Etapa 2: administração nas páginas com menos código

Hoje existem 12 componentes quase iguais (cerca de 1.040 linhas), um trio de adicionar, editar e excluir para cada um dos tipos: aulas, eventos, workshops e produtos digitais.

- Unificar em um modal de formulário e um botão de exclusão reutilizáveis, configurados por tipo de conteúdo.
- Reduzir as actions restantes a um conjunto pequeno, organizado por tipo, deixando de concentrar tudo em um único arquivo.
- Separar as peças de administração das peças públicas em `components/`.

**Comportamentos que precisam continuar iguais:**

- Campos, rótulos e mensagens de cada formulário, exceto as mensagens de título repetido removidas na etapa 1.
- Validação de capa da aula (JPEG, PNG ou WebP, até 2 MB).
- Criação de workshop sem duplicar em caso de reenvio (`requestId`), coberta pelos testes atuais.
- Escolha entre e-book e aula digital nos produtos digitais.
- Data de evento.
- Publicação na loja, com categoria existente ou nova, duração ou publicação fixa.
- Toda action administrativa continua exigindo `requireAdmin`.

## Etapa 3: banco de dados

### Procedimento

1. Rodar consultas somente leitura em produção para cada candidato abaixo.
2. Apresentar o resultado ao dono do projeto.
3. Fazer backup do banco.
4. Conferir com `prisma migrate status` se o histórico de migrations de produção corresponde a `prisma/migrations`, pois o projeto já permitiu `db push`. Se houver divergência, alinhar o histórico antes de seguir.
5. Criar a migration apenas para os candidatos aprovados.
6. Testar a migration em uma cópia do banco e aplicar em produção com autorização explícita.

**Ordem de publicação (decisão de design):** a remoção acontece em duas entregas, para o site nunca ficar incompatível com o banco. Primeiro, uma migration torna opcionais as colunas obrigatórias que vão sair, como `Item.slug`, e o código para de usá-las. Depois que essa versão estiver no ar, uma segunda migration remove as colunas e tabelas.

Se um candidato tiver dados relevantes em produção, ele fica no schema até o dono do projeto decidir.

### Candidatos à remoção

| Onde | Campo | Situação no código |
|---|---|---|
| `ItemImage` | Tabela inteira | Só era gravada pelas actions mortas e lida pela página removida |
| `Item` | `priceCents` | Nenhuma tela exibe ou grava |
| `Item` | `scheduleOnlineUrl`, `schedulePresentialUrl` | Nenhuma tela exibe |
| `Item` | `storeSectionId` | Usado só pelo tipo `PRODUCT`, sem tela |
| `Item` | `slug` | Sem uso público depois da remoção de `/aulas/[slug]` |
| `Item` | `isActive` | Todo formulário envia sempre ativo; não existe opção para desativar |
| `Item` | `order` | Nenhuma tela define; se todos forem iguais, substituir por uma ordenação explícita que preserve a ordem visível atual |
| `ItemType` | `PRODUCT` | Nenhuma tela lista ou cria |
| `StoreSection` | `isAdult`, `bannerUrl`, `isActive` | Nenhuma tela usa |

**Atenção a `isActive`:** se houver itens inativos em produção, eles estão invisíveis hoje e não podem ser reativados pelo site. O dono do projeto decide se devem ser publicados ou excluídos antes da remoção do campo.

### Permanecem

`User` completo, `StorePost` completo, `StoreSection.slug`, `StoreSection.title`, `StoreSection.order` e, em `Item`, os campos `type`, `title`, `coverUrl`, `description`, `hotmartUrl`, `whatsappTextTemplate` e `eventDate`.

## Etapa 4: acabamento Vinho

A direção foi escolhida a partir de mockups com as fotos reais. A skill taste serve como referência de qualidade para hover, toque e movimento. O checklist completo dela não se aplica, porque exigiria reestruturar as páginas.

### Tokens

| Token | Valor | Uso |
|---|---|---|
| Vinho | `#5a1a2a` | Botão principal |
| Vinho hover | `#6e2235` | Hover do botão |
| Marfim | `#f3ece2` | Texto sobre vinho e sobre foto |
| Tinta | `#0e0b0b` | Fundos escuros |

### Componentes

- **Botões (`ActionButton`):** formato pill, fundo vinho, texto marfim, contorno interno `inset 0 0 0 1px rgba(243,236,226,.2)`, altura mínima de 48 px, texto em caixa alta com espaçamento moderado. Hover: fundo vinho claro e elevação de 1 px. Toque: `scale(.98)`.
- **Botões sobre fundo escuro (decisão de design):** o vinho quase desaparece sobre o fundo escuro das páginas `/aulas` e `/produtos-digitais`. Nesses casos, `tone="light"` usa o mesmo formato pill com fundo marfim e texto `#1b1212`. Sobre fotos com a camada vinho e sobre fundos claros, o botão é vinho.
- **Botão de contorno:** a variante `outline` continua existindo para ações secundárias, como fechar modais, no mesmo formato pill.
- **Botão único:** a página de workshops passa a usar `ActionButton`, e `components/ui/button.tsx` sai se ficar sem uso.
- **Heros (`HomeHero`, `PageHero`):** troca da camada escura uniforme por `linear-gradient(to top, rgba(58,16,28,.88) 0%, rgba(40,12,20,.34) 45%, rgba(14,11,11,.05) 78%)`, deixando a foto mais visível.
- **Sem botão novo no hero:** o hero da home continua só com a foto e o título, por decisão do dono do projeto, embora o mockup mostrasse um botão.
- **Cards da home (`ImageLinkCard`):** raio de 16 px, camada `linear-gradient(90deg, rgba(58,16,28,.55), rgba(14,11,11,.4))`. Hover e foco: foto com zoom de 1.04 e título com espaçamento de letras maior.

### Animações

Somente CSS, sem biblioteca nova.

| Elemento | Animação | Duração |
|---|---|---|
| Foto do hero | Entra de `scale(1.07)` e opacidade .5 até o normal | 2 s |
| Título do hero | Letras se acomodam: espaçamento de `.36em` até `.24em`, com fade. `.24em` passa a ser o espaçamento final dos títulos em `HomeHero` e `PageHero`, como no mockup escolhido | 1,4 s, atraso de .2 s |
| Foto do card no hover | Zoom | .7 s |
| Título do card no hover | Espaçamento de letras | .5 s |

Curva padrão: `cubic-bezier(.16, 1, .3, 1)`.

**Regras:** a entrada do hero acontece uma vez, ao carregar a página. Nada aparece com fade ao rolar. Com `prefers-reduced-motion: reduce`, todas as animações e transições ficam desligadas e o conteúdo aparece normalmente.

## Verificação

Em cada etapa:

- `npm test`, `npm run lint` e `npm run build` passando.
- Navegação pelas páginas públicas em 390 px e em desktop.

Etapas 1 e 2, em banco local: adicionar, editar e excluir aula, evento, workshop, produto digital e publicação da loja, confirmando que editar preserva os campos que o formulário não mostra.

Etapa 4: conferir contraste do texto sobre as fotos e sobre o vinho, foco visível no teclado, ausência de rolagem horizontal em 320 px e funcionamento com movimento reduzido.

## A cargo de quem construir

- Nomes de arquivos e organização final das pastas, dentro das regras acima.
- A forma exata de configurar o modal unificado e as actions por tipo.
- O critério técnico para o seed reconhecer um banco local.
- A divisão de cada etapa em commits.
