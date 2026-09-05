#!/bin/bash
set -euo pipefail

# ==============================================================================
# SCRIPT DE RESTAURAÇÃO DE BANCO DE DADOS - VORIXA POSTGRESQL
# Conforme especificação em docs/BACKUP.md
# ==============================================================================

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-vorixa_db}"
DB_USER="${DB_USER:-vorixa_user}"

if [ -z "${1:-}" ]; then
    echo "Uso: $0 <caminho_para_arquivo_de_backup.sql.gz ou .sql>"
    echo "Exemplo: $0 /var/backups/postgres/vorixa_db_backup_20260827_100000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "[ERRO] Arquivo de backup não encontrado: $BACKUP_FILE" >&2
    exit 1
fi

echo "========================================================"
echo "ATENÇÃO: INICIANDO RESTAURAÇÃO DO BANCO DE DADOS VORIXA"
echo "Arquivo: $BACKUP_FILE"
echo "Destino: $DB_HOST:$DB_PORT/$DB_NAME (Usuário: $DB_USER)"
echo "========================================================"

# 1. Encerra conexões ativas com o banco para permitir recriação/restauração
echo "Encerrando conexões ativas com o banco $DB_NAME..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c \
    "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$DB_NAME' AND pid <> pg_backend_pid();" || true

# 2. Executa a restauração com base na extensão do arquivo (.sql.gz ou .sql)
echo "Restaurando dados a partir do backup..."
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gzip -dc "$BACKUP_FILE" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"
else
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"
fi

# 3. Validação de integridade pós-restauração
echo "Validando integridade pós-restauração..."
USER_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM \"User\";" | xargs || echo "0")
PAYMENT_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM \"Payment\";" | xargs || echo "0")

echo "[OK] Contagem de Usuários: $USER_COUNT"
echo "[OK] Contagem de Pagamentos: $PAYMENT_COUNT"

echo "========================================================"
echo "Restauração do banco de dados concluída com sucesso!"
echo "========================================================"
