# DIRETRIZES DE TESTES VORIXA

Este documento rege a qualidade e cobertura dos testes locais.

1. **Testes Adversariais**:
   - Todo comportamento crítico de segurança (RBAC, IDOR, Mass Assignment, Race Conditions) deve possuir testes de regressão reais no Vitest.
   - Utilizar dados no PostgreSQL real (via Prisma) em vez de simular respostas em memória com mocks genéricos.

2. **Evidência de Falso Positivo**:
   - O teste deve demonstrar qual alteração intencional de código faria a asserção quebrar (ex: aceitar um valor forjado de credits ou ignorar RBAC).

3. **Validação e Build**:
   - Todo ciclo de modificação exige a execução de `npx vitest run` e `npm run build` para comprovar que nenhuma alteração introduziu regressões no core do VORIXA.
