# Authence

Authence is being migrated to a full-stack Next.js application. Work is on `docs/nextjs-migration-plan`; see [migration.md](./migration.md) for phase progress and the approved direction.

## Current status

- Phase 0 code containment is committed: the unsafe legacy signup handler returns HTTP `503` without reading credentials or connecting to MongoDB. Tracked `.env` and `node_modules/` have been removed from the branch tree.
- Phase 1 foundation is prepared: Next.js `16.4.2`, React `19.3.1`, TypeScript, App Router, scoped styles, and server-only configuration validation.
- The root is now a private application, not a compatible replacement for the old `authence@1.0.4` npm package.
- Authentication is **not implemented in the new application yet**. Signup, sign-in, sessions, dashboard protection, and sign-out belong to the next phases.
- Dependency installation is blocked in the current workspace by proxy access. No new lockfile or passing Next.js build is claimed. The incompatible legacy root lockfile was removed. GitHub Actions will install and verify the foundation, then commit the generated lockfile to this branch only if checks pass.

Do not deploy this intermediate branch as a production authentication service.

## Development

Use Node.js 24 LTS (`.nvmrc`) and npm. Once registry access is available:

```bash
git clone --branch docs/nextjs-migration-plan https://github.com/Siser-Pratap/Authence.git
cd Authence
npm install
npm run dev
```

`npm install` must generate the new lockfile, which will be reviewed and committed before reproducible CI installation uses `npm ci`.

The foundation home page requires no database or authentication secret. It displays that account access is temporarily unavailable. It does not simulate successful authentication.

### Configuration for the authentication phase

Copy `.env.example` to `.env.local` when configuring an isolated development environment. Generate a unique secret with `openssl rand -base64 32`.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Server-only connection URI for a new development database. |
| `MONGODB_DB_NAME` | Explicit database name; use a separate test/development database. |
| `BETTER_AUTH_SECRET` | At least 32 characters; never expose it to the browser. |
| `BETTER_AUTH_URL` | Exact application origin; HTTPS in production, local HTTP outside production. |

The configuration reader is lazy, so importing application modules does not require a live database at build time. Database/authentication wiring is still pending; these variables are validated contracts, not a claim that authentication already works.

### Commands

| Command | Status |
| --- | --- |
| `npm test` | Dependency-free Node.js checks for configuration and disabled legacy signup; passed locally. |
| `npm run dev` | Defined; requires dependencies to be installed. |
| `npm run lint` | Defined; not run because dependencies are unavailable. |
| `npm run typecheck` | Generates Next.js route types, then runs TypeScript; not run yet. |
| `npm run build` | Defined; not run yet. |
| `npm start` | Serves a successful production build; not run yet. |

## Layout

```text
src/app/             # Next.js layout, foundation home page, and styles
src/lib/config.ts    # Pure configuration validation
src/lib/env.ts       # Lazy server-only environment reader
tests/config/        # Configuration validation checks
tests/security/      # Legacy signup containment check
migration.md         # Migration plan and implementation progress
```

`components/`, `api/`, `userSchema/`, old entry files, and `test-project/` remain temporarily as legacy reference code. They are excluded from the active Next.js source/typecheck scope and will be removed after the replacement flow is verified. The old signup handler is intentionally disabled.

## Data and security

No legacy or production database has been accessed or migrated. Existing user and npm-consumer compatibility is unverified; no data is being deleted.

The owner reported rotating/revoking the database credentials embedded in the old implementation. This has not been independently verified through MongoDB account access. Removing credentials from this branch does not erase Git history. Do not reuse the legacy credentials or tracked environment file.

Email verification, password recovery, OAuth, and public production launch remain outside the first milestone. Production readiness requires the additional work listed in the migration plan.

## License

The project declares ISC in `package.json`; a standalone license file has not yet been added.
