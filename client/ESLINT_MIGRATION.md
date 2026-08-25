# Client ESLint Migration Required

## Current state (broken)

`pnpm lint` in `client/` fails with:

```
Invalid Options:
- Unknown options: useEslintrc, extensions, resolvePluginsRelativeTo, rulePaths, ignorePath, reportUnusedDisableDirectives
```

**Root cause chain:**
1. The workspace uses **ESLint 10.2.0** (catalog).
2. ESLint 10 removed all legacy constructor options (`useEslintrc`, `extensions`, etc.) that the old `ESLint` JS class accepted.
3. `next lint` (Next.js 15) still passes those deprecated options internally — it is fundamentally incompatible with ESLint 10.
4. Next.js itself acknowledges this: `next lint` is deprecated and will be removed in Next.js 16.
5. Additionally, ESLint 10 dropped the `eslintrc` config format entirely. `.eslintrc.json` is no longer read.
6. `eslint-plugin-import@2.x` (currently at `^2.29.1`) also crashes on ESLint 10 (`getTokenOrCommentBefore is not a function`).

The `api/` package already uses the correct setup: `eslint.config.mjs` (flat config) + `eslint .` script.

---

## What needs to change

### 1. Replace `next lint` with `eslint .` in `package.json`

```json
"lint": "eslint ."
```

### 2. Add missing devDependencies to `client/package.json`

```json
"@typescript-eslint/parser": "catalog:",
"@next/eslint-plugin-next": "15.5.12"
```

Remove `eslint-plugin-import` (incompatible with ESLint 10 — see below).

### 3. Create `client/eslint.config.mjs`

```js
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**', 'next-env.d.ts'],
  },
  ...tsPlugin.configs['flat/recommended'],
  nextPlugin.flatConfig.coreWebVitals,
  prettierPlugin,
  {
    languageOptions: { parser: tsParser },
    rules: {
      'no-console': [1, { allow: ['info', 'error', 'debug'] }],
    },
  },
];
```

### 4. Delete `.eslintrc.json` and `.eslintignore`

Ignores are now declared inside `eslint.config.mjs`.

### 5. Handle `import/order` separately

`eslint-plugin-import@2.x` is not compatible with ESLint 10. Options:

- **Recommended:** switch to [`eslint-plugin-simple-import-sort`](https://github.com/lydell/eslint-plugin-simple-import-sort) (maintained, ESLint 10 compatible, simpler config).
- **Alternative:** use [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x) — a maintained fork of `eslint-plugin-import` with ESLint 9/10 support.

The `import/order` rule's full `pathGroups` config from `.eslintrc.json` will need to be ported to whichever plugin is chosen.

### 6. Run `pnpm install` and verify

```bash
pnpm install
cd client && pnpm lint
```

After fixing auto-fixable Prettier issues (`pnpm lint -- --fix`), remaining errors will be genuine code issues to address.

---

## Why the `api/` linter works

`api/` already went through this migration. It uses:
- `eslint.config.mjs` with `typescript-eslint` flat config
- `eslint "src/**/*.ts" --fix` script (direct CLI, no `next lint` wrapper)

The client migration follows the same pattern — see `api/eslint.config.mjs` as reference.
