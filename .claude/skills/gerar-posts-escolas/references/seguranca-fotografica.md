# Segurança fotográfica

Aplicar sempre que houver fotografia, em qualquer modalidade. Informativos podem ser feitos sem foto; nesse caso, não exigir acervo nem `safe_photo_reviewed`, e registrar revisão fotográfica não aplicável. A modalidade de cotidiano continua exigindo foto real.

## Contrato do acervo

Considerar autorizadas apenas as fotos colocadas pelo proprietário em `inputs/<escola>/fotos/`. Não copiar essas fotos para a skill, para o Git ou para serviços externos.

## Portão pessoa por pessoa

Para cada foto candidata:

1. Abrir em tamanho real.
2. Contar todas as pessoas visíveis.
3. Verificar cada cabeça, inclusive no fundo e nas bordas.
4. Rejeitar se qualquer pessoa estiver sem a cabeça inteira no arquivo original, inclusive pessoas pequenas, desfocadas, nas bordas ou parcialmente escondidas.
5. Rejeitar se um card, texto, logotipo ou grafismo cobrir cabeça ou rosto.
6. Preservar mãos quando forem parte da atividade.
7. Em atividades com água, privilegiar experiência, interação e materiais.

## Regra técnica

Usar `object-fit: contain` como padrão. O gerador já aplica essa regra. Não trocar por `cover`.

## Auditoria final

Criar `AUDITORIA-PESSOAS.md` com uma linha por arte:

| Arte | Foto | Pessoas revisadas | Cabeças completas | Resultado |
|---|---|---:|---|---|
| slide-01 | nome-do-arquivo | 3 | sim | aprovado |

Se houver dúvida, reprovar a foto.

Uma foto já reprovada no arquivo original não pode ser “consertada” por enquadramento, máscara, recorte, desfoque ou cobertura gráfica.
