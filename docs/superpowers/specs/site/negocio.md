# Negócio

## Quem é

**Denise Garcia** é instrutora de pole dance e artes sensuais, mentora de autoestima feminina e
formada em Educação Física. Acompanha mulheres desde 2017. O estúdio fica na Rua Rafael Citro, 42,
Jardim Rafael, Caçapava/SP. Instagram: `@denisegarcia.polestudio`.
(Fonte: `hardcoded/texts.ts`, chaves `HOME_INTRO_*` e `SITE_FOOTER_*`.)

Lema do site: **"Liberdade através da sensualidade"**.

## Público

O texto do site fala com mulheres que querem se movimentar, se expressar e melhorar a autoestima.
A vivência "O despertar da Deusa" é "direcionada ao público feminino ou quem se identifica"
(`hardcoded/event-types.ts`). Faixa etária e perfil além disso: **a confirmar**.

## O que vende

| Oferta | Página | Como compra |
|---|---|---|
| Aulas presenciais de pole dance em Caçapava/SP | `/aulas` | WhatsApp (pergunta horários e valores) |
| Produtos físicos (pole, sensualidade, bem-estar, autocuidado, sex shop) | `/loja` | WhatsApp com o nome e o preço do produto. Aceita PIX, dinheiro, cartão e parcelamento, com envio para todo o Brasil (`LOJA_PAYMENT_FACTS_1`) |
| Produtos digitais: e-books e aulas gravadas | `/produtos-digitais` | Link externo cadastrado pelo admin (o campo se chama `hotmartUrl`) ou, sem link, WhatsApp |
| Eventos que ela leva até o cliente (chá de lingerie, reunião de amigas, performances, Pole Canto, palestras, vivência) | `/eventos` | WhatsApp |
| Agenda de eventos abertos com data | `/eventos` | WhatsApp |
| Workshops temáticos | `/workshops` | WhatsApp |

**O site não tem carrinho, pagamento nem cadastro de cliente.** Todo botão de compra abre o
WhatsApp com uma mensagem pronta (`lib/whatsapp.ts`, `buildWhatsAppUrl`). O número vem da
variável `NEXT_PUBLIC_WHATSAPP_PHONE` (ou `WHATSAPP_PHONE`). O botão flutuante verde e o rodapé
usam o número fixo de `SITE_FOOTER_WHATSAPP_URL_1`. Sem número configurado, os botões das
páginas somem ou mostram um aviso.

Preços aparecem só na loja (`StorePost.priceCents`). Preços de aulas, workshops e eventos não
estão no site: a pessoa pergunta no WhatsApp.

## Restrição de idade

A loja vende produtos adultos. Ao abrir `/loja`, aparece o aviso "Você tem 18 anos ou mais?"
(`components/site/AgeGateModal.tsx`):
- **Sim:** a resposta fica salva no navegador (`localStorage`, chave `age_gate_loja_accepted`) e
  o aviso não volta.
- **Não:** volta para a home.

É uma confirmação simples, sem verificação real de idade. Só a loja tem esse aviso.

## Quem administra

A própria Denise. Ela entra pelo site com e-mail e senha e edita direto nas páginas (ver
[admin.md](admin.md)). Se mais alguém tem acesso: **a confirmar**.

## Tom e visual

Textos em português, segunda pessoa ("você"), acolhedores e sensuais sem ser explícitos. Paleta:
vinho (`#5a1a2a`), marfim, areia e tinta (quase preto). Títulos em Playfair Display, texto em
Jost (`app/layout.tsx`, `app/globals.css`). Detalhes em [componentes.md](componentes.md).
