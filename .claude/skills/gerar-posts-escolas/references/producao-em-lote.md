# Produção em lote

Usar quando o usuário pedir duas ou mais publicações, uma safra, um calendário ou uma quantidade X.

## Regra da quantidade

Entregar exatamente a quantidade solicitada.

- `Crie 5 carrosséis` significa 5 carrosséis finais.
- Não criar três opções por carrossel.
- Criar cinco ganchos internamente e publicar somente o melhor de cada peça.
- Se a quantidade não estiver clara, pedir apenas esse número.
- Para mais de 10 publicações, criar um plano mestre e executar em blocos de até 10 jobs. Continuar até completar o total, sem reduzir a quantidade.

## Planejamento da safra

Criar `PLANO-SAFRA.md` antes dos jobs:

| Nº | Tema | Cena real | Pilar | Gancho | Emoção | CTA | Foto dominante | Layout de capa |
|---:|---|---|---|---|---|---|---|---|
| 01 | tema | cena | pilar | tipo | emoção | CTA | arquivo | layout |

Portões da matriz:

- uma tese diferente por linha;
- nenhum tipo de gancho repetido em sequência;
- nenhuma emoção repetida mais de duas vezes;
- nenhum CTA repetido em sequência;
- nenhuma foto dominante repetida em sequência;
- não usar o mesmo título com palavras trocadas;
- dentro de cada carrossel, não repetir layout enquanto houver outro layout compatível disponível;
- alternar carrosséis de 5, 6 e 7 telas quando o briefing não fixar a quantidade;
- manter a voz e os territórios da escola.

## Seleção de fotos

1. Abrir todas as candidatas uma única vez.
2. Criar uma lista de aprovadas e rejeitadas com motivo.
3. Usar somente aprovadas nos jobs.
4. Repetir o caminho da mesma foto em telas diferentes quando necessário.
5. Se o acervo for pequeno, variar enquadramento contido, posição, cor, texto e função da tela.
6. Nunca usar repetição para contornar uma foto insegura.

O número de fotos não limita o número de carrosséis. Ele limita a variedade fotográfica. Informar isso na entrega quando houver reutilização intensa.

## Estrutura de arquivos

Exemplo para cinco carrosséis:

```text
jobs/
└── aviaozinho-safra-01/
    ├── 01-cor-em-movimento.json
    ├── 02-caminhos-da-brincadeira.json
    ├── 03-escolhas-que-aparecem.json
    ├── 04-criar-juntos.json
    └── 05-convite-para-conhecer.json

outputs/
└── aviaozinho/
    └── safra-01/
        ├── 01-cor-em-movimento/
        ├── 02-caminhos-da-brincadeira/
        ├── 03-escolhas-que-aparecem/
        ├── 04-criar-juntos/
        └── 05-convite-para-conhecer/
```

Cada job precisa apontar para sua própria pasta de saída.

## Renderização

Executar:

```powershell
powershell -ExecutionPolicy Bypass -File ".claude\skills\gerar-posts-escolas\scripts\render-batch.ps1" -JobDirectory "jobs\aviaozinho-safra-01"
```

O script interrompe o lote no primeiro erro. Usar `-ContinueOnError` apenas para diagnosticar vários jobs e nunca considerar o lote aprovado enquanto houver falhas.

## Auditoria do lote

Depois da renderização:

1. Conferir se o número de pastas finais é igual ao pedido.
2. Abrir todos os PNGs em tamanho real.
3. Contar todas as pessoas em cada arte.
4. Conferir cabeça, rosto, mãos principais, texto e logotipo.
5. Comparar capas lado a lado para detectar repetição.
6. Ler apenas as headlines em sequência para detectar mesmice.
7. Criar `AUDITORIA-LOTE.md`.

Modelo:

| Nº | Publicação | PNGs | Pessoas revisadas | Copy | Variedade | Resultado |
|---:|---|---:|---:|---|---|---|
| 01 | slug | 6 | 6 | aprovada | aprovada | aprovado |

Se qualquer peça falhar, corrigir e renderizar novamente somente o job correspondente.

Nunca colar, redimensionar, normalizar ou reparar logotipo diretamente no PNG final. Se o logotipo falhar, corrigir a fonte HTML, o asset ou o job e executar o render novamente. A arte aprovada precisa ser reproduzível pelo gerador.
