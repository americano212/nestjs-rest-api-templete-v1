# NestJS REST API templete v1

## Description

NestJS REST API templete for Korea user.

## Features

- [x] Database(TypeORM)
  - Support DB
  - [x] MySQL
- [x] Seeding
- [x] Local Authentication
- [x] OAuth(Social Login)
  - [x] Kakao
  - [x] Naver
  - [x] Google
  - [x] Github
- [x] Customizing Roles(Admin, User...)
- [x] JWT Authorization
- [x] Slack Alert when throw ERROR
- [x] Logging(winston)
- [x] Swagger
- [x] Validate DTOs with Entities
- [x] Unit Test(Jest)
- [x] E2E Test
- [x] File upload
- [x] CI
- [x] Example Domain(Board with content)

## Configuration

Create `.env` file with reference to `.env.example`

Especially, `SUPER_ADMIN` will be a master account by seeding, so please decide carefully.

## Installation

```bash
# 1. Install node_modules
npm ci
# 2. Load Entity
npm run entity:sync
# 3. Seeding(Load Role with Super Admin)
npm run seed:run
```

## Development

Set `NODE_ENV='development'` in `.env`

```bash
npm run start:dev
```

## Production

Set `NODE_ENV='production'` in `.env`

```bash
npm start
```

OR

```bash
npm run lint
rimraf dist
nest build
node dist/src/main
```

## Test

Test run on `jest`.
Template already contains an example of unit and e2e tests.

### Unit Test

```bash
# 1. Test by 'Jest'
npm run test:e2e
# 2. Auto e2e test. (It include creating test DB CLI too.)
npm run test:e2e:auto
```

### End-to-End Test

```bash
# 1. Load local test DB by docker
npm run test:docker:up
# 2. Run E2E test auto mode
npm run test:e2e:auto
# 3. Quit E2E test
npm run test:docker:down
```

OR

```bash
# 1. Load local test DB by docker
npm run test:docker:up
# 2. Initialize Database
npm run test:entity:drop
# 3. Synchronization Database
npm run test:entity:sync
# 4. Seeding Database
npm run test:seed:run
# 5. Run E2E test
npm run test:e2e:debug
# 6. Quit E2E test
npm run test:docker:down
```

## Links

- Swagger: <http://localhost:8081/docs>

## Database utils

```bash
# 1. When project init, synchronize Entities to Database
npm run entity:sync
# 2. [Warning] When you need to erase ALL Database, DROP ALL Exist table.
npm run entity:drop
# 3. When project init, seeding data.(Roles, Super Admin)
npm run seed:run
# 4. [Warning] When you need to erase ALL Users with roles, DELETE ALL raws in user, role, user_role table.
npm run seed:revert
```
