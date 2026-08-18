# VORIXA, FASE 5: FERRAMENTAS DE IA

A Fase 4 foi definitivamente encerrada e aprovada.

As migrations foram validadas em banco limpo, o motor de IA foi auditado, os webhooks foram protegidos, a idempotência foi validada, os testes foram aprovados e o Git local foi configurado.

Está autorizada a execução da:

# FASE 5, FERRAMENTAS DE IA

Esta fase tem como objetivo construir as interfaces de utilização das principais ferramentas de geração de IA do VORIXA.

---

# 1. OBJETIVO DA FASE

Criar as primeiras ferramentas utilizáveis pelo usuário final:

1. Geração de Imagem
2. Image to Video / Texto para Vídeo
3. Motion Control
4. Lip Sync
5. Video Upscale

As ferramentas deverão utilizar o motor de IA criado na Fase 4.

**Não criar uma segunda arquitetura de IA.**

Não acessar diretamente a fal.ai a partir das telas.

O fluxo obrigatório é:

```text
Interface
↓
Validação
↓
AIService
↓
IAIProvider
↓
FalAIProvider
↓
fal.ai
```

---

# 2. REGRA FUNDAMENTAL

As telas são apenas uma camada de apresentação.

Não colocar regras financeiras ou de negócio diretamente nos componentes React.

O frontend NÃO é autoridade para:

- preço;
- custo;
- créditos;
- saldo;
- modelo ativo;
- permissões;
- status final do Job;
- conclusão da geração.

A fonte de verdade continua sendo o backend.

---

# 3. DESIGN SYSTEM

Toda a Fase 5 deve utilizar o Design System já existente.

Antes de criar componentes, consultar:

```text
/docs/DESIGN_SYSTEM.md
/app/globals.css
```

Não criar cores aleatórias.

Não criar uma nova paleta.

Não duplicar tokens.

Não utilizar cores hardcoded quando existir token correspondente.

A identidade visual deve seguir a logo oficial do VORIXA:

- Violeta
- Azul Elétrico
- Ciano
- Preto
- Branco

Gradientes e efeitos visuais podem ser utilizados quando fizerem sentido para a identidade, mas sem prejudicar legibilidade ou acessibilidade.

---

# 4. RESPONSIVIDADE E MOBILE FIRST

Esta é uma regra obrigatória para toda a Fase 5.

As ferramentas devem ser projetadas pensando primeiro em:

```text
Mobile
↓
Tablet
↓
Desktop
```

Não desenvolver primeiro uma interface desktop e posteriormente "encolher" para celular.

A interface mobile deve ser funcional.

Isso significa que o usuário deve conseguir realizar o fluxo inteiro utilizando somente o celular:

```text
Login
↓
Escolher ferramenta
↓
Upload
↓
Configurar
↓
Visualizar custo
↓
Gerar
↓
Acompanhar processamento
↓
Visualizar resultado
↓
Baixar/compartilhar
```

---

# 5. TOUCH E ACESSIBILIDADE

Respeitar as regras existentes do projeto:

- área de toque mínima de aproximadamente 44px;
- espaçamento adequado;
- botões claramente identificáveis;
- inputs fáceis de utilizar;
- feedback visual;
- mensagens de erro compreensíveis;
- contraste adequado;
- foco acessível;
- navegação por teclado quando aplicável.

Não colocar controles pequenos demais em telas mobile.

---

# 6. EVITAR TABELAS NO MOBILE

Não utilizar tabelas complexas nas ferramentas.

Quando uma informação for naturalmente tabular no desktop, utilizar no mobile:

- cards;
- listas;
- accordions;
- seções;
- bottom sheets;
- componentes empilhados.

Exemplo:

Em vez de:

```text
Modelo | Resolução | Duração | Créditos
```

no mobile:

```text
┌──────────────────────┐
│ Kling 3 Standard     │
│ Motion Control       │
│                      │
│ Duração: 10s         │
│ Créditos: 120        │
│                      │
│ [Selecionar]         │
└──────────────────────┘
```

---

# 7. ESTRUTURA DAS FERRAMENTAS

As páginas deverão ficar organizadas de forma consistente.

Exemplo conceitual:

```text
/dashboard/tools
/dashboard/tools/image
/dashboard/tools/video
/dashboard/tools/motion
/dashboard/tools/lipsync
/dashboard/tools/upscale
```

A estrutura final deverá respeitar a arquitetura existente do projeto.

Não criar rotas duplicadas.

---

# 8. LAYOUT PADRÃO

As ferramentas devem compartilhar uma estrutura visual consistente.

Conceito:

```text
┌─────────────────────────────────────┐
│ Header / Navegação                  │
├─────────────────────────────────────┤
│                                     │
│ Título da ferramenta                │
│ Descrição                           │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ Área principal de configuração│   │
│ │                               │   │
│ │ Upload / Prompt / Parâmetros  │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ Resumo da geração             │   │
│ │ Custo em créditos             │   │
│ │ Saldo                         │   │
│ │                               │   │
│ │ [GERAR]                       │   │
│ └───────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

No mobile, os blocos devem ser empilhados.

---

# 9. COMPONENTES REUTILIZÁVEIS

Não duplicar componentes entre ferramentas.

Criar componentes reutilizáveis quando fizer sentido:

```text
AIFileUploader
AIPromptInput
AIModelSelector
AICreditCost
AIGenerationButton
AIJobStatus
AIResultViewer
AIParameterControl
AIErrorMessage
AIEmptyState
AILoadingState
```

Os nomes finais podem seguir a convenção já existente no projeto.

---

# 10. COMPONENTE DE UPLOAD

Criar uma experiência de upload adequada para desktop e mobile.

Deve permitir:

- selecionar arquivo;
- arrastar e soltar no desktop;
- selecionar pela galeria no celular;
- visualizar preview;
- remover arquivo;
- substituir arquivo;
- validar formato;
- validar tamanho;
- mostrar progresso de upload.

Não confiar somente na validação frontend.

O backend também deve validar.

---

# 11. PREVIEW DE ARQUIVOS

Imagem:

```text
Preview visual
```

Vídeo:

```text
Thumbnail
+
Duração
+
Tamanho
```

Áudio:

```text
Player
+
Duração
+
Nome
```

Sempre que possível, evitar carregar arquivos enormes diretamente em memória no navegador.

Utilizar a estratégia de storage existente.

---

# 12. CUSTO ANTES DA GERAÇÃO

Antes do usuário clicar em gerar, mostrar:

```text
Custo estimado
```

Exemplo:

```text
Esta geração consumirá aproximadamente

120 créditos
```

Também mostrar:

```text
Seu saldo:
850 créditos
```

e:

```text
Após a geração:
730 créditos
```

Quando o cálculo depender de parâmetros:

```text
Duração
Resolução
Modelo
Quantidade
```

o custo exibido deverá ser recalculado.

---

# 13. NÃO CONFIAR NO FRONTEND PARA O CUSTO

O frontend pode apresentar uma estimativa.

Mas o backend deverá recalcular e validar o custo.

Exemplo:

```text
Frontend:
120 créditos

Backend:
125 créditos
```

O backend deverá ser a autoridade.

Nunca permitir que o usuário envie:

```text
credits = 1
```

para tentar gerar uma operação que deveria custar 120.

---

# 14. SALDO INSUFICIENTE

Se o usuário não possuir créditos suficientes:

Mostrar uma mensagem clara:

```text
Você não possui créditos suficientes para realizar esta geração.
```

Disponibilizar uma ação para:

```text
Comprar créditos
```

A rota de pagamento não será implementada nesta fase caso ainda não exista.

Nesse caso, utilizar apenas o ponto de integração previsto para a futura Fase de pagamentos.

Não criar gateway fake.

---

# 15. USUÁRIO UNLIMITED

Usuários configurados como:

```text
creditMode = UNLIMITED
```

não devem receber bloqueio de saldo.

Porém:

- custo estimado deve continuar sendo calculado;
- AIJob deve ser criado;
- consumo deve ser registrado;
- auditoria deve funcionar;
- rate limiting continua funcionando.

No frontend, apresentar uma indicação adequada de que a conta possui acesso ilimitado, sem remover informações importantes da operação.

---

# 16. BOTÃO GERAR

O botão deve possuir estados:

```text
Gerar
↓
Validando
↓
Preparando
↓
Enviando
↓
Processando
```

Enquanto a operação estiver sendo criada:

**bloquear múltiplos cliques.**

Não confiar somente nisso.

A idempotência do backend continua sendo obrigatória.

---

# 17. ESTADO DE PROCESSAMENTO

Após iniciar:

```text
AIJob
↓
PENDING
↓
PROCESSING
↓
COMPLETED
```

ou:

```text
FAILED
```

A interface deverá refletir o estado real retornado pelo backend.

Não inventar percentual de progresso se o provider não fornecer progresso real.

---

# 18. POLLING OU ATUALIZAÇÃO DO STATUS

Implementar a estratégia adequada para acompanhar o Job.

Pode utilizar:

- polling controlado;
- Server Actions;
- atualização por outra estratégia adequada.

Evitar polling agressivo.

Não fazer uma requisição a cada poucos milissegundos.

Definir intervalo razoável.

Parar o polling quando:

```text
COMPLETED
FAILED
CANCELLED
```

---

# 19. RESULTADO

Quando o Job terminar:

mostrar o resultado dentro da própria ferramenta.

Para imagem:

```text
Imagem gerada
```

Para vídeo:

```text
Player de vídeo
```

Para áudio:

```text
Player de áudio
```

Disponibilizar:

- visualizar;
- baixar;
- compartilhar quando apropriado;
- gerar novamente;
- acessar histórico quando essa funcionalidade estiver disponível.

---

# 20. DOWNLOAD

O download deverá utilizar o storage do VORIXA.

Não depender diretamente de URLs temporárias da fal.ai.

Não expor credenciais de storage.

---

# 21. ERROS

Criar estados claros para:

### Falha de validação

```text
Verifique os dados enviados.
```

### Saldo insuficiente

```text
Você não possui créditos suficientes.
```

### Falha do provedor

```text
Não foi possível concluir a geração.
```

### Timeout

```text
A geração demorou mais que o esperado.
```

Não mostrar stack trace ao usuário.

Logs técnicos permanecem no backend.

---

# 22. FERRAMENTA 1, GERAÇÃO DE IMAGEM

Criar a primeira ferramenta:

```text
Imagem
```

Objetivo:

```text
Prompt
↓
Imagem
```

Utilizar o modelo ativo cadastrado no banco.

Inicialmente, utilizar o modelo configurado para FLUX.

A ferramenta deve possuir:

- prompt;
- modelo;
- proporção;
- parâmetros suportados;
- quantidade, se suportada;
- preview das configurações;
- custo estimado;
- saldo;
- botão gerar;
- status;
- resultado.

Não implementar parâmetros que o modelo não suporte.

Consultar a configuração real do modelo no backend.

---

# 23. FERRAMENTA 2, VIDEO

Criar a ferramenta de geração de vídeo.

A arquitetura deverá permitir:

```text
Texto → Vídeo
```

e:

```text
Imagem → Vídeo
```

conforme o modelo selecionado suportar.

A interface deve se adaptar ao modelo.

Se um modelo suportar apenas determinados inputs, esconder os campos incompatíveis.

Não apresentar opções falsas.

---

# 24. FERRAMENTA 3, MOTION CONTROL

Criar:

```text
Motion Control
```

Fluxo:

```text
Imagem do personagem
+
Vídeo de referência
↓
Vídeo
```

Interface:

### Input 1

Imagem do personagem.

### Input 2

Vídeo de referência de movimento.

Mostrar previews dos dois arquivos.

Exibir:

- duração;
- formato;
- tamanho;
- validações;
- modelo;
- configurações disponíveis;
- custo estimado.

O backend deve validar tudo novamente.

---

# 25. FERRAMENTA 4, LIP SYNC

Criar:

```text
Lip Sync
```

Fluxo:

```text
Vídeo
+
Áudio
↓
Vídeo sincronizado
```

Interface:

- upload do vídeo;
- upload do áudio;
- preview;
- duração;
- modelo;
- custo estimado;
- saldo;
- gerar.

Validar compatibilidade entre os arquivos.

---

# 26. FERRAMENTA 5, VIDEO UPSCALE

Criar:

```text
Video Upscale
```

Fluxo:

```text
Vídeo
↓
Upscale
↓
Vídeo melhorado
```

Interface:

- upload;
- preview;
- escala suportada;
- modelo;
- custo;
- gerar;
- resultado.

Não mostrar opções de escala que o modelo não suporte.

---

# 27. SELEÇÃO DE MODELOS

O modelo não deve ser hardcoded na interface.

A interface deverá consultar o catálogo de modelos ativo no backend.

Conceito:

```text
AI Tool
↓
Modelos ativos
↓
AIModel
```

Se o administrador desativar um modelo futuramente:

```text
active = false
```

ele não deverá aparecer para novos usuários.

---

# 28. PARÂMETROS DINÂMICOS

Os parâmetros devem ser derivados da configuração suportada pelo modelo.

Não criar cinco telas completamente diferentes para cada versão do mesmo modelo se a arquitetura puder reutilizar componentes.

Exemplo:

```text
AIModel
↓
configuration
↓
parâmetros permitidos
↓
UI
```

Toda entrada deve ser validada no backend.

---

# 29. CUSTO DINÂMICO

A tela deve consultar o backend para calcular o custo estimado.

Exemplo:

```text
Modelo: Kling
Duração: 10 segundos

Custo estimado:
120 créditos
```

Se o usuário alterar:

```text
10s → 15s
```

o custo deverá ser atualizado.

O backend continua sendo a fonte de verdade.

---

# 30. CONFIRMAÇÃO PARA OPERAÇÕES CARAS

Quando uma operação atingir um custo configurado como alto pelo sistema, considerar uma confirmação adicional:

```text
Esta geração consumirá 800 créditos.

Deseja continuar?
```

Não criar um limite arbitrário sem documentar.

Se não houver configuração para isso nesta fase, deixar a arquitetura preparada.

---

# 31. HISTÓRICO

Nesta fase, implementar somente o necessário para o usuário consultar o Job atual.

Se já existir estrutura de histórico no dashboard:

integrar.

Se não existir:

não criar um sistema completo de histórico nesta fase.

O `AIJob` já deve continuar sendo a fonte de dados.

A implementação completa do histórico poderá ser realizada posteriormente.

---

# 32. REGENERAÇÃO

Se o usuário clicar em:

```text
Gerar novamente
```

isso deverá criar uma NOVA operação conscientemente.

Não reutilizar silenciosamente a mesma idempotency key.

O frontend deve gerar uma nova operação.

A idempotência deve proteger duplicidade da mesma operação, não impedir uma nova geração intencional.

---

# 33. CANCELAMENTO

Não criar cancelamento fake.

Somente permitir cancelamento se o provider e o backend suportarem a operação corretamente.

Se não houver cancelamento seguro:

não apresentar um botão que sugira que o Job foi realmente cancelado.

---

# 34. SEGURANÇA DE UPLOAD

Validar no backend:

- MIME type;
- extensão;
- tamanho;
- conteúdo quando necessário;
- autorização;
- ownership.

Não confiar somente em:

```text
file.type
```

enviado pelo navegador.

---

# 35. RATE LIMITING

As ferramentas devem utilizar o rate limiting já implementado.

Não criar um segundo mecanismo.

Aplicar limites adequados para:

- geração;
- upload;
- consulta de Job.

---

# 36. ACESSIBILIDADE

Todos os componentes devem possuir:

- labels;
- aria quando necessário;
- foco;
- navegação por teclado;
- feedback de erro;
- estados de loading acessíveis.

Não usar somente cor para indicar erro/sucesso.

---

# 37. PERFORMANCE

Não carregar bibliotecas desnecessárias no client.

Preferir Server Components quando não houver necessidade de interatividade.

Utilizar Client Components somente onde necessário.

Não carregar vídeos gigantes automaticamente.

Utilizar:

- thumbnails;
- lazy loading;
- previews controlados;
- object URLs quando apropriado;
- streaming/player adequado.

---

# 38. RESPONSABILIDADE FINANCEIRA

Antes de chamar qualquer geração:

```text
Autenticação
↓
Autorização
↓
Validação
↓
Modelo ativo
↓
Custo
↓
Saldo
↓
Idempotência
↓
AIService
```

Nunca:

```text
Frontend
↓
fal.ai
```

---

# 39. TESTES

Criar testes para cada ferramenta.

## Imagem

- prompt válido;
- prompt inválido;
- saldo insuficiente;
- geração;
- duplicidade;
- resultado;
- falha.

## Vídeo

- input válido;
- input incompatível;
- saldo;
- geração;
- falha.

## Motion

- imagem ausente;
- vídeo ausente;
- formato inválido;
- saldo;
- geração;
- resultado.

## Lip Sync

- vídeo;
- áudio;
- formatos;
- saldo;
- geração.

## Upscale

- vídeo;
- escala;
- saldo;
- geração.

---

# 40. TESTES MOBILE

Sempre que possível, validar visualmente:

```text
360px
390px
414px
768px
1024px
1280px+
```

Verificar:

- nenhum overflow;
- nenhum botão cortado;
- inputs utilizáveis;
- upload utilizável;
- player funcionando;
- resultado visível;
- navegação funcional.

---

# 41. TESTES DE SEGURANÇA

Validar:

- usuário não autenticado;
- usuário tentando acessar ferramenta protegida;
- usuário tentando acessar Job de outro usuário;
- manipulação de créditos;
- manipulação de modelo;
- alteração de custo;
- parâmetros inválidos;
- requests duplicados.

---

# 42. NÃO MODIFICAR O MOTOR DA FASE 4 SEM NECESSIDADE

O motor da Fase 4 foi auditado e aprovado.

Não reescrever:

```text
AIService
CreditService
IAIProvider
FalAIProvider
MockAIProvider
StorageService
```

sem necessidade.

Se for encontrada uma incompatibilidade necessária para a Fase 5:

1. documentar;
2. explicar o motivo;
3. alterar de maneira mínima;
4. criar testes de regressão;
5. atualizar documentação.

Não fazer refatorações amplas apenas por preferência.

---

# 43. NÃO IMPLEMENTAR NESTA FASE

Não implementar:

- VorexPay;
- Stripe;
- Mercado Pago;
- PagBank;
- Asaas;
- checkout;
- marketplace de modelos reais;
- assinatura;
- sistema completo de promoções;
- painel financeiro completo;
- painel administrativo completo;
- landing page definitiva;
- programa de afiliados;
- novos providers de IA.

Esses itens serão tratados em fases próprias.

---

# 44. GIT

O projeto já possui o repositório oficial:

```text
https://github.com/pitarf/vorixa.git
```

Antes de começar:

```bash
git status
```

Durante a fase:

não misturar alterações não relacionadas.

Ao concluir:

```bash
git status
git diff
```

Confirmar que:

- `.env` não foi incluído;
- secrets não foram incluídos;
- arquivos temporários não foram incluídos;
- uploads de teste não foram incluídos.

Criar um commit específico da Fase 5.

Sugestão:

```text
feat: implementacao das ferramentas de IA
```

**NÃO executar `git push` sem minha autorização explícita.**

---

# 45. DOCUMENTAÇÃO

Atualizar conforme necessário:

```text
/docs/AI_INTEGRATIONS.md
/docs/FRONTEND.md
/docs/API.md
/docs/TESTING.md
/docs/SECURITY.md
/docs/CHANGELOG.md
/docs/ROADMAP.md
```

Criar documentação adicional somente se realmente necessária.

---

# 46. CHECKLIST DE CONCLUSÃO

Antes de considerar a Fase 5 concluída:

### Arquitetura

- [ ] Todas as ferramentas usam AIService.
- [ ] Nenhuma tela acessa fal.ai diretamente.
- [ ] Nenhuma regra financeira está no frontend.

### Imagem

- [ ] Interface.
- [ ] Upload.
- [ ] Prompt.
- [ ] Modelo.
- [ ] Parâmetros.
- [ ] Custo.
- [ ] Geração.
- [ ] Resultado.

### Vídeo

- [ ] Interface.
- [ ] Inputs.
- [ ] Modelo.
- [ ] Custo.
- [ ] Geração.
- [ ] Resultado.

### Motion

- [ ] Imagem.
- [ ] Vídeo referência.
- [ ] Configurações.
- [ ] Custo.
- [ ] Geração.
- [ ] Resultado.

### Lip Sync

- [ ] Vídeo.
- [ ] Áudio.
- [ ] Custo.
- [ ] Geração.
- [ ] Resultado.

### Upscale

- [ ] Vídeo.
- [ ] Configuração.
- [ ] Custo.
- [ ] Geração.
- [ ] Resultado.

### Segurança

- [ ] Autenticação.
- [ ] Autorização.
- [ ] Ownership.
- [ ] Idempotência.
- [ ] Rate limit.
- [ ] Validação backend.

### Mobile

- [ ] 360px.
- [ ] 390px.
- [ ] 414px.
- [ ] Tablet.
- [ ] Desktop.
- [ ] Touch.
- [ ] Upload.
- [ ] Player.
- [ ] Resultado.

### Testes

- [ ] Unitários.
- [ ] Integração.
- [ ] Segurança.
- [ ] Concorrência.
- [ ] Erros.
- [ ] Build.

---

# 47. REGRA DE NÃO AVANÇO

A Fase 5 deverá ser concluída somente após:

- testes passarem;
- build passar;
- documentação atualizada;
- Git revisado;
- segurança revisada;
- mobile revisado.

Depois disso:

**NÃO iniciar automaticamente a Fase 6.**

Apresentar o relatório final e aguardar autorização explícita.

---

# 48. RELATÓRIO FINAL OBRIGATÓRIO

Ao concluir a Fase 5, apresentar:

## 1. Ferramentas implementadas

## 2. Rotas criadas

## 3. Componentes criados

## 4. Serviços utilizados

## 5. Modelos de IA utilizados

## 6. Endpoints utilizados

## 7. Fluxo de geração

## 8. Sistema de custos

## 9. Sistema de créditos

## 10. Segurança

## 11. Idempotência

## 12. Upload e Storage

## 13. Experiência Mobile

## 14. Testes

## 15. Build

## 16. Git

## 17. Documentação

## 18. Problemas encontrados

## 19. Limitações

## 20. Melhorias futuras

## 21. Conclusão

A conclusão deverá ser:

```text
FASE 5 PRONTA PARA APROVAÇÃO
```

ou:

```text
FASE 5 AINDA POSSUI PENDÊNCIAS
```

Não declarar aprovação apenas porque o build passou.

---

# 49. REGRA ABSOLUTA

O VORIXA está sendo construído para crescer e receber tráfego real.

Portanto, não priorizar velocidade de implementação em detrimento de:

- segurança;
- estabilidade;
- experiência mobile;
- integridade financeira;
- escalabilidade;
- manutenção;
- arquitetura;
- documentação.

Qualquer decisão que possa comprometer essas características deve ser documentada antes de ser aplicada.

A Fase 5 deve transformar o motor de IA validado na Fase 4 em uma experiência real de produto, mantendo toda a arquitetura e as proteções já estabelecidas.

**Iniciar agora exclusivamente a Fase 5.**