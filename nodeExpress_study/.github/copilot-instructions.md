# AI Coding Assistant Guidance for nodeExpress_study

Short context
- This repo is a small, educational Node.js / Express study repo with examples of: Express routes (`app.js`), native Node `http` server (`server.js`), static serving (`index.js` commented sample), file system examples (`fileSystem.js`), stream examples (`stream.js`), and a simple validation schema stub (`validationSchema.js`).
- `package.json` sets "type": "module" and `main: app.js` and includes dependencies `express` and `express-validator`.

Top-level architecture notes
- Primary application server is `app.js`. It defines the Express app, middleware, and a set of CRUD endpoints around `/api/users` using an in-memory `users` array. Use this file to add or modify API behaviour.
- `server.js` is a minimal native Node HTTP example to serve HTML files from `docs/`. Avoid editing `app.js` and `server.js` simultaneously unless intentionally merging Express and raw HTTP logic.
- `index.js` contains commented examples for Express file serving and middleware ordering—use this for reference.
- `fileSystem.js` and `stream.js` are tutorial/demo snippets showing Node core APIs. They are not wired into `app.js` and can be modified freely for learning examples.
- `docs/` contains HTML files used by `server.js` and `index.js` samples.

Important patterns you should follow (do not change without tests or user approval):
- ESM is the repo default (see `package.json` type: "module"). Prefer `import` statements when adding new modules. If you intentionally write CommonJS, use `.cjs` extension or `createRequire` to avoid runtime errors.
- Route patterns: API endpoints are under `/api/users`. When adding endpoints, follow the existing style (simple middleware functions in `app.js`, keeping route handlers short and focused).
- In-memory store: `users` is intentionally an array used for CRUD demos; it is not a persistent DB. If you add persistent storage, document and add config to `package.json` accordingly.
- Parameter middleware: `getUserIndex` is an example of middleware that attaches `req.userIndex` for downstream route handlers. Follow similar patterns for param-based middleware (do not mutate `req` in unexpected ways).
- Validation: `express-validator` is installed and `validationSchema.js` exists as a demo. Prefer schema validation using `check()` / `validationResult()` in route middleware and keep validation logic separate from route handlers (e.g., `validationSchema.js` or `/middlewares/validation.js`). The current schema object is a stub; if you update it, ensure it matches express-validator usage.

Developer workflows and commands
- Start the dev server (auto restart) with: `npm run start` (nodemon). To run once: `npm run dev`.
- Default app port is hard-coded to 5000 in `app.js`. Use environment variables if you externalize config later.
- Quick API sanity checks:
  - GET all: `curl http://localhost:5000/api/users`
  - Create: `curl -X POST -H "Content-Type: application/json" -d '{"user_name":"New"}' http://localhost:5000/api/users`
  - Update: `curl -X PATCH -H "Content-Type: application/json" -d '{"user_name":"Updated"}' http://localhost:5000/api/users/1`
- Debugging pattern: add console.log statements or run with node's inspector: `node --inspect app.js` or update `package.json` scripts when needed.
- Tests: there are currently no test scripts. Keep changes small and self-contained; consider adding tests and a `test` script when adding behavior.

Code style & conventions
- Use existing naming for fields (user_name) to minimize breaking changes to other examples. When adding new fields or endpoints, be consistent with underscore style or migrate the repo in a separate PR.
- Use small, readable route handlers (the current repo places all routes in `app.js`—if you split into routers/controllers, follow Express router conventions and add an `index.js` or `app.js` glue to import and mount them).
- Avoid using duplicate IDs in `users`. If demonstrating duplicate handling as a learning example, explicitly document it.
- When adding files, maintain ESM (`import`) unless you intentionally need CommonJS - then use `.cjs`.

Where to look / relevant files
- Main app: `app.js` (CRUD endpoints & middleware)
- Example native HTTP server: `server.js`
- Express static + middleware example: `index.js` (commented)
- Node core API demos: `fileSystem.js`, `stream.js`
- Validation shape: `validationSchema.js` (stub, not wiredup)
- Frontend demo HTML: `docs/` (home.html, demo.html, about.html, 404.html)
- Package: `package.json` (scripts, dependencies, ESM type)

How to propose changes
- Keep changes to `app.js` minimal and functional. If adding structure (routers / controllers / services), split logically and update `app.js` to import and mount routers.
- If you add third-party packages, update `package.json` and include usage examples or reasons in PR description.

Small reminders for AI agents
- This is a small tutorial repo with a single purpose; do not attempt to over-engineer. Keep fixes incremental and explain the reasoning in comments or PR descriptions.
- Where a file is an example (commented code or non-wired script), avoid applying heavy refactors unless requested by the user.
- Prefer ESM (`import`) and respect `package.json`'s `type`: "module".

If any part of this guidance is unclear or the codebase changes meaningfully, ask for permission before performing large refactors (e.g., introducing a DB or converting all code to CommonJS).