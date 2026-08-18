A documentação e as decisões arquiteturais estão aprovadas.

Você está autorizado a iniciar a **Fase 1: Fundação do Projeto**.

Siga rigorosamente a documentação existente em `/docs` como fonte de verdade do projeto.

Nesta fase, implemente somente a fundação técnica necessária, incluindo:

- Estrutura inicial do Next.js com App Router e TypeScript
- React
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose
- Estrutura inicial de frontend e backend
- Configuração do ambiente de desenvolvimento
- `.env.example`
- Estrutura inicial de serviços
- Estrutura de storage preparada para Cloudflare R2
- Estrutura preparada para workers/jobs
- Configuração inicial de testes
- Migrations iniciais somente quando a estrutura estiver validada
- Scripts necessários para desenvolvimento, testes e build

Mantenha frontend e backend no mesmo ecossistema da aplicação.

Não implemente ainda:

- Ferramentas de IA
- Integração fal.ai
- VorexPay
- Sistema completo de créditos
- Landing page definitiva
- Funcionalidades comerciais adicionais

Essas funcionalidades serão implementadas nas fases correspondentes do roadmap.

### Regras importantes

1. Não altere decisões arquiteturais sem registrar a alteração em `/docs/DECISIONS.md`.
2. Não adicione dependências desnecessárias.
3. Não crie microsserviços.
4. Não introduza Redis/BullMQ nesta fase.
5. Não armazene arquivos definitivos no filesystem do container.
6. Não coloque secrets no código.
7. Não utilize valores sensíveis hardcoded.
8. Mantenha o projeto stateless.
9. Siga as regras de desenvolvimento documentadas.
10. Não avance para a próxima fase automaticamente.

### Ao finalizar a Fase 1

Não inicie a Fase 2.

Apresente um relatório contendo:

- Estrutura final de pastas
- Dependências instaladas
- Containers criados
- Configuração do Docker
- Configuração do PostgreSQL
- Configuração do Prisma
- Migrations criadas
- Variáveis de ambiente
- Scripts disponíveis
- Testes executados
- Resultado do build
- Problemas encontrados
- Decisões técnicas tomadas
- Arquivos modificados/criados
- Como executar o projeto localmente
- Checklist de validação da Fase 1

Aguarde minha autorização explícita antes de iniciar a Fase 2.