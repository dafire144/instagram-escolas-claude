---
name: gerar-posts-escolas
description: Usar quando o usuário pedir posts, carrosséis, artes, avisos, conteúdo informativo, calendário editorial ou uma quantidade de publicações para Aviãozinho de Papel ou Colibri.
---

# Gerar posts das escolas

Criar publicações prontas em PNG, com copy, manifesto e auditoria, usando o gerador do repositório. Preservar a identidade própria de cada escola e tratar enquadramento humano como portão absoluto.

## Duas modalidades

- **Cotidiano:** parte de uma cena real. Foto real autorizada é obrigatória; o motor legado usa uma por tela.
- **Informativo:** parte de uma dúvida ou informação útil confirmada para famílias. Usa `content_type: "informative"`, com tipografia, listas, passos, comparação ou aviso. Foto é opcional e entra somente se esclarecer o assunto. Ler `references/formato-informativo.md`.

As modalidades coexistem. Não converter um post de cotidiano em informativo só para contornar uma foto reprovada. Um informativo sem fotos dispensa a triagem do acervo; sua revisão fotográfica é registrada como não aplicável.

## Preparação obrigatória

1. Identificar escola, modalidade, formato, quantidade de publicações, tema opcional e quantidade de telas.
2. Tratar a quantidade pedida como quantidade final. Se o usuário pedir 10 carrosséis, entregar 10 carrosséis, não 10 alternativas nem 30 versões.
3. Se houver informação suficiente, seguir sem pedir um briefing adicional. No cotidiano, inferir temas a partir das fotos aprovadas e do histórico. No informativo, usar a dúvida e a fonte ou briefing confirmados. Datas, regras, canais e orientações institucionais ausentes precisam ser confirmados, nunca inventados.
4. Se a publicação usar foto, ler `references/seguranca-fotografica.md`.
5. Ler apenas a referência da escola escolhida:
   - Aviãozinho: `references/aviaozinho.md`
   - Colibri: `references/colibri.md`
6. Ler `references/copy-e-variedade.md` e `references/metodologia-copy-escolar.md`.
7. Para duas ou mais publicações, ler também `references/producao-em-lote.md`.

## Fluxo de publicação única

1. Definir tema, objetivo, número de telas, tipo de gancho e CTA.
2. No cotidiano, selecionar fotos em `inputs/<escola>/fotos/`. No informativo, definir a informação principal e a organização visual; selecionar foto somente quando útil.
3. Quando houver foto, abrir e analisar cada candidata em tamanho real.
4. Rejeitar qualquer foto com pessoa parcial no arquivo original, mesmo pequena ou desfocada ao fundo. Se aparecer corpo sem cabeça inteira, a foto inteira está reprovada.
5. Escrever a copy, executar os cinco passes editoriais e selecionar layouts distintos. Consultar `references/job-schema.md`.
6. Criar o job JSON em `jobs/`.
7. Se houver foto, definir `safe_photo_reviewed: true` somente após a análise visual pessoa por pessoa. Omitir esse campo nos informativos sem foto.
8. Renderizar:

```powershell
powershell -ExecutionPolicy Bypass -File ".claude\skills\gerar-posts-escolas\scripts\render.ps1" -Job "jobs\meu-job.json"
```

9. Abrir todos os PNGs gerados em tamanho real.
10. Corrigir e renderizar novamente se qualquer cabeça, rosto, mão principal, texto ou logotipo estiver comprometido.
11. Salvar `AUDITORIA-PESSOAS.md` na pasta de saída. Sem fotos, registrar "Não aplicável: publicação informativa sem fotografia", sem simular uma inspeção.
12. Entregar a pasta final e a legenda.

## Fluxo de safra ou quantidade X

1. Triar o acervo apenas para as publicações que usam fotos e registrar aprovadas e rejeitadas.
2. Consultar os manifestos recentes em `outputs/`.
3. Criar `PLANO-SAFRA.md` com exatamente uma linha por publicação.
4. Distribuir modalidades, pilares, cenas ou dúvidas, ganchos, CTAs e layouts. No cotidiano, variar também emoções e fotos; no informativo, variar a forma de explicar sem sacrificar clareza.
5. Para mais de 10 publicações, dividir a execução em blocos de até 10 sem alterar o total planejado.
6. Criar uma pasta de jobs dedicada e numerar os arquivos: `01-slug.json`, `02-slug.json` e assim por diante.
7. Produzir cada copy com uma tese própria. Não dividir a mesma ideia em vários carrosséis.
8. No cotidiano, repetir caminhos de fotos no array quando necessário, variando a foto dominante. No informativo, usar `photo` na tela pertinente; a ausência de foto é válida.
9. Renderizar o lote:

```powershell
powershell -ExecutionPolicy Bypass -File ".claude\skills\gerar-posts-escolas\scripts\render-batch.ps1" -JobDirectory "jobs\aviaozinho-safra-01"
```

10. Abrir todos os PNGs para conferir texto, legibilidade e logotipo. Onde houver foto, revisar pessoa por pessoa.
11. Criar `AUDITORIA-LOTE.md` com o resultado de cada publicação.
12. Entregar a quantidade exata solicitada, as legendas e o plano editorial.

## Portões absolutos

- Nunca gerar crianças por IA.
- Nunca alterar rosto, corpo ou identidade das crianças.
- Nunca usar foto fora de `inputs/` sem autorização explícita.
- Nunca aceitar uma foto cujo arquivo original já corte a cabeça de qualquer pessoa.
- Nunca cortar, cobrir ou encostar a cabeça de uma criança na borda da arte.
- Nunca aprovar apenas olhando a criança principal. Revisar todas as pessoas ao fundo.
- Nunca usar `safe_photo_reviewed: true` sem inspeção visual.
- Nunca publicar, subir ou compartilhar fotos automaticamente.
- Nunca misturar os códigos visuais das duas escolas.
- Nunca retocar o PNG final para corrigir logotipo, texto, foto ou layout. Corrigir o job ou o motor e renderizar novamente.

Se nenhuma foto passar em um post de cotidiano, parar essa peça e informar quais arquivos foram rejeitados. Não contornar o portão. Em um informativo, uma foto opcional reprovada pode ser retirada quando a informação continuar completa, registrando a decisão.

## Produção de copy

- Usar uma ideia por tela.
- Escrever para famílias em linguagem natural, calorosa e concreta.
- No cotidiano, basear a legenda na cena real. No informativo, responder à dúvida com fatos confirmados, exemplos úteis e limites claros.
- Criar cinco ganchos internamente e publicar apenas o melhor.
- Conduzir cada tela para a próxima, sem clickbait.
- Evitar promessa pedagógica sem prova, comparação entre crianças e informação sensível.
- Usar um único CTA.
- Não usar travessão.
- Nunca inventar fala de criança, depoimento, resultado, intenção ou bastidor.
- Em avisos, apresentar o que muda, para quem, quando e a ação necessária, conforme o briefing confirmado. Nunca renderizar placeholders como se fossem dados reais.
- Saúde, segurança e desenvolvimento infantil exigem fonte confiável e validação pertinente; não improvisar diagnóstico, marcos ou promessa de resultado.

## Anti-repetição

Antes de criar, consultar os `manifest.json` das últimas publicações em `outputs/`.

- No cotidiano, não repetir o mesmo layout de capa em duas publicações consecutivas. No informativo, variar composição e abordagem conforme o assunto, preservando consistência quando útil para avisos.
- Não repetir a mesma combinação de motivos em telas consecutivas.
- No cotidiano, alternar foto ampla, moldura, bloco, pergunta, colagem e composição modular.
- No informativo, alternar explicação, lista, passos, comparação e síntese conforme o assunto. Não inserir foto ou enfeite para cumprir uma rotação.
- Variar o comprimento da headline e a composição; no cotidiano, variar também emoção e posição da foto.
- Preservar cores, tipografia e voz da escola.

## Saída esperada

Cada publicação deve conter:

- PNGs 1080 x 1350;
- `copy.md`;
- `manifest.json`;
- `AUDITORIA-PESSOAS.md`;
- job JSON preservado em `jobs/`.

O script faz validação estrutural. A validação de pessoas continua visual e obrigatória quando houver foto. Sem fotos, `manifest.json` registra lista de fotos vazia e a revisão fotográfica não se aplica.

Uma safra deve conter também:

- `PLANO-SAFRA.md`;
- uma pasta de job por lote;
- `AUDITORIA-LOTE.md`;
- exatamente a quantidade de publicações solicitada.
