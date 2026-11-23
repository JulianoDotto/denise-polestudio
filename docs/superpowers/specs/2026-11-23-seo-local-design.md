# SEO local — design

Data: 23/11/2026 · Tamanho: mudança pequena

## Por quê

Ranquear melhor no Google para **atrair novas alunas para as aulas presenciais** da Denise.
O público é local: quem busca "pole dance Caçapava", "aula de pole perto de mim" e parecidas.
As alunas podem vir de Caçapava, São José dos Campos e Taubaté. Loja, produtos digitais e
eventos não são o foco.

Hoje o site tem título e descrição por página, `lang="pt-BR"`, imagem de compartilhamento e
favicon. Faltam sitemap, robots, `metadataBase`, canônico, dados estruturados e `noindex` nas
páginas internas. O título da home é só "Denise Garcia".

## Metas, não-metas, antimetas

- **Metas:** dar ao Google tudo o que ele precisa para entender que é um estúdio de pole dance
  em Caçapava que atende a região. Fazer `/aulas` e a home falarem as palavras que a aluna busca.
- **Não-metas:** páginas próprias por aula ou workshop (ficam para depois, se isto não bastar),
  páginas por cidade, mudanças em loja, produtos digitais e eventos, mudança visual.
- **Antimetas:** inventar fatos sobre as aulas (preço, horário, aula experimental, idade). Criar
  páginas quase iguais trocando a cidade, porque o Google pune isso.

## Restrições

- O domínio próprio virá no futuro. Trocar de endereço não pode exigir mudança de código.
- Textos fixos ficam em `hardcoded/texts.ts`. O admin não edita esses textos pelo site.
- Mobile first: o texto novo de `/aulas` precisa ler bem no celular.

## Abordagens

| | Abordagem | Troca |
|---|---|---|
| **A (escolhida)** | Base técnica, dados do estúdio e textos da home e de `/aulas` | Pequena e sem risco, ataca a busca que traz aluna |
| B | A, mais uma página por cidade | O Google trata isso como truque. E o estúdio fica em Caçapava, não nas outras cidades |
| C | A, mais uma página por aula e workshop | Hoje cada item tem pouco texto: as páginas sairiam rasas e a Denise teria de escrever um texto longo por item. Ajuda pouco na busca local |

O usuário chegou a escolher C, mas voltou para A.

## O que foi decidido

1. **Endereço configurável.** `NEXT_PUBLIC_SITE_URL`, com padrão `https://denisegarcia.vercel.app`,
   lido num só lugar em `lib/`. Dele saem o `metadataBase`, os canônicos (`alternates.canonical`
   por página), o sitemap, o robots e o JSON-LD. Para trocar de domínio: mudar a variável e
   configurar na Vercel o redirecionamento 301 do endereço antigo.
2. **`app/sitemap.ts`** com as seis páginas públicas: `/`, `/aulas`, `/workshops`, `/eventos`,
   `/produtos-digitais` e `/loja`. **`app/robots.ts`** libera o site, bloqueia `/login`,
   `/logout`, `/403` e `/api`, e aponta para o sitemap. `/login`, `/logout` e `/403` ganham
   `robots: { index: false }`.
3. **Dados do estúdio (JSON-LD)** no layout raiz: `SportsActivityLocation` com nome, endereço
   (Rua Rafael Citro, 42, Jardim Rafael, Caçapava/SP), telefone, Instagram em `sameAs`, URL,
   imagem e `areaServed` com Caçapava, São José dos Campos e Taubaté. Os valores vêm do
   `hardcoded/texts.ts` (chaves `SITE_FOOTER_*`) e não são duplicados. Sem horário de
   funcionamento, porque ele não está no site.
4. **Textos:**
   - Título da home: "Denise Garcia · Pole Dance em Caçapava/SP". A home usa `title.absolute`
     para não sair com o sufixo duplicado.
   - Título de `/aulas`: "Aulas de pole dance em Caçapava/SP".
   - As descrições da home e de `/aulas` citam Caçapava, São José dos Campos e Taubaté.
   - Em `/aulas`, o topo visual (`PageHero`) continua igual. A abertura (`PageIntro`) ganha dois
     ou três parágrafos para a aluna nova: pole dance em Caçapava, para todos os níveis, com a
     Denise (formada em Educação Física, acompanhando mulheres desde 2017), perto de São José e
     Taubaté, e como marcar pelo WhatsApp.
   - Só entram fatos que já estão no site.
5. **Fora do código:** recomendar à Denise criar ou revisar o Perfil da Empresa no Google, com o
   endereço do estúdio e o link do site. Para busca local, ele pesa mais do que o site.

## Para a Denise confirmar depois

Estas respostas enriquecem o texto de `/aulas` numa próxima mudança:
- Existe aula experimental?
- Há idade mínima?
- Quais níveis ou turmas existem?
- O que a aluna precisa levar e vestir?
- Quais são os dias e horários de funcionamento? (também servem para o JSON-LD e o Perfil da
  Empresa no Google)

## Fica a critério de quem implementa

- A redação final dos textos, no tom do site (segunda pessoa, acolhedor, sensual sem ser
  explícito).
- O formato exato do helper de URL e do componente de JSON-LD.
- Testes: TDD na lógica pura em `lib/`, por exemplo o montador do JSON-LD e da URL base.
- Atualizar `docs/superpowers/specs/site/` (`README.md` ou `dados.md`, `paginas/home.md` e
  `paginas/aulas.md`) no mesmo commit.
