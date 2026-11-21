# Loja (`/loja`)

**Arquivos:** `app/loja/page.tsx` · fileiras em `components/site/StoreProductRow.tsx` · aviso de
idade em `components/site/AgeGateModal.tsx` · admin: `components/admin/AdminModal.tsx`,
`components/admin/FeedCategoryField.tsx`, `components/admin/ImageUploadField.tsx`,
`components/admin/StorePostDurationFields.tsx`, `components/admin/StorePostSubmitButton.tsx`,
`components/admin/ReorderButtons.tsx` · ações em `lib/admin/actions/store-posts.ts` e
`lib/admin/actions/reorder.ts` · regras em `lib/feed-groups.ts`, `lib/store-product.ts`,
`lib/admin/feed-category.ts`, `lib/admin/feed-persistence.ts`,
`lib/admin/store-post-details.ts`.

No código, os produtos da loja aparecem como "posts" ou "feed" (`StorePost`) e as categorias como
`StoreSection`.

## O que mostra
1. **Aviso de 18 anos** na primeira visita (ver [negocio.md](../negocio.md#restrição-de-idade)).
2. Topo "Loja" (02 / 05) e abertura "Para o palco, o quarto e o autocuidado", com as formas de
   pagamento (PIX · Dinheiro · Cartão · Parcelamento · Envio para todo o Brasil) e o botão
   **"Comprar pelo WhatsApp"** (mensagem geral).
3. **Uma fileira por categoria.** Cada uma tem o contador "N produtos", o título e um carrossel
   horizontal de cards (no celular, arrasta com o dedo; no computador, aparecem setas ‹ › quando
   há mais de 3 produtos).
   - **Card:** foto quadrada, título, preço (se houver) e "Pedir no WhatsApp".
   - **Categoria com um produto só:** o card ocupa a largura toda.
   - **Tocar na foto ou no título** abre um modal com a foto inteira, o preço, a descrição
     completa e "Pedir no WhatsApp".

## Visitante pode
- Pedir um produto: abre o WhatsApp com "Olá! Tenho interesse no produto "{título}" (R$ X,XX)."
  (o preço só entra se existir; `buildProductOrderMessage`).
- Falar com a Denise sem um produto específico, pelo botão da abertura.

## Admin pode
| Ação | Onde | Função |
|---|---|---|
| Publicar produto | "+ Adicionar" no fim da página, modal "Publicar no feed" | `createStorePost` |
| Excluir produto (com confirmação; apaga a foto) | lixeira no canto do card | `deleteStorePost` |
| Mover categoria para cima / para baixo | setas ao lado do título da fileira | `moveStoreSection` |

**Campos do formulário de publicação:**
- **Título:** obrigatório.
- **Descrição.**
- **Preço:** opcional. Aceita "25", "25,00", "1.234,56" ou "R$ 25,00"; recusa formatos
  inválidos.
- **Categoria:** uma existente, **"Cadastrar nova categoria"** (aparece o campo do nome; é o
  padrão) ou "Sem categoria".
- **Foto.**
- **Duração:** marcar "Publicação fixa" (fica para sempre) **ou** escolher data e hora em "Tempo
  de duração" (some depois disso). Um dos dois é obrigatório.

Erros e sucesso voltam pela URL (`/loja?error=title`, `/loja?success=1`), e o modal reabre
mostrando a mensagem.

**O admin não consegue:** editar um produto publicado (tem que excluir e publicar de novo),
renomear ou excluir uma categoria, nem ordenar os produtos dentro da fileira.

## Regras
- **Quais produtos aparecem:** os fixados e os que ainda não expiraram. Produto expirado continua
  no banco, só não aparece.
- **Ordem dentro da fileira:** fixados primeiro, depois os mais novos.
- **Ordem das fileiras:** a que o admin montou com as setas (`order`); categoria nova entra no
  fim.
- **Categoria vazia** (sem produto ativo) não aparece. As setas pulam essas categorias, então um
  toque sempre muda o que está na tela.
- **Produto "Sem categoria" não aparece em lugar nenhum.** O formulário permite, mas o produto
  fica invisível. Se isso é intencional: **a confirmar**.
- **Nome de categoria repetido** dá o erro "Já existe uma categoria com esse nome". A comparação
  é pelo slug, então "Pole" e "pole" contam como iguais.
- **Sem foto**, o card usa a imagem de reserva `/images/fallback-dg.svg`.
- As categorias têm os campos `isAdult` e `bannerUrl`, mas a página não usa nenhum dos dois. O
  aviso de idade vale para a loja inteira.
