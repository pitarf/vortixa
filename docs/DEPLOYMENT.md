# DEPLOYMENT GUIDE - VORIXA

Este documento descreve as etapas de publicação e a esteira de CI/CD para colocar a plataforma VORIXA em produção.

## 1. Estratégia de Hospedagem

A plataforma Next.js Monolítica Integrada pode ser hospedada em duas estruturas recomendadas:

### Opção A: Vercel (Recomendado para Frontend + API Serverless)
* **Frontend/API**: Deploy automático na Vercel a partir do repositório GitHub.
* **Banco de Dados**: Instância gerenciada PostgreSQL (ex: AWS RDS, Supabase ou Neon).
* **Storage**: Cloudflare R2 ou AWS S3.

### Opção B: VPS / Servidor Dedicado (Docker Compose / Coolify)
* **Hospedagem**: Servidor Linux (Ubuntu 22.04 LTS) rodando Docker.
* **Orquestração**: Portainer ou Coolify para gerenciar deploys via Git.
* **Proxy Reverso**: Nginx ou Traefik com renovação automática de SSL Let's Encrypt.

---

## 2. Pipeline de Integração Contínua (GitHub Actions)

Abaixo está o arquivo de configuração para rodar validações e testes automáticos a cada Pull Request ou Push na branch `main` (`.github/workflows/ci.yml`):

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Prisma Schema Check
        run: npx prisma validate

      - name: Lint Code
        run: npm run lint

      - name: Run Tests
        run: npm run test:ci
```

---

## 3. Checklist de Lançamento em Produção

1. **Variáveis de Ambiente**: Confirmar que todas as chaves estão cadastradas na plataforma de hospedagem (sem vazamentos no código).
2. **Migrations do Banco**: Rodar `npx prisma migrate deploy` no pipeline de release de produção para aplicar atualizações sem sobrescrever dados.
3. **CORS e Headers**: Configurar políticas de segurança no Next.js (`next.config.js`) definindo cabeçalhos `Content-Security-Policy` e `X-Frame-Options`.
4. **SSL / HTTPS**: Garantir que todos os domínios do painel e webhooks operam sob HTTPS rígido.
