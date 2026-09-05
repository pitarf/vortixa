# 🖥️ Guia de Conexão VPS e Estado Atual dos Serviços

Este documento reúne as instruções rápidas de conexão SSH, os passos iniciais para criação de um novo ambiente e o mapa dos serviços/portas que já estão em execução na VPS.

---

## 🔑 Passo 1: Conexão SSH à VPS

Execute no terminal do seu computador (PowerShell ou Git Bash):

```powershell
ssh -i "G:\Meu Drive\Pita\VPS ORACLE\ssh-key-vpsOraclePrivate.key" ubuntu@tv.connectadvec.online
```

> **Acesso direto por IP:**
> ```powershell
> ssh -i "G:\Meu Drive\Pita\VPS ORACLE\ssh-key-vpsOraclePrivate.key" ubuntu@144.22.173.125
> ```

---

## 📁 Passo 2: Criar a Pasta do Novo Projeto

Após autenticar no terminal da VPS (`ubuntu@instance-...:~$`), crie e acesse o diretório exclusivo para o novo container/serviço:

```bash
# Substitua 'meu-novo-projeto' pelo nome desejado
mkdir -p /home/ubuntu/meu-novo-projeto
cd /home/ubuntu/meu-novo-projeto
```

---

## 📊 O Que Já Está Rodando na VPS Atualmente

| Serviço / Aplicação | Tipo | Diretório na VPS | Porta Interna | Porta Host (VPS) | Descrição / Domínio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nginx (Host)** | Nativo | `/etc/nginx/` | `80`, `443` | `80`, `443` | Proxy Reverso com SSL Certbot para `tv.connectadvec.online` |
| **Connect TV** | Docker | `/var/www/connecttv26advec` | `80` | `8080` (Local) | Aplicação web principal de TV/Controle |
| **PostgreSQL (Testes)** | Docker | `/home/ubuntu/postgres-test` | `5432` | `5432` (Pública) | Banco Postgres de testes (`test_db` / `test_user`) |

---

> [!WARNING]
> **Atenção ao Mapear Portas do Novo Container:**
> Ao criar o novo `docker-compose.yml`, utilize uma porta de Host livre (lado esquerdo de `PORTA_HOST:PORTA_CONTAINER`), evitando as portas **`80`**, **`443`**, **`8080`** e **`5432`**.
> *Sugestões de portas livres:* `3000`, `3001`, `8081`, `8082`, etc.
