# Acessibilidade: correções da revisão pelas Web Interface Guidelines

Data: 2026-11-23

## Por quê

Uma revisão de todo o código de interface (site, admin, login) contra as Web Interface Guidelines
da Vercel encontrou quatro problemas que atrapalham de fato quem usa teclado, leitor de tela ou
celular com entalhe. Este lote corrige só esses quatro. Os outros achados (reticências "...",
estados vazios, `autoComplete` nos formulários do admin etc.) ficam para depois.

## O que muda

1. **Foco nos formatos de evento (`EventFormats`).** O `summary` tirava o contorno de foco e
   contava com `group-focus-visible:` para sublinhar o título. Só que o `group` é o `<details>`,
   que nunca recebe foco, então quem usa teclado não via onde estava. Agora o estilo usa
   `group-has-[summary:focus-visible]:`: o título fica sublinhado e o círculo do "+" ganha um
   anel.
2. **Aviso de 18 anos (`AgeGateModal`).** O diálogo tinha `aria-modal`, mas o Tab saía dele para
   a loja por trás. Enquanto o aviso está aberto, os outros filhos do `<body>` ficam `inert`.
   O aviso continua com portal próprio, e não com o Radix Dialog, porque o portal do Radix
   recebe `z-index: 1` da regra `body > *` de `globals.css` e ficaria abaixo do botão do
   WhatsApp. O painel também respeita a área segura de baixo e ganhou `overscroll-contain`.
3. **Botão flutuante do WhatsApp (`Footer`).** Ele passa de `<Link>` para `<a>`, com
   `rel="noopener noreferrer"`, por ser um endereço externo. A posição respeita
   `env(safe-area-inset-*)` e o botão ganhou anel de foco. A última faixa do rodapé ganhou
   `pb-24`, para que o botão não cubra os links das páginas.
4. **Layout.** Entrou um link "Pular para o conteúdo", que só aparece com o foco do teclado e
   leva ao `<main id="conteudo">`. Entrou também `viewport.themeColor` (`#d8bfb6`, a mesma cor
   do fundo e do cabeçalho).

## Plano

1. Corrigir os quatro pontos acima.
2. Conferir no celular (375 px): o link de pular aparece no primeiro Tab, o título do formato
   fica sublinhado com o foco, o Tab não sai do aviso de 18 anos, e o rodapé fica livre do
   botão.
3. Atualizar `docs/superpowers/specs/site/paginas/home.md` (layout), `loja.md` (aviso de idade)
   e `eventos.md` (foco dos formatos).

Não há lógica pura nova em `lib/`, então este lote não tem teste novo.

## Segundo lote: o resto da revisão

Mesmo dia, mesma branch. Corrige os outros achados da revisão.

- **Texto:** "..." vira "…" e as aspas retas da mensagem de pedido viram curvas. Os
  placeholders do admin passam a mostrar um exemplo terminado em "…". As mensagens de erro
  dizem o que fazer ("Tente de novo."). Todo botão de enviar troca o texto durante o envio, e o
  `pending` passou a ser obrigatório em `CONTENT_FORMS` (com teste).
- **Foco e hover:** anel de `focus-visible` e estado de hover no cabeçalho, no 403, no login, na
  navegação do topo das páginas internas, nos botões de ícone do admin (que passam a ter 44 px),
  nas setas de reordenar e nos diálogos de exclusão.
- **Formulários:** `autoComplete="off"` nos campos de conteúdo, `inputMode="url"` e sem
  corretor no link do produto digital (continua sem `type="url"`, porque o servidor aceita link
  sem `https://`), fundo explícito nos `<select>`. O campo de data da loja não abre mais o
  seletor quando recebe foco pelo Tab. Tocar fora do modal do admin não fecha mais o modal.
- **Loja:** o título do produto é o único botão do card, com a área esticada sobre o card. O
  produto aberto fica na URL (`?produto=`), então o link pode ser compartilhado. A exclusão
  mostra "Excluindo…".
- **Estados vazios:** um componente `EmptyState`, o mesmo card tracejado de ingresso que a
  agenda de eventos já usava, para aulas, workshops, produtos digitais e loja. Assim todas as
  listas vazias têm a mesma cara e a mesma ação.
- **Movimento e desempenho:** o título do topo entra com opacity e transform, não mais com
  `letter-spacing`. O traço do `GlowCard` cresce com `scale-x`, não com `width`. A foto das aulas
  tem um quadro 3:2 reservado. O layout abre a conexão com o Vercel Blob cedo
  (`getBlobOrigin`, com teste). Os títulos ganham `text-wrap: balance`, e os toques têm
  `touch-action: manipulation` e um flash de toque em tom de vinho.

Os estados vazios seguem as regras do taste-skill que valem para peças pequenas: um estilo de
card só, botão com verbo e objeto, nenhuma legenda e nenhuma animação de scroll. O processo
completo do taste-skill (sorteio e gate) monta páginas novas e não foi rodado neste site.
