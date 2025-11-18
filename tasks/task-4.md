# Task 4 – Frontend Tests for Sites Filter

## Goal
Add Jest/Angular unit tests to cover the new status-filter behavior on the frontend (service call + UI trigger).

## Context
- Existing FE test example: `libs/frontend-data-access/src/lib/sites.service.spec.ts` using `HttpClientTestingModule`.
- Sites page and service were updated in Task 3 to support `status` filtering.
- Standard run: `npm install` then `nx test frontend frontend-data-access`. Docker: `docker compose run --rm tests` (runs NX tests inside container).

## Steps
1) Extend `SitesService` tests (or add a new spec) to assert that calling the new filter-aware method issues a request to `/api/sites?status=active` (and omits the param for “All”).
2) Add a shallow component test for the Sites page (or a small harness) that simulates selecting a status option and verifies it delegates to the service with the expected argument. Mock the service to avoid real HTTP calls.
3) Keep tests fast and focused: assert URL/method, argument wiring, and that no unexpected requests are left pending.
4) Run the FE test targets locally (standard or Docker) and ensure they pass.

## Acceptance Criteria
- Tests cover both the service URL construction and the UI-to-service interaction for the status filter.
- Requests with a status include the query param; “All” omits it.
- Test suite `nx test frontend frontend-data-access` (standard) or `docker compose run --rm tests` (Docker) passes.
- No leftover HTTP expectations or console warnings in test output.

## Handoff Notes
- Share any helper test utilities you introduced so reviewers know where to find them.
- Confirm the test names clearly describe the behavior under test for PR review.
