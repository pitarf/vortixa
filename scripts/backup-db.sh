#!/bin/bash
set -euo pipefail

# ==============================================================================
# SCRIPT DE BACKUP AUTOMATIZADO - VORIXA POSTGRESQL
# Conforme especificação em docs/BACKUP.md
# ==============================================================================

BACKUP_DIR="${BACKUP_DIR:-/var/backups/postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-vorixa_db}"
DB_USER="${DB_USER:-vorixa_user}"
S3_BUCKET="${S3_BUCKET:-s3://vorixa-backups-archive/db/}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/${DB_NAME}_backup_$TIMESTAMP.sql.gz"

echo "========================================================"
echo "Iniciando rotina de backup do banco de dados VORIXA..."
echo "Data/Hora: $TIMESTAMP"
echo "Host: $DB_HOST:$DB_PORT | Banco: $DB_NAME | Usuário: $DB_USER"
echo "Diretório de destino: $BACKUP_DIR"
echo "========================================================"

# 1. Garante a existência do diretório de backup
mkdir -p "$BACKUP_DIR"

# 2. Executa o dump do PostgreSQL compactado com gzip
echo "Executando pg_dump e compactação gzip..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --no-owner --clean --if-exists | gzip > "$FILENAME"

# 3. Valida se o arquivo de backup foi gerado com sucesso e não está vazio
if [ -s "$FILENAME" ]; then
    FILESIZE=$(du -h "$FILENAME" | cut -f1)
    echo "[OK] Backup gerado com sucesso: $FILENAME ($FILESIZE)"
else
    echo "[ERRO] Falha ao gerar o arquivo de backup ou arquivo gerado vazio." >&2
    exit 1
fi

# 4. Envia para o bucket S3 de backup frio (se AWS CLI estiver disponível)
if command -v aws &> /dev/null; then
    echo "Enviando arquivo para o bucket S3: $S3_BUCKET"
    if aws s3 cp "$FILENAME" "$S3_BUCKET"; then
        echo "[OK] Upload para S3 concluído com sucesso."
    else
        echo "[AVISO] Falha ao sincronizar com o bucket S3. O arquivo local foi preservado." >&2
    fi
else
    echo "[INFO] AWS CLI não configurado. Upload para S3 ignorado."
fi

# 5. Aplica política de retenção: remove backups locais com mais de 7 dias
echo "Aplicando política de retenção (removendo backups locais com mais de 7 dias)..."
find "$BACKUP_DIR" -type f -mtime +7 -name "*.sql.gz" -exec rm -f {} \;

echo "========================================================"
echo "Backup do PostgreSQL concluído com sucesso em $TIMESTAMP"
echo "========================================================"
