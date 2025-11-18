# Task 3 – Frontend Sites Filter Component

## Goal
Add a lightweight status filter UI on the Sites page that calls the backend with the new `status` query parameter and refreshes the list accordingly.

## Context
- Sites page lives in `apps/frontend/src/app/sites.page.ts` and uses `SitesService` from `libs/frontend-data-access/src/lib/sites.service.ts` plus `SiteListComponent` UI.
- The backend now supports `GET /api/sites?status={status}` (Task 1); tests for it exist (Task 2).
- Standard run: `npm install`, then `nx serve frontend --host=0.0.0.0 --port=4200` (API on 8000). Docker run: `docker compose up frontend` (depends on `api`).

## Steps
1) Update `SitesService` to optionally accept a `status` filter when loading sites (e.g., `loadSites(status?: SiteStatus)` and/or a variant method) so it calls `/api/sites?status=...` when provided.
2) Add a small filter control to the Sites page (e.g., a select or pill group with `All | Active | Maintenance | Offline`). Default is “All” (no query param).
3) On filter change, trigger a reload via the service and keep the existing loading/error handling intact.
4) Ensure UI copy is in English only and matches existing styling (Tailwind classes already used in `app.html`).

## Acceptance Criteria
- Sites page displays a visible status filter control with four options (All + three statuses).
- Selecting a status triggers an API call that includes the correct `status` query param; “All” omits the param.
- The list updates according to the filter; loading and error states still work.
- No console errors in the browser while toggling filters.

## Handoff Notes
- Note any new component or method names added to `SitesService` or the Sites page; FE test task will use them.
- Mention any UI text strings you introduced for potential reuse in tests.
