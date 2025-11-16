# Projeto NestJS com TypeORM e Docker

Este projeto é uma aplicação construída em NestJS utilizando TypeORM para gerenciamento do banco de dados, rodando em containers com Docker Compose.

A aplicação também utiliza class-validator para validações de dados e suporta migrações para versionamento do banco.

---

## Tecnologias

- NestJS — Framework Node.js progressivo
- TypeORM — ORM para TypeScript/JavaScript
- SQL Server — Banco de dados relacional
- Docker & Docker Compose — Containers
- class-validator — Validação de dados

---

## Requisitos

- Node.js 20+
- Docker e Docker Compose
- [npm](https://www.npmjs.com/) ou yarn

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/FIEA-AL/selo-fiea-back.git
cd selo-fiea-back

```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo (ajuste conforme necessário):

```
# Application Configuration
NODE_ENV=development
PORT=3000
TZ=America/Sao_Paulo
PREFIX_API=/api
FRONTEND_URL=http://localhost:3000

# Environment variables for production
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrong!Passw0rd
DB_DATABASE=selo_fiea
DB_SCHEMA=dev

```

### 3. Suba os containers com Docker para rodar o banco de dados

```bash
docker-compose up -d

```

Isso irá subir:

- **Banco SQL Server** (porta 1433)

### 4. Criar o banco de dados (se ainda não existir)

### Linux/macOS (`create-db.sh`)

Após rodar o `docker-compose up -d`, deve ser criado o banco de dados manualmente. Acesse o banco atraves do DBeaver, Beekeeper Studio ou Azure Data Studio e execute o seguinte comando SQL:

```sql
CREATE DATABASE selo_fiea;
```

### 5. Instale as dependências

```bash
npm install

```

### 6. Rodar a aplicação

```bash
npm run start:dev

```

A API estará disponível em:

[http://localhost:3000](http://localhost:3000/)

---

## Scripts úteis

```bash
# Rodar em dev
npm run start:dev

# Rodar em produção
npm run start:prod

# Criar migration
npm run typeorm migration:create ./src/migrations/NomeDaMigration

# Rodar migrations
npm run typeorm migration:run

# Reverter última migration
npm run typeorm migration:revert

# Testes
npm run test

```

---

## Estrutura do Projeto (sugestão)

```
src/
 ├── config/           # Configurações (TypeORM, etc)
 ├── modules/          # Módulos da aplicação
 ├── common/           # Pipes, filtros, decorators...
 ├── migrations/       # Migrations do TypeORM
 ├── main.ts           # Arquivo principal
 └── app.module.ts     # Módulo raiz

```

---

## Validações com class-validator

Este projeto utiliza `class-validator` junto com `class-transformer` para validações de DTOs.

Exemplo:

```tsx
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsEmail()
  email: string;
}
```

---

## Docker Compose

Exemplo de `docker-compose.yml` usado:

```yaml
services:
  # SQL Server 2017
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2017-latest
    container_name: sqlserver_dev
    restart: unless-stopped
    hostname: sqlserver_dev
    environment:
      ACCEPT_EULA: Y
      MSSQL_SA_PASSWORD: YourStrong!Passw0rd
      TZ: America/Sao_Paulo
    ports:
      - '1433:1433'
    volumes:
      - sqlserver_data:/var/opt/mssql
      - /etc/localtime:/etc/localtime:ro
    networks:
      - selo_network

volumes:
  sqlserver_data:

networks:
  selo_network:
    driver: bridge
```
