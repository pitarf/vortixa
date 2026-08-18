A documentação e as decisões arquiteturais estão aprovadas.

Você está autorizado a iniciar a **Fase 1: Fundação do Projeto**, porém antes de finalizar a fundação visual, precisamos incorporar uma nova informação importante ao projeto:

O CONTRATANTE já forneceu a **logo oficial do VORIXA**.

A identidade visual da plataforma deverá ser construída a partir dessa logo.

## 1. DESIGN SYSTEM CENTRALIZADO

O VORIXA deverá possuir um **Design System centralizado e documentado**, que será a fonte oficial de padronização visual de toda a aplicação.

Não espalhar valores de cores, fontes, espaçamentos ou outros padrões visuais diretamente pelos componentes.

Toda a aplicação deverá consumir tokens/variáveis centralizadas.

A estrutura deverá permitir alterar a identidade visual da plataforma em um único lugar e fazer com que toda a aplicação acompanhe automaticamente essa alteração.

---

## 2. PALETA DE CORES

Analise a logo oficial fornecida pelo CONTRATANTE e identifique:

- Cor primária
- Cor secundária
- Cores de destaque
- Background principal
- Background secundário
- Foreground/texto principal
- Texto secundário
- Bordas
- Estados de sucesso
- Estados de erro
- Estados de alerta
- Estados informativos
- Cores para elementos interativos
- Cores para hover/active/focus

A partir da logo, proponha uma paleta visual coerente com uma plataforma SaaS de inteligência artificial moderna, tecnológica e premium.

IMPORTANTE:

Não definir ou aplicar definitivamente uma nova paleta sem apresentar a proposta para aprovação.

Enquanto a paleta definitiva não for aprovada, utilizar uma estrutura provisória de tokens.

---

## 3. TOKENS DE DESIGN

Criar uma estrutura centralizada de Design Tokens.

No mínimo:

### Cores

```text
primary
primary-foreground

secondary
secondary-foreground

accent
accent-foreground

background
foreground

card
card-foreground

muted
muted-foreground

border
input
ring

success
warning
error
info
```

Os nomes devem ser semânticos.

Evitar nomes como:

```text
red-1
red-2
blue-main
black-dark
```

quando esses valores estiverem sendo utilizados como funções semânticas.

O objetivo é permitir, por exemplo:

```text
primary
```

ser alterado em um único local sem precisar procurar centenas de componentes.

---

## 4. TIPOGRAFIA

Centralizar também as definições de tipografia:

- Família principal
- Família secundária, se necessária
- Peso regular
- Peso médio
- Peso semibold
- Peso bold
- Tamanhos de heading
- Tamanho de texto
- Texto pequeno
- Line-height
- Letter spacing

A tipografia também deverá ser utilizada através de tokens/classes padronizadas.

---

## 5. ESPAÇAMENTOS E DIMENSÕES

Criar padrões consistentes para:

- Espaçamento
- Padding
- Margin
- Border radius
- Tamanhos de componentes
- Altura de inputs
- Botões
- Cards
- Containers
- Larguras máximas

Evitar valores arbitrários repetidos em diferentes componentes.

---

## 6. COMPONENTES

Todos os componentes reutilizáveis deverão respeitar o Design System.

Exemplos:

- Button
- Input
- Select
- Checkbox
- Switch
- Card
- Modal
- Dialog
- Dropdown
- Tooltip
- Toast
- Tabs
- Badge
- Avatar
- Table
- Pagination
- Upload
- Progress
- Skeleton

Quando uma alteração visual for solicitada posteriormente, o desenvolvedor deverá primeiro verificar se a alteração pertence ao Design System antes de criar uma exceção específica em um componente.

---

## 7. REGRA OBRIGATÓRIA PARA ALTERAÇÕES FUTURAS

Sempre que for solicitada qualquer alteração visual:

1. Verificar primeiro se o elemento utiliza um token existente.
2. Se a alteração for global, alterar o Design System.
3. Se for específica de um componente, avaliar se deve ser criado um novo token/componente.
4. Evitar valores hardcoded.
5. Não criar exceções visuais sem justificativa.
6. Atualizar a documentação quando uma nova regra visual for criada.

O objetivo é garantir consistência visual em toda a plataforma.

---

## 8. DARK MODE / LIGHT MODE

A arquitetura visual deverá ser preparada para suportar temas.

Inicialmente, implementar o tema definido para a identidade do VORIXA.

Porém, os tokens deverão permitir futuramente:

- Dark
- Light
- Temas personalizados

sem necessidade de reescrever os componentes.

---

## 9. LOGO E ASSETS

A logo oficial fornecida pelo CONTRATANTE deverá ser tratada como asset oficial da aplicação.

Criar estrutura organizada para:

- Logo principal
- Logo para fundo claro
- Logo para fundo escuro, caso necessário
- Ícone/favicon
- Open Graph image
- Outros assets oficiais

Não criar versões alternativas da logo sem aprovação.

---

## 10. DOCUMENTAÇÃO

Atualizar:

`/docs/DESIGN_SYSTEM.md`

com:

- Paleta
- Tokens
- Tipografia
- Espaçamentos
- Bordas
- Sombras
- Componentes
- Estados
- Regras de uso
- Regras para alterações futuras

Registrar também no `DECISIONS.md` a adoção do Design System centralizado como regra arquitetural do projeto.

---

# FASE 1

Após incorporar o Design System à fundação, implemente somente a fundação técnica necessária:

- Next.js
- App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Prisma
- Docker
- Docker Compose
- Estrutura inicial de frontend e backend
- Configuração do ambiente
- `.env.example`
- Estrutura inicial de serviços
- Estrutura de storage preparada para Cloudflare R2
- Estrutura preparada para workers/jobs
- Configuração inicial de testes
- Scripts de desenvolvimento, testes e build

Mantenha frontend e backend no mesmo ecossistema da aplicação.

---

# NÃO IMPLEMENTAR NESTA FASE

Não implementar ainda:

- Ferramentas de IA
- Integração fal.ai
- VorexPay
- Sistema completo de créditos
- Landing page definitiva
- Marketplace completo
- Assinaturas
- Funcionalidades comerciais adicionais

Essas funcionalidades serão implementadas nas fases correspondentes.

---

# REGRAS IMPORTANTES

1. Não altere decisões arquiteturais sem registrar a alteração em `/docs/DECISIONS.md`.
2. Não adicione dependências desnecessárias.
3. Não crie microsserviços.
4. Não introduza Redis/BullMQ nesta fase.
5. Não armazene arquivos definitivos no filesystem do container.
6. Não coloque secrets no código.
7. Não utilize valores sensíveis hardcoded.
8. Mantenha o projeto stateless.
9. Siga todas as regras de desenvolvimento documentadas.
10. Não avance para a próxima fase automaticamente.
11. Não espalhe valores visuais hardcoded pelos componentes.
12. Todo elemento visual deverá respeitar o Design System.
13. Não criar nova cor, fonte, espaçamento ou padrão visual sem avaliar primeiro o Design System.

---

# ENTREGA DA FASE 1

Ao finalizar a Fase 1, NÃO inicie a Fase 2.

Apresente um relatório contendo:

- Estrutura final de pastas
- Dependências instaladas
- Containers criados
- Configuração Docker
- Configuração PostgreSQL
- Configuração Prisma
- Migrations criadas
- Variáveis de ambiente
- Scripts disponíveis
- Testes executados
- Resultado do build
- Design System criado
- Tokens visuais criados
- Paleta proposta a partir da logo
- Arquivos de identidade criados
- Problemas encontrados
- Decisões técnicas tomadas
- Arquivos modificados/criados
- Como executar o projeto localmente
- Checklist de validação da Fase 1

Aguarde minha autorização explícita antes de iniciar a Fase 2.

A logo oficial do VORIXA foi fornecida. Ela deve ser considerada a referência visual principal do projeto. A identidade visual deve ser derivada dela, priorizando violeta, azul elétrico, ciano, preto e branco, com gradientes coerentes com a logo. A paleta definitiva deverá ser documentada em DESIGN_SYSTEM.md e implementada através de Design Tokens centralizados. Nenhum componente deverá possuir cores de marca hardcoded.
