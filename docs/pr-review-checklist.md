# PR Review Helper (Tasks 1–5)

Use this when reviewing the status-filter work with CodeRabbit (or any review bot) and during a quick human pass.

- API contract: `/api/sites` accepts optional `status` (`active|maintenance|offline`); no param still returns all. Invalid values should be 422.
- Backend tests: verify new tests cover valid filters, invalid input, and keep seed data expectations intact.
- Frontend wiring: Sites page has a Status select (All/Active/Maintenance/Offline) that reloads the list via the service; the service appends `?status=...` only when set.
- Frontend tests: ensure service spec asserts the filtered URL and the page spec checks the filter triggers `loadSites` with the right argument.
- CodeRabbit prompt suggestion: “Focus on API backward compatibility, status filter behavior, UI-to-service wiring, and test coverage. Flag non-English strings or missing accessibility on the filter control.”
