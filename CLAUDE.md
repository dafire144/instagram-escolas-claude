# Instagram das escolas

Usar a skill de projeto `gerar-posts-escolas` em toda solicitação de post, carrossel, arte, safra, calendário ou pacote de conteúdo para o Aviãozinho de Papel ou o Colibri.

## Regras firmes

- Ler a referência da escola antes de criar.
- Escolher a modalidade: cotidiano parte de foto real; informativo parte de uma dúvida ou informação confirmada e pode ser feito sem fotos.
- Em informativos, usar `content_type: "informative"` e ler `references/formato-informativo.md` da skill.
- A direção informativa colorida e temática foi aprovada em 12/10/2026. Manter áreas grandes de cor, cartões variados e objetos relacionados ao assunto, com texto legível.
- Escolher `theme` conforme o assunto: `escola`, `pertences`, `recados`, `familia-escola` ou `dia-das-criancas`. Uma tela pode sobrescrever o tema do job. Para novos assuntos, preparar repertório próprio; não aplicar objetos sem relação ou somente confetes genéricos.
- No Dia das Crianças, usar elementos de brincadeira: livro, lápis e caixa no Aviãozinho; bola, blocos e giz no Colibri. "Animado" aqui significa arte estática viva e lúdica.
- Quando houver foto, usar somente fotos em `inputs/` e inspecionar todas as pessoas em tamanho real antes e depois da renderização.
- Nunca cortar, cobrir ou encostar a cabeça de uma criança na borda.
- Nunca gerar ou alterar crianças com IA.
- Usar de 3 a 5 cores da paleta por arte.
- Variar layouts e motivos entre publicações.
- Quando o usuário pedir uma quantidade X, entregar exatamente X publicações finais.
- Em lotes, planejar temas, modalidades, ganchos, estruturas e CTAs. Cenas, emoções e fotos orientam o cotidiano; dúvidas e fontes orientam os informativos.
- Não inventar datas, regras, canais ou orientações institucionais. Saúde e desenvolvimento exigem fonte confiável e validação pertinente.
- Salvar resultados em `outputs/`.
- Nunca publicar ou enviar imagens sem pedido explícito.

Abrir `.claude/skills/gerar-posts-escolas/SKILL.md` para o fluxo completo.

## Execução neste computador

Trabalhar na pasta que contém este `CLAUDE.md`, `package.json` e `tools/`. Todos os caminhos são relativos a essa pasta; não depender de caminhos do computador de quem criou o pacote.

Na primeira utilização, executar `scripts/setup.ps1` no Windows PowerShell para verificar Node.js e Chrome e preparar as pastas. Para reproduzir os seis exemplos aprovados, incluindo Dia das Crianças, executar `npm run examples:informative`. A galeria fica em `outputs/informativos-v2-2026-10-12/GALERIA.html`.

Para um pedido novo, criar um job próprio em `jobs/` e renderizar com `node tools/generate_posts.mjs --job jobs/meu-job.json`. Entregar as artes, a legenda e os registros previstos na skill. Os JSONs em `examples/informativos/` são referências de estrutura; adaptar o conteúdo ao pedido, sem anunciar eventos ou regras que não tenham sido confirmados.

A aprovação registrada refere-se à direção visual. Ela não autoriza publicar, nem confirma dados institucionais de futuras peças.
