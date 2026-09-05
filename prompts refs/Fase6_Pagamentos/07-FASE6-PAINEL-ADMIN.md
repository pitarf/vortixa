# VORIXA, FASE 6.7: PAINEL ADMINISTRATIVO FINANCEIRO

## OBJETIVO

Criar uma visão administrativa do ciclo financeiro.

## INDICADORES

Exibir, quando os dados existirem:

- receita;
- pagamentos aprovados;
- pagamentos pendentes;
- falhas;
- estornos;
- créditos vendidos;
- créditos consumidos;
- custo estimado de IA;
- margem estimada;
- pacotes;
- promoções.

## SEGURANÇA

Somente ADMIN.

Todas as consultas devem ocorrer no backend com autorização.

Não aceitar userId/role vindos do frontend para definir permissão.

## AÇÕES CRÍTICAS

Ações como:

- alterar preço;
- desativar pacote;
- criar promoção;
- ajustar créditos;
- solicitar estorno;
- ajuste manual financeiro

devem possuir confirmação adequada, auditoria e proteção contra clique repetido.

## MOBILE

Obrigatório:

- layout responsivo;
- botões com área de toque adequada;
- cards para métricas;
- tabelas transformadas em cards/listas no mobile;
- filtros usáveis no celular;
- nenhuma função importante pode existir apenas no desktop.

## AUDITORIA

Registrar quem executou cada ação administrativa, quando e o que mudou.

Não permitir alteração silenciosa de histórico.

## TESTES

Testar RBAC, IDOR administrativo, mass assignment, duplo clique e concorrência.

Parar.
