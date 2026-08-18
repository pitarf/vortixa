Correção importante sobre o ambiente de desenvolvimento:

Minha máquina local **não possui Docker instalado**, e não pretendo instalar Docker neste momento.

O desenvolvimento local deverá funcionar normalmente de forma nativa.

## Ambiente local

Utilizar:

- Node.js
- npm
- Next.js
- PostgreSQL instalado localmente
- Prisma
- demais dependências do projeto

O fluxo local deverá ser:

```bash
npm install
npm run dev
```

O PostgreSQL local será utilizado como banco de desenvolvimento.

Não tornar o Docker obrigatório para executar o projeto localmente.

## Docker

O Docker continua sendo obrigatório como parte da estratégia de implantação e produção.

O projeto deverá manter:

- Dockerfile
- docker-compose.yml
- configurações necessárias para produção

Esses arquivos serão utilizados posteriormente na VPS.

Não é necessário executar Docker localmente neste momento.

## PostgreSQL

Utilizar o PostgreSQL já instalado na máquina local.

Não criar uma segunda instância PostgreSQL via Docker para desenvolvimento local.

As configurações deverão continuar utilizando `DATABASE_URL`, permitindo trocar facilmente entre:

Desenvolvimento:

```text
PostgreSQL local
```

Produção:

```text
PostgreSQL da infraestrutura de produção
```

Sem alterar a lógica da aplicação.

## Storage

Como o ambiente local não possui Docker, o MinIO não deve ser uma dependência obrigatória para executar o projeto.

A camada de storage deve permanecer abstraída.

O projeto deverá permitir utilizar:

- Cloudflare R2 em ambientes configurados para R2
- Storage local/mock apenas quando necessário para testes
- MinIO futuramente, caso seja útil no ambiente de desenvolvimento

Não criar dependência obrigatória do MinIO para `npm run dev`.

## Regra

O comando:

```bash
npm run dev
```

deve ser suficiente para iniciar a aplicação localmente, desde que as dependências externas obrigatórias, principalmente PostgreSQL, estejam configuradas.

O Docker será utilizado posteriormente na VPS para implantação.

Antes de avançar para a Fase 2, valide:

1. `npm install`
2. Conexão com PostgreSQL local
3. Prisma
4. Migrations
5. `npm run dev`
6. Testes
7. `npm run build`

Não avance para a Fase 2 até confirmar que o ambiente local funciona sem Docker.