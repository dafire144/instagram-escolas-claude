---
name: gerar-posts-escolas
description: Criar uma ou várias artes estáticas e carrosséis 1080 x 1350 para as escolas Aviãozinho de Papel e Colibri, usando fotos reais autorizadas, identidade visual infantil, copy para famílias e auditoria obrigatória de todas as pessoas. Usar quando o usuário pedir post, carrossel, arte, publicação, conteúdo de Instagram, calendário editorial, pacote de conteúdo, nova safra ou uma quantidade específica como "crie 5 carrosséis" para qualquer uma das duas escolas.
---

# Gerar posts das escolas

Criar publicações prontas em PNG, com copy, manifesto e auditoria, usando o gerador do repositório. Preservar a identidade própria de cada escola e tratar enquadramento humano como portão absoluto.

## Preparação obrigatória

1. Identificar escola, formato, quantidade de publicações, tema opcional e quantidade de telas.
2. Tratar a quantidade pedida como quantidade final. Se o usuário pedir 10 carrosséis, entregar 10 carrosséis, não 10 alternativas nem 30 versões.
3. Se escola e quantidade estiverem claras, seguir sem pedir um briefing adicional. Inferir temas a partir das fotos aprovadas, dos pilares da escola e do histórico.
4. Ler `references/seguranca-fotografica.md`.
5. Ler apenas a referência da escola escolhida:
   - Aviãozinho: `references/aviaozinho.md`
   - Colibri: `references/colibri.md`
6. Ler `references/copy-e-variedade.md` e `references/metodologia-copy-escolar.md`.
7. Para duas ou mais publicações, ler também `references/producao-em-lote.md`.

## Fluxo de publicação única

1. Definir tema, objetivo, número de telas, tipo de gancho e CTA.
2. Listar as fotos em `inputs/<escola>/fotos/`.
3. Abrir e analisar cada foto candidata em tamanho real.
4. Rejeitar qualquer foto com pessoa parcial no arquivo original, mesmo pequena ou desfocada ao fundo. Se aparecer corpo sem cabeça inteira, a foto inteira está reprovada.
5. Escrever a copy, executar os cinco passes editoriais e selecionar layouts distintos. Consultar `references/job-schema.md`.
6. Criar o job JSON em `jobs/`.
7. Definir `safe_photo_reviewed: true` somente após a análise visual pessoa por pessoa.
8. Renderizar:

```powershell
powershell -ExecutionPolicy Bypass -File ".claude\skills\gerar-posts-escolas\scripts\render.ps1" -Job "jobs\meu-job.json"
```

9. Abrir todos os PNGs gerados em tamanho real.
10. Corrigir e renderizar novamente se qualquer cabeça, rosto, mão principal, texto ou logotipo estiver comprometido.
11. Salvar `AUDITORIA-PESSOAS.md` na pasta de saída.
12. Entregar a pasta final e a legenda.

## Fluxo de safra ou quantidade X

1. Fazer uma única triagem visual de todo o acervo disponível e registrar fotos aprovadas e rejeitadas.
2. Consultar os manifestos recentes em `outputs/`.
3. Criar `PLANO-SAFRA.md` com exatamente uma linha por publicação.
4. Distribuir pilares, cenas, tipos de gancho, emoções, CTAs, fotos e layouts sem repetição consecutiva.
5. Para mais de 10 publicações, dividir a execução em blocos de até 10 sem alterar o total planejado.
6. Criar uma pasta de jobs dedicada e numerar os arquivos: `01-slug.json`, `02-slug.json` e assim por diante.
7. Produzir cada copy com uma tese própria. Não dividir a mesma ideia em vários carrosséis.
8. Repetir caminhos de fotos no array quando necessário, mas variar a foto dominante entre publicações consecutivas.
9. Renderizar o lote:

```powershell
powershell -ExecutionPolicy Bypass -File ".claude\skills\gerar-posts-escolas\scripts\render-batch.ps1" -JobDirectory "jobs\aviaozinho-safra-01"
```

10. Abrir todos os PNGs, pessoa por pessoa.
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

Se nenhuma foto passar, parar e informar quais arquivos foram rejeitados. Não contornar o portão.

## Produção de copy

- Usar uma ideia por tela.
- Escrever para famílias em linguagem natural, calorosa e concreta.
- Basear a legenda na cena real da foto.
- Criar cinco ganchos internamente e publicar apenas o melhor.
- Conduzir cada tela para a próxima, sem clickbait.
- Evitar promessa pedagógica sem prova, comparação entre crianças e informação sensível.
- Usar um único CTA.
- Não usar travessão.
- Nunca inventar fala de criança, depoimento, resultado, intenção ou bastidor.

## Anti-repetição

Antes de criar, consultar os `manifest.json` das últimas publicações em `outputs/`.

- Não repetir o mesmo layout de capa em duas publicações consecutivas.
- Não repetir a mesma combinação de motivos em telas consecutivas.
- Alternar foto ampla, moldura, bloco, pergunta, colagem e composição modular.
- Alternar emoção, comprimento da headline e posição da foto.
- Preservar cores, tipografia e voz da escola.

## Saída esperada

Cada publicação deve conter:

- PNGs 1080 x 1350;
- `copy.md`;
- `manifest.json`;
- `AUDITORIA-PESSOAS.md`;
- job JSON preservado em `jobs/`.

O script faz validação estrutural. A validação de pessoas continua sendo visual e obrigatória.

Uma safra deve conter também:

- `PLANO-SAFRA.md`;
- uma pasta de job por lote;
- `AUDITORIA-LOTE.md`;
- exatamente a quantidade de publicações solicitada.
