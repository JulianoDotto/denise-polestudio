# Fotos no Vercel Blob: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tirar as fotos de aulas e da loja de dentro do banco e do HTML, guardando-as no Vercel Blob.

**Architecture:** O navegador reduz a foto e a envia no próprio formulário. A Server Action valida os bytes, grava no Blob com `put()` e salva só o endereço nas colunas atuais. Um script avulso migra as fotos existentes depois da publicação do código.

**Tech Stack:** Next.js 16 (App Router, Server Actions), React 19, Prisma 7, `@vercel/blob`, `node:test` via `tsx --test lib/*.test.ts`.

**Spec:** `docs/superpowers/specs/2026-11-18-fotos-vercel-blob-design.md`

## Global Constraints

- Lado maior da foto: no máximo `1600` px. Qualidade: `0.82`. Formato: WebP, com JPEG quando o navegador não gerar WebP.
- Tipos aceitos no servidor: JPEG, PNG e WebP, conferidos pelos bytes iniciais. Tamanho máximo no servidor: `3 * 1024 * 1024` bytes.
- Store público. Caminhos `aulas/` e `loja/`, com prefixo `dev/` fora de produção. `addRandomSuffix: true` e `cacheControlMaxAge: 31536000`.
- Sem migration: `Item.coverUrl` e `StorePost.imageUrl` continuam como estão.
- Só apague do Blob endereços cujo host termine em `.public.blob.vercel-storage.com`.
- Visual das páginas igual ao atual. Textos em `hardcoded/texts.ts`.
- Merge na `main`, migração em produção e qualquer escrita em produção exigem autorização explícita do dono do projeto. Nunca grave credenciais em arquivos versionados nem as peça no chat.
- Previews da Vercel não servem para testar escrita, porque podem apontar para o banco de produção.

## Review Focus

1. Foto vertical tirada no celular: precisa continuar em pé depois de reduzida (Task 5, Step 3; Task 6, Step 1).
2. Arquivo com extensão falsa, como um GIF ou texto renomeado para `.jpg`: o servidor recusa (Task 1).
3. Duplo clique em publicar: cria uma única publicação e envia uma única foto (Tasks 3 e 4; Task 5, Step 3).
4. Falha do banco depois do envio: a foto recém-enviada é apagada e o erro aparece (Task 2).
5. Editar uma aula sem escolher foto: a capa atual continua, mesmo se ainda estiver em base64 (Task 3).

---

### Task 0: Preparação

Pré-requisito humano: o dono do projeto cria um store **público** no Vercel Blob, na região de São Paulo se disponível, conecta os dois projetos e coloca `BLOB_READ_WRITE_TOKEN` em `.env.local`.

- [ ] **Step 1: Criar a branch a partir da `main` atualizada**

```bash
git checkout -b feat/fotos-vercel-blob
```

- [ ] **Step 2: Confirmar que `.env.local` é ignorado**

Run: `git check-ignore .env.local`
Expected: imprime `.env.local`.

- [ ] **Step 3: Instalar a dependência**

Run: `npm install @vercel/blob@^2.9.0`
Expected: `package.json` e `package-lock.json` alterados, sem mudança em outras dependências diretas.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json docs/superpowers/specs/2026-11-18-fotos-vercel-blob-design.md docs/superpowers/plans/2026-11-18-fotos-vercel-blob.md
git commit -m "chore: add vercel blob dependency and image migration plan"
```

---

### Task 1: Regras puras de imagem

**Files:**
- Create: `lib/admin/image-file.ts`
- Test: `lib/image-file.test.ts`

**Interfaces:**
- Produces:
  - `IMAGE_UPLOAD_MAX_BYTES`, `IMAGE_MAX_DIMENSION`, `IMAGE_QUALITY`
  - `type ImageError = 'imageType' | 'imageSize'`
  - `type ParsedImage = { bytes: Uint8Array; contentType: 'image/jpeg' | 'image/png' | 'image/webp'; extension: 'jpg' | 'png' | 'webp' }`
  - `parseImageBytes(bytes: Uint8Array): ParsedImage | { error: ImageError }`
  - `readImageField(form: FormData, name: string): Promise<{ image: ParsedImage | null } | { error: ImageError }>`
  - `fitWithin(width: number, height: number, max?: number): { width: number; height: number }`
  - `isBlobUrl(value: string | null | undefined): boolean`
  - `buildImagePath(folder: 'aulas' | 'loja', extension: string, nodeEnv: string | undefined): string`

O módulo não importa nada do servidor, porque o navegador usa `fitWithin` e as constantes.

- [ ] **Step 1: Escrever os testes**

```ts
const JPEG = [0xff, 0xd8, 0xff, 0xe0]
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const WEBP = [0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50]

test('recognises images by their bytes', () => {
  assert.equal(expectImage(JPEG).contentType, 'image/jpeg')
  assert.equal(expectImage(PNG).extension, 'png')
  assert.equal(expectImage(WEBP).contentType, 'image/webp')
})

test('rejects files that only pretend to be images', () => {
  assert.deepEqual(parseImageBytes(new TextEncoder().encode('GIF89a fake')), { error: 'imageType' })
  assert.deepEqual(parseImageBytes(new Uint8Array([0x52, 0x49, 0x46, 0x46])), { error: 'imageType' })
})

test('enforces the size limit', () => {
  const atLimit = new Uint8Array(IMAGE_UPLOAD_MAX_BYTES); atLimit.set(JPEG)
  const over = new Uint8Array(IMAGE_UPLOAD_MAX_BYTES + 1); over.set(JPEG)
  assert.ok(!('error' in parseImageBytes(atLimit)))
  assert.deepEqual(parseImageBytes(over), { error: 'imageSize' })
})

test('an empty file input means no new image', async () => {
  const form = new FormData()
  form.set('coverFile', new File([], ''))
  assert.deepEqual(await readImageField(form, 'coverFile'), { image: null })
  assert.deepEqual(await readImageField(new FormData(), 'coverFile'), { image: null })
})

test('fits the longest side and never enlarges', () => {
  assert.deepEqual(fitWithin(4000, 3000), { width: 1600, height: 1200 })
  assert.deepEqual(fitWithin(3000, 4000), { width: 1200, height: 1600 })
  assert.deepEqual(fitWithin(800, 600), { width: 800, height: 600 })
  assert.deepEqual(fitWithin(10000, 1), { width: 1600, height: 1 })
})

test('only recognises public blob urls', () => {
  assert.equal(isBlobUrl('https://abc.public.blob.vercel-storage.com/aulas/a.webp'), true)
  assert.equal(isBlobUrl('https://evil.com/abc.public.blob.vercel-storage.com'), false)
  assert.equal(isBlobUrl('data:image/png;base64,AAAA'), false)
  assert.equal(isBlobUrl('/images/a.png'), false)
  assert.equal(isBlobUrl(null), false)
})

test('keeps development files apart', () => {
  assert.equal(buildImagePath('aulas', 'webp', 'production'), 'aulas/foto.webp')
  assert.equal(buildImagePath('loja', 'jpg', 'development'), 'dev/loja/foto.jpg')
  assert.equal(buildImagePath('loja', 'jpg', undefined), 'dev/loja/foto.jpg')
})
```

`expectImage` é um auxiliar do teste que chama `parseImageBytes` e falha se o retorno tiver `error`.

- [ ] **Step 2: Confirmar a falha**

Run: `npx tsx --test lib/image-file.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 3: Implementar `lib/admin/image-file.ts`**

A checagem de tipo vem antes da de tamanho.

- [ ] **Step 4: Confirmar que passa**

Run: `npx tsx --test lib/image-file.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/admin/image-file.ts lib/image-file.test.ts
git commit -m "feat: add image validation rules"
```

---

### Task 2: Fluxo de envio e armazenamento

**Files:**
- Create: `lib/admin/image-flow.ts`
- Create: `lib/admin/image-store.ts`
- Test: `lib/image-flow.test.ts`

**Interfaces:**
- Consumes: `ParsedImage`, `isBlobUrl`, `buildImagePath` (Task 1)
- Produces:
  - `type ImageStore = { upload(folder: 'aulas' | 'loja', image: ParsedImage): Promise<string>; remove(url: string): Promise<void> }`
  - `class ImageUploadError extends Error`
  - `persistWithImage<T>(store: ImageStore, input: { folder: 'aulas' | 'loja'; image: ParsedImage | null; previousUrl?: string | null; persist(newUrl: string | null): Promise<T> }): Promise<T>`
  - `removeStoredImage(store: ImageStore, url: string | null | undefined): Promise<void>`
  - `blobImageStore: ImageStore`, em `lib/admin/image-store.ts`

`image-flow.ts` não importa `@vercel/blob`, para os testes rodarem sem credenciais.

- [ ] **Step 1: Escrever os testes**

Use um `ImageStore` falso que registra as chamadas em `uploads` e `removed`.

```ts
const BLOB = 'https://a.public.blob.vercel-storage.com/aulas/antiga.webp'

test('saves without touching the store when no image is sent', async () => {
  const store = fakeStore()
  const result = await persistWithImage(store, { folder: 'aulas', image: null, previousUrl: BLOB, persist: async (url) => url })
  assert.equal(result, null)
  assert.deepEqual(store.uploads, [])
  assert.deepEqual(store.removed, [])
})

test('uploads, saves and then removes the previous blob', async () => {
  const store = fakeStore('https://a.public.blob.vercel-storage.com/aulas/nova.webp')
  const steps: string[] = []
  await persistWithImage(store, { folder: 'aulas', image, previousUrl: BLOB, persist: async () => { steps.push(`removed:${store.removed.length}`) } })
  assert.deepEqual(steps, ['removed:0'])
  assert.deepEqual(store.removed, [BLOB])
})

test('never removes a previous image stored elsewhere', async () => {
  for (const previousUrl of ['data:image/png;base64,AAAA', '/images/a.png', null]) {
    const store = fakeStore()
    await persistWithImage(store, { folder: 'aulas', image, previousUrl, persist: async () => {} })
    assert.deepEqual(store.removed, [])
  }
})

test('removes the new upload when saving fails and keeps the previous one', async () => {
  const store = fakeStore('https://a.public.blob.vercel-storage.com/aulas/nova.webp')
  const failure = new Error('db')
  await assert.rejects(
    persistWithImage(store, { folder: 'aulas', image, previousUrl: BLOB, persist: async () => { throw failure } }),
    (error) => error === failure,
  )
  assert.deepEqual(store.removed, ['https://a.public.blob.vercel-storage.com/aulas/nova.webp'])
})

test('reports a failed upload without saving', async () => {
  const store = fakeStore(); store.upload = async () => { throw new Error('blob') }
  let saved = false
  await assert.rejects(
    persistWithImage(store, { folder: 'aulas', image, persist: async () => { saved = true } }),
    ImageUploadError,
  )
  assert.equal(saved, false)
})

test('a failed cleanup does not undo a successful save', async () => {
  const store = fakeStore(); store.remove = async () => { throw new Error('blob') }
  assert.equal(await persistWithImage(store, { folder: 'aulas', image, previousUrl: BLOB, persist: async () => 'ok' }), 'ok')
  await removeStoredImage(store, BLOB)
})
```

- [ ] **Step 2: Confirmar a falha**

Run: `npx tsx --test lib/image-flow.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 3: Implementar**

`image-flow.ts` registra falhas de limpeza com `console.error`. `image-store.ts` usa `put(buildImagePath(folder, image.extension, process.env.NODE_ENV), Buffer.from(image.bytes), { access: 'public', addRandomSuffix: true, cacheControlMaxAge: 31536000, contentType: image.contentType })` e `del(url)`.

- [ ] **Step 4: Verificar**

Run: `npx tsx --test lib/image-flow.test.ts` e `npx tsc --noEmit`
Expected: PASS e nenhum erro de tipo.

- [ ] **Step 5: Commit**

```bash
git add lib/admin/image-flow.ts lib/admin/image-store.ts lib/image-flow.test.ts
git commit -m "feat: store uploaded images in vercel blob"
```

---

### Task 3: Campo de foto e aulas

**Files:**
- Create: `lib/admin/resize-image.ts`
- Create: `components/admin/ImageUploadField.tsx`
- Modify: `components/admin/ContentFields.tsx`, `components/admin/ContentFormModal.tsx`
- Modify: `lib/admin/actions/classes.ts`, `lib/admin/item-updates.ts`, `lib/item-updates.test.ts`
- Modify: `lib/admin/content-forms.ts`, `hardcoded/texts.ts`, `app/aulas/page.tsx`
- Delete: `components/admin/ClassCoverField.tsx`, `lib/admin/class-cover.ts`, `lib/class-cover.test.ts`

**Interfaces:**
- Consumes: Tasks 1 e 2
- Produces:
  - `resizeImageFile(file: File): Promise<File>`
  - `ImageUploadField` com as props `{ name: string; label: string; previewLabel: string; emptyLabel: string; previewAlt: string; fallbackUrl: string; initialUrl?: string }`

- [ ] **Step 1: Atualizar o teste de `parseClassUpdate`**

```ts
test('class update only contains the fields the form edits', () => {
  const result = parseClassUpdate(form({ title: ' Pole ', description: '', coverUrl: 'data:image/png;base64,AAAA' }))
  assert.deepEqual(result, { data: { title: 'Pole', description: null } })
})
```

- [ ] **Step 2: Confirmar a falha**

Run: `npx tsx --test lib/item-updates.test.ts`
Expected: FAIL, o resultado ainda contém `coverUrl`.

- [ ] **Step 3: Implementar `resizeImageFile`**

Use `createImageBitmap(file, { imageOrientation: 'from-image' })`, `fitWithin` e um canvas. Gere `image/webp` com `IMAGE_QUALITY`. Se `blob.type` não for `image/webp`, pinte o fundo de branco, redesenhe e gere `image/jpeg`. Lance erro se a imagem não abrir ou se o resultado passar de `IMAGE_UPLOAD_MAX_BYTES`. Feche o bitmap ao terminar.

- [ ] **Step 4: Implementar `ImageUploadField`**

- `<input type="file" name={name} accept="image/jpeg,image/png,image/webp">`, com as classes atuais de `ClassCoverField`.
- Ao escolher a foto, chame `setCustomValidity(TEXTS.AULAS_ADMIN_IMAGE_READING_1)`, reduza e coloque o arquivo reduzido no campo com `DataTransfer`. Limpe a validade ao terminar.
- Se a redução ou o `DataTransfer` falhar, limpe o campo e mostre `TEXTS.AULAS_ADMIN_ERROR_IMAGE_DATA_1` em `role="alert"`.
- Ignore resultados de uma seleção anterior, como `ClassCoverField` faz com `readSequence`.
- Preview com `URL.createObjectURL`, revogado na troca e ao desmontar. Sem foto nova, mostre `initialUrl || fallbackUrl`.

- [ ] **Step 5: Ligar o campo às aulas**

- `ContentFields`: use `ImageUploadField` com `name="coverFile"` e os textos e a imagem de fallback atuais de aulas.
- `ContentFormModal`: no modo de criação, adicione `disabled={pending}` ao botão de envio.
- `parseClassUpdate`: remova `coverUrl`.
- `createClassInline`: valide o título, chame `readImageField(formData, 'coverFile')` e crie o item dentro de `persistWithImage`, com `coverUrl: newUrl`.
- `updateClassInline`: se houver foto nova, leia a `coverUrl` atual para `previousUrl`. Inclua `coverUrl` em `data` somente quando `newUrl` existir.
- `deleteClassInline`: use `prisma.item.delete({ where: { id }, select: { coverUrl: true } })` e chame `removeStoredImage(blobImageStore, deleted.coverUrl)`.
- Retorne `{ success: false, error: 'imageUpload' }` para `ImageUploadError` e `{ success: false, error: 'persistence' }` para falha de gravação.

- [ ] **Step 6: Atualizar textos e página**

- `AULAS_ADMIN_ERROR_IMAGE_SIZE_1`: `'A imagem ficou grande demais. Escolha outra foto.'`
- Nova chave `ADMIN_ERROR_IMAGE_UPLOAD_1`: `'Não foi possível enviar a foto. Tente novamente.'`
- `CONTENT_FORMS.class.errors`: adicione `imageUpload: TEXTS.ADMIN_ERROR_IMAGE_UPLOAD_1`.
- `app/aulas/page.tsx`: use `aulas.map((aula, index) => ...)` e, na capa, `loading={index === 0 ? undefined : 'lazy'}` e `decoding="async"`.

- [ ] **Step 7: Verificar**

Run: `npm test`, `npx tsc --noEmit` e `npm run lint`
Expected: testes passando, sem erros de tipo e 0 erros de lint.

- [ ] **Step 8: Commit**

```bash
git add -A components/admin lib hardcoded app/aulas
git commit -m "feat: upload class covers to blob storage"
```

---

### Task 4: Fotos da loja

**Files:**
- Create: `components/admin/StorePostSubmitButton.tsx`
- Modify: `app/loja/page.tsx`, `lib/admin/actions/store-posts.ts`
- Delete: `components/admin/StorePostImageField.tsx`

**Interfaces:**
- Consumes: `ImageUploadField` (Task 3), `readImageField` (Task 1), `persistWithImage`, `removeStoredImage`, `ImageUploadError` e `blobImageStore` (Task 2)

- [ ] **Step 1: Trocar o campo no formulário**

Use `ImageUploadField` com `name="imageFile"`, os textos `STORE_IMAGE_FIELD_*` e `fallbackUrl={IMAGES.STORE_IMAGE_FIELD_PREVIEW_1}`. Em `errorMessages`, adicione `imageType: TEXTS.AULAS_ADMIN_ERROR_IMAGE_TYPE_1`, `imageSize: TEXTS.AULAS_ADMIN_ERROR_IMAGE_SIZE_1` e `imageUpload: TEXTS.ADMIN_ERROR_IMAGE_UPLOAD_1`.

- [ ] **Step 2: Bloquear envio duplicado**

`StorePostSubmitButton` é um componente cliente que usa `useFormStatus` e renderiza `ActionButton` com `type="submit"`, `size="sm"`, `className="self-start"` e `disabled={pending}`. Substitua o botão atual.

- [ ] **Step 3: Atualizar as actions**

- `createStorePost`: depois das validações atuais, chame `readImageField(formData, 'imageFile')` e faça `redirect('/loja?error=<erro>')` se houver erro. Envolva `persistFeedPostWithCategory` em `persistWithImage`, usando `imageUrl: newUrl`.
- Trate `ImageUploadError` no `catch` atual com `redirect('/loja?error=imageUpload')`.
- `deleteStorePost`: use `delete` com `select: { imageUrl: true }` e chame `removeStoredImage` antes do `revalidatePath`.

- [ ] **Step 4: Verificar**

Run: `npm test`, `npx tsc --noEmit`, `npm run lint` e `npm run build`
Expected: tudo passando e 0 erros de lint.

- [ ] **Step 5: Commit**

```bash
git add -A components/admin app/loja lib/admin/actions/store-posts.ts
git commit -m "feat: upload store photos to blob storage"
```

---

### Task 5: Verificação local completa

Use o Postgres temporário em `127.0.0.1:54329` e `npm run dev`, para que os arquivos sejam gravados em `dev/`. Não use `next start`, porque ele grava nos caminhos de produção.

- [ ] **Step 1: Subir o site com o banco local e entrar como administrador**

Expected: `/aulas` e `/loja` abrem e o administrador vê os formulários.

- [ ] **Step 2: Conferir aulas**

Crie uma aula com foto, edite só o título, troque a foto e exclua. Em cada etapa, confira a coluna `coverUrl` e a lista do Blob em `dev/`.
Expected: editar só o título mantém a capa, a foto antiga sai ao trocar, e nada resta depois de excluir.

- [ ] **Step 3: Conferir a loja e os casos de risco em 375x812 e em desktop**

Publique com foto vertical com rotação EXIF, PNG grande e foto de mais de 3 MB. Clique duas vezes em publicar. Tente enviar um `.txt` renomeado para `.jpg`.
Expected: foto em pé, arquivos reduzidos abaixo de 3 MB, uma única publicação por envio e mensagem de erro para o arquivo falso.

- [ ] **Step 4: Conferir o HTML público**

Run: `curl -s http://localhost:3000/aulas | grep -c 'data:image'` e o mesmo para `/loja`, com dados novos no banco local.
Expected: `0` e HTML abaixo de 100 KB em cada página.

- [ ] **Step 5: Limpar os arquivos de teste em `dev/` no Blob**

Expected: nenhum arquivo restante com o prefixo `dev/`.

---

### Task 6: Script de migração

> Feito em 21/11/2026 pelo plano `2026-11-21-lighthouse-loja.md`: 24 fotos migradas (7 de aulas, 17 da loja), conferidas em `denisegarcia.vercel.app`.

**Files:**
- Create fora do repositório: `migrate-images.mjs`, no scratchpad da sessão, ao lado de uma cópia de `dump-production.mjs`.

- [x] **Step 1: Implementar o script**

- Peça a URL do banco e o token do Blob sem exibir na tela. Aceite `--rehearsal` somente para `127.0.0.1` e recuse banco local sem essa opção. Aceite `--dry-run`.
- Faça o backup com `dump-production.mjs` em `C:/Users/jdott/Backups/denise-polestudio/<data>-antes-das-fotos` e cancele se ele falhar.
- Selecione `id` e valor de `Item.coverUrl` e `StorePost.imageUrl` que comecem com `data:image/`.
- Para cada foto: decodifique, aplique `sharp(input).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 })`, envie com os parâmetros da Global Constraints e baixe de volta para comparar os bytes.
- Atualize com `UPDATE ... WHERE id = $1 AND "<coluna>" = $2` e registre como conflito se nenhuma linha mudar.
- Falha em uma foto não interrompe as demais. O script termina com o total migrado, os conflitos, as falhas e o tamanho antes e depois.
- Nunca imprima a URL, o token ou o conteúdo das fotos.

- [x] **Step 2: Ensaiar em uma cópia local do backup mais recente, usando o prefixo `dev/migracao/`**

Execute simulação, execução completa, repetição e conflito forçado.
Expected: a simulação não altera nada, a execução migra todas as linhas com base64, a repetição processa 0 linhas e o conflito preserva o valor mais novo.

- [x] **Step 3: Limpar o ensaio**

Apague a cópia local, os backups do ensaio e os arquivos em `dev/migracao/`.
Expected: nenhum dado de usuário fora da pasta de backups.

---

### Task 7: Publicação

**Esta tarefa exige autorização explícita do dono do projeto antes dos Steps 1 e 3.**

- [ ] **Step 1: Publicar o código na `main` e aguardar o deploy dos dois projetos**

Expected: status `success` nos dois projetos da Vercel.

- [ ] **Step 2: O dono do projeto entra como administrador, cria uma aula de teste com foto e a exclui em seguida**

Expected: a foto abre pelo endereço `.public.blob.vercel-storage.com` e sai do Blob ao excluir a aula.

- [x] **Step 3: O dono do projeto executa a migração no próprio terminal**

Expected: todas as fotos migradas, sem falhas.

- [x] **Step 4: Conferir os dois endereços públicos**

Run: buscar `/aulas` e `/loja` em `denise-polestudio.vercel.app` e `denise-polestudio-llm1.vercel.app`.
Expected: nenhum `data:image`, HTML abaixo de 100 KB e todas as fotos com status 200.
