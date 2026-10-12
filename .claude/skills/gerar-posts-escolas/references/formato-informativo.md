# Formato informativo

Ler quando a publicação responder a uma dúvida, explicar um assunto, organizar orientações ou transmitir um comunicado. Usar `content_type: "informative"` no job. A estrutura de cotidiano permanece disponível.

## Decisão antes da copy

Definir a pergunta da família, a resposta central, a fonte ou briefing que a sustenta e a ação útil ao final. Não partir da busca de uma foto.

- **Educativo:** explicar com base verificável, sem promessas de resultado. Saúde, segurança e desenvolvimento exigem fonte confiável e validação pertinente.
- **Comunicado:** usar somente dados confirmados da escola. Organizar o que, quem, quando e ação; incluir local ou canal quando necessário e conhecido. Confirmar dados essenciais ausentes antes de renderizar. Nunca preencher com fatos inventados ou placeholders no PNG.

A validação institucional do acervo de 2026 não confirma automaticamente novas datas, regras ou orientações.

## Estrutura flexível

Carrossel: normalmente 4 a 7 telas, com título/pergunta, resposta/contexto, pontos úteis e síntese/CTA único. O motor aceita 2 a 10; não alongar a peça por obrigação. Uma resposta importante não deve ficar escondida até a última tela.

Estático: título claro, resposta curta ou até quatro itens, complemento necessário. Usar quando a mensagem couber com legibilidade. A legenda pode conter o CTA.

| Layout | Usar para |
|---|---|
| `info-cover` | Título ou pergunta e contexto breve |
| `info-explain` | Resposta com explicação |
| `info-list` | Até quatro pontos úteis |
| `info-steps` | Até quatro passos em ordem |
| `info-compare` | Exatamente dois itens comparáveis |
| `info-summary` | Síntese e ação |
| `info-notice` | Aviso com informações confirmadas |

Não comparar crianças nem empilhar texto para caber em uma única arte. Os limites técnicos estão em `job-schema.md`; procurar escrever abaixo deles.

## Design e fotografia

- Preservar paleta, fontes e motivos da escola, com três a cinco cores por peça, áreas de cor visíveis, formas lúdicas e cartões orgânicos.
- Manter a estética infantil viva dos posts de cotidiano. Texto legível, respiro e agrupamento por função convivem com objetos ilustrados expressivos que comunicam o assunto. Clareza não significa sobriedade corporativa ou uma página quase vazia.
- Aviãozinho: papel claro, azul céu/amarelo, Fredoka e Nunito; cartões, curvas e detalhes leves de papel.
- Colibri: creme/branco, azul profundo/laranja, Baloo 2 e Nunito; blocos, faixas, números e formas arredondadas. Sem metáforas de voo, céu ou asas.
- Foto é opcional. Usar apenas quando acrescentar informação, nunca como preenchimento ou obrigação.
- Se houver foto, usar `photo` na tela, ou no topo do job estático, e cumprir `seguranca-fotografica.md`. Declarar `safe_photo_reviewed: true` somente depois da inspeção real.
- Sem foto, omitir `photo` e `safe_photo_reviewed`. Registrar a auditoria fotográfica como não aplicável; o manifesto deve ter lista de fotos vazia.

## Tema visual

Escolher `theme` no job conforme o assunto; uma tela pode usar `theme` próprio. O tema define o repertório ilustrado e preserva a identidade da escola. "Mais animado" significa vivo e lúdico em uma arte estática, sem criar vídeo ou animação.

| `theme` | Objetos e associações |
|---|---|
| `escola` | Repertório escolar geral; padrão para jobs antigos sem tema |
| `pertences` | Mochila, garrafinha e etiqueta |
| `recados` | Caderno, bilhete e calendário |
| `familia-escola` | Conversa e livro |
| `dia-das-criancas` | Bola, blocos, lápis e brincadeiras |

Os elementos participam da composição e variam de escala, posição e combinação entre telas e assuntos. Não depender do mesmo confete ou ornamento genérico em toda peça. Para um tema novo, preparar repertório próprio antes de produzir; não forçar objetos sem relação só porque já estão disponíveis no motor.

O feedback de 12/10/2026 substitui a direção visual da demonstração v1. Ela não é referência aprovada; as novas artes devem expressar essa direção temática e colorida.

## Escrita

Responder de forma direta, calorosa e concreta. Evitar frases poéticas fixas, tom professoral, culpa parental e jargão. A capa informa o assunto; o corpo explica; a legenda acrescenta contexto, fonte quando pertinente e um CTA. A extensão da legenda depende da utilidade, sem mínimo artificial.

Nos cinco passes editoriais, substituir o passe "Cena" por "Clareza": a família consegue entender e usar a informação? O passe "Verdade" confere fonte, atualidade, escopo e dados institucionais. Gancho curioso não pode esconder um aviso urgente.

## Lotes e entrega

Planejar uma dúvida ou informação central por publicação, registrando sua base no plano. Alternar explicação, lista, passos, comparação ou aviso conforme a necessidade; consistência de avisos é preferível a variação forçada. Não exigir foto dominante ou emoção diferente em um lote sem fotos.

Entregar PNGs 1080 x 1350, legenda, manifesto e registro de revisão. Distinguir demonstração visual de informação institucional válida; produzir artes não autoriza publicação. Guia de apresentação do formato: `docs/FORMATO-INFORMATIVO.md`, na raiz do projeto.
