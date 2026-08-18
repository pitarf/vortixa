# API SPECIFICATION - VORIXA

Este documento especifica os endpoints HTTP internos desenvolvidos sob a estrutura de **API Routes** do Next.js. Todas as rotas (exceto webhooks públicos) exigem autenticação do usuário.

## 1. Módulos de Endpoints

### 1.1 Autenticação (`/api/auth/*`)

#### `POST /api/auth/register`
* **Descrição**: Cadastra um novo usuário comum no sistema.
* **Autenticação**: Nenhuma.
* **Request Body (JSON)**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senhaSegura123!",
    "name": "Nome do Usuário"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário"
  }
  ```

#### `POST /api/auth/login`
* **Descrição**: Efetua login do usuário e estabelece sessão (Cookie JWT/Session).
* **Autenticação**: Nenhuma.

---

### 1.2 Créditos (`/api/credits/*`)

#### `GET /api/credits/balance`
* **Descrição**: Retorna o saldo atualizado de créditos do usuário autenticado.
* **Autenticação**: Requerida (USER ou ADMIN).
* **Response (200 OK)**:
  ```json
  {
    "balance": 150,
    "isUnlimited": false
  }
  ```

---

### 1.3 IA e Jobs (`/api/jobs/*`)

#### `POST /api/jobs/create`
* **Descrição**: Cria e enfileira uma nova requisição de geração de IA (imagem, vídeo, motion control, etc.).
* **Autenticação**: Requerida.
* **Request Body (JSON)**:
  ```json
  {
    "toolSlug": "motion-control",
    "inputs": {
      "character_image_url": "https://s3.vorixa.com/uploads/user1/char.png",
      "reference_video_url": "https://s3.vorixa.com/uploads/user1/ref.mp4",
      "prompt": "personagem dançando animadamente"
    }
  }
  ```
* **Response (202 Accepted)**:
  ```json
  {
    "jobId": "uuid-do-job-interno",
    "status": "PROCESSING",
    "creditCost": 15
  }
  ```

#### `GET /api/jobs/[id]`
* **Descrição**: Retorna o status e detalhes do processamento de um job específico.
* **Autenticação**: Requerida. Deve ser o dono do job ou ADMIN.
* **Response (200 OK - Processando)**:
  ```json
  {
    "id": "uuid-do-job-interno",
    "status": "PROCESSING",
    "createdAt": "2026-08-17T21:56:40Z"
  }
  ```
* **Response (200 OK - Sucesso)**:
  ```json
  {
    "id": "uuid-do-job-interno",
    "status": "COMPLETED",
    "outputs": [
      {
        "fileUrl": "https://s3.vorixa.com/outputs/final.mp4"
      }
    ],
    "createdAt": "2026-08-17T21:56:40Z"
  }
  ```

---

### 1.4 Webhooks Públicos (`/api/webhooks/*`)

#### `POST /api/webhooks/fal`
* **Descrição**: Endpoint receptor dos retornos assíncronos da fal.ai.
* **Autenticação**: Assinatura criptográfica enviada nos headers (`x-fal-signature` ou similar) validada com `FAL_KEY`.
* **Response (200 OK)**: Retorna confirmação de recebimento.

#### `POST /api/webhooks/vorexpay`
* **Descrição**: Receptor de notificações de pagamentos do VorexPay.
* **Autenticação**: Validação de token ou cabeçalho de assinatura contido em `VOREXPAY_WEBHOOK_SECRET`.
* **Response (200 OK)**: Retorna confirmação de recebimento.

---

### 1.5 Admin (`/api/admin/*`)

#### `POST /api/admin/users/[id]/credits`
* **Descrição**: Ajusta manualmente os créditos de um usuário.
* **Autenticação**: Requerida (ADMIN).
* **Request Body (JSON)**:
  ```json
  {
    "amount": 500,
    "description": "Bônus promocional out/2026"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "newBalance": 650
  }
  ```
