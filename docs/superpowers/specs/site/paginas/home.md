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

## Em todas as páginas (layout)
- **Cabeçalho:** só o nome "Denise Garcia", com link para a home. Não tem menu.
- **Rodapé:** endereço, telefone (link para o WhatsApp), Instagram, copyright e links para as 5
  páginas.
- **Botão flutuante do WhatsApp:** canto inferior direito, número fixo de
  `SITE_FOOTER_WHATSAPP_URL_1`.
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
