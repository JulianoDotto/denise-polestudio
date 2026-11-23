# Card de compartilhamento nítido no WhatsApp

## Por quê

O link do site mandado no WhatsApp mostra uma prévia com a imagem em resolução horrível.
A imagem atual (`app/opengraph-image.jpg`) tem três problemas:

- o fundo de folhas é uma textura miúda que vira granulado no JPEG e na recompressão do WhatsApp;
- a camada escura por cima tira o contraste da foto, que é preto e branco;
- na miniatura quadrada o WhatsApp corta o centro, e o rosto da Denise fica de fora (sobra "SE GARC" e as botas).

## Objetivo

Prévia nítida e bonita no WhatsApp, tanto no card grande quanto na miniatura quadrada.

Fica de fora: card diferente por página, título e descrição.
Seria um fracasso se a imagem perdesse a Denise ou ficasse genérica.

## Abordagens

1. **Refazer o mesmo card a partir da foto original** (escolhida). A foto original tem 2048×1365
   e resolução de sobra. O problema está em como o card foi montado, não na foto.
2. Card só com a marca (vinho + "DG"). Nítido em qualquer tamanho, mas perde a foto, que é o que
   chama atenção. Descartada.

## Como fica

- Fonte: a foto do aro em resolução cheia (`home_about_denise_5776.jpg`, do histórico do git).
- 1200×630, JPEG, abaixo de 300 KB. Mesmo arquivo e mesmo caminho, então o código não muda
  e a referência em `buildStudioJsonLd` continua valendo.
- Fundo de folhas suavizado (desfoque leve) para tirar o granulado. Denise e aro ficam nítidos.
- Escurecimento só onde o texto precisa, em degradê, sem lavar a foto.
- Enquadramento: rosto da Denise e o nome dentro do quadrado central de 630×630, para a miniatura.
- Texto: "DENISE GARCIA" e "POLE DANCE · CAÇAPAVA/SP", na mesma linha visual de hoje.
- Gerado por script (Python + Pillow), para dar para refazer.

## Fica com quem constrói

O desfoque, o degradê e o tamanho exato da fonte, conferidos olhando o resultado nos dois recortes
(1200×630 e o quadrado central).

## Conferir

O WhatsApp guarda a prévia em cache. Para ver a nova, mandar o link com `?v=2` no final.
