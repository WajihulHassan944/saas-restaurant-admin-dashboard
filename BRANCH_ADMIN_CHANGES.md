# Branch Admin Integration Changes

This codebase now supports both restaurant admins and branch admins from the same dashboard.

## Core behavior

- Added role-aware auth/session handling for `BUSINESS_ADMIN`, `RESTAURANT_ADMIN`, and `BRANCH_ADMIN`.
- Branch admins are scoped to their JWT `tenantId`, `restaurantId`, and `branchId`.
- Branch admins cannot switch restaurants/branches from the UI.
- Shared API clients attach bearer tokens and retry refresh once on 401.
- 403 responses show a branch/account-specific permission message.

## Branch-admin UI

- Added `/branch-workspace` as the main branch-admin workspace.
- Branch admins see a scoped dashboard, My Branch page, orders, POS, menu overrides, inventory, delivery team, branch staff/roles, promotions, loyalty read views, reports, invoices, notifications, profile, and auto-printing.
- Restaurant admins keep the existing multi-branch management experience.

## Dynamic/scoped pages

- Dashboard, orders, POS, menu, menu items, menu categories, deliverymen, customers, employees, promotions, reports, invoices, notifications, loyalty, auto-printing, and branch settings now use logged-in branch scope when the current user is a branch admin.
- Menu item/category branch overrides are implemented through branch override endpoints instead of full catalog mutation for branch admins.
- Branch admins get branch-specific inventory stock movement screens.
- Branch admins can view loyalty data but manual points/program changes remain restricted.
- Branch admins can manage promotions/happy-hours within their assigned branch scope.

## Validation

- `npx tsc --noEmit --pretty false` passes.
- `next build` was attempted, but the sandbox build process did not complete within the execution timeout. Google font fetching was also removed from `lib/fonts.ts` in favor of local system font fallbacks to avoid external build-time network dependency.

## Follow-up fixes - 2026-05-24

- Removed `branchId` from menu catalog GET calls (`/menu/items`, `/menu/categories`, `/menus`) because those endpoints validate as restaurant/catalog reads and branch overrides are handled by `/menu/branch-overrides/*`.
- Removed `restaurantId` and `branchId` from branch-admin staff/role list and create/update payloads; branch admin staff scope is now JWT-driven for `/staff-management` and `/staff-roles`.
- Restored the original Google font setup through `next/font/google` and loaded the font variables globally in the root layout.
- Updated the branch-scope pill in the top navbar to fetch and display the assigned branch name instead of the raw branch ID, with a green scope style.
- Removed Promotion Management from branch-admin navigation and dashboard shortcuts, and added a route guard for `/promotion-management` and all nested promotion routes.
- Invalidated deliveryman stats/dashboard queries after deliveryman create/update/delete/status changes so cards refresh after returning to the listing page.
