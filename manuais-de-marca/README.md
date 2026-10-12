# Sistema de marca para o Instagram das escolas

Este pacote transforma o material visual existente em dois sistemas de produção independentes. Cada escola possui:

- manual visual em PDF;
- manual editável em Markdown;
- `brand-tokens.json` para cores, tipografia, formatos e regras;
- pasta `assets` com logotipo, recorte do feed e prancha de fotografias reais.

## Modalidades e fotografia

- **Cotidiano:** cada publicação inclui pelo menos uma foto real das crianças da escola correspondente. A criança é o elemento principal; ilustrações, grafismos e tipografia organizam a leitura sem cobrir rosto, mãos ou atividade.
- **Informativo:** estáticos e carrosséis podem ser feitos sem fotos. A informação é o elemento principal, organizada em explicações, listas, passos, comparações ou avisos. Foto só entra quando ajuda a esclarecer e continua sujeita a todas as regras de autorização e enquadramento.

Estrutura e aplicações: [Formato informativo](../docs/FORMATO-INFORMATIVO.md).

Portão absoluto desde 23/07/2026:

- nenhuma cabeça de criança pode ser cortada, coberta ou encostada na borda;
- fotos que já chegam com a cabeça infantil cortada são rejeitadas;
- `object-fit: contain` é o padrão;
- `cover` só pode ser usado com ajuste manual e revisão pessoa por pessoa em tamanho real.

Acervo mapeado em 23/07/2026:

- Aviãozinho de Papel: 17 fotos;
- Colibri: 32 fotos.

As imagens do acervo têm autorização de uso confirmada pelo Sr. Davi em 23/07/2026. Em atividades com água, selecione enquadramentos respeitosos que valorizem experiência, interação e materiais, nunca exposição corporal.

## Linguagem infantil

- Use de 3 a 5 cores da paleta de cada escola em cada arte.
- Headlines arredondadas: Fredoka para o Aviãozinho e Baloo 2 para o Colibri.
- Nunito preserva a leitura de textos de apoio.
- Bubblegum Sans entra apenas em perguntas, bilhetes e detalhes curtos.
- Alterne estruturas, enquadramentos e motivos gráficos. Não repita a mesma combinação em telas consecutivas.
- Referências e princípios: `..\REFERENCIAS-VISUAIS-INFANTIS.md`.

## Diferença central

| Dimensão | Aviãozinho de Papel | Colibri |
|---|---|---|
| Território | imaginação, céu, papel, afeto | movimento, desenvolvimento, clareza |
| Forma | colagem leve, doodle, polaroide | blocos fortes, módulos, ondas |
| Cor condutora | azul céu + amarelo | azul profundo + laranja |
| Fotografia | criança real em cena espontânea e narrativa | criança real em atividade, movimento e interação |
| Voz | afetiva, imaginativa, próxima | segura, didática, enérgica |
| Metáfora | descoberta que ganha asas | desenvolvimento em ação |

## Método de produção

1. Escolha a modalidade, um pilar editorial e um único objetivo.
2. No cotidiano, selecione a foto real que será o elemento principal. No informativo, defina a dúvida e a resposta sustentada por fonte ou briefing confirmado.
3. Escreva um título curto e claro. Em avisos, priorize o assunto, os dados e a ação necessária.
4. Monte a peça com os tokens da escola.
5. Use uma ideia por tela e um CTA por peça.
6. Verifique autorização de imagem, ausência de informação sensível e claims pedagógicos.
7. Compare com a matriz acima. Se a peça servir para as duas escolas sem mudança, ainda está genérica.

## Status

Manuais Markdown e tokens v1.4, de 12/10/2026, incorporam a modalidade informativa. Os PDFs existentes continuam como registro visual v1.3; não foram regenerados nesta atualização. Antes de reconstruí-los, incorporar a regra informativa às fontes do gerador de manuais para não sobrescrever esta evolução.

A identidade e o formato de cotidiano foram aprovados para produção em 23/07/2026, quando o Sr. Davi confirmou a autorização de uso das imagens e as informações fornecidas. Essa confirmação não valida automaticamente novas datas, regras ou orientações. Os exemplos informativos são demonstrações para avaliação visual, sem aprovação final ou publicação presumida.
