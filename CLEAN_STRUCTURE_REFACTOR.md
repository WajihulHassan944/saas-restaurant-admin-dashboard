# Clean Structure Refactor

This update continues the restaurant-admin / branch-admin dashboard refactor into a clean App Router structure while preserving existing route URLs, API payload names, role behavior, and branch-admin scoping semantics.

## Dependency/install changes

- Renamed package to `saas-restaurant-admin-dashboard`.
- Kept `next@16.0.10`, `react@19.2.0`, and `react-dom@19.2.0`.
- Replaced ESLint 10 with Next-compatible `eslint@^9.39.4` and `eslint-config-next@^16.2.6`.
- Removed direct `@eslint/js`, `typescript-eslint`, and `eslint-plugin-react-hooks` devDependency declarations from `package.json` because the final ESLint config does not import them directly.
- Added `vitest@^4.1.7` and `baseline-browser-mapping@^2.10.31`.
- Added public `.npmrc` using only `https://registry.npmjs.org/`.
- Cleaned internal registry URLs from `package-lock.json`.

## Architecture changes

- Moved routes into `src/app/(auth)` and `src/app/(dashboard)` route groups without changing public URLs.
- Kept `src/app/layout.tsx`, `src/app/providers.tsx`, and `src/app/globals.css` at the app root.
- Made app route `page.tsx` files thin wrappers that render components from `src/components/pages`.
- Removed the previous `src/features`, `src/shared`, `src/entities`, and `src/widgets` top-level architecture folders.
- Moved shared API helpers into `src/lib`.
- Moved feature API modules into `src/services`.
- Moved schemas into `src/validations`.
- Moved layout shell, navbar, sidebar, query provider, and auth provider into `src/components`.
- Moved reusable utilities into `src/lib` and reusable UI helpers into `src/components/common`.

## Auth, forms, and validation

- Added safe login redirect helpers in `src/lib/auth-routes.ts`.
- Login redirect handling now rejects external, protocol-relative, and hostile-protocol redirects.
- Auth forms use React Hook Form + Zod with `zodResolver` and `noValidate`.
- Removed component/page-level manual Zod validation patterns from `src/components` and `src/app`.
- Added reusable Zod error helpers in `src/lib/zod-errors.ts`.

## Tests added

- `src/lib/auth-routes.test.ts`
- `src/lib/params.test.ts`
- `src/lib/response.test.ts`
- `src/validations/auth.test.ts`

## Verification note

The dependency-install and npm script verification could not complete inside the sandbox because DNS resolution to `registry.npmjs.org` failed with `EAI_AGAIN`. Non-install audits that do not require `node_modules` passed, including internal-registry URL scan, old architecture import scan, old architecture folder scan, route-group presence, manual Zod validation scan for app/components, React.FC/default React import scan, console cleanup scan, and tests-present scan.
