# Spec do site para agentes de IA — design curto

## Por quê
O projeto não começou com o fluxo do superpowers. Cada agente que chega precisa redescobrir no
código o que é o negócio, o que cada página faz e o que o admin pode fazer. Não existe
`AGENTS.md` nem `CLAUDE.md`, então nada aponta para a documentação, e as regras de trabalho
(mobile first, porta 3000 etc.) estão só na memória local de um agente.

## Objetivo / não-objetivo / antiobjetivo
- Objetivo: um retrato do site **como ele é hoje**, por página, com as funcionalidades e os poderes
  do admin, mais um guia de componentização, e um `AGENTS.md` que leva qualquer agente até ele.
- Não-objetivo: adotar o Spec Kit ou outro fluxo novo. Funcionalidades novas continuam no fluxo do
  superpowers (brainstorm → design datado → plano). Refatorar código para seguir o guia.
- Antiobjetivo: documentação que inventa (datas, motivos, regras de negócio que o código não
  mostra) ou que envelhece sem ninguém perceber.

## Abordagens consideradas
1. **Escolhida:** pasta `docs/superpowers/specs/site/` organizada por página, ao lado dos designs
   datados. Responde direto "o que esta página faz e o que o admin pode fazer nela".
2. Formato oficial do Spec Kit (`.specify/`, `constitution.md`, `specs/NNN-…/`). É um padrão, mas só
   ajuda usando os comandos dele, o que trocaria o fluxo atual, e não tem lugar para "como o site é
   hoje".
3. Formato do Kiro (`product.md`, `tech.md`, `structure.md` + specs por funcionalidade). Arquivos
   gerais grossos demais para o detalhe por página.

Também descartado: escrever designs datados retroativos para as funcionalidades antigas, porque
inventaria datas e motivos.

## Estrutura
```
docs/superpowers/specs/
  YYYY-MM-DD-…-design.md   histórico de cada mudança (como hoje)
  site/
    README.md              índice + regra de manutenção
    negocio.md             a Denise, o estúdio, público, venda pelo WhatsApp, restrição de idade
    paginas/               home, aulas, workshops, eventos, produtos-digitais, loja, login
                           → cada uma: o que mostra, funcionalidades, o que o admin faz ali
    admin.md               login, permissões, lista de todos os poderes do admin
    dados.md               modelos do Prisma, imagens no Vercel Blob, textos fixos em hardcoded/
    componentes.md         onde cada componente mora (site/admin/ui), padrões, desvios atuais
AGENTS.md                  aponta para site/README.md + regras de trabalho
CLAUDE.md                  só importa o AGENTS.md (@AGENTS.md)
```

## Regras
- Tudo é escrito lendo o código. O que o código não confirma sobre o negócio fica marcado
  **"a confirmar"** para o Juliano revisar.
- O guia de componentes descreve o padrão que o código já segue e lista onde ele foge, sem
  refatorar.
- Manutenção: toda mudança que altera uma página atualiza o arquivo dela em `site/` no mesmo
  commit. O design datado continua registrando o porquê.
- `AGENTS.md` leva as regras de trabalho: mobile first (toque antes de hover), não parar o
  servidor da porta 3000 (pedir para o usuário subir), outros agentes usam a mesma pasta (não
  trocar de branch, usar worktree), não conferir o deploy na Vercel depois do push.
- Textos em português, curtos, voltados para um agente que vai mexer no código: caminhos de
  arquivos reais em cada página.

## Fica para quem executar
Profundidade de cada arquivo, ordem das seções, e se alguma página pequena (login, 403, logout)
vira arquivo próprio ou entra junto em `admin.md`.
