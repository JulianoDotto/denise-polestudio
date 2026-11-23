# Spec do site — como ele é hoje

Esta pasta descreve o site **no estado atual**: o negócio, cada página, o que o visitante e o
admin podem fazer, os dados e como o código é organizado. Ela serve para um agente (ou pessoa)
entender o projeto sem precisar ler o código inteiro.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| [negocio.md](negocio.md) | Quem é a Denise, o que ela vende, como a venda acontece (WhatsApp), restrição de idade |
| [admin.md](admin.md) | Login, permissões e a lista completa de poderes do admin |
| [dados.md](dados.md) | Modelos do banco, ordem das listas, fotos no Vercel Blob, textos fixos em `hardcoded/` |
| [seo.md](seo.md) | Sitemap, robots, canônicos, dados do estúdio para o Google e como trocar de domínio |
| [componentes.md](componentes.md) | Guia de componentização: onde cada coisa mora e como criar uma nova |
| [paginas/home.md](paginas/home.md) | `/` — apresentação e índice do site |
| [paginas/aulas.md](paginas/aulas.md) | `/aulas` — aulas presenciais |
| [paginas/loja.md](paginas/loja.md) | `/loja` — vitrine por categorias, com restrição de idade |
| [paginas/produtos-digitais.md](paginas/produtos-digitais.md) | `/produtos-digitais` — e-books e aulas gravadas |
| [paginas/eventos.md](paginas/eventos.md) | `/eventos` — formatos de evento e agenda |
| [paginas/workshops.md](paginas/workshops.md) | `/workshops` — workshops temáticos |

`/login`, `/logout` e `/403` estão descritas em [admin.md](admin.md).

## `site/` x designs datados

- **`site/`** (esta pasta) é o retrato de agora. Quando algo muda, o arquivo é reescrito, não
  ganha um apêndice.
- **`docs/superpowers/specs/AAAA-MM-DD-*-design.md`** registram **por que** cada mudança foi feita.
  Não são atualizados depois, são histórico.

Se os dois discordarem, vale o código, e depois `site/`. Um design antigo pode ter sido
substituído.

## Regra de manutenção

Toda mudança que altera o que uma página mostra, o que o admin pode fazer ou como os dados
funcionam atualiza o arquivo correspondente aqui **no mesmo commit**.

## "A confirmar"

Trechos marcados **a confirmar** são suposições sobre o negócio que o código não comprova.
Pergunte ao Juliano antes de usá-los como regra.
