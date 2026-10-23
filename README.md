# Authence

Authence is an early-stage JavaScript authentication package with React form components and a MongoDB signup handler. The root package declares version `1.0.4` and uses ES modules.

**Status: prototype.** Registration is partially implemented, sign-in is a UI placeholder, and the demo and package distribution need fixes before they can be used end to end.

## Current implementation

| Area | What exists today |
| --- | --- |
| Signup UI | Styled React form for username, email, password, and password confirmation; posts to a caller-provided backend URL using Axios. |
| Signup handler | Async `signup(req, res)` function that attempts a MongoDB connection, hashes the password with bcryptjs, and saves a Mongoose user document. |
| User model | Required `username`, `email`, `password`, and `key` fields; username and email have unique indexes declared. |
| Sign-in UI | A button that navigates to `/dashboard` without checking credentials. |
| Demo | React 18 / Vite 5 app in `test-project/` with `/`, `/sign-in`, and `/sign-up` routes; authentication component imports are unresolved. |
| Tests | Root `npm test` is a placeholder that exits with an error. |

Sign-out, authenticated sessions, protected routes, password reset, email verification, and token issuance/verification are not implemented. `jsonwebtoken` is a dependency but is unused by the current authentication code.

## Repository layout

```text
Authence/
├── api/auth/Signup.js          # Backend signup handler
├── components/
│   ├── SignIn.jsx             # Placeholder sign-in component
│   └── SignUp/
│       ├── SignUp.jsx         # Signup form
│       └── SignUp.css         # Form styling
├── userSchema/userSchema.js   # Mongoose User model
├── index.js                   # Default export: backend signup handler
├── index.d.mjs                # Alternate module entry: signup UI
├── package.json               # Root metadata and dependencies
├── test-project/              # React + Vite demo scaffold
├── signup                     # HTML/CSS design references
└── ideas                      # Future component variation notes
```

## Package entry points

- `main` points to `index.js`, which default-exports the backend `signup` handler.
- `module` points to `index.d.mjs`, which default-exports the React `SignUp` component using an extensionless import. Despite its filename, this is JavaScript, not a TypeScript declaration file.
- There is no `exports` map or unified public API. Consumers may resolve different entry points depending on their tooling.

Distribution is incomplete: there is no `.npmignore` or `files` allowlist, so npm falls back to `.gitignore`. A local `npm pack --dry-run` includes `index.js` but excludes `api/`, `components/`, `userSchema/`, and `index.d.mjs`. The included backend entry therefore imports a file missing from that archive. This describes packing the current repository; it does not verify an existing npm registry release.

## Local development

Use Node.js and npm. The root package does not declare a supported Node.js version through an `engines` field.

```bash
git clone https://github.com/Siser-Pratap/Authence.git
cd Authence
npm ci
```

The root has no `start`, `dev`, or `build` script. Importing the backend handler does not start an HTTP server, register a route, or configure request-body parsing.

The demo has separate dependencies and scripts:

```bash
cd test-project
npm ci
npm run dev
```

**Known demo blocker:** `test-project/src/main.jsx` imports `./components/SignIn.jsx` and `./components/SignUp.jsx`, but those files are absent. The actual components live in the repository-level `components/` directory. Imports and backend wiring must be corrected before the demo can exercise registration. `/dashboard` is not registered as a route, even though the sign-in placeholder navigates there.

Other demo commands are `npm run build`, `npm run lint`, and `npm run preview`. Preview serves a previously generated build. These scripts are defined in `test-project/package.json`; their presence does not mean the current demo builds successfully.

## Signup behavior

### React component

`components/SignUp/SignUp.jsx` currently accepts two props:

| Prop | Current behavior |
| --- | --- |
| `backend` | URL passed directly to `axios.post`; must point to a backend endpoint provided by the consuming application. |
| `dbUrl` | If truthy, changes the request body to `{ formData, dbUrl }`. Custom database handling is unfinished in the backend. |

The form collects `username`, `email`, and `password`. Without `dbUrl`, it posts these fields directly in the JSON body. It calls `useNavigate`, so it requires React Router context, even though it does not currently redirect after signup. The login link is hardcoded to `/login/`.

Known form issues:

- Confirmation is stored as an object and compared to the password string, so the mismatch check is incorrect. A mismatch also does not stop the request.
- The submit handler calls `res.json()` on an Axios response instead of reading `res.data`.
- Request failures share the password-mismatch message, and loading is not cleared in the error path.
- Submission is attached to the button's `onClick` rather than the form's `onSubmit`.

Configurable appearance, initial values, redirect URLs, and alternate layouts are not implemented props. Earlier design notes should not be treated as an available component API.

### Backend handler

`api/auth/Signup.js` expects an Express-style request and response supplied by a host application. It has no built-in endpoint URL.

For requests without a truthy `req.body.dbUrl`, the handler:

1. Reads `username`, `password`, and `email` from `req.body`.
2. Attempts a Mongoose connection using a hardcoded MongoDB connection string.
3. Hashes the password with bcryptjs using a cost factor of `10`.
4. Reads `process.env.API_KEY` and stores it as the user's required `key` field.
5. Attempts to save the user and returns HTTP `201` on success, or HTTP `401` when the save throws.

`dotenv.config()` runs when the handler module loads. `API_KEY` is the only environment variable read by this handler; it is stored on the user document and does not authenticate incoming requests. There is no environment-based MongoDB URI configuration. A missing `API_KEY` prevents a valid user document from being saved because the schema requires `key`.

If `req.body.dbUrl` is truthy, the save branch is skipped and no response is sent. Database connection failures are logged without stopping execution, and connection/password-hashing errors do not have comprehensive response handling. The schema uses `timeStamps` instead of Mongoose's `timestamps` option, so automatic timestamps are not enabled as intended.

## Security limitations

The current code is unsuitable for handling real user credentials:

- The signup handler contains hardcoded database credentials. Treat them as exposed and rotate them before further use; move database configuration to server-side environment variables.
- It logs the request body, password hash, and `API_KEY`.
- Its successful response includes the submitted plaintext password.
- Server-side input validation, authentication checks, and rate limiting are absent. Duplicate username/email errors have no dedicated handling.
- The `dbUrl` prop would send database connection information from the browser; database credentials should remain on the server.

The repository also tracks an `.env` file and `node_modules/`, despite ignore rules for them. Adding a path to `.gitignore` does not remove already tracked files or erase values from Git history.

## Validation and next work

Root `npm test` currently prints `Error: no test specified` and exits with status `1`. There is no automated authentication test suite.

Before an end-to-end integration or usable package release:

1. Remove exposed secrets and credential logging, and stop returning passwords.
2. Configure the database on the server, validate requests, and handle errors consistently.
3. Repair signup confirmation, response handling, loading/error feedback, and demo imports.
4. Define consistent backend and frontend entry points and include their files in the npm archive.
5. Implement real sign-in, session/token handling, sign-out, and protected routes.
6. Add tests for registration, authentication, failure paths, and package consumption.

## License

`package.json` declares ISC. A standalone license file is not currently included in the repository.
