# Authence

Authence is a full-stack Next.js authentication application with custom React forms and self-hosted authentication backed by MongoDB.

The migration lives on `docs/nextjs-migration-plan`. See [migration.md](./migration.md) for the plan, phase evidence, and remaining release work.

## Implemented

- Registration with a normalized, unique username and email.
- Email/password sign-in, a server-protected dashboard, and sign-out.
- Seven-day database-backed sessions, expiry/revocation checks, and secure HttpOnly cookies in production.
- Server-side validation, database-backed rate limits, trusted-origin checks, and private account responses.
- Accessible forms with confirmation, pending/error feedback, keyboard submission, and responsive styles.

Registration is followed by an explicit sign-in. To reduce email enumeration, registration can return the same success response for an existing email; it never changes that account's password.

**This is the core migration milestone, not a public production release.** Email verification and password recovery are not implemented. OAuth, MFA, multi-tenancy, and a distributable SDK are also outside this milestone.

## Stack

Next.js 16.4.2 (App Router), React 19.3.1, strict TypeScript, Better Auth 1.7.12, and the version-matched MongoDB adapter. MongoDB must run as a replica set or sharded cluster because authentication writes use transactions. The application uses the Node.js runtime.

## Run locally

Use Node.js 24 LTS and npm. Select Node 24 with your version manager, then:

```bash
git clone --branch docs/nextjs-migration-plan https://github.com/Siser-Pratap/Authence.git
cd Authence
npm ci
cp .env.example .env.local
```

Configure a new development database in `.env.local`. Generate a unique secret using `openssl rand -base64 48`, and place it in `BETTER_AUTH_SECRET`. Do not commit the resulting file.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Server-only MongoDB replica-set connection string. |
| `MONGODB_DB_NAME` | Explicit database name; use a new database such as `authence_development`. |
| `BETTER_AUTH_SECRET` | Unique server-only secret, at least 32 characters. |
| `BETTER_AUTH_URL` | Exact application origin: `http://localhost:3000` for development; HTTPS in production. |

For a local replica set using Docker, create a dedicated container and volume:

```bash
docker run --detach --name authence-dev-mongo --publish 127.0.0.1:27017:27017 --mount source=authence-dev-data,target=/data/db mongo:8.0 --replSet rs0 --bind_ip_all
```

Once MongoDB is ready, initialize the replica set once:

```bash
docker exec authence-dev-mongo mongosh --quiet --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"127.0.0.1:27017"}]})'
```

Use `mongodb://127.0.0.1:27017/?replicaSet=rs0` as the local URI. On later runs, start the existing container with `docker start authence-dev-mongo`; do not reinitialize it or delete the volume.

```bash
npm run dev
```

Open `http://localhost:3000`. Database connections and indexes initialize lazily on the first authentication request. Missing configuration or an unavailable database produces safe failure feedback. Building the application does not require access to a live database.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Build for production. |
| `npm start` | Serve the production build; requires runtime configuration. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Generate route types and check TypeScript. |
| `npm test` | Run configuration and identifier-validation unit tests. |
| `npm run test:integration` | Test the real API/database lifecycle against an already running isolated test server. |
| `npm run test:e2e` | Run Chromium browser tests against an already running isolated test server. |

Integration/browser tests are restricted to loopback URLs and an `authence_test*` database. They create synthetic accounts, expire their sessions, and clear test rate-limit counters. They must never run against real accounts. Configure the server and test process to use the same isolated database and origin.

CI creates a disposable MongoDB replica set, generates temporary test configuration and an HTTPS certificate, and runs the production Next.js server behind a test-only HTTPS proxy. Playwright's certificate exception applies to this test setup; application TLS verification is not disabled.

## Structure

```text
src/app/                 # Pages, layouts, and auth/account route handlers
src/components/auth/     # Client forms, sign-out control, scoped styles
src/lib/auth.ts          # Lazy server-only Better Auth configuration
src/lib/auth-client.ts   # Browser-safe auth client
src/lib/db.ts            # Shared MongoDB connection and indexes
src/lib/config.ts        # Pure server-configuration validation
src/lib/env.ts           # Server-only environment reader
src/lib/validation/      # Shared identifier/password rules
tests/                   # Unit, integration, and browser checks
scripts/test-proxy.mjs   # CI-only local HTTPS termination
migration.md             # Migration plan, evidence, and remaining work
```

Public pages are `/`, `/sign-up`, and `/sign-in`. `/dashboard` validates its session on the server. `GET /api/me` returns only the authenticated user's ID, username, and email, or `401`. Authentication endpoints are managed by Better Auth under `/api/auth/*`. The old `/login` URL redirects to `/sign-in`.

Usernames are stored in Better Auth's `name` field and normalized to lowercase ASCII letters, numbers, and underscores (3–30 characters). Email is normalized to lowercase. Sign-in uses email, not username. Passwords use the authentication library's hashing; they are not stored on the user document or returned by application endpoints.

## Compatibility and remaining work

The root is now a private application and does not preserve the old npm package entry points. The old Vite demo, Express-style handler, Mongoose schema, and conflicting frontend/backend exports have been retired. Supporting SDK consumers would require a separately designed package/workspace.

No legacy users, bcrypt hashes, application keys, or production databases have been imported or modified. Keeping MongoDB does not make old documents compatible with the new auth schema. Any import requires an inventory, backup, identity mapping, duplicate checks, and a deliberate password-reset/import strategy.

The owner reported rotating/revoking the database credential exposed in the original repository. It must not be reused. Branch cleanup does not erase Git history.

Before public production use, implement email verification and recovery, configure a delivery provider, validate the real host's proxy/header and rate-limit behavior, configure HTTPS and trusted origins, and exercise deployment/rollback with isolated environments. No production deployment or merge to `main` is included in this migration work.

## License

The project declares ISC in `package.json`.
