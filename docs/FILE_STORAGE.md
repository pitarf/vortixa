# FILE STORAGE - VORIXA

Este documento descreve a infraestrutura e fluxos para armazenamento de arquivos multimídia (imagens, vídeos e áudio).

## 1. Arquitetura de Storage (Cloudflare R2)

O VORIXA adota **Cloudflare R2** como provedor de storage principal e definitivo desde o início. A escolha se baseia na eliminação total de taxas de transferência de dados de saída (*zero egress fees*), reduzindo drasticamente os custos operacionais à medida que a plataforma cresce e consome alta largura de banda para transferir vídeos.

* **Arquivos Locais**: Em ambiente de desenvolvimento local, para evitar a dependência do Docker/MinIO, a plataforma utiliza por padrão um adaptador de disco local (`DiskStorageProvider`). Este adaptador grava os arquivos diretamente na pasta `/public/uploads/` (que é listada no `.gitignore` para evitar o versionamento). Caso o desenvolvedor queira testar a API S3 localmente, o suporte ao MinIO permanece disponível através do adaptador S3, bastando configurar as variáveis do `.env`.
* **Banco de Dados**: O PostgreSQL armazena exclusivamente os metadados na tabela `File`. Arquivos físicos nunca devem ser gravados como blobs no banco de dados.

---

## 2. Fluxos de Upload

### 2.1 Upload de Arquivos do Usuário (Entradas / Referências)
Para otimizar a performance do servidor e evitar gargalos de processamento, a plataforma adota o fluxo de **Presigned URLs**:
1. O **Cliente** solicita ao backend uma URL temporária de upload via `/api/files/presigned` informando o nome e tamanho do arquivo.
2. O **Backend**:
   * Valida se o usuário está autenticado.
   * Valida se o tamanho do arquivo está dentro do limite (ex: Imagem máx 10MB, Vídeo máx 50MB).
   * Valida o MIME type (ex: `image/jpeg`, `image/png`, `video/mp4`).
   * Gera uma chave única no S3: `uploads/{userId}/{uuid}-{filename}`.
   * Solicita a URL assinada de escrita ao S3 SDK com expiração de 15 minutos.
   * Salva um registro temporário em `File` com status `PENDING`.
   * Retorna a URL assinada para o Cliente.
3. O **Cliente** realiza o upload direto (método `PUT`) do arquivo para a URL assinada recebida.
4. Após o upload bem-sucedido, o cliente notifica o backend via `/api/files/confirm`, alterando o status do arquivo para `READY`.

### 2.2 Upload de Arquivos Gerados (Outputs)
Para os arquivos resultantes das gerações de IA (fal.ai):
1. O webhook da fal.ai fornece uma URL pública de download temporário (geralmente sob o domínio `queue.fal.run`).
2. O **Backend**:
   * Efetua o download do arquivo temporário via Stream HTTP.
   * Valida a integridade do arquivo.
   * Faz upload direto do Stream para a chave do S3: `outputs/{userId}/{jobId}/{uuid}.mp4` (ou png).
   * Registra a URL final e os metadados na tabela `File`.

---

## 3. Políticas de Acesso e Segurança de Arquivos

* **Arquivos Privados (Entradas/Referências)**: Salvos no S3 com permissão de leitura privada. Toda vez que o frontend for exibir o arquivo, deve solicitar uma Presigned URL de leitura expiráveis.
* **Arquivos Públicos (Resultados/Galeria)**: Podem ser configurados com acesso de leitura pública (Read-Only) para otimizar entrega via CDN.
* **Validação de Posse**: Toda requisição para baixar ou visualizar um arquivo privado exige validação no backend:
  $$\text{file.userId} === \text{session.userId}$$
  Se as chaves de ID divergirem, o sistema deve barrar o acesso com HTTP 403 Forbidden.
