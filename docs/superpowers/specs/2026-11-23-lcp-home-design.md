# LCP da home — 23/11/2026

A nota de performance da home oscilava entre 83 e 97 no Lighthouse (celular). Comparando builds
de antes da troca de fontes, de antes de 23/11 e o atual, as três davam a mesma nota: não houve
regressão de código. O LCP (foto do topo) ficava perto de 4 s no celular simulado porque dividia a
banda com ~670 KB da página:

- seis fontes pré-carregadas (~165 KB): Playfair normal e itálico e Jost, cada uma em `latin` e
  `latin-ext`;
- `home-sobre-denise.webp` com 216 KB, em 1600 px de largura para ocupar ~340 px, e cortada em 4:5
  pelo CSS; ela já aparece na primeira tela, então o `loading="lazy"` não adiantava;
- a foto do topo em 853 px para ocupar ~390 px no celular.

Decisões:

- **Fontes só em `latin`.** O português cabe inteiro no subset `latin` (ç, ã, é…). Caem três
  arquivos pré-carregados.
- **Fotos geradas em tamanhos fixos com `srcset`/`sizes`**, sem `next/image`: o site não usa o
  otimizador da Vercel em nenhum outro lugar e as fotos da home são fixas.
- **Foto "sobre" já cortada em 4:5** no mesmo enquadramento do CSS (`object-[42%_50%]`), em 480 e
  800 px de largura.
- **Foto do topo em 480 px e 853 px** (a original), recomprimida.

Sem mudança visual. O script `scripts/home-images.py` regera as fotos a partir das originais.
