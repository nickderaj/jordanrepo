# Jordanrepo

A Turborepo with a simple Todo CRUD app: Vite + TS frontend, Express + Postgres backend, shared models and UI packages.

## Apps & packages

- `apps/web` — Vite vanilla-TS frontend (Todo UI)
- `apps/backend` — Express + `pg` CRUD API
- `packages/models` — shared TS types + Zod schemas used by both web and backend
- `packages/ui` — shared HTML-string UI components (`Button`, `Input`, `TodoItem`, `Header`, `Counter`)
- `packages/eslint-config`, `packages/typescript-config` — shared tooling

## Prereqs

- Node 20+
- pnpm 8.15+
- Docker (for local Postgres)

## First run

```sh
pnpm install
cp apps/backend/.env.example apps/backend/.env
pnpm db:up      # starts Postgres in Docker (persistent volume)
pnpm dev        # starts web + backend + docs via turbo
```

- Web: http://localhost:5173
- Backend: http://localhost:3001 (health: `/health`, CRUD: `/todos`)
- Postgres: `postgres://jordan:jordan@localhost:5432/jordan`

Backend bootstraps the `todos` table on startup via `apps/backend/src/schema.sql`.

## Database scripts

| Script          | What it does                                   |
| --------------- | ---------------------------------------------- |
| `pnpm db:up`    | Start the Postgres container in the background |
| `pnpm db:down`  | Stop the Postgres container                    |
| `pnpm db:logs`  | Tail Postgres logs                             |
| `pnpm db:reset` | Stop + wipe the volume + restart (fresh DB)    |

Data is persisted in the `jordanrepo-pgdata` Docker volume.

## API

| Method | Path         | Body                |
| ------ | ------------ | ------------------- |
| GET    | `/todos`     | —                   |
| GET    | `/todos/:id` | —                   |
| POST   | `/todos`     | `{ title: string }` |
| PATCH  | `/todos/:id` | `{ title?, done? }` |
| DELETE | `/todos/:id` | —                   |

Request/response shapes are defined once in `@repo/models/todo` and imported by both web and backend.
