# SEO

O foco é a busca local: trazer alunas novas para as aulas presenciais em Caçapava/SP, com
São José dos Campos e Taubaté como região atendida. Por quê: ver
[o design de 23/11/2026](../2026-11-23-seo-local-design.md).

**Arquivos:** lógica em `lib/seo.ts` (testes em `lib/seo.test.ts`) · `app/sitemap.ts` ·
`app/robots.ts` · `metadataBase` e JSON-LD em `app/layout.tsx` · textos em `hardcoded/texts.ts`
(chaves `SITE_STUDIO_*`, `SITE_FOOTER_*` e `META_*`).

## Ícones do site

O D estilizado em marfim sobre vinho tem uma curva que sugere movimento de dança.
O desenho usa paths vetoriais, sem depender de fontes.
O App Router descobre automaticamente app/icon.svg, app/favicon.ico (16, 32 e
48 px) e app/apple-icon.png (180 px, fundo opaco para a máscara do iOS).
Ao mudar o desenho, atualizar os três arquivos juntos a partir do SVG.

## Imagem de compartilhamento

`app/opengraph-image.jpg` (1200×630) é o card que aparece quando alguém manda o link no WhatsApp,
no Instagram e em outros apps. É a mesma imagem para todas as páginas. Ela é gerada por
`scripts/og-image.py` a partir da foto original do aro (as instruções estão no topo do script).

O WhatsApp quase sempre mostra só uma miniatura pequena do quadrado central, recomprimida. Por isso
o card é fundo vinho liso, com um recorte fechado no rosto da Denise no quadrado central (fundo de
folhas desfocado) e, embaixo, uma faixa vinho com "DENISE GARCIA" e "POLE DANCE". A cidade fica no
título da prévia. O JPEG sai com qualidade 82 e fica abaixo de 100 KB.

O WhatsApp guarda a prévia em cache. Para ver uma imagem nova, mande o link com `?v=2` no final.

## Endereço do site

- A URL base vem de `NEXT_PUBLIC_SITE_URL`. Sem ela, ou se o valor não for `http(s)://…`, vale
  `https://denisegarcia.vercel.app`. Só a origem é usada: barra do fim, caminho, `?` e `#` são
  descartados.
- Dela saem o `metadataBase` (URLs absolutas da imagem de compartilhamento e dos canônicos), o
  sitemap, o robots e o JSON-LD.

**Para trocar para o domínio próprio:**
1. Na Vercel, adicionar o domínio e definir `NEXT_PUBLIC_SITE_URL` com ele (ex.:
   `https://denisegarcia.com.br`).
2. **Fazer um novo deploy.** Variáveis `NEXT_PUBLIC_*` entram no build e só mudam assim.
3. Configurar na Vercel o redirecionamento 301 de `denisegarcia.vercel.app` para o domínio novo.
4. Atualizar o link do site no Perfil da Empresa no Google e no Instagram.

## O que o Google recebe

| Peça | Onde | O que tem |
|---|---|---|
| `/sitemap.xml` | `app/sitemap.ts` | As seis páginas públicas: `/`, `/aulas`, `/workshops`, `/eventos`, `/produtos-digitais`, `/loja` |
| `/robots.txt` | `app/robots.ts` | Libera o site, bloqueia `/login`, `/logout`, `/403` e `/api/`, aponta o sitemap |
| `noindex` | `metadata` de `/login`, `/403` e `app/logout/layout.tsx` | Essas páginas ficam fora das buscas |
| Canônico | `alternates.canonical` em cada uma das seis páginas públicas | A URL oficial da página, sem parâmetros (`/loja?error=…` aponta para `/loja`) |
| Dados do estúdio (JSON-LD) | `<script type="application/ld+json">` no layout, em todas as páginas | `SportsActivityLocation` com nome, endereço, telefone, Instagram, site, foto e as três cidades atendidas |

O JSON-LD não tem horário de funcionamento, porque ele não está no site. Quando a Denise
informar, ele entra em `buildStudioJsonLd`.

## Fora do código

Para quem busca "pole dance Caçapava", o **Perfil da Empresa no Google** (o card no Maps) pesa
mais do que o site. A recomendação é a Denise criar ou revisar o dela, com o mesmo endereço e
telefone do site, horários, fotos e o link do site.
