# Esquema do job

Salvar jobs em `jobs/`. Caminhos podem ser absolutos ou relativos à raiz do repositório. Fotos devem estar em `inputs/`.

Jobs sem `content_type` usam o modo legado de cotidiano. Informativos usam `content_type: "informative"`; não misturar os layouts das duas modalidades no mesmo job.

## Cotidiano: carrossel

```json
{
  "school": "aviaozinho",
  "format": "carousel",
  "slug": "pintura-com-as-maos",
  "output": "outputs/aviaozinho/pintura-com-as-maos",
  "safe_photo_reviewed": true,
  "photos": [
    "inputs/aviaozinho/fotos/foto-01.jpg",
    "inputs/aviaozinho/fotos/foto-02.jpg"
  ],
  "slides": [
    {
      "layout": "cover",
      "title": "A COR COMEÇA NAS MÃOS",
      "body": "Antes do desenho, existe o toque."
    },
    {
      "layout": "cta",
      "title": "CADA ESCOLHA DEIXA UMA MARCA.",
      "body": "Salve para criar em família."
    }
  ],
  "caption": "Legenda completa."
}
```

Fornecer uma foto por tela. Repetir uma foto somente quando houver justificativa visual.

## Cotidiano: estático

```json
{
  "school": "colibri",
  "format": "static",
  "slug": "conquista-do-dia",
  "output": "outputs/colibri/conquista-do-dia",
  "safe_photo_reviewed": true,
  "photo": "inputs/colibri/fotos/foto-01.jpg",
  "layout": "poster",
  "title": "CONSEGUIR COMEÇA TENTANDO.",
  "body": "Um gesto de cada vez.",
  "caption": "Legenda completa."
}
```

Para estáticos, usar `poster` ou um dos layouts da escola.

## Informativo: carrossel sem fotos

Exemplo demonstrativo de leitura de recados, sem anunciar regras ou eventos de uma escola:

```json
{
  "content_type": "informative",
  "theme": "recados",
  "school": "colibri",
  "format": "carousel",
  "slug": "como-ler-um-recado",
  "output": "outputs/colibri/como-ler-um-recado",
  "caption": "Ao ler um recado, confira a informação principal e a ação solicitada. Se faltar um dado, confirme com a escola antes de se organizar. Salve este lembrete.",
  "slides": [
    {
      "layout": "info-cover",
      "eyebrow": "PARA AS FAMÍLIAS",
      "title": "Chegou um recado da escola?",
      "body": "Veja como encontrar a informação de que você precisa."
    },
    {
      "layout": "info-explain",
      "title": "Comece pelo assunto",
      "body": "Leia o recado completo e identifique o que está sendo comunicado. Depois, confira a quem a mensagem se destina."
    },
    {
      "layout": "info-list",
      "title": "Confira os detalhes",
      "body": "Procure os dados que aparecem na mensagem.",
      "items": [
        { "title": "Data e horário", "body": "Veja quando a informação se aplica." },
        { "title": "Próximo passo", "body": "Confira se há alguma ação solicitada à família." }
      ]
    },
    {
      "layout": "info-summary",
      "title": "Faltou uma informação?",
      "body": "Confirme com a escola antes de concluir por conta própria.",
      "note": "Salve para consultar quando chegar um novo recado."
    }
  ]
}
```

Não incluir `photos`, `photo` ou `safe_photo_reviewed` quando não houver fotografia. O manifesto terá lista de fotos vazia e a auditoria fotográfica será não aplicável.

## Informativo: campos e layouts

- Raiz: `content_type`, `school` (`aviaozinho` ou `colibri`), `format` (`carousel` ou `static`), `slug`, `output`, `caption`.
- Tema visual opcional: `theme` na raiz, com `escola` (padrão), `pertences`, `recados`, `familia-escola` ou `dia-das-criancas`. Define os objetos ilustrados do assunto, sem alterar a paleta da escola. Jobs antigos sem esse campo usam `escola`.
- Carrossel: `slides`, com 2 a 10 telas. A recomendação editorial é de 4 a 7 quando o assunto justificar.
- Estático: uma tela. Seus campos podem estar no topo do job ou em `slides` com um único item.
- Tela: `layout`, `eyebrow`, `title`, `body`; `items`, `note` e `photo` conforme a composição. `slide.theme` pode sobrescrever o tema do job nessa tela, usando os mesmos valores permitidos.
- Item: `{ "title": "...", "body": "..." }`; o corpo do item é opcional. No máximo quatro itens; `info-compare` exige exatamente dois.
- Foto opcional: `slide.photo` no carrossel ou `photo` no estático. Somente se houver foto, declarar `safe_photo_reviewed: true` na raiz após a inspeção real de todas as pessoas.

Layouts: `info-cover`, `info-explain`, `info-list`, `info-steps`, `info-compare`, `info-summary`, `info-notice`.

Escolher o tema pela informação: `dia-das-criancas` usa repertório de brinquedos e brincadeiras; `recados`, caderno, bilhete e calendário. Consultar `formato-informativo.md`. Assuntos novos exigem repertório próprio antes da produção, em vez de objetos disponíveis sem relação com o tema.

Limites técnicos de caracteres, incluindo espaços:

| Campo | Limite |
|---|---:|
| `title` | 90 |
| `eyebrow` | 40 |
| `note` | 160 |
| Título / corpo de item comum | 70 / 130 |
| Título / corpo de item em comparação | 60 / 220 |

| `body` da tela | Limite |
|---|---:|
| `info-cover` | 180 |
| `info-explain` | 420 |
| `info-list` | 140 |
| `info-steps` | 130 |
| `info-compare` | 120 |
| `info-summary` | 220 |
| `info-notice` | 180 |

Esses tetos não são metas de copy. O motor também verifica o espaço real do texto e recusa transbordamento. Se falhar, simplificar a mensagem ou redistribuir o conteúdo; não encobrir nem cortar o texto.

Executar diretamente:

```powershell
node tools/generate_posts.mjs --job jobs/meu-informativo.json
```

Regras editoriais e de fontes: `formato-informativo.md`.

## Lotes

Para duas ou mais publicações:

- criar uma pasta dedicada dentro de `jobs/`;
- usar um job completo por publicação;
- numerar os arquivos para preservar a ordem editorial;
- apontar cada job para uma pasta de saída exclusiva;
- executar `scripts/render-batch.ps1`;
- consultar `producao-em-lote.md`.
