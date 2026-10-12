# Instagram das escolas

Repositório de produção de conteúdo para o Aviãozinho de Papel e o Colibri. Inclui identidades visuais, fontes, logos, gerador determinístico e uma skill de projeto para o Claude Code.

## Instalação automática

Este repositório público não contém fotos de crianças. Para baixar e configurar o pacote oficial:

```powershell
$arquivo = Join-Path ([System.IO.Path]::GetTempPath()) "INSTALAR-instagram-escolas.ps1"
Invoke-WebRequest "https://raw.githubusercontent.com/dafire144/instagram-escolas-claude/main/INSTALAR.ps1" -OutFile $arquivo
powershell -NoProfile -ExecutionPolicy Bypass -File $arquivo
```

O instalador:

- verifica Node.js e Google Chrome;
- baixa o ZIP oficial;
- confere o SHA-256;
- recusa sobrescrever uma pasta existente;
- extrai em `Documentos\instagram-escolas`;
- executa a configuração inicial.

## Pacote para o dono usar no Claude

O arquivo atual é [instagram-escolas-claude-v1.3.0.zip](dist/instagram-escolas-claude-v1.3.0.zip), atualizado em 12/10/2026 com o formato informativo aprovado. Ele inclui a skill, as instruções `CLAUDE.md`, os manuais, logos, fontes, o gerador e exemplos das duas escolas.

1. Extrair o ZIP em uma pasta no computador Windows.
2. Abrir o Claude Code nessa pasta, que contém `CLAUDE.md` e `package.json`.
3. Pedir ao Claude para executar a configuração inicial e criar o conteúdo desejado.

Pedido inicial pronto para usar:

```text
Leia o CLAUDE.md e a skill gerar-posts-escolas deste projeto. Execute a configuração inicial em scripts/setup.ps1. Depois gere um post informativo estático para o Colibri sobre brincadeiras em família no Dia das Crianças, usando o tema dia-das-criancas, sem fotografias. Siga a direção visual aprovada: áreas de cor, cartões variados e ilustrações de brincadeiras ligadas ao conteúdo. Entregue a arte em PNG 1080 x 1350 e a legenda. Não invente eventos, datas, horários ou regras da escola e não publique.
```

O pacote executa localmente com Claude Code, Node.js e Chrome. Anexar somente o `CLAUDE.md` a uma conversa não fornece o gerador nem os demais arquivos. A organização da skill segue a [documentação oficial do Claude Code](https://code.claude.com/docs/en/skills).

### Se o dono já tiver a versão anterior

O instalador não sobrescreve pastas existentes. Para usar o ZIP atualizado com os dados antigos:

1. Extrair o ZIP em uma pasta nova, mantendo a pasta anterior guardada.
2. Copiar as pastas locais `inputs/`, `jobs/` e `outputs/` da instalação anterior para a nova, para preservar fotos, briefings, histórico e artes.
3. Abrir o Claude Code na nova pasta e executar `scripts/setup.ps1`. Se usava a skill global opcional, executar também `scripts/install-skill.ps1` nessa nova pasta.

Personalizações no motor ou nas instruções antigas devem ser comparadas antes de transferir; não substituir os arquivos novos do pacote por versões antigas.

## O que o sistema gera

- posts estáticos em 1080 x 1350;
- carrosséis com quantidade variável de telas;
- modalidade de cotidiano, baseada em fotos reais;
- modalidade informativa, com listas, passos, comparações, explicações e avisos, com foto opcional;
- safras com qualquer quantidade de publicações;
- planejamento editorial para evitar repetição;
- legenda em Markdown;
- manifesto das fotos e layouts;
- auditoria de pessoas.

O [guia do formato informativo](docs/FORMATO-INFORMATIVO.md) explica a estrutura e a diferença entre conteúdo educativo e comunicado institucional. A informação comanda a arte; não é necessário incluir criança ou cena de atividade para produzir um informativo.

**Direção visual aprovada em 12/10/2026:** informativos também são coloridos e lúdicos, com objetos ligados ao assunto. Use `theme` (`pertences`, `recados`, `familia-escola`, `dia-das-criancas` ou `escola`) para selecionar o repertório ilustrado. O tema pode variar por tela. A demonstração inicial sóbria foi substituída pela v2 aprovada. `npm run examples:informative` gera a galeria v2 com seis publicações/16 artes, incluindo Dia das Crianças, em `outputs/informativos-v2-2026-10-12/`.

## Segurança

Fotos de crianças não fazem parte do Git. As pastas `inputs/`, `outputs/`, `raw/`, `jobs/` e `tmp/` são protegidas pelo `.gitignore`.

Ao colocar uma foto em `inputs/`, o proprietário confirma que possui autorização para usá-la. A skill nunca envia imagens para serviços externos e nunca gera crianças por IA.

Recomendação: manter qualquer remoto deste repositório como privado.

## Requisitos

- Claude Code;
- Node.js 18 ou superior;
- Google Chrome;
- Windows PowerShell para os atalhos incluídos.

## Primeira configuração

```powershell
powershell -ExecutionPolicy Bypass -File "scripts\setup.ps1"
```

Para conteúdo com fotografia, colocar as fotos autorizadas em:

```text
inputs/
├── aviaozinho/fotos/
└── colibri/fotos/
```

Informativos sem foto podem ser produzidos sem esse acervo. Quando uma foto for usada, todas as regras de autorização e enquadramento continuam valendo.

## Uso com o Claude

Abrir o Claude Code na raiz do repositório e pedir, por exemplo:

```text
Use a skill gerar-posts-escolas para criar um carrossel de 6 telas para o Aviãozinho sobre pintura com as mãos. Analise todas as pessoas nas fotos e não repita os layouts da última publicação.
```

```text
Crie um post estático para o Colibri sobre uma pequena conquista do dia. Escolha uma foto segura da pasta inputs e gere também a legenda.
```

```text
Crie 8 carrosséis para o Aviãozinho de Papel. Planeje uma safra variada a partir das fotos disponíveis, alterne os pilares editoriais e gere todas as artes e legendas.
```

```text
Quero 5 carrosséis para o Colibri para o próximo mês. Use de 5 a 7 telas, varie ganchos e CTAs e não repita a mesma foto dominante em sequência.
```

```text
Crie um carrossel informativo para o Colibri sobre como ler os recados da escola, sem fotografias. Organize a explicação em 4 telas com título direto, pontos úteis e um CTA. Não invente regras, datas ou canais da escola.
```

Para avisos reais, fornecer os dados confirmados no pedido. Orientações sobre saúde ou desenvolvimento precisam de fonte confiável e validação pertinente antes de virarem arte.

A skill está em `.claude/skills/gerar-posts-escolas/` e é carregada automaticamente quando o Claude é aberto neste projeto.

Quando uma quantidade for informada, a skill entende o número como quantidade final. Um pedido de 10 carrosséis produz 10 carrosséis, não três alternativas para cada um.

## Fluxo técnico

1. O Claude identifica a modalidade e a base do conteúdo. Se houver foto, inspeciona todas as pessoas.
2. Cria um job JSON em `jobs/`. Informativos usam `content_type: "informative"`; jobs antigos preservam o cotidiano.
3. Executa o gerador.
4. O script valida quantidade e dimensões.
5. O Claude abre todos os PNGs para conferir texto, logotipo e composição. Audita pessoas quando houver foto; sem fotos, registra revisão fotográfica não aplicável.
6. O resultado fica em `outputs/`.

Execução manual:

```powershell
powershell -ExecutionPolicy Bypass -File ".claude\skills\gerar-posts-escolas\scripts\render.ps1" -Job "jobs\meu-job.json"
```

Execução de uma pasta inteira de jobs:

```powershell
powershell -ExecutionPolicy Bypass -File ".claude\skills\gerar-posts-escolas\scripts\render-batch.ps1" -JobDirectory "jobs\aviaozinho-safra-01"
```

## Estrutura

```text
.claude/skills/gerar-posts-escolas/  Skill do Claude
assets/                              Logos e fontes
docs/                                Estrutura dos formatos
inputs/                              Fotos locais, nunca versionadas
jobs/                                Briefings técnicos locais
manuais-de-marca/                    Diretrizes e tokens
outputs/                             Artes geradas
tools/                               Motor de renderização
```

## Skill global opcional

Para disponibilizar a skill na conta local do Claude:

```powershell
powershell -ExecutionPolicy Bypass -File "scripts\install-skill.ps1"
```

Mesmo instalada globalmente, executar a skill com o Claude aberto na raiz deste repositório.

## Versão das diretrizes

Manuais Markdown e tokens v1.4, de 12/10/2026, incluem o formato informativo. Os PDFs existentes continuam como registro visual v1.3, sem regeneração nesta entrega. O Sr. Davi aprovou a direção visual v2 em 12/10/2026. As demonstrações não são comunicados vigentes nem autorização de publicação; futuros dados institucionais precisam ser confirmados.
