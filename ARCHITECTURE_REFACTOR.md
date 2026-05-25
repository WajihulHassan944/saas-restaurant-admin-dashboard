# Architecture refactor notes

## What changed

- Moved application source into `src/` and updated the TypeScript alias to `@/* -> ./src/*`.
- Added a shared API layer under `src/shared/api`:
  - `http-client.ts` for the typed Axios client and auth refresh retry.
  - `response.ts` for response envelope parsing.
  - `params.ts` for query/body parameter cleaning.
  - `errors.ts` for normalized API errors.
  - `query-client.ts` for React Query defaults.
- Added a feature-based structure under `src/features` for auth, menu, branches, orders, customers, deliverymen, employees, reports, inventory, loyalty, notifications, printing, promotions, and settings.
- Kept route paths unchanged and converted App Router page files into thin wrappers that render feature page components.
- Centralized layout composition in `src/app/providers.tsx` and `src/shared/layout/AppShell.tsx`.
- Centralized branch/restaurant scope helpers in `src/shared/lib/scope.ts` and `src/shared/hooks/use-current-scope.ts`.
- Removed the old `hooks/useApi.ts` hook and migrated callers to the shared API client / feature API modules.
- Converted auth forms to React Hook Form + Zod.
- Added feature schemas/mappers for branch editing, opening hours, menu item creation, and POS add-to-cart payloads.
- Split the menu feature into feature folders for items, categories, modifiers, modifier groups, variations, labels, allergens, and menus.
- Moved large menu/branch/POS/report UI implementations behind feature-level adapters and entity-level compatibility components to avoid product behavior regressions.
- Fixed the Branch Details popup to render only fields that exist in the backend response shape.
- Added reusable shared components for status badges, page sections, and modal actions.
- Added production scripts: `typecheck` and `check`.

## Compatibility choices

Some legacy-heavy screens are intentionally wrapped through `src/entities/**` adapters instead of being rewritten from scratch in one pass. This preserves working behavior while allowing gradual replacement with smaller RHF/Zod feature components. The menu feature wrappers are under 300 lines; legacy implementations remain isolated under `entities`.

## Validation

The following commands were run successfully in this workspace:

```bash
npm run typecheck
npm run lint
npm run check
```

`next.config.mjs` pins the build worker count to one CPU to make production builds deterministic in constrained CI/sandbox environments.
