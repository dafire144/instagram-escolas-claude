# Instagram das escolas

Repositório de produção de conteúdo para o Aviãozinho de Papel e o Colibri. Inclui identidades visuais, fontes, logos, gerador determinístico e uma skill de projeto para o Claude Code.

## O que o sistema gera

- posts estáticos em 1080 x 1350;
- carrosséis com quantidade variável de telas;
- safras com qualquer quantidade de publicações;
- planejamento editorial para evitar repetição;
- legenda em Markdown;
- manifesto das fotos e layouts;
- auditoria de pessoas.

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

Depois, colocar as fotos autorizadas em:

```text
inputs/
├── aviaozinho/fotos/
└── colibri/fotos/
```

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

A skill está em `.claude/skills/gerar-posts-escolas/` e é carregada automaticamente quando o Claude é aberto neste projeto.

Quando uma quantidade for informada, a skill entende o número como quantidade final. Um pedido de 10 carrosséis produz 10 carrosséis, não três alternativas para cada um.

## Fluxo técnico

1. O Claude inspeciona as fotos.
2. Cria um job JSON em `jobs/`.
3. Executa o gerador.
4. O script valida quantidade e dimensões.
5. O Claude abre todos os PNGs e audita as pessoas.
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
