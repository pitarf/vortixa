Antes de iniciar a Fase 2, uma informação importante sobre o ambiente de desenvolvimento:

Eu já possuo uma instalação local do **PostgreSQL** nesta máquina e quero utilizá-la como banco de desenvolvimento do VORIXA, em vez de depender obrigatoriamente do container PostgreSQL.

A senha do usuário PostgreSQL local é:

`Rafael@180`

IMPORTANTE:

- Não colocar essa senha em nenhum arquivo versionado.
- Não colocar essa senha em `/docs`.
- Não colocar essa senha em `.env.example`.
- Não colocar essa senha diretamente no código.
- Utilizar a credencial somente no arquivo de ambiente local apropriado.
- Nunca fazer commit de `.env.local`, `.env` ou qualquer arquivo contendo credenciais.
- Manter `.gitignore` configurado para impedir o versionamento desses arquivos.

Utilize a instalação PostgreSQL local como banco de desenvolvimento, desde que ela esteja acessível pelo ambiente atual.

Antes de alterar qualquer configuração, verifique a configuração atual do projeto e do PostgreSQL.

Caso seja necessário informar host, porta, nome do banco ou usuário e esses dados não estejam disponíveis na configuração atual, não invente valores. Informe exatamente quais dados estão faltando.

O Docker poderá continuar sendo utilizado para os demais serviços necessários, como storage local/MinIO, mas não deve criar um segundo PostgreSQL desnecessariamente se o banco local puder ser utilizado.

Mantenha a configuração preparada para que, em produção, o PostgreSQL possa ser substituído por uma instância externa/gerenciada sem alteração da lógica da aplicação.

Depois dessa configuração, valide:

1. Conexão com PostgreSQL.
2. Prisma Client.
3. Prisma migrations.
4. Execução das queries básicas.
5. Build.
6. Testes.

Não avance para a Fase 2 até confirmar que o banco local está funcionando corretamente.