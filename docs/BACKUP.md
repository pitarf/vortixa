# BACKUP & RECOVERY POLICY - VORIXA

Este documento define a estratégia e os procedimentos para a realização de backups e recuperação de dados da plataforma VORIXA.

## 1. Backup do Banco de Dados (PostgreSQL)

O banco de dados PostgreSQL contém toda a lógica de estado da plataforma (usuários, saldos de crédito, transações financeiras, auditoria). O backup é automatizado via script cron.

### 1.1 Frequência e Retenção
* **Backup Completo diário**: Executado todas as noites às 02:00 UTC.
* **Backup de Transações (WAL/Point-in-Time Recovery)**: Habilitado na infraestrutura gerenciada para permitir restauração até o minuto anterior à falha.
* **Retenção**: 30 dias para backups diários. 12 meses para backups mensais consolidados.

### 1.2 Script de Dump Automatizado (`backup-db.sh`)

```bash
#!/bin/bash
# Script de backup do PostgreSQL
BACKUP_DIR="/var/backups/postgres"
DB_NAME="vorixa_db"
DB_USER="vorixa_user"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/${DB_NAME}_backup_$TIMESTAMP.sql.gz"

# Garante que o diretório existe
mkdir -p $BACKUP_DIR

# Executa o dump compactado
pg_dump -h localhost -U $DB_USER -d $DB_NAME | gzip > $FILENAME

# Envia para um bucket S3 de backup frio (Archive)
aws s3 cp $FILENAME s3://vorixa-backups-archive/db/

# Remove arquivos locais com mais de 7 dias
find $BACKUP_DIR -type f -mtime +7 -name "*.sql.gz" -exec rm {} \;

echo "Backup do PostgreSQL concluído com sucesso em $TIMESTAMP"
```

---

## 2. Backup de Arquivos de Mídia (Storage S3)

Os arquivos de mídia (imagens e vídeos) gerados ficam no bucket S3 principal.
* **Versionamento de Objetos**: Habilitado no bucket S3 para evitar perda por deleção acidental ou overwrite.
* **Replicação Cross-Region**: Os arquivos do bucket principal são automaticamente duplicados em tempo real para uma região secundária pelo próprio provedor do Storage (AWS/Cloudflare) como proteção contra desastres regionais.

---

## 3. Procedimento de Restauração em Caso de Falha

No caso de corrupção ou perda do banco de dados, siga as etapas abaixo para restaurar o estado:

1. **Colocar a Aplicação em Manutenção**: Desviar o tráfego do domínio ou subir página estática de manutenção.
2. **Obter Backup Recente**: Baixar o último arquivo `.sql.gz` do bucket de backup.
3. **Executar a Restauração**:
   ```bash
   # Descompacta o arquivo
   gunzip vorixa_db_backup_XXXXXXXX.sql.gz
   
   # Dropa e recria o banco vazio (CUIDADO!)
   dropdb -h localhost -U vorixa_user vorixa_db
   createdb -h localhost -U vorixa_user vorixa_db
   
   # Restaura os dados
   psql -h localhost -U vorixa_user -d vorixa_db -f vorixa_db_backup_XXXXXXXX.sql
   ```
4. **Verificar Integridade**: Conferir contagem de usuários e conciliar saldos consolidados antes de reabrir a plataforma.
