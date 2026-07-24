---
name: gerar-posts-escolas
description: Criar artes estáticas e carrosséis 1080 x 1350 para as escolas Aviãozinho de Papel e Colibri, usando fotos reais autorizadas, identidade visual infantil, copy para famílias e auditoria obrigatória de todas as pessoas. Usar quando o usuário pedir post, carrossel, arte, publicação, conteúdo de Instagram, nova safra ou variação visual para qualquer uma das duas escolas.
---

# Gerar posts das escolas

Criar publicações prontas em PNG, com copy e manifesto, usando o gerador do repositório. Preservar a identidade própria de cada escola e tratar enquadramento humano como portão absoluto.

## Fluxo obrigatório

1. Identificar escola, formato, tema, objetivo e quantidade de telas.
2. Ler `references/seguranca-fotografica.md`.
3. Ler apenas a referência da escola escolhida:
   - Aviãozinho: `references/aviaozinho.md`
   - Colibri: `references/colibri.md`
4. Ler `references/copy-e-variedade.md`.
5. Listar as fotos em `inputs/<escola>/fotos/`.
6. Abrir e analisar cada foto candidata em tamanho real.
7. Rejeitar qualquer foto com pessoa parcial no arquivo original, mesmo pequena ou desfocada ao fundo. Se aparecer corpo sem cabeça inteira, a foto inteira está reprovada.
8. Escrever a copy e selecionar layouts distintos. Consultar `references/job-schema.md`.
9. Criar o job JSON em `jobs/`.
10. Definir `safe_photo_reviewed: true` somente após a análise visual pessoa por pessoa.
11. Renderizar:

```powershell
powershell -ExecutionPolicy Bypass -File ".claude\skills\gerar-posts-escolas\scripts\render.ps1" -Job "jobs\meu-job.json"
```

12. Abrir todos os PNGs gerados em tamanho real.
13. Corrigir e renderizar novamente se qualquer cabeça, rosto, mão principal, texto ou logotipo estiver comprometido.
14. Salvar `AUDITORIA-PESSOAS.md` na pasta de saída.
15. Entregar a pasta final e a legenda.

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

Se nenhuma foto passar, parar e informar quais arquivos foram rejeitados. Não contornar o portão.

## Produção de copy

- Usar uma ideia por tela.
- Escrever para famílias em linguagem natural, calorosa e concreta.
- Basear a legenda na cena real da foto.
- Evitar promessa pedagógica sem prova, comparação entre crianças e informação sensível.
- Usar um único CTA.
- Não usar travessão.

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
