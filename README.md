# BE HELPCENTER

## Features

- [x] Database ([typeorm](https://www.npmjs.com/package/typeorm)).
- [x] Seeding.
- [x] I18N ([nestjs-i18n](https://www.npmjs.com/package/nestjs-i18n)).
- [x] File uploads. Support local and Amazon S3 drivers.
- [x] Swagger.
- [x] E2E and units tests.
- [x] Docker.
- [x] CI (Github Actions).
- [x] Logging

## Getting Started

Before start, we need to install some packages and tools.
The recommended version is the LTS version for every tool and package.

### Clone Repo

Clone the project with git.

```bash
git clone https://github.com/fajarantono/be-helpcenter.git
```

### Install Dependencies

This project needs some dependencies. Let's go install it.

```bash
npm install

npm run migration:run

npm run seed:run
```

### Create environment

Make your own environment file with a copy of `env.example` and adjust values to suit your own environment.

```bash
cp .env.example .env
```

## Links

- Swagger: <http://localhost:3000/docs>
- Adminer (client for DB): <http://localhost:8080>
- Maildev: <http://localhost:1080>

## Database utils

Generate migration

```bash
npm run migration:generate -- src/database/migrations/CreateNameTable
```

Run migration

```bash
npm run migration:run
```

Revert migration

```bash
npm run migration:revert
```

Drop all tables in database

```bash
npm run schema:drop
```

Run seed

```bash
npm run seed:run
```

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Run Project

Finally, Cheers 🍻🍻 !!! you passed all steps.

Now you can run the project.

```bash
npm run start:dev
```
