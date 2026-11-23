# Card de compartilhamento nítido no WhatsApp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar `app/opengraph-image.jpg` por uma versão nítida, gerada por script a partir da foto original.

**Architecture:** Um script Python (Pillow) lê a foto original, desfoca o fundo, aplica um degradê só atrás do texto, enquadra rosto e nome no quadrado central e grava o JPEG no mesmo caminho. Nenhum código do site muda.

**Tech Stack:** Python 3 + Pillow 13 (já instalados), fontes Georgia e Arial do Windows (mesma linha visual do card atual).

**Spec:** `docs/superpowers/specs/2026-11-23-card-whatsapp-design.md`

## Global Constraints

- Saída: `app/opengraph-image.jpg`, 1200×630, JPEG, abaixo de 300 KB.
- Texto: "DENISE GARCIA" e "POLE DANCE · CAÇAPAVA/SP".
- Rosto da Denise e o nome dentro do quadrado central (x de 285 a 915).
- Fonte da foto: `public/images/home/home_about_denise_5776.jpg` no commit `972f178^` (2048×1365).

## Review Focus

- Miniatura quadrada: recorte central 630×630 precisa mostrar rosto e nome legíveis.
- Miniatura pequena (~100 px): o nome ainda reconhecível.
- Granulado: a parede de folhas não pode virar ruído depois da compressão.
- Peso: arquivo grande faz o WhatsApp não mostrar a imagem; tem de ficar abaixo de 300 KB.
- Cache do WhatsApp: conferir com `?v=2` no link.

---

### Task 1: Gerar o novo card

**Files:**
- Create: `scripts/og-image.py`
- Modify: `app/opengraph-image.jpg`
- Modify: `docs/superpowers/specs/site/seo.md` (como a imagem é gerada)

- [ ] **Step 1:** Extrair a foto original para a pasta de rascunho: `git show 972f178^:public/images/home/home_about_denise_5776.jpg > <scratch>/source.jpg`.
- [ ] **Step 2:** Escrever `scripts/og-image.py <source.jpg> <saida.jpg>`: recorte 1.905:1 com o rosto perto do centro, desfoque de fundo com máscara (Denise e aro nítidos), degradê escuro só na faixa do texto, nome em Georgia com espaçamento largo e subtítulo em Arial, JPEG qualidade ~88, progressivo, otimizado.
- [ ] **Step 3:** Rodar e conferir olhando: a imagem 1200×630, o recorte central 630×630 e uma redução para 120 px. Ajustar até rosto e nome ficarem nítidos nos três.
- [ ] **Step 4:** Conferir: `python -c "from PIL import Image;im=Image.open('app/opengraph-image.jpg');print(im.size)"` dá `(1200, 630)` e o arquivo tem menos de 300 KB.
- [ ] **Step 5:** Atualizar `seo.md` com uma linha sobre o script e o `?v=2`. Rodar `npm test`.
- [ ] **Step 6:** Commit.
