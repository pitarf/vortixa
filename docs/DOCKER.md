# DOCKER CONFIGURATION - VORIXA

Este documento descreve como o projeto é empacotado e executado em ambientes isolados utilizando **Docker** e **Docker Compose** para implantação.

> [!NOTE]
> **Ambiente Local**: A execução local do projeto é 100% nativa (Node.js, npm, PostgreSQL local) e **não requer o Docker instalado**. Os arquivos descritos abaixo são utilizados exclusivamente para a esteira de CI/CD e implantação definitiva em produção (VPS).

## 1. Estrutura do Dockerfile (Produção)

O Dockerfile utiliza build multiestágio para otimizar o tamanho da imagem final do Next.js:

```dockerfile
# 1. Instalação de dependências
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# 2. Build da aplicação
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npm run build

# 3. Execução em Produção
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

---

## 2. Docker Compose (Desenvolvimento Local)

Para o desenvolvimento local, o arquivo `docker-compose.yml` orquestra a aplicação, o banco PostgreSQL e um container de MinIO (simulando o storage compatível com S3):

```yaml
version: '3.8'

services:
  # Banco de Dados PostgreSQL com Volume Mapeado
  postgres:
    image: postgres:15-alpine
    container_name: vorixa-postgres
    restart: always
    environment:
      POSTGRES_USER: vorixa_user
      POSTGRES_PASSWORD: vorixa_password
      POSTGRES_DB: vorixa_db
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Storage S3 Local (MinIO)
  minio:
    image: minio/minio
    container_name: vorixa-minio
    restart: always
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minio_admin
      MINIO_ROOT_PASSWORD: minio_password
    command: server /data --console-address ":9001"
    volumes:
      - minio-data:/data

volumes:
  postgres-data:
    driver: local
  minio-data:
    driver: local
```

---

## 3. Execução de Migrations e Seeds via Docker

Para inicializar a estrutura do banco localmente pela primeira vez, execute:

```bash
# Sobe os containers em segundo plano
docker-compose up -d

# Executa as migrations do Prisma
docker exec -it vorixa-app npx prisma migrate dev

# Popula o banco com os provedores, modelos e ferramentas iniciais (seed)
docker exec -it vorixa-app npx prisma db seed
```
