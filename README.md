# Backend Metanet Comandas

Backend base multi-tenant construído com NestJS, MikroORM e PostgreSQL.

## Tecnologias

| Tecnologia | Versão | Propósito |
| :--- | :--- | :--- |
| NestJS | 11.x | Framework backend |
| MikroORM | 6.x | ORM (Data Mapper, Unit of Work) |
| PostgreSQL | 14+ | Banco de dados relacional |
| Pino | 10.x | Logging estruturado em JSON |
| TypeScript | 5.x | Linguagem de programação |

## Estrutura do Projeto

```
src/
├── modules/
│   ├── filiais/         # Módulo de filiais (tenants)
│   ├── auth/            # Módulo de autenticação (futuro)
│   └── users/           # Módulo de usuários (futuro)
├── shared/
│   ├── database/        # Configuração do MikroORM, entidade base, migrações
│   ├── logger/          # Configuração do Pino (logging)
│   └── config/          # Validação de variáveis de ambiente
├── app.module.ts
└── main.ts
```

## Pré-requisitos

- Node.js 22+
- Yarn
- PostgreSQL 14+

## Instalação

```bash
yarn install
cp .env.example .env
```

## Banco de Dados

### Com Docker Compose

```bash
docker compose up -d
```

### Sem Docker (PostgreSQL local)

```bash
sudo -u postgres psql -c "CREATE USER metanet WITH PASSWORD 'metanet123' SUPERUSER;"
sudo -u postgres psql -c "CREATE DATABASE metanet_comandas OWNER metanet;"
```

## Migrações

```bash
yarn migration:create    # Criar nova migração
yarn migration:up        # Executar migrações pendentes
yarn migration:down      # Reverter última migração
yarn migration:fresh     # Recriar banco (dev only)
```

## Executando

```bash
yarn start:dev           # Desenvolvimento (watch mode)
yarn build && yarn start:prod  # Produção
```

## Logging

Logs em formato JSON estruturado (Pino), salvos na pasta `logs/`.

- **Rotação:** Diária e por tamanho (10MB)
- **Nomenclatura:** `app.YYYY-MM-DD.N.log`
- **Retenção:** Últimos 30 arquivos

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
| :--- | :--- | :--- |
| `APP_PORT` | Porta da aplicação | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USER` | Usuário do PostgreSQL | `metanet` |
| `DB_PASSWORD` | Senha do PostgreSQL | `metanet123` |
| `DB_NAME` | Nome do banco de dados | `metanet_comandas` |
| `LOG_LEVEL` | Nível de log | `debug` |
| `LOG_DIR` | Diretório dos logs | `./logs` |
| `LOG_MAX_SIZE` | Tamanho máximo do arquivo de log (bytes) | `10485760` |


