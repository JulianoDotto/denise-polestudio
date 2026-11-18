# Fotos fora do banco com Vercel Blob

## Por que fazer

As fotos de aulas e da loja ficam gravadas como texto (base64) no banco e vêm embutidas no HTML. Em produção, `/aulas` tem cerca de 15,8 MB e `/loja` cerca de 9,7 MB de HTML. Em `/aulas`, cada foto aparece duas vezes. O site é mobile first e ainda não foi lançado, então este é o momento de corrigir.

## Situação atual

| Origem | Coluna | Fotos embutidas | Tamanho |
|---|---|---|---|
| Aulas | `Item.coverUrl` (tipo `CLASS`) | 7 | cerca de 5,8 MB |
| Loja | `StorePost.imageUrl` | 17 | cerca de 5,8 MB |

- `ClassCoverField` e `StorePostImageField` leem o arquivo com `FileReader` e enviam o base64 em um campo oculto.
- A capa de aula aceita JPEG, PNG e WebP até 2 MB. A foto da loja aceita qualquer imagem e não tem limite próprio.
- Server Actions aceitam até 4 MB (`next.config.ts`). A Vercel limita o corpo da requisição a 4,5 MB.
- Workshops não têm fotos embutidas e ficam fora deste trabalho.

## Objetivos

- `/aulas` e `/loja` sem nenhum `data:image` no HTML público, com menos de 100 KB de HTML cada para visitantes.
- Fotos novas reduzidas no navegador antes do envio e guardadas no Vercel Blob.
- As 24 fotos atuais migradas sem perda, com backup antes.
- Visual das páginas igual ao de hoje.

## Fora do escopo

- Trocar `<img>` por `next/image`.
- Alterar colunas do banco. `coverUrl` e `imageUrl` continuam, agora com o endereço da foto.
- Remover a tabela `ItemImage` e as demais colunas sem uso.
- Tratar as 4 publicações sem categoria.
- Galerias, recorte de imagem ou remoção da foto sem substituição.

## Abordagens consideradas

1. **Vercel Blob (escolhida pelo dono do projeto).** Resolve a causa, entrega as fotos por CDN e usa o provedor que o site já tem.
2. **Manter no Neon com rota própria e cache.** Dispensa serviço novo, mas o banco continua pesado e cada foto fora do cache consulta o Neon.
3. **Cloudinary.** Otimiza automaticamente, mas adiciona uma conta e um fornecedor para apenas 24 fotos.

## Design

### Armazenamento

- Um único store **público** do Vercel Blob, conectado aos dois projetos da Vercel (`denise-polestudio` e `denise-polestudio-llm1`).
- Região: São Paulo, se disponível. A região não pode ser alterada depois da criação.
- Caminhos: `aulas/<nome>.webp` e `loja/<nome>.webp`, com `addRandomSuffix: true`. A extensão acompanha o tipo real do arquivo.
- `cacheControlMaxAge` de 1 ano, porque cada foto nova recebe um endereço novo.
- Fora de produção, os caminhos recebem o prefixo `dev/`.

### Envio de foto nova

1. O administrador escolhe a foto.
2. O navegador reduz a imagem para no máximo 1600 px no lado maior e gera WebP com qualidade 0,82. Se o navegador não gerar WebP, como o Safari, gera JPEG com a mesma qualidade.
3. O arquivo reduzido substitui o original no campo do formulário. O envio fica bloqueado enquanto a foto é processada.
4. A Server Action confere o administrador e valida os outros campos primeiro.
5. A action valida a foto: JPEG, PNG ou WebP, conferidos pelos bytes iniciais do arquivo, e no máximo 3 MB.
6. A action envia a foto com `put()` e grava o endereço no banco.
7. Se a gravação no banco falhar, a action apaga a foto recém-enviada.

Se a foto não puder ser lida, o formulário mostra um erro e não envia.

### Edição e exclusão

- Editar uma aula sem escolher foto nova não altera `coverUrl`. O campo oculto com a foto atual deixa de existir.
- Ao substituir ou excluir, a foto antiga é apagada do Blob depois que o banco for atualizado, somente quando o endereço for do host `.public.blob.vercel-storage.com`.
- Falha ao apagar a foto antiga é registrada no log e não desfaz a operação do administrador.
- `validateClassCoverUrl` deixa de ser usada e é removida.

### Exibição

- As páginas continuam com `<img>`, recebendo o endereço da foto.
- Fotos abaixo da primeira tela usam `loading="lazy"` e `decoding="async"`. A primeira foto de `/aulas` e a foto ativa do carrossel carregam normalmente.
- Valores antigos continuam funcionando durante a transição, porque `src` aceita base64, caminho local e endereço do Blob.

### Migração das fotos atuais

Script avulso, fora do repositório, executado pelo dono do projeto no próprio terminal. A URL do banco e o token do Blob são pedidos sem aparecer na tela.

1. Faz um backup completo do banco.
2. Seleciona as linhas de `Item.coverUrl` e `StorePost.imageUrl` que começam com `data:image/`.
3. Reduz cada foto com `sharp`, respeitando a rotação, para no máximo 1600 px em WebP com qualidade 0,82.
4. Envia a foto, baixa de volta pelo endereço público e confere os bytes.
5. Atualiza a linha somente se o valor ainda for o mesmo lido no passo 2.
6. Mostra o total migrado, o tamanho antes e depois e qualquer falha.

O script oferece simulação sem alterações e pode ser repetido, porque só processa linhas que ainda têm base64. A reversão é feita a partir do backup, e as fotos no Blob só devem ser apagadas depois da conferência.

### Ordem de publicação

1. O dono do projeto cria o store e conecta os dois projetos.
2. O novo código é publicado. Ele funciona com as fotos antigas e novas.
3. O envio de foto é testado em produção com uma aula de teste, que é excluída em seguida.
4. A migração é ensaiada em cópia local e depois executada em produção.
5. O HTML das páginas e as fotos são conferidos nos dois endereços.

## Verificação

- Testes automatizados da validação de arquivo, do cálculo de dimensões, do reconhecimento do host do Blob e da ordem de falha do envio.
- Teste local com banco temporário e prefixo `dev/`: criar, substituir e excluir fotos de aulas e da loja.
- Teste em tela de celular (375 px) e desktop, com foto grande, foto vertical e PNG.
- Depois da migração: nenhum `data:image` em `/aulas` e `/loja`, HTML abaixo de 100 KB e todas as fotos respondendo com status 200.

Previews da Vercel não devem ser usados para testar escrita enquanto apontarem para o banco de produção.

## Riscos

- **Limite do plano.** No plano Hobby, o Blob inclui 1 GB de armazenamento, 10 GB de transferência, 10 mil operações simples e 2 mil avançadas. Ao ultrapassar, o acesso ao Blob fica bloqueado até completar 30 dias, e as fotos deixam de aparecer. A Vercel avisa por e-mail quando o uso se aproxima do limite.
- **Uso comercial.** O plano Hobby da Vercel é destinado a uso não comercial. O dono do projeto deve confirmar o plano adequado antes do lançamento.
- **Dois projetos publicando o mesmo site.** Enquanto os dois existirem, ambos consomem o mesmo store.
- **Fotos reduzidas.** A migração reduz as fotos atuais. Os originais em base64 ficam preservados no backup.

## Decisões deixadas para o plano de implementação

- Nome e organização dos módulos de upload.
- Forma de substituir o arquivo no campo do formulário, com alternativa para navegadores sem `DataTransfer`.
- Mensagens de erro, seguindo `hardcoded/texts.ts`.
