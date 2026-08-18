# VORIXA, AUDITORIA ADVERSARIAL COMPLEMENTAR DA FASE 5

A primeira auditoria adversarial da Fase 5 foi analisada.

O relatório anterior documentou 7 categorias principais e adicionou apenas os testes CT-013 até CT-016.

Porém, a auditoria original solicitava uma quantidade muito maior de cenários.

Portanto:

# NÃO CONSIDERAR A FASE 5 APROVADA AINDA.

Esta etapa é uma AUDITORIA COMPLEMENTAR obrigatória.

O objetivo é executar os cenários que ainda não possuem evidência suficiente, sem simplesmente afirmar que determinada proteção "existe no código".

---

# 1. REGRA MAIS IMPORTANTE DESTA AUDITORIA

Para cada cenário abaixo, você deverá obrigatoriamente registrar um resultado individual.

Não agrupar dezenas de testes em uma única conclusão.

Cada item deve possuir:

| ID | Cenário | Executado? | Resultado | Evidência | Teste automatizado | Correção necessária |
|---|---|---|---|---|---|---|

Os valores permitidos para "Executado?" são:

- SIM
- NÃO
- NÃO APLICÁVEL

Se for "NÃO", explicar exatamente por quê.

Se for "NÃO APLICÁVEL", explicar tecnicamente por quê.

NÃO considerar um cenário testado apenas porque você analisou o código e concluiu que existe uma proteção.

Sempre que for possível reproduzir o ataque no ambiente local, EXECUTAR o teste.

---

# 2. REGRA CONTRA FALSA COBERTURA

Não utilizar:

"30/30 testes passaram"

como justificativa para afirmar que toda a auditoria foi executada.

Os 30 testes atuais são apenas uma parte da validação.

O relatório final deverá separar:

```text
Testes existentes antes da auditoria complementar
+
Testes adversariais anteriores
+
Testes desta auditoria complementar
```

---

# 3. AMBIENTE

Todos os testes devem ocorrer somente no ambiente local/teste.

Utilizar:

```text
AI_PROVIDER_MODE=mock
```

para testes de concorrência, abuso e falhas.

NÃO executar testes de carga destrutivos.

NÃO realizar DoS real.

NÃO executar ataques contra produção.

NÃO gerar chamadas caras em massa na fal.ai.

---

# 4. CONTAGEM OBRIGATÓRIA

Antes de iniciar, criar uma lista numerada de TODOS os cenários desta auditoria.

Ao terminar, apresentar:

```text
TOTAL DE CENÁRIOS SOLICITADOS: X
EXECUTADOS: X
PASSARAM: X
FALHARAM: X
NÃO EXECUTADOS: X
NÃO APLICÁVEIS: X
```

Os números precisam fechar matematicamente:

```text
EXECUTADOS + NÃO EXECUTADOS + NÃO APLICÁVEIS
=
TOTAL DE CENÁRIOS
```

Não usar "mais de 60" ou estimativas.

---

# 5. AUTENTICAÇÃO E SESSÃO

## SEC-C01
Acessar `/api/tools/config` sem sessão.

Esperado: 401.

## SEC-C02
Acessar `/api/tools/generate` sem sessão.

Esperado: 401.

## SEC-C03
Acessar `/api/tools/upload` sem sessão.

Esperado: 401.

## SEC-C04
Acessar `/api/tools/job/[id]` sem sessão.

Esperado: 401.

## SEC-C05
Enviar cookie de sessão inválido.

## SEC-C06
Enviar sessão expirada.

## SEC-C07
Enviar sessão cujo usuário não existe mais.

## SEC-C08
Tentar manipular o cookie de sessão.

## SEC-C09
Tentar inserir `userId` manualmente no body.

## SEC-C10
Tentar inserir `ownerId` manualmente no body.

O usuário deve sempre ser derivado da sessão autenticada.

---

# 6. IDOR E PRIVACIDADE

Criar:

```text
USER_A
USER_B
```

Criar Jobs, Files e outputs pertencentes ao USER_A.

## SEC-C11
USER_B consulta Job de USER_A.

## SEC-C12
USER_B tenta acessar output de USER_A.

## SEC-C13
USER_B tenta acessar File de USER_A.

## SEC-C14
USER_B tenta baixar output de USER_A.

## SEC-C15
USER_B altera ID de Job no endpoint.

## SEC-C16
USER_B tenta enumerar IDs de Jobs.

## SEC-C17
USER_B tenta acessar Job inexistente.

## SEC-C18
USER_B tenta acessar File inexistente.

## SEC-C19
Tentar alterar `userId` do recurso.

## SEC-C20
Tentar alterar `ownerId`.

Resultado esperado em todos os casos aplicáveis:

Acesso negado sem vazamento de informações.

---

# 7. MANIPULAÇÃO FINANCEIRA

## SEC-C21
Enviar:

```json
{
  "credits": 0
}
```

## SEC-C22
Enviar:

```json
{
  "creditCost": 0
}
```

## SEC-C23
Enviar:

```json
{
  "cost": 0
}
```

## SEC-C24
Enviar valores negativos.

## SEC-C25
Enviar valores extremamente altos.

## SEC-C26
Enviar `price = 0`.

## SEC-C27
Enviar `price < 0`.

## SEC-C28
Enviar `creditCost < 0`.

## SEC-C29
Enviar `providerCostUsd = 0`.

## SEC-C30
Enviar `providerCostUsd` negativo.

## SEC-C31
Enviar `creditsCharged` manipulado.

## SEC-C32
Enviar `creditsReserved` manipulado.

## SEC-C33
Enviar `creditsRefunded` manipulado.

Todos esses valores, quando presentes no payload, devem ser ignorados ou rejeitados.

O backend deve calcular os valores financeiros.

---

# 8. MANIPULAÇÃO DO MODELO

## SEC-C34
Enviar modelo inexistente.

## SEC-C35
Enviar modelo desativado.

## SEC-C36
Enviar modelo incompatível com a ferramenta.

## SEC-C37
Enviar modelo pertencente a outra ferramenta.

## SEC-C38
Tentar usar modelo com custo zero.

## SEC-C39
Tentar usar modelo com custo negativo.

## SEC-C40
Manipular `toolId`.

## SEC-C41
Manipular `modelId` após o cálculo do frontend.

O backend deve validar novamente o catálogo.

---

# 9. MANIPULAÇÃO DE PARÂMETROS

Para cada parâmetro suportado pelas ferramentas:

## SEC-C42
Valor zero.

## SEC-C43
Valor negativo.

## SEC-C44
Valor extremamente alto.

## SEC-C45
String em campo numérico.

## SEC-C46
Boolean em campo numérico.

## SEC-C47
Array em campo escalar.

## SEC-C48
Objeto em campo escalar.

## SEC-C49
Campo desconhecido adicional.

## SEC-C50
Parâmetro incompatível com o modelo.

---

# 10. QUANTIDADE E GERAÇÕES

Se a ferramenta suportar quantidade:

## SEC-C51
`quantity = 0`.

## SEC-C52
`quantity = -1`.

## SEC-C53
Quantidade extremamente alta.

## SEC-C54
Quantidade decimal.

## SEC-C55
Verificar cálculo:

```text
custo unitário × quantidade
```

## SEC-C56
Verificar limite máximo de gerações.

---

# 11. IDEMPOTÊNCIA E REPLAY

## SEC-C57
Enviar exatamente a mesma requisição duas vezes.

## SEC-C58
Enviar a mesma requisição 10 vezes.

## SEC-C59
Enviar a mesma requisição simultaneamente.

## SEC-C60
Repetir a mesma idempotency key.

## SEC-C61
Alterar apenas campos não financeiros mantendo a mesma idempotency key.

## SEC-C62
Repetir uma requisição após timeout.

## SEC-C63
Repetir uma requisição após erro de rede.

Verificar:

- AIJob;
- débito;
- CreditTransaction;
- chamada ao provider.

---

# 12. CONCORRÊNCIA E RACE CONDITIONS

Utilizar Mock Provider.

## SEC-C64
10 gerações simultâneas.

## SEC-C65
50 gerações simultâneas, se o ambiente suportar com segurança.

## SEC-C66
100 requests simultâneos, somente se seguro para o ambiente local.

## SEC-C67
Saldo menor que a soma das operações concorrentes.

Exemplo:

```text
saldo = 100
10 operações × 80 créditos
```

Resultado:

Somente operações permitidas pelo saldo devem prosseguir.

Nunca saldo negativo.

---

# 13. DUPLA ABA E DUPLO CLIQUE

## SEC-C68
Duas abas gerando simultaneamente.

## SEC-C69
Clique repetido rapidamente.

## SEC-C70
Refresh imediatamente após clicar em gerar.

## SEC-C71
Voltar no navegador durante geração.

## SEC-C72
Sair da ferramenta e voltar.

## SEC-C73
Abrir a ferramenta em duas abas.

Não criar operações duplicadas acidentais.

---

# 14. FALHAS ENTRE ETAPAS

Simular falhas controladas.

## SEC-C74
Falha depois do débito e antes da chamada ao provider.

## SEC-C75
Falha durante chamada ao provider.

## SEC-C76
Timeout do provider.

## SEC-C77
Erro HTTP 500 do provider.

## SEC-C78
Erro HTTP 429 do provider.

## SEC-C79
Provider retorna payload inválido.

## SEC-C80
Provider retorna output vazio.

## SEC-C81
Provider conclui mas Storage falha.

## SEC-C82
Webhook chega depois de falha.

## SEC-C83
Webhook duplicado após sucesso.

## SEC-C84
Webhook fora de ordem.

Verificar integridade dos créditos e estado do Job.

---

# 15. REFUND

## SEC-C85
Falha de geração gera refund correto.

## SEC-C86
Mesmo erro processado duas vezes.

## SEC-C87
Webhook FAILED duplicado.

## SEC-C88
Refund duplicado manualmente.

Nunca devolver créditos em dobro.

---

# 16. UPLOAD, MIME E CONTEÚDO

## SEC-C89
Arquivo vazio.

## SEC-C90
Arquivo corrompido.

## SEC-C91
Extensão falsa.

## SEC-C92
MIME falso.

## SEC-C93
Conteúdo incompatível com extensão.

## SEC-C94
Arquivo acima do limite.

## SEC-C95
Arquivo exatamente no limite.

## SEC-C96
Arquivo extremamente grande, dentro de teste controlado.

## SEC-C97
Extensão executável.

## SEC-C98
Arquivo HTML.

## SEC-C99
Arquivo SVG contendo conteúdo potencialmente perigoso.

## SEC-C100
Nome de arquivo com caracteres especiais.

---

# 17. PATH TRAVERSAL

## SEC-C101
`../../.env`

## SEC-C102
`../../../arquivo`

## SEC-C103
`..\..\arquivo`

## SEC-C104
Caminho absoluto.

## SEC-C105
Tentativa de escrever fora da pasta autorizada.

Verificar fisicamente onde o arquivo foi salvo.

---

# 18. STORAGE E ISOLAMENTO

## SEC-C106
USER_B acessar arquivo de USER_A.

## SEC-C107
Alterar URL do arquivo.

## SEC-C108
Tentar acessar arquivo por ID de outro usuário.

## SEC-C109
Tentar acessar URL temporária de outro usuário.

## SEC-C110
Verificar se arquivos privados ficam realmente protegidos.

## SEC-C111
Verificar se URLs expiram quando deveriam.

---

# 19. RATE LIMITING

Testar controladamente:

## SEC-C112
Requests repetidos em `/config`.

## SEC-C113
Requests repetidos em `/job`.

## SEC-C114
Requests repetidos em `/upload`.

## SEC-C115
Requests repetidos em `/generate`.

## SEC-C116
Verificar se o rate limit realmente bloqueia.

## SEC-C117
Verificar se o limite pode ser facilmente contornado alterando headers.

Não realizar DoS.

---

# 20. POLLING

## SEC-C118
Polling rápido.

## SEC-C119
Polling excessivo.

## SEC-C120
Polling Job inexistente.

## SEC-C121
Polling Job de outro usuário.

## SEC-C122
Polling após COMPLETED.

## SEC-C123
Polling após FAILED.

Verificar se o servidor controla abuso.

---

# 21. XSS

Testar entradas controladas:

```html
<script>alert(1)</script>
```

## SEC-C124
Prompt.

## SEC-C125
Nome/metadado.

## SEC-C126
Mensagem renderizada.

## SEC-C127
Output armazenado.

Verificar XSS refletido e armazenado quando aplicável.

---

# 22. SQL INJECTION

Auditar endpoints e queries.

## SEC-C128
IDs manipulados.

## SEC-C129
Strings manipuladas.

## SEC-C130
Filtros manipulados.

## SEC-C131
Inputs usados em SQL raw.

Se não existir SQL raw, registrar explicitamente:

```text
SQL Injection via SQL raw: NÃO APLICÁVEL
Motivo: ...
```

---

# 23. SSRF

Primeiro identificar se a aplicação aceita URLs controladas pelo usuário.

Se aceitar:

## SEC-C132
localhost.

## SEC-C133
127.0.0.1.

## SEC-C134
rede interna.

## SEC-C135
metadata endpoint.

Se não aceitar URLs externas diretamente:

Registrar:

```text
SSRF: NÃO APLICÁVEL
```

com evidência.

Não adicionar uma funcionalidade apenas para realizar o teste.

---

# 24. CSRF

## SEC-C136
Testar requests de alteração de estado provenientes de origem externa.

## SEC-C137
Verificar cookies SameSite.

## SEC-C138
Verificar proteção adicional existente.

Documentar exatamente o mecanismo utilizado.

---

# 25. STATUS E OUTPUT

## SEC-C139
Enviar `status = COMPLETED`.

## SEC-C140
Enviar `status = FAILED`.

## SEC-C141
Enviar `status = PROCESSING`.

## SEC-C142
Enviar `outputUrl` manualmente.

## SEC-C143
Enviar `fileId` manualmente.

## SEC-C144
Enviar `providerJobId` manualmente.

O usuário não pode transformar uma geração falsa em uma geração concluída.

---

# 26. ENUMERAÇÃO

## SEC-C145
Enumerar Job IDs.

## SEC-C146
Enumerar File IDs.

## SEC-C147
Verificar mensagens diferentes para recursos existentes e inexistentes.

Evitar vazamento de informações.

---

# 27. LOGS E SECRETS

## SEC-C148
Buscar FAL_KEY nos logs.

## SEC-C149
Buscar DATABASE_URL nos logs.

## SEC-C150
Buscar tokens nos logs.

## SEC-C151
Buscar passwords nos logs.

## SEC-C152
Inspecionar bundle client.

## SEC-C153
Inspecionar HTML enviado ao navegador.

## SEC-C154
Buscar `NEXT_PUBLIC_FAL_KEY` ou equivalentes.

---

# 28. CONFIGURAÇÃO

## SEC-C155
Tentar alterar saldo via `/api/tools/config`.

## SEC-C156
Tentar alterar `isUnlimited`.

## SEC-C157
Tentar alterar preço.

## SEC-C158
Tentar alterar modelo.

## SEC-C159
Tentar alterar permissões.

Confirmar que config é somente leitura para usuário comum.

---

# 29. USUÁRIO UNLIMITED

## SEC-C160
Usuário unlimited com saldo zero.

## SEC-C161
Usuário unlimited com request manipulada.

## SEC-C162
Usuário unlimited tentando exceder rate limit.

## SEC-C163
Usuário unlimited tentando acessar Job de outro usuário.

Unlimited significa ausência de bloqueio por saldo, NÃO ausência de segurança.

---

# 30. REDE E ESTADO DA INTERFACE

Testar controladamente:

## SEC-C164
Rede lenta durante upload.

## SEC-C165
Rede interrompida durante upload.

## SEC-C166
Rede interrompida durante geração.

## SEC-C167
Refresh durante PENDING.

## SEC-C168
Refresh durante PROCESSING.

## SEC-C169
Refresh após COMPLETED.

## SEC-C170
Navegar para outra página durante geração.

## SEC-C171
Voltar para a ferramenta.

Não criar Job duplicado.

---

# 31. MOBILE

Validar os fluxos críticos em:

```text
360px
390px
414px
```

## SEC-C172
Upload.

## SEC-C173
Configuração.

## SEC-C174
Geração.

## SEC-C175
Loading.

## SEC-C176
Erro.

## SEC-C177
Resultado.

## SEC-C178
Download.

## SEC-C179
Duplo toque.

A interface deve continuar funcional.

---

# 32. TESTES DE REGRESSÃO

Depois de qualquer correção:

```bash
npm run test
npm run build
```

E, quando disponível:

```bash
npm run test:e2e
```

Verificar que nenhuma proteção anterior foi quebrada.

---

# 33. DOCUMENTAÇÃO OBRIGATÓRIA

Atualizar:

```text
security_audit_phase5.md
TESTING.md
walkthrough.md
```

Não apagar os resultados da primeira auditoria.

A auditoria complementar deve ser claramente identificada como:

```text
FASE 5, AUDITORIA ADVERSARIAL COMPLEMENTAR
```

---

# 34. MATRIZ FINAL

Criar no relatório uma tabela contendo TODOS os IDs:

```text
SEC-C01
SEC-C02
SEC-C03
...
SEC-C179
```

Cada um deve possuir:

```text
ID
Cenário
Executado
Resultado
Evidência
Teste automatizado
Severidade
Correção
```

Não omitir nenhum ID.

Não resumir intervalos.

Exemplo INCORRETO:

```text
SEC-C42 até SEC-C56: PASS
```

Exemplo CORRETO:

```text
SEC-C42: PASS
SEC-C43: PASS
SEC-C44: PASS
...
SEC-C56: PASS
```

---

# 35. RESULTADO MATEMÁTICO

No final apresentar:

```text
TOTAL DE CENÁRIOS: 179

EXECUTADOS: X
PASSARAM: X
FALHARAM: X
NÃO EXECUTADOS: X
NÃO APLICÁVEIS: X
```

E conferir matematicamente:

```text
EXECUTADOS + NÃO EXECUTADOS + NÃO APLICÁVEIS = 179
```

Além disso:

```text
PASSARAM + FALHARAM = EXECUTADOS
```

Se os números não fecharem, a auditoria está incompleta.

---

# 36. VULNERABILIDADES

Para cada falha encontrada:

```text
ID
Severidade
Descrição
Passo a passo
Impacto
Correção
Teste de regressão
```

Prioridade:

```text
CRÍTICA
ALTA
MÉDIA
BAIXA
INFORMATIVA
```

---

# 37. CRITÉRIO DE APROVAÇÃO

A Fase 5 NÃO poderá ser aprovada se existir:

- vulnerabilidade crítica não corrigida;
- vulnerabilidade alta não corrigida;
- IDOR;
- acesso indevido a arquivos;
- manipulação financeira;
- possibilidade de geração sem cobrança;
- cobrança duplicada;
- refund duplicado;
- geração duplicada por race condition;
- exposição de secrets;
- falha grave de autenticação;
- falha grave de autorização.

---

# 38. NÃO INVENTAR RESULTADOS

Se um cenário não puder ser executado:

NÃO marcar como PASS.

Marcar:

```text
NÃO EXECUTADO
```

e explicar a razão.

Se for tecnicamente impossível ou não existir na arquitetura:

```text
NÃO APLICÁVEL
```

com justificativa.

---

# 39. NÃO ALTERAR FUNCIONALIDADES SEM NECESSIDADE

A auditoria pode encontrar vulnerabilidades.

Quando encontrar:

1. documentar;
2. corrigir;
3. criar teste;
4. executar regressão;
5. documentar resultado.

Não realizar refatorações não relacionadas.

---

# 40. GIT

Antes e depois:

```bash
git status
git diff
git log --oneline -n 10
git remote -v
```

Não executar:

```bash
git push
```

Sem autorização explícita.

Verificar novamente se nenhum secret foi incluído.

---

# 41. NÃO INICIAR FASE 6

Mesmo que todos os 179 cenários passem:

NÃO iniciar pagamentos.

NÃO integrar VorexPay.

NÃO integrar Stripe.

NÃO integrar Mercado Pago.

NÃO integrar PagBank.

NÃO integrar Asaas.

Aguardar minha análise da auditoria.

---

# 42. CONCLUSÃO OBRIGATÓRIA

Somente ao final responder:

```text
FASE 5 AUDITORIA COMPLEMENTAR CONCLUÍDA
```

seguido do relatório completo.

Não utilizar:

```text
FASE 5 PRONTA PARA APROVAÇÃO
```

A aprovação será feita por mim após analisar a matriz completa.

O objetivo desta auditoria é obter evidência real de segurança, e não apenas uma contagem elevada de testes.

Executar agora exclusivamente esta auditoria complementar.
