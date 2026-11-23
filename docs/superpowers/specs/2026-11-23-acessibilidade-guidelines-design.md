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
