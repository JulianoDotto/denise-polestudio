# Home (`/`)

**Arquivos:** `app/page.tsx`, `components/site/HomeHero.tsx`, `components/site/HomeIntro.tsx`,
`components/site/HomeLinks.tsx`. Moldura comum a todas as páginas: `app/layout.tsx`,
`components/site/Header.tsx`, `components/site/Footer.tsx`.

## O que mostra
1. **Hero:** foto grande da Denise com "Pole dance · Caçapava/SP" e o lema "Liberdade através da
   sensualidade".
2. **Sobre mim:** foto e apresentação da Denise (formação, desde 2017, mentora de autoestima).
3. **Encontre sua experiência:** índice com uma linha por página (Aulas, Loja, Produtos digitais,
   Eventos, Workshops), cada uma com foto e frase curta.

A home é **100% fixa**: textos em `hardcoded/texts.ts` (`HOME_*`) e fotos em
`hardcoded/images.ts` (`HOME_*`). Não lê o banco.

**No Google:** título "Denise Garcia · Pole Dance em Caçapava/SP" (`SITE_HOME_METADATA_TITLE_1`,
via `title.absolute`, sem o sufixo das outras páginas) e descrição `SITE_METADATA_DESCRIPTION_1`,
que cita Caçapava, São José dos Campos e Taubaté. Sitemap, canônico e dados do estúdio: ver
[seo.md](../seo.md).

## Em todas as páginas (layout)
- **Cabeçalho:** só o nome "Denise Garcia" (Playfair em semibold, caixa alta), com link para a
  home. Não tem menu.
- **Rodapé:** endereço, telefone (link para o WhatsApp), Instagram, copyright e links para as 5
  páginas.
- **Botão flutuante do WhatsApp:** canto inferior direito, número fixo de
  `SITE_FOOTER_WHATSAPP_URL_1`. É um `<a>` externo, respeita a área segura do celular
  (`env(safe-area-inset-*)`), e a última faixa do rodapé tem espaço embaixo (`pb-24`) para ele
  não cobrir os links.
- **Link "Pular para o conteúdo"** (`SITE_SKIP_LINK_1`): primeiro item do Tab, só aparece com o
  foco do teclado e leva ao `<main id="conteudo">`.
- **Cor da barra do navegador** (`viewport.themeColor`): `#d8bfb6`, a mesma do fundo.
- Conteúdo com largura máxima de 738 px, centralizado. É pensado para o celular, e no
  computador fica como uma coluna.

## Visitante pode
Navegar para as páginas e abrir o WhatsApp ou o Instagram.

## Admin pode
Nada nesta página. Mudar textos ou fotos da home exige editar `hardcoded/`.

## Regras
- A ordem das páginas está repetida em quatro lugares. Ao incluir ou reordenar uma página,
  atualize todos:
  - `homeLinks` em `app/page.tsx`;
  - `SITE_LINKS` em `components/site/Footer.tsx`;
  - `PAGES` em `components/site/PageHero.tsx`;
  - o `index={n} total={5}` passado ao `PageHero` em cada `app/<rota>/page.tsx`.
