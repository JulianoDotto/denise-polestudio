# Admin

O admin edita o site **dentro das próprias páginas**. Não existe painel separado. Logado como
`ADMIN`, as mesmas páginas que o visitante vê ganham botões a mais: "+ Adicionar", lápis,
lixeira e setas.

## Entrar e sair

| Rota | O que faz | Arquivos |
|---|---|---|
| `/login` | Formulário de e-mail e senha. Quem já está logado vai para a home. Depois de entrar, vai para `/` (o formulário lê `?from=`, mas nada no site preenche esse parâmetro) | `app/login/page.tsx`, `app/login/LoginForm.tsx` |
| `/logout` | Encerra a sessão e volta para a home | `app/logout/page.tsx` |
| `/403` | "Acesso negado", para quem está logado mas não é admin, ou foi desativado/rebaixado no banco depois de entrar | `app/403/page.tsx` |

**Não há link para o login nem para o logout no site.** O admin digita o endereço. As três
rotas ficam fora do Google (`noindex` e bloqueio no `robots.txt`, ver [seo.md](seo.md)).

- **Como funciona:** NextAuth com e-mail e senha (`lib/auth/authOptions.ts`), sessão em JWT, e o
  papel (`role`) vai dentro do token (tipos em `next-auth.d.ts`). A senha é comparada com
  bcrypt. Usuário com `isActive = false` não entra.
- **Quem é admin:** usuário com `role = ADMIN` na tabela `User`. Não há tela de cadastro nem de
  troca de senha. O admin é criado pelo seed (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) ou direto no
  banco.
- **Variáveis:** `AUTH_SECRET` ou `NEXTAUTH_SECRET`.

## Como o acesso é protegido

1. **Na tela:** cada página lê a sessão (`getServerSession`) e só mostra os botões quando
   `session.user.role === 'ADMIN'`.
2. **No servidor:** toda ação começa com `requireAdmin()` (`lib/auth/requireAdmin.ts`). Ela
   confere a sessão **e** relê o usuário no banco (ainda é admin? ainda está ativo?). Sem sessão,
   manda para `/login`; sem permissão, para `/403`.

O passo 1 usa só o token. Por isso, um admin desativado continua vendo os botões até a sessão
expirar, mas qualquer ação dele cai em `/403`. Esconder o botão é só aparência. A segurança está no passo 2, e **toda ação nova precisa chamar
`requireAdmin()` na primeira linha**.

## Todos os poderes

| Poder | Página | Função (`lib/admin/actions/`) |
|---|---|---|
| Criar aula | [aulas](paginas/aulas.md) | `createClassInline` (`classes.ts`) |
| Editar aula (inclui trocar a foto) | [aulas](paginas/aulas.md) | `updateClassInline` (`classes.ts`) |
| Excluir aula | [aulas](paginas/aulas.md) | `deleteClassInline` (`classes.ts`) |
| Reordenar aulas | [aulas](paginas/aulas.md) | `moveItem` (`reorder.ts`) |
| Criar produto digital | [produtos-digitais](paginas/produtos-digitais.md) | `createDigitalProductInline` (`digital-products.ts`) |
| Editar produto digital | [produtos-digitais](paginas/produtos-digitais.md) | `updateDigitalProductInline` (`digital-products.ts`) |
| Excluir produto digital | [produtos-digitais](paginas/produtos-digitais.md) | `deleteDigitalProductInline` (`digital-products.ts`) |
| Reordenar produtos digitais | [produtos-digitais](paginas/produtos-digitais.md) | `moveItem` (`reorder.ts`) |
| Criar evento | [eventos](paginas/eventos.md) | `createEventInline` (`events.ts`) |
| Editar evento | [eventos](paginas/eventos.md) | `updateEventInline` (`events.ts`) |
| Excluir evento | [eventos](paginas/eventos.md) | `deleteEventInline` (`events.ts`) |
| Criar workshop | [workshops](paginas/workshops.md) | `createWorkshopInline` (`workshops.ts`) |
| Editar workshop | [workshops](paginas/workshops.md) | `updateWorkshopInline` (`workshops.ts`) |
| Excluir workshop | [workshops](paginas/workshops.md) | `deleteWorkshopInline` (`workshops.ts`) |
| Publicar produto na loja (e criar categoria) | [loja](paginas/loja.md) | `createStorePost` (`store-posts.ts`) |
| Excluir produto da loja | [loja](paginas/loja.md) | `deleteStorePost` (`store-posts.ts`) |
| Reordenar categorias da loja | [loja](paginas/loja.md) | `moveStoreSection` (`reorder.ts`) |

## O que o admin **não** consegue fazer pelo site

- Editar um produto da loja já publicado.
- Renomear ou excluir uma categoria da loja.
- Reordenar workshops, eventos ou os produtos dentro de uma categoria.
- Pôr foto em workshop, evento ou produto digital.
- Desativar um item sem excluir (`isActive` existe, mas não há botão).
- Mudar a mensagem do WhatsApp de um item (`whatsappTextTemplate`).
- Mudar textos fixos, fotos da home ou os formatos de evento: tudo isso fica em `hardcoded/`.
- Mudar a própria senha ou criar outros usuários.

## Padrões das ações

- Os formulários do admin abrem dentro de `AdminModal` (`components/admin/AdminModal.tsx`) e
  usam `useActionState`. A ação devolve `{ success, error }` (as de reordenar devolvem
  `{ error? }`), e o `error` é uma chave curta (`title`, `imageType`, `persistence`…) que o
  modal traduz por `errorMessages`.
- A loja é a exceção: devolve o resultado pela URL com `redirect('/loja?error=…')`.
- Depois de gravar, a ação chama `revalidatePath` da página, que atualiza sem recarregar.
- Excluir sempre pede confirmação num diálogo.
