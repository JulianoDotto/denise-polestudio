# Lighthouse da loja — design

## Por quê

O Lighthouse mobile de `denisegarcia.vercel.app/loja` (21/11/2026) deu desempenho 43 e marcou
boas práticas com "source map ausente". FCP e LCP ficaram em cerca de 58 s no 4G simulado.

A causa é uma só: o HTML da `/loja` tem 15,7 MB. Desses, 15,4 MB são 13 fotos de produtos gravadas
no banco como base64 (`StorePost.imageUrl` começando com `data:image/png;base64,`), cada uma com
0,4 a 0,9 MB. Cada foto aparece duas vezes: no `<img>` e no payload do React. O aviso de source map
vem desses scripts inline enormes. `/aulas` tem o mesmo problema (15,8 MB).

As fotos novas já vão para o Blob desde `d4410a6`. A migração das antigas foi desenhada em
[`2026-11-18-fotos-vercel-blob-design.md`](2026-11-18-fotos-vercel-blob-design.md) (seção "Migração
das fotos atuais") e detalhada na Task 6 do plano `2026-11-18-fotos-vercel-blob.md`, mas nunca rodou.

## Objetivos

- `/loja` sem nenhum `data:image` no HTML, com menos de 100 KB de HTML para visitantes.
- Desempenho mobile da `/loja` acima de 90 e o aviso de source map resolvido.
- `/aulas` sai junto, porque o mesmo script cobre `Item.coverUrl`.

## Fora do escopo

- Trocar `<img>` por `next/image`. As fotos novas já chegam reduzidas (1600 px, WebP) e o otimizador
  da Vercel tem cota no plano atual.
- Bf-cache: a página lê a sessão do admin e por isso responde `no-store`. O Lighthouse marca como
  "não acionável".
- Avisos de JS não minificado e JS não usado: vieram de uma extensão de bloqueio de anúncios ativa
  no teste, não do site. Medir de novo em janela anônima.
- Polyfills legados (14 KiB): ganho pequeno, fica para outra vez.

## Não pode acontecer

- Perder uma foto. Backup completo antes, e o `UPDATE` só troca a linha se o valor ainda for o base64 lido.
- Credenciais impressas na tela, no chat ou em arquivo versionado.

## Abordagens

- **Migrar para o Blob (escolhida).** Script de uma vez que reduz cada foto para WebP 1600 px,
  envia ao Blob e troca o endereço no banco. Fica igual às fotos novas e não deixa código especial.
- **Servir por uma rota.** `/loja/foto/[id]` decodifica o base64 do banco com cache. Não mexe nos
  dados, mas mantém 15 MB no banco e um caminho só para fotos antigas.
- **Denise reenviar as 13 fotos à mão.** Sem script, mas depende dela e `/aulas` continuaria pesado.

## Como

Segue a Task 6 do plano de 18/11 sem mudanças de regra: script avulso fora do repositório, backup com
`dump-production.mjs`, `--dry-run`, ensaio em cópia local com prefixo `dev/migracao/`, conferência dos
bytes depois do envio, conflito registrado em vez de sobrescrever. O dono do projeto roda a migração
em produção no próprio terminal.

Única atualização: o endereço público agora é `denisegarcia.vercel.app`, e é nele que se confere o
resultado (HTML de `/loja` e `/aulas`, fotos com status 200) e se roda o Lighthouse de novo.

## Deixado para o plano

- Se `dump-production.mjs` ainda existe ou precisa ser refeito.
- Ordem exata dos passos de ensaio e de produção.
