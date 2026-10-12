# Formato informativo das escolas

Versão 1.4 | 12/10/2026

O sistema passa a ter duas modalidades que convivem no feed. O formato de cotidiano mostra experiências reais da escola. O novo formato informativo organiza uma dúvida, orientação ou comunicado para que a família entenda e saiba o que fazer.

## Quando usar cada modalidade

| | Cotidiano | Informativo |
|---|---|---|
| Ponto de partida | Uma cena real | Uma dúvida ou informação confirmada |
| Elemento principal | Foto da experiência | Título, resposta, lista, passos ou aviso |
| Fotografia | Obrigatória | Opcional, quando esclarece |
| Sequência | Cena, descoberta, processo, família | Pergunta, resposta, pontos úteis, ação |
| Escrita | Observação concreta e afetiva | Direta, acolhedora e precisa |

Ambos preservam identidade, cores, fontes e dimensões de 1080 x 1350. O informativo pode dispensar fotografia e usar objetos ilustrados que ajudem a comunicar o assunto. Não precisa de uma criança como decoração, nem da narrativa de uma atividade que não aconteceu.

## Duas aplicações informativas

**Educativo:** esclarece uma questão de interesse das famílias. Deve responder à pergunta da capa, explicar o necessário e oferecer uma aplicação possível. Alegações sobre saúde, segurança ou desenvolvimento infantil precisam de fonte confiável e validação pertinente; não criar diagnósticos, marcos de idade ou promessas de resultados.

**Comunicado institucional:** transmite informação real da escola. A hierarquia é o que acontece, para quem, quando e qual ação a família precisa tomar. Datas, horários, turmas, regras, locais e canais vêm do briefing confirmado. Se faltarem dados essenciais, confirmar antes da arte final. Não colocar placeholders no PNG nem apresentar um exemplo como comunicado vigente.

## Estrutura editorial

### Carrossel

Usar normalmente 4 a 7 telas. A sequência se adapta ao assunto:

1. **Pergunta ou título:** apresentar o assunto e sua utilidade.
2. **Resposta ou contexto:** entregar a informação principal cedo.
3. **Pontos úteis:** organizar de dois a quatro pontos, passos ou exemplos por tela, quando necessário.
4. **Síntese e ação:** resumir o essencial e encerrar com um único CTA.

Os pontos úteis podem ocupar mais de uma tela. Não inflar o carrossel para atingir uma quantidade. O motor aceita de 2 a 10 telas; esse limite técnico não é uma meta editorial. Em comunicados, a resposta principal pode vir já na capa.

### Estático

Usar uma arte quando a mensagem couber com leitura confortável: título claro, uma resposta curta ou até quatro itens e a informação complementar necessária. Um aviso simples não precisa virar carrossel. O CTA pode ficar na legenda.

## Composições disponíveis

| Composição | Função |
|---|---|
| `info-cover` | Pergunta ou título com contexto curto |
| `info-explain` | Resposta ou explicação com hierarquia de leitura |
| `info-list` | Lista de dois a quatro pontos |
| `info-steps` | Até quatro etapas numeradas |
| `info-compare` | Comparação entre dois itens, sem classificar crianças |
| `info-summary` | Síntese e ação final |
| `info-notice` | Comunicado com os dados confirmados e a ação necessária |

Escolher a composição pelo conteúdo. Não usar todas em toda publicação. Foto, quando útil, é um apoio opcional na tela pertinente. Permanecem as regras de autorização e revisão de todas as pessoas, preservando cabeças, rostos e mãos relevantes.

## Como cada escola aparece

| | Aviãozinho de Papel | Colibri |
|---|---|---|
| Base visual | Papel claro, azul céu, amarelo e índigo | Creme ou branco, azul profundo e laranja |
| Títulos / corpo | Fredoka / Nunito | Baloo 2 / Nunito |
| Organização | Cartões e detalhes de papel, curvas e pequenos rabiscos | Blocos, faixas, números e formas arredondadas |
| Voz informativa | Próxima, curiosa e clara | Acolhedora, segura e objetiva |

Manter de três a cinco cores por arte, áreas de cor visíveis, formas lúdicas e cartões orgânicos, com contraste de leitura. A estética continua infantil, viva e colorida como nos posts de cotidiano; o texto conversa com adultos. Metáforas não substituem uma orientação. No Colibri, continuam vedadas as metáforas de voo, céu e asas.

### Elementos que mostram o assunto

Os objetos e as ilustrações participam da composição e ajudam a reconhecer o tema. Variar sua posição, escala e combinação entre telas, mantendo espaço para o texto.

| Tema | Repertório visual |
|---|---|
| Dia das Crianças | Bola, blocos, lápis e brincadeiras |
| Recados | Caderno, bilhete e calendário |
| Pertences | Mochila, garrafinha e etiqueta |
| Família e escola | Conversa e livro |

O tema orienta as escolhas: confetes e ornamentos genéricos repetidos não bastam. Clareza deve vir da hierarquia e do contraste, sem transformar a peça em uma página corporativa quase vazia. Aqui, "mais animado" significa uma arte estática viva e lúdica; não implica vídeo ou animação.

## Copy e legenda

- Uma ideia por tela; o corpo acrescenta informação ao título.
- Frases curtas e palavras familiares, sem slogans poéticos fixos.
- A legenda complementa a arte com contexto, fonte quando pertinente e uma ação. Pode ser breve; 80 a 150 palavras não é obrigação em informativos.
- Comparações servem para esclarecer conceitos ou opções, nunca desempenho de crianças.
- Não inventar rotinas, políticas, resultados, depoimentos ou orientações da escola.

## Produção e estado dos materiais

O gerador usa `content_type: "informative"`; jobs antigos sem esse campo mantêm o funcionamento de cotidiano. O campo opcional `theme` escolhe o repertório visual do job e pode ser sobrescrito em uma tela. Temas disponíveis: `escola` (padrão), `pertences`, `recados`, `familia-escola` e `dia-das-criancas`. Um tema novo precisa de repertório próprio antes da produção. O contrato completo está na [referência do job](../.claude/skills/gerar-posts-escolas/references/job-schema.md), e o fluxo editorial na [referência informativa da skill](../.claude/skills/gerar-posts-escolas/references/formato-informativo.md).

O feedback do Sr. Davi em 12/10/2026 substitui a direção visual da primeira demonstração: os informativos precisam de mais vida e de elementos ligados ao assunto, como no Dia das Crianças. As artes v1 não foram aprovadas como referência final. As demonstrações revisadas continuam sujeitas à avaliação visual e não representam comunicado vigente ou autorização de publicação.

Os manuais Markdown e tokens passam a v1.4. Os PDFs existentes permanecem como registro visual v1.3; não foram regenerados nesta atualização. Ao reconstruí-los futuramente, preservar estas novas regras nas fontes do gerador de manuais.
