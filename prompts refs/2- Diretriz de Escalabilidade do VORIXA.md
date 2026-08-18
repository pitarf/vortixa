## NOVA DIRETRIZ DE PRODUTO E ARQUITETURA

Foi definida uma nova premissa estratégica para o VORIXA:

O projeto não deve ser tratado como uma aplicação temporária ou descartável.

O CONTRATANTE pretende investir em tráfego pago, aquisição de usuários e crescimento comercial, com objetivo de competir futuramente com plataformas grandes do mercado.

Portanto:

> A arquitetura deve ser preparada para escala desde o início, porém a infraestrutura inicial deve permanecer simples e economicamente eficiente.

Não devemos antecipar custos de infraestrutura de grande escala antes que exista demanda real.

---

# 1. PRINCÍPIO

Utilizar:

**Arquitetura preparada para escala + infraestrutura inicial enxuta.**

Não utilizar Kubernetes, microsserviços ou múltiplos servidores apenas por antecipação.

Porém, nenhuma decisão arquitetural inicial deve impedir futura expansão horizontal.

---

# 2. BANCO DE DADOS

PostgreSQL permanece como banco principal.

A implementação deve considerar desde o início:

- Índices adequados
- Paginação
- Queries eficientes
- Transações
- Controle de concorrência
- Migrations versionadas
- Integridade referencial
- Histórico de operações
- Auditoria
- Separação lógica adequada dos dados dos usuários

Documentar pontos que futuramente poderão utilizar:

- Read replicas
- Connection pooling
- Particionamento
- Otimização de índices

Não implementar essas estruturas antecipadamente sem necessidade.

---

# 3. JOBS DE IA

O sistema deverá ser desenhado considerando que o volume de gerações poderá crescer significativamente.

A geração de IA não pode depender de uma requisição HTTP mantida aberta até a conclusão.

Fluxo:

Usuário
→ API
→ AIJob
→ processamento assíncrono
→ provider
→ webhook
→ atualização do AIJob
→ storage
→ resultado

A arquitetura deverá permitir futuramente a introdução de uma fila dedicada, como Redis/BullMQ ou equivalente.

Inicialmente, poderá ser utilizado PostgreSQL + worker dentro do próprio ecossistema Docker, desde que a abstração permita posteriormente substituir ou complementar o mecanismo de fila.

Não acoplar a lógica de negócio diretamente ao mecanismo de fila.

---

# 4. WORKERS

O processamento pesado deverá ser separado conceitualmente do servidor HTTP.

Inicialmente:

```text
Docker Compose

app
worker
postgres
```

A quantidade de workers poderá posteriormente ser aumentada horizontalmente.

Exemplo futuro:

```text
app
worker-1
worker-2
worker-3
worker-N
postgres
storage
```

Não implementar múltiplos workers inicialmente sem necessidade real.

---

# 5. STORAGE

Arquivos de mídia não devem ser armazenados no filesystem local do container como armazenamento definitivo.

Utilizar storage S3-compatible.

Preferência inicial:

- Cloudflare R2
- ou outro S3-compatible previamente aprovado

O banco deverá armazenar metadados e referências.

A arquitetura deverá permitir posteriormente:

- CDN
- Lifecycle policies
- Expiração de arquivos temporários
- Diferentes buckets
- Armazenamento de originais
- Armazenamento de resultados

---

# 6. CDN

A arquitetura deverá ser compatível com CDN.

A aplicação não deve depender do servidor Next.js para entregar grandes arquivos de vídeo diretamente aos usuários quando houver escala significativa.

Documentar estratégia futura para:

- Assets públicos
- Imagens
- Vídeos
- Downloads
- Cache

---

# 7. RATE LIMITING

Implementar desde o início proteção contra abuso.

O sistema deverá possuir capacidade de limitar:

- Requisições por usuário
- Requisições por IP
- Gerações simultâneas
- Utilização por ferramenta
- Uploads
- Endpoints sensíveis

O rate limiting deverá ser configurável e preparado para futuramente utilizar armazenamento compartilhado quando houver múltiplas instâncias.

---

# 8. CRÉDITOS E CONCORRÊNCIA

O sistema de créditos é uma parte financeira crítica.

Nenhuma operação de crédito poderá depender apenas do frontend.

Garantir:

- Transações PostgreSQL
- Controle de concorrência
- Idempotência
- Histórico imutável
- Saldo consistente
- Proteção contra gasto simultâneo acima do saldo
- Regras claras para falha de geração
- Regras claras para cancelamento
- Regras claras para reembolso

Exemplo que deve ser impedido:

Usuário possui 100 créditos.

Cinco requisições simultâneas não podem consumir 100 créditos cada simplesmente por condição de corrida.

---

# 9. OBSERVABILIDADE

A plataforma deverá registrar informações suficientes para análise operacional e financeira.

Cada geração deverá registrar, quando disponível:

- Usuário
- Ferramenta
- Modelo
- Provider
- Job ID
- Data/hora
- Tempo de processamento
- Status
- Erro
- Créditos consumidos
- Custo estimado da API
- Arquivo de entrada
- Arquivo de saída

O sistema deverá permitir futuramente calcular:

**Custo de IA × Créditos consumidos × Receita gerada**

---

# 10. MARKETING E TRÁFEGO PAGO

Como haverá possibilidade de investimento em tráfego pago, a arquitetura da landing page e cadastro deverá estar preparada para rastreamento de aquisição.

Considerar suporte a:

- UTM Source
- UTM Medium
- UTM Campaign
- UTM Content
- UTM Term
- Referrer

Quando o usuário se cadastrar, registrar a origem de aquisição de forma adequada.

Quando ocorrer uma compra, deve ser possível relacionar:

Campanha
→ Usuário
→ Compra
→ Créditos
→ Consumo

Não implementar integração específica com todas as plataformas de anúncios agora.

A estrutura deve apenas permitir essa evolução.

---

# 11. PERFORMANCE

O frontend deverá priorizar:

- Server Components quando apropriado
- Lazy loading
- Code splitting
- Imagens otimizadas
- Evitar JavaScript desnecessário
- Paginação
- Cache quando apropriado

A landing page deverá priorizar performance e Core Web Vitals.

---

# 12. ESCALABILIDADE HORIZONTAL

Nenhum componente crítico deverá depender de estado local da instância da aplicação.

Não armazenar:

- Sessões críticas
- Jobs
- Créditos
- Arquivos definitivos
- Dados de usuários

somente no filesystem ou memória local do container.

A aplicação deverá poder futuramente executar múltiplas instâncias.

---

# 13. SEGURANÇA

Considerar crescimento de tráfego como aumento potencial de ataques e abuso.

Documentar:

- Rate limiting
- Upload seguro
- Autorização
- RBAC
- Proteção de endpoints
- Proteção de webhooks
- Gestão de secrets
- Logs
- Auditoria
- Validação de arquivos
- Limites de tamanho
- Proteção contra abuso de IA

---

# 14. CUSTO DE INFRAESTRUTURA

Não criar infraestrutura de grande escala antes da necessidade.

A primeira versão deve permanecer economicamente enxuta.

Entretanto, documentar como evoluir:

### Fase inicial
Docker + aplicação + PostgreSQL + worker + storage S3-compatible.

### Crescimento
Mais workers, CDN, cache, connection pooling e monitoramento.

### Escala maior
Múltiplas instâncias da aplicação, filas dedicadas, workers horizontais, réplicas do banco e infraestrutura distribuída.

Cada evolução deverá ocorrer baseada em métricas reais.

---

# 15. REGRA FUNDAMENTAL

O projeto deve ser:

**simples para iniciar, preparado para crescer e seguro para operar.**

Não sacrificar a qualidade arquitetural em nome de velocidade.

Também não adicionar complexidade operacional apenas por antecipação.

Toda decisão que impactar escalabilidade deverá ser registrada em:

`/docs/DECISIONS.md`