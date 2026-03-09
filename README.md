# Odin Blog Monorepo

Monorepo implementation of the Odin Blog API project using:

- API: Express + Prisma + PostgreSQL + JWT (Railway deploy target)
- Public app: React + Vite (Vercel deploy target)
- Admin app: React + Vite (Vercel deploy target)
- Testing: Vitest + Playwright

## Workspace layout

- `apps/api` - secure REST API
- `apps/blog-client` - public blog reader
- `apps/admin-client` - admin authoring/moderation interface

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create environment files

```bash
cp apps/api/.env.example apps/api/.env
cp apps/blog-client/.env.example apps/blog-client/.env
cp apps/admin-client/.env.example apps/admin-client/.env
```

3. Start PostgreSQL and set `DATABASE_URL` in `apps/api/.env`

4. Generate Prisma client, migrate, and seed

```bash
npm run prisma:generate --workspace @blog/api
npm run prisma:migrate:deploy --workspace @blog/api
npm run prisma:seed --workspace @blog/api
```

5. Run all apps

```bash
npm run dev
```

- API: `http://127.0.0.1:4000`
- Blog client: `http://127.0.0.1:5173`
- Admin client: `http://127.0.0.1:5174`

## API surface

Public:

- `POST /auth/login`
- `GET /posts`
- `GET /posts/:slug`
- `GET /posts/:slug/comments`
- `POST /posts/:slug/comments`

Admin (Bearer JWT required):

- `GET /admin/posts`
- `POST /admin/posts`
- `PUT /admin/posts/:id`
- `PATCH /admin/posts/:id/publish`
- `DELETE /admin/posts/:id`
- `DELETE /admin/comments/:id`

## Testing

Run lint, unit/integration tests, and E2E:

```bash
npm run lint
npm run test:unit
npm run test:e2e
```

`npm run test:e2e` expects a reachable Postgres instance at `TEST_DATABASE_URL` (or defaults to `postgresql://postgres:postgres@127.0.0.1:5432/blog_api_test?schema=public`).

## Local workflow

Suggested command order during development:

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:coverage
```

Before opening a PR that touches E2E behavior, run:

```bash
npm run test:e2e
```

## Railway deployment (API)

1. Create Railway service from this repo.
2. Configure root directory as repo root.
3. Set env vars from `apps/api/.env.example`.
4. Attach PostgreSQL plugin/service and set `DATABASE_URL`.
5. Railway uses `railway.toml` start command, which runs migrations before boot.

## Vercel deployment (frontends)

Create two Vercel projects:

1. Blog client
- Root directory: `apps/blog-client`
- Build command: `npm run build`
- Output directory: `dist`
- Env: `VITE_API_URL` -> Railway API URL

2. Admin client
- Root directory: `apps/admin-client`
- Build command: `npm run build`
- Output directory: `dist`
- Env: `VITE_API_URL` -> Railway API URL

Set production CORS allowlist in API to both production frontend domains, and optionally enable preview-domain support with `ALLOW_VERCEL_PREVIEWS=true` in staging.
