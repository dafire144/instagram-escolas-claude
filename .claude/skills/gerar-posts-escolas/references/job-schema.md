# Esquema do job

Salvar jobs em `jobs/`. Caminhos podem ser absolutos ou relativos à raiz do repositório.

## Carrossel

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

## Estático

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
