# Admin reordena categorias da loja, produtos digitais e aulas — design curto

## Por quê
A Denise quer destacar o que é o carro-chefe dela. Hoje são as aulas de pole dance, mas isso pode
mudar. Ela precisa colocar no topo o que quiser e reorganizar depois, sem pedir para ninguém.

## Objetivo / não-objetivo / antiobjetivo
- Objetivo: com o admin logado, mudar a ordem de três listas pelo próprio site:
  1. as categorias (fileiras) da loja, em `/loja`;
  2. os cards de produtos digitais, em `/produtos-digitais`;
  3. os cards de aulas, em `/aulas`.
- Não-objetivo: a ordem dos posts dentro de cada categoria da loja (continua "fixados primeiro,
  depois os mais novos"), eventos e workshops.
- Antiobjetivo: um toque numa seta que não muda nada na tela, ou um item criado depois que
  desarruma a ordem que ela montou.

## Abordagens consideradas
1. **Escolhida:** setinhas ↑ ↓ em cada card ou categoria, visíveis só para o admin. Cada toque troca
   o item com o vizinho. Funciona bem no toque, não precisa de biblioteca nova e usa o padrão de
   ação no servidor que o projeto já tem. Levar o último item ao topo custa vários toques, o que é
   aceitável para listas curtas.
2. Modo "reordenar" com arrastar e salvar. É melhor para listas longas, mas precisa de biblioteca
   (dnd-kit), arrastar no celular briga com a rolagem e o código é bem maior.
3. Campo "posição" no formulário de edição. É simples de construir, mas estranho de usar e
   permite posições repetidas.

## Como funciona
- O banco já tem `order` em `Item` e em `StoreSection`, e as páginas já ordenam por ele. Não há
  migração.
- Aulas e produtos digitais: duas setas (↑ ↓) ao lado dos botões de editar e apagar do card.
  Na loja, as setas ficam ao lado do título de cada fileira.
- A seta do primeiro item não sobe e a do último não desce: ficam desabilitadas ou escondidas.
- Um toque chama uma ação no servidor (`requireAdmin`) que troca o item com o vizinho **que
  aparece na tela**, regrava a ordem da lista inteira como 0, 1, 2… (hoje quase tudo está com 0,
  então trocar só dois valores não funcionaria) e revalida a página.
- Produtos digitais: e-books e vídeos formam uma lista só, como já aparecem na página.
- Loja: a página só mostra categorias que têm posts ativos. A seta troca com a fileira vizinha
  visível, e as categorias escondidas não podem "engolir" o toque.
- Itens e categorias novos entram no fim da lista (`order` = maior atual + 1).
- Ordem estável: no empate de `order`, desempatar sempre do mesmo jeito (por exemplo, `createdAt`)
  para que a tela e a ação no servidor concordem sobre quem é o vizinho.
- Mobile first: as setas precisam ter área de toque confortável (cerca de 44px) e não podem cobrir
  a imagem nem o botão principal do card.

## Fica a critério de quem construir
- Ícones (lucide `ChevronUp`/`ChevronDown` ou `ArrowUp`/`ArrowDown`) e o lugar exato no card.
- Se as setas usam formulário com ação no servidor (como `ContentDeleteButton`) ou outra forma, desde
  que mostrem o estado de "carregando" e não aceitem toque duplo enquanto a ação roda.
- Onde fica a lógica pura de reordenar (por exemplo, `lib/admin/reorder.ts`), coberta por teste.
