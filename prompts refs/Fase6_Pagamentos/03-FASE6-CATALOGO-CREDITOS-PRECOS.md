# VORIXA, FASE 6.3: CATÁLOGO, CRÉDITOS, PREÇOS E MARGEM

## OBJETIVO

Estruturar o catálogo comercial sem misturar preço do cliente com custo de IA.

## CADA PACOTE DEVE PERMITIR

- nome;
- créditos;
- preço;
- moeda;
- ativo/inativo;
- promoção, quando existir;
- período promocional, se aplicável;
- regras administrativas necessárias.

## SEPARAÇÃO OBRIGATÓRIA

Manter conceitos separados:

CUSTO DO PROVEDOR
↓
CUSTO ESTIMADO DO MODELO
↓
CRÉDITOS CONSUMIDOS
↓
PREÇO DO PACOTE
↓
RECEITA
↓
MARGEM ESTIMADA

Não apresentar providerCostUsd como custo real cobrado pela API se ele for apenas estimado/configurado pelo VORIXA.

## ADMIN

O administrador deverá poder visualizar:

- vendas;
- créditos vendidos;
- créditos consumidos;
- custo estimado de IA;
- receita;
- margem estimada;
- pacotes ativos;
- promoções.

Não permitir que alterações administrativas retroativas modifiquem históricos financeiros.

## MOBILE

O painel financeiro deve ser funcional no celular.

Não criar tabelas impossíveis de usar em telas pequenas.

Usar cards, listas ou visualizações adaptativas.

## ENTREGA

Implementar catálogo e regras.

Criar testes.

Executar build.

Atualizar documentação.

Parar.
