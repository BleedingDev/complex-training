# Task 1 – Backend API Change (Sites filter)

## Goal
Add an optional `status` query parameter to `GET /api/sites` so callers can filter sites by status (`active`, `maintenance`, `offline`) while keeping the current default (return all sites when no filter is provided).

## Context
- Backend is a FastAPI app in `apps/api`. Data lives in the in-memory seed list in `apps/api/seed.py`, models are in `apps/api/models.py`, and routes are in `apps/api/main.py`.
- Frontend (Angular 20) consumes this endpoint via `SitesService` in `libs/frontend-data-access/src/lib/sites.service.ts`.
- Two run modes are available:
  - Standard: `npm install` then `nx serve api` (port 8000) and `nx serve frontend --host=0.0.0.0 --port=4200`.
  - Docker: `docker compose up api frontend` (ports 8000 and 4200).

## Steps
1) In `apps/api/main.py`, update the `/api/sites` handler to accept an optional `status` query parameter.
2) Validate the value against the existing `SiteStatus` enum; on invalid input, return 422 with a clear message.
3) Filter the seed sites when `status` is provided; otherwise, return the full list (current behavior).
4) Keep response shape unchanged and avoid breaking existing routes.

## Acceptance Criteria
- Calling `GET /api/sites` with no query param still returns all seeded sites (200).
- `GET /api/sites?status=active` returns only active sites; similar for `maintenance` and `offline` (200).
- Invalid status (e.g., `status=foo`) produces a 422-style validation error with a helpful message.
- OpenAPI docs reflect the new query parameter automatically (FastAPI dependency).
- Code style aligns with existing FastAPI patterns; no new globals or breaking changes.

## Handoff Notes
- Note the exact query param and validation behavior so the next BE test task can cover it.
- Mention any new helper you introduce (if any) and where it lives.
