# Task 2 – Backend Tests for Sites Filter

## Goal
Add FastAPI TestClient coverage for the new `status` filter on `GET /api/sites`, including happy paths and invalid input.

## Context
- Tests live under `apps/tests`; current examples use `fastapi.testclient` (see `test_hello.py`).
- The API change from Task 1 adds an optional `status` query parameter to `/api/sites`.
- Standard run: `uv sync` (from repo root) then `cd apps && uv run pytest apps/tests`.
- Docker run: `docker compose run --rm tests` (uses the `tests` service defined in `docker-compose.yml`).

## Steps
1) Create a new test module (e.g., `apps/tests/test_sites_filter.py`) using `TestClient` against `api.main.app`.
2) Add tests that:
   - Assert `GET /api/sites?status=active` returns only active sites and at least one item.
   - Assert `GET /api/sites?status=maintenance` returns only maintenance sites.
   - Assert invalid `status` (e.g., `foo`) returns 422 with a clear error payload.
3) Keep fixtures minimal; reuse the existing in-memory data (no DB mocking needed).
4) Run pytest locally (standard or Docker) and ensure it passes.

## Acceptance Criteria
- New tests are in `apps/tests` and run with the existing suite.
- Tests assert both HTTP status codes and that all returned items match the requested status.
- Invalid `status` case fails with 422 and includes an explanation in the response body.
- `uv run pytest apps/tests` (standard) or `docker compose run --rm tests` (Docker) passes.

## Handoff Notes
- Share the exact endpoints and payload expectations so the FE team can align their calls.
- If you adjusted fixtures or added helper functions, mention the filenames for FE reference.
