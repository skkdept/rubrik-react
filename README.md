# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Railway deployment (password-protected preview)

This branch adds `server.js`, an Express server that serves the built app behind a
password gate, for use as a Railway preview deployment. The password is validated
server-side and lives in an environment variable — there is no database.

Required Railway service variables:

- `SITE_PASSWORD` — the password visitors must enter.
- `SESSION_SECRET` — random string used to sign the session cookie (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

Railway runs `npm run build` then `npm start` (see `railway.json`). For a local dry run:

```
cp .env.example .env   # fill in real values
npm run build
npm start
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
