# Authence: Next.js migration plan

> Status: implementation authorized by the owner; work proceeds phase by phase on the existing branch.
> Implementation branch: `docs/nextjs-migration-plan`.
> Baseline: `main` at `e8c829eb9c360562e52637aec34880dccc3bac7b`.

## Implementation progress

### Phase 0 — code containment completed; operational follow-up remains

- Disabled the legacy signup handler with HTTP 503. It no longer reads credentials, logs secrets, returns passwords, imports database code, or connects to the embedded database.
- Removed tracked `.env` and `node_modules/` from the branch tree and corrected ignore rules. Existing history is untouched.
- Added a dependency-free security regression check for the disabled handler.
- The owner reported completing credential rotation/revocation after the GitGuardian alert. This was not independently verified through MongoDB account access; no old credential will be reused.
- Real users, deployments, and npm consumers have not been inventoried through account access. Preserve them; do not import or delete production data.
- Direct Git/npm access is blocked by the workspace proxy connection. GitHub connector commits work. Dependency installation and runtime verification must be unblocked before declaring the Next.js foundation complete.

### Phase 1 — foundation prepared; exit checks blocked

- Prepared the scaffold in `/tmp/authence-foundation` before copying it into the repository root.
- Selected Next.js 16.4.2 from its stable release and verified package/documentation at that tag; React 19.3.1 is the current stable React release. Next.js declares React 19 peer compatibility.
- Added App Router layout/home, CSS Modules, strict TypeScript, npm scripts, Node.js 24 selection, and the official flat ESLint configuration pattern.
- Converted the root to a private application and retired its old package entry metadata. Legacy reference files remain until later phases.
- Added placeholder-only `.env.example`, a lazy server-only reader, and tested validation that never prints supplied secrets.
- Removed the incompatible legacy root lockfile. Generating/reviewing the replacement lockfile is pending; no fabricated dependency lockfile is supplied.
- `npm test` passed for the configuration and legacy-security checks. React checklist review: server components by default, no unnecessary client boundary/hooks, explicit ReactNode typing, semantic landmarks, scoped styles, responsive sizing, and visible focus styles.
- `npm install` failed with `EPERM` connecting to the workspace proxy. The subsequent network-permission attempt did not complete; no dependency installation succeeded. Lint, Next.js type generation, typecheck, build, dev server, browser checks, and clean-install verification have NOT run. Phase 1 is not complete, and Phases 2–5 have not started.
- A GitHub Actions workflow is being added to run the same install/test/lint/typecheck/build checks outside the blocked workspace. It commits the first generated lockfile to this branch only after successful checks; remote verification is pending.
- Next step once dependency access is available: install dependencies, inspect version-matched bundled docs, generate/review the lockfile, run lint/typecheck/build and a server smoke test, then begin the MongoDB/authentication phase against an isolated database.

## 1. Objective and end goal

Transform Authence from a React authentication package prototype plus a disconnected Vite demo into a single, maintainable Next.js application with a working authentication flow.

The proposed first milestone is a full-stack Next.js App Router application at the repository root, using TypeScript, MongoDB, and server-managed authentication. A user should be able to register, sign in, reach a protected dashboard, refresh the page without losing a valid session, and sign out. Invalid, expired, or revoked sessions must not authorize access.

This is both a framework migration and completion of missing authentication behavior. Moving the existing files without repairing their behavior would not meet the end goal.

### Review decisions

The owner authorized implementation of the plan. Proceed with these defaults: full Next.js application, TypeScript/App Router, self-hosted authentication, MongoDB, and email/password sign-in. External consumers and real user data remain unverified; no legacy database will be accessed or modified.

| Decision | Proposed direction | Why it matters |
| --- | --- | --- |
| Application or reusable package? | Make the root a full-stack Next.js application for this migration. Keep reusable UI separate from server code internally. | The current project calls itself an npm package. A Next.js app does not replace a distributable SDK or multi-application authentication service. If either is the primary goal, revise this plan to a workspace with separate packages/apps before scaffolding. |
| Authentication engine | Prefer a maintained, self-hosted authentication library, with Better Auth as the candidate, rather than rebuilding session/password infrastructure. Validate its current Next.js and MongoDB adapter support first. | Authence can retain its name and custom UI while the library handles security primitives. A hosted identity provider would be a separate product decision. |
| Database | Keep MongoDB initially; use the selected authentication engine's supported adapter and schema. | Avoid combining a framework migration with an unnecessary database replacement. Keeping MongoDB does not imply that the old Mongoose schema is compatible. |
| Existing users | Default to a fresh, isolated development database. Preserve any real users through an explicit import/reset strategy if they exist. | There is no verified inventory of real users, deployments, or consuming applications. Never assume the old database is disposable. |
| Account identifier | Use email/password for sign-in; retain username as profile data, with an explicit normalization/uniqueness policy. | Username-based sign-in would require additional validation and adapter/plugin support. |
| First milestone versus public release | Complete the core flow first; require recovery and email verification before a public production launch. | Email delivery and abuse controls need their own configuration and testing. |
| Hosting | Keep the application compatible with a standard Node.js Next.js deployment. Choose a host later. | No deployment, paid integration, domain change, or production cutover is included in this planning change. |

## 2. Current state to migrate

Source of truth: [README.md](./README.md) and the implementation on the baseline commit.

- Root package: ES modules, version `1.0.4`, with no development server or build script.
- `index.js` exports a backend signup handler; `index.d.mjs` exposes a different frontend entry. There is no consistent public export contract.
- `components/SignUp/SignUp.jsx` renders a form, but confirmation handling, Axios response handling, submission, and loading/error behavior need repair.
- `api/auth/Signup.js` uses Express-style request/response objects, opens a hardcoded MongoDB connection, hashes a password, and attempts to save a user.
- The handler embeds database credentials, logs sensitive information, and returns the submitted plaintext password. A truthy `dbUrl` causes it to skip saving and send no response.
- `userSchema/userSchema.js` requires username, email, password, and an application `key`; its `timeStamps` option is misspelled.
- `components/SignIn.jsx` only navigates to `/dashboard`; there is no real sign-in, session, sign-out, or protected-route implementation.
- `test-project/` is a Vite demo with missing component imports and no dashboard route.
- `.env` and `node_modules/` are tracked. The root ignore rules also hide source directories from normal discovery and npm packing.
- `npm test` is a failing placeholder. A local npm pack dry run excludes files needed by the entry point.

Do not carry these behaviors forward as compatibility requirements.

## 3. Scope

### Included in the migration

- Next.js App Router at the root, TypeScript, a compatible React version, and one package manager/lockfile.
- Next.js pages, layouts, navigation, server/client component boundaries, and scoped styles.
- Server-only database and authentication configuration, validated environment variables, and a documented local setup.
- Working registration, email/password sign-in, session validation, sign-out, and a protected dashboard.
- Server-side validation, safe error handling, rate limiting, and protections against credential/session exposure.
- A data compatibility decision, automated checks, realistic integration/end-to-end tests, and updated documentation.
- Removal of the redundant Vite scaffold and obsolete package entry points once the replacement is verified.

### Deferred or conditional

- OAuth, MFA, organizations, multi-tenancy, billing, an admin console, and multiple visual themes.
- A separately published npm SDK or support for arbitrary external consumer applications.
- Production deployment and DNS changes.
- Database replacement, destructive data cleanup, and Git history rewriting.

Password recovery and email verification are a follow-up milestone after the core flow, but are required before opening password-based accounts to public production use. They must not be implied to work in the first milestone.

## 4. Proposed architecture

### Framework and dependencies

- Select the current stable Next.js release at implementation kickoff; verify the matching React, Node.js LTS, TypeScript, and authentication-library requirements in official documentation. Pin the chosen versions in the lockfile.
- Use the App Router and Node.js runtime for database/authentication routes. MongoDB access must never enter a client bundle.
- Keep npm unless a concrete compatibility issue warrants changing it. Use strict TypeScript and an `@/` source alias.
- Use CSS Modules for component styles and a small global stylesheet for tokens/resets. Preserve useful existing visual ideas without retaining global form selectors that affect unrelated pages.
- Prefer the authentication library's client/server APIs. Use native `fetch` only for additional application endpoints; remove Axios if it has no remaining use.
- Remove direct `jsonwebtoken`, `bcryptjs`, Mongoose, Express, CORS, and related dependencies only after checking whether the chosen adapter, import process, or retained code still needs them.

### Suggested structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── sign-up/page.tsx
│   │   └── sign-in/page.tsx
│   ├── (protected)/dashboard/page.tsx
│   └── api/auth/[...all]/route.ts   # If Better Auth is selected
├── components/
│   ├── auth/                      # Interactive auth forms
│   └── ui/                        # Shared presentation
├── lib/
│   ├── auth.ts                    # Server-only auth configuration
│   ├── auth-client.ts             # Client-safe auth client
│   ├── db.ts                      # Server-only database connection
│   ├── env.ts                     # Server environment validation
│   └── validation/                # Shared input contracts
└── proxy.ts                       # Optional coarse redirect layer
tests/
├── integration/
└── e2e/
.env.example
next.config.ts
package.json
migration.md
```

Route groups such as `(auth)` do not appear in URLs. Final paths and adapter-specific files should follow the chosen versions' documentation. Next.js 16 uses `proxy.ts`; older releases use `middleware.ts`. A request-interception layer is optional and is never the only authorization check.

### Boundaries and request flow

1. Default to Server Components for pages/layouts. Mark only interactive forms and session UI with `"use client"`.
2. Replace `react-router-dom` with file-based routes, `next/link`, and the appropriate `next/navigation` APIs.
3. Submit forms through the selected auth client's same-origin endpoints. Avoid parallel custom signup/sign-in implementations that bypass the library.
4. Validate inputs on the server even when the browser validates them. Treat every public endpoint and Server Action as independently callable.
5. Read and validate the session on the server for the protected dashboard and every protected data operation. A cookie's presence or a client-side redirect is insufficient.
6. Use the library's cookie/session handling with HttpOnly cookies, Secure in production, an appropriate SameSite policy, bounded expiry, and tested revocation. Never store session secrets in localStorage.
7. Keep user-specific responses out of shared caches. Verify that logout/revocation takes effect under the selected library's cache settings.
8. Reuse a server-side MongoDB client/connection promise across requests; handle development hot reload, connection limits, and database unavailability.

Do not use static export for this application: authentication and database operations require a server runtime.

## 5. Phased migration steps

Complete the phases in order after this plan is reviewed. Use small commits that can be inspected independently.

### Phase 0 — Confirm direction and contain existing exposure

- [x] Proceed with the proposed defaults following owner authorization; preserve unknown external consumers/data by avoiding production access.
- [ ] Inventory consumers, deployed endpoints, real users, required profile fields, and any existing published package usage.
- [ ] Treat the embedded database credential and any tracked secrets as exposed. Arrange rotation/revocation through the credential owner and remove sensitive logging/response fields before using real credentials.
- [x] Record the baseline and continue on `docs/nextjs-migration-plan`, as explicitly requested by the owner.
- [ ] Use a disposable database for development and testing. Do not connect to the hardcoded database during the migration.

Exit condition: target scope and data-preservation requirements are recorded; development can proceed with isolated credentials.

### Phase 1 — Establish the Next.js foundation

- [x] Scaffold into a temporary directory first, then move the required files into the root without overwriting project documentation.
- [x] Add Next.js/React/TypeScript, strict compiler settings, Next-compatible lint configuration, and scripts for `dev`, `build`, `start`, `lint`, and `typecheck`.
- [ ] Add root layout, home page, metadata, global style tokens, and the intended route skeleton.
- [x] Mark the root package private if the full-application proposal is accepted; retire the old `main`/`module` contract as a documented breaking change.
- [x] Correct `.gitignore`; stop tracking `node_modules/` and `.env` in future commits while retaining the source files. Add `.next/`, coverage, and test-output ignores.
- [x] Add `.env.example` containing placeholders only, and make missing required configuration fail clearly without printing values.

Exit condition: a clean dependency install, development server, lint, typecheck, and production build work for the scaffold. No real user data is needed at build time.

### Phase 2 — Establish data and authentication contracts

- [ ] Validate the chosen authentication library's current MongoDB adapter, Node.js requirements, schema/index setup, session model, rate-limit support, and password-hash import options.
- [ ] Configure server-only database access and the auth handler. If Better Auth is selected, mount its Next.js handler under `/api/auth/[...all]` and use its supported MongoDB adapter.
- [ ] Define normalized email/username rules, password policy, duplicate behavior, session lifetime, safe redirects, and error categories.
- [ ] Add appropriate database indexes; do not rely on browser checks or treat a Mongoose `unique` declaration as an input validator.
- [ ] Resolve old-user compatibility before creating or modifying production collections; follow section 6.
- [ ] Replace the old per-user `key` requirement with a deliberately designed schema. It must not be copied as proof of authentication or used as a client credential.

Exit condition: a disposable database supports user creation and session lifecycle through the selected auth engine, with safe responses and predictable failure behavior.

### Phase 3 — Port and complete the user experience

- [ ] Rebuild signup/sign-in as typed forms with proper `onSubmit`, labels, autocomplete attributes, keyboard support, and accessible validation messages.
- [ ] Preserve useful branding/styles while isolating CSS and checking narrow/mobile layouts.
- [ ] Fix password confirmation, prevent invalid submissions, handle request failures accurately, and reset pending state on every outcome.
- [ ] Add real sign-in and sign-out behavior; handle duplicate email, wrong credentials, expired sessions, and temporary service failures without leaking sensitive details.
- [ ] Create the protected dashboard and server-side session checks; verify both direct navigation and authenticated reloads.
- [ ] Standardize `/sign-in`, `/sign-up`, and `/dashboard`. Redirect the old `/login/` link to `/sign-in` if retaining compatibility is useful.
- [ ] Allow redirects only to approved internal destinations and prevent redirect loops.

Exit condition: registration → authenticated session (or explicit sign-in, according to the chosen policy) → dashboard → sign-out works in the browser.

### Phase 4 — Remove obsolete structure and document the new contract

- [ ] Remove `test-project/` after its useful assets and behavior have been replaced.
- [ ] Remove the old Express-style signup handler, duplicate router setup, conflicting entry points, stale schema, and unused dependencies after compatibility checks.
- [ ] Decide whether to archive or remove the `signup` design-reference file and `ideas` notes; do not leave them presented as executable application code.
- [ ] Regenerate one root lockfile and verify the dependency graph from a clean checkout.
- [ ] Rewrite README setup, environment configuration, commands, architecture, supported flows, limitations, and migration/breaking-change notes.
- [ ] Record a separate SDK/workspace follow-up if package consumers must be supported; do not publish the Next.js application as a replacement npm library.

Exit condition: one coherent Next.js application remains, with no Vite or React Router dependency in its active runtime.

### Phase 5 — Verify and prepare release

- [ ] Add CI for clean install, lint, typecheck, focused tests, and `next build`; run a smoke test against `next start`.
- [ ] Run integration tests with an isolated test database and browser tests against the actual UI/API/database flow.
- [ ] Inspect client bundles and network responses for database configuration, auth secrets, password hashes, and plaintext passwords.
- [ ] Confirm shared rate limiting works across application instances; an in-memory counter alone is insufficient for a multi-instance deployment.
- [ ] Add recovery and email-verification flows with a chosen email provider before public production launch, or explicitly keep the release limited to development/private evaluation.
- [ ] If production deployment is later requested, validate HTTPS cookies, trusted origins, database network access/region, email callbacks, monitoring, and rollback on a preview first.

Exit condition: the acceptance criteria below pass, known limitations are explicit, and release readiness is supported by evidence.

## 6. Data migration and compatibility

Keeping MongoDB does not make the existing `User` documents compatible with a new authentication engine. Inspect the schema and record counts without printing user credentials or personal data.

- **If no real data must be retained:** use a new database/collection set and create test accounts. Do not silently delete old collections.
- **If existing users must be retained:** take a restorable backup, prepare a dry-run import, preserve stable identity mappings, and detect duplicate or differently normalized emails/usernames before applying unique indexes.
- Existing passwords are bcrypt hashes. Verify whether the chosen engine supports importing/verifying those hashes and migrating them safely. Never reinterpret bcrypt hashes as plaintext or assume the engine's default hash format matches.
- Given the exposed credentials and insecure responses/logging in the old implementation, prefer a verified password-reset flow for real users. Choose the retention/reset policy explicitly.
- Do not copy the old `key` field into session credentials. Determine whether any external consumer depends on it before removal.
- Do not invent historic `createdAt`/`updatedAt` values: the old `timeStamps` typo means those fields may be missing.
- Stage schema changes in new collections or use additive changes first. Validate record counts, required fields, indexes, and login behavior before switching reads/writes.
- If a real service is already live, define a write freeze or reconciliation window and a cutover plan so registrations/password changes are not lost.

Do not run data migrations, delete production data, or rewrite repository history as part of creating or approving this document. Those operations need a concrete implementation/cutover plan. Removing a tracked secret from the current tree alone does not remove it from history; rotation is still required.

## 7. Configuration and security requirements

| Configuration | Intended use |
| --- | --- |
| `MONGODB_URI` (proposed name) | Server-only connection string for the selected environment. |
| `BETTER_AUTH_SECRET` if selected | Server-only authentication secret generated for each environment. |
| `BETTER_AUTH_URL` if selected | Correct application origin for the selected environment; document the chosen library's preview-origin behavior. |
| Email provider settings, later | Server-only delivery credentials and verified sender for verification/recovery. |
| Shared rate-limit storage, if needed | Database or other shared storage supported by the chosen engine/deployment. |

- Use Next.js environment loading instead of carrying forward unconditional `dotenv.config()` calls. Validate server configuration at a deliberate runtime boundary so builds do not query a live user database.
- Never place database credentials, authentication secrets, or email secrets in `NEXT_PUBLIC_*` variables. Do not send a database URL from a signup form.
- Configure exact trusted origins and the library's CSRF protections. Do not add wildcard CORS to make authentication work.
- Sanitize logs and return only the minimum safe user/session information; never return or log submitted passwords.
- Use generic sign-in errors and define consistent validation, conflict, throttling, unauthorized, and unavailable behavior for application endpoints. Use the library's documented response contract for its own endpoints.
- Guard every protected data operation; request interception and hidden UI are convenience layers, not authorization boundaries.
- Reset/verification tokens must be bounded, single-use where appropriate, and excluded from logs. Their implementation belongs to the public-release follow-up.

## 8. Testing and acceptance criteria

Use focused unit tests for normalization/validation where useful, integration tests for the auth/database contract, and Playwright (or an equivalent browser runner) for complete flows. Do not use production credentials or databases in CI.

| Scenario | Required result |
| --- | --- |
| Fresh checkout | Documented install and configuration produce a running app without copying tracked dependencies or secrets. |
| Signup | Valid data creates one account; persisted credentials are hashed; responses contain no password/hash. |
| Invalid/duplicate signup | Validation and duplicate races are handled without extra accounts or sensitive error leakage. |
| Sign-in | Correct credentials establish a session; wrong credentials are rejected consistently. |
| Protected access | Signed-out, forged, expired, and revoked sessions cannot read protected pages or data directly. |
| Refresh | A valid authenticated session remains usable after a full page reload. |
| Sign-out | The session is invalidated; revisiting protected routes requires sign-in, including after browser navigation. |
| Failure paths | Database outage, network errors, and throttling yield safe feedback and clear pending states. |
| Redirect safety | External/untrusted return URLs are rejected; public/protected redirects do not loop. |
| UI accessibility | Keyboard submission, labels, focus/error feedback, and mobile layout work. |
| Build and runtime | Lint, typecheck, tests, production build, and a production-server smoke test pass. |
| Data retention, if required | Dry-run/import counts, identity mappings, and the selected legacy-password/reset behavior are verified. |

The core migration is complete when the first milestone works through the browser, auth endpoints, and isolated database; the active codebase is entirely Next.js; documentation matches behavior; and no exposed legacy secrets remain active. Public production readiness additionally requires the recovery/verification milestone and deployment checks.

## 9. Risks and rollback

- **Product scope drift:** adopting Next.js does not automatically create an SDK or multi-tenant identity platform. Resolve that distinction before choosing repository structure.
- **Adapter/schema mismatch:** prove MongoDB and legacy-password compatibility early, before porting all UI.
- **Hidden consumers:** treat old entry-point/API removal as a breaking change; inventory consumers instead of assuming there are none.
- **Session/cache mistakes:** test revocation and direct data access, not just successful redirects.
- **Infrastructure constraints:** the current workspace has a source snapshot because direct Git/network access failed earlier. Implementation requires working dependency installation and an isolated database before builds/end-to-end tests can be claimed as passing.
- **Rollback:** retain the baseline and deployable artifacts on Git branches; stage data changes and keep backups. If a future cutover fails, disable new registrations or roll back to a verified safe build while diagnosing. Do not reactivate compromised credentials or restore the insecure legacy auth handler as a public fallback.

## 10. Review checklist

- [ ] Confirm the full Next.js application goal, or request a workspace/SDK-oriented revision.
- [ ] Confirm TypeScript + App Router and the proposed self-hosted authentication approach.
- [ ] Confirm MongoDB retention and whether real users or external consumers must be preserved.
- [ ] Confirm email as the login identifier and username as profile data.
- [ ] Confirm the first milestone and the recovery/verification requirement before public launch.
- [ ] Record requested changes, then approve the revised plan before implementation starts.

Implementation is authorized on this branch. Production data operations, deployment, and a merge to `main` remain outside the current scope.

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js authentication guidance](https://nextjs.org/docs/app/guides/authentication)
- [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables)
- [Better Auth Next.js integration](https://www.better-auth.com/docs/integrations/next)
- [Better Auth MongoDB adapter](https://www.better-auth.com/docs/adapters/mongodb)

Recheck version-specific APIs and adapter requirements when implementation begins.
