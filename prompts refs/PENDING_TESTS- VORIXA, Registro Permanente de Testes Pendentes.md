# VORIXA, PENDING TESTS

## Objetivo

Este arquivo é o registro permanente de testes, validações e verificações que ainda não puderam ser concluídos no ambiente atual ou que dependem de integrações, credenciais, produção ou fases futuras.

Este arquivo deve acompanhar o projeto durante todo o desenvolvimento.

---

# REGRAS PERMANENTES

## 1. Nunca apagar histórico

Um item não deve ser removido simplesmente porque foi analisado.

Quando um item for concluído, manter o registro histórico e alterar seu status para:

`CONCLUÍDO`

Registrar:

- data;
- fase;
- auditoria;
- evidência/relatório;
- teste executado.

## 2. Itens novos devem ser acrescentados

Sempre que durante desenvolvimento, auditoria, homologação ou integração surgir algo que não possa ser validado naquele momento, acrescentar ao arquivo.

## 3. Não marcar como concluído sem evidência

Inspeção de código não equivale automaticamente a teste.

Quando possível, registrar se foi:

- `TESTADO`
- `INSPECIONADO`
- `NÃO FOI POSSÍVEL TESTAR`

## 4. Não remover por conveniência

Nenhuma etapa pode ser considerada encerrada apenas porque o código foi implementado.

Implementação e validação são etapas diferentes.

## 5. Dependências externas

Registrar testes que dependam de:

- APIs reais;
- credenciais;
- OAuth;
- Brevo;
- fal.ai live;
- gateway de pagamento;
- domínio;
- HTTPS;
- VPS;
- Cloudflare;
- storage de produção;
- webhooks públicos;
- ambiente de produção.

## 6. Segurança

Priorizar neste arquivo qualquer teste relacionado a:

- autenticação;
- autorização;
- IDOR;
- pagamentos;
- créditos;
- concorrência;
- webhooks;
- SSRF;
- XSS;
- uploads;
- downloads;
- rate limiting;
- antifraude;
- secrets;
- exposição de dados;
- recuperação de senha;
- OAuth.

---

# MATRIZ

| ID | Área | Teste/Pendência | Motivo | Dependência | Prioridade | Status | Criado em | Validado em | Evidência |
|---|---|---|---|---|---|---|---|---|---|

---

# HISTÓRICO DE CONCLUSÕES

Quando um item pendente for concluído, manter seu registro nesta seção ou atualizar a própria linha sem apagar a informação original.

Formato:

```text
ID:
Status: CONCLUÍDO
Data:
Fase:
Auditoria:
Evidência:
Observação:
```

---

# REGRA PARA O ANTIGRAVITY

Ao final de qualquer auditoria ou fase:

1. revisar este arquivo;
2. acrescentar novos testes pendentes encontrados;
3. atualizar testes que tenham sido efetivamente concluídos;
4. preservar o histórico;
5. não remover itens sem evidência de conclusão;
6. informar no relatório quais itens foram adicionados ou concluídos.

Este arquivo é cumulativo e permanente.
