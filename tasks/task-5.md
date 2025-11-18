# Task 5 – PR Review with CodeRabbit (or similar)

## Goal
Perform a concise code review of the changes from Tasks 1–4 using CodeRabbit (or another AI review assistant) plus a quick human sanity check, and provide a short review summary + action items.

## Context
- Repo contains FastAPI backend (apps/api) and Angular frontend (apps/frontend, libs/*). Recent changes add a status filter to sites API + UI and related tests.
- CodeRabbit can be triggered via its GitHub app or CLI; GitHub’s built-in review + local `git diff` is also fine if CodeRabbit is unavailable.
- Standard checks: `uv run pytest apps/tests` and `nx test frontend frontend-data-access`. Docker alternative: `docker compose run --rm tests`.

## Steps
1) Pull the latest branch with Tasks 1–4 completed; ensure dependencies are installed (standard `npm install` + `uv sync`) or containers built (`docker compose build`).
2) Run the quick test suites (standard or Docker) to confirm no regressions.
3) Trigger CodeRabbit review on the branch/PR; ask it to focus on API contract, FE-service wiring, and test coverage for the status filter.
4) Manually skim the diff for:
   - Backward compatibility of `/api/sites` without a filter.
   - Error messaging in English only.
   - UI accessibility of the new filter control (labels/focus states).
5) Post a short review summary with:
   - ✅ items that look good
   - ⚠️ any follow-ups/asks

## Acceptance Criteria
- CodeRabbit (or equivalent) review is executed and its key points captured in the summary.
- Local tests are reported as run (pass/fail) with commands noted.
- Review comments cover API behavior, FE wiring, and tests; all text is English-only.
- Summary clearly separates approvals from follow-up items.

## Handoff Notes
- Share the review summary and any requested fixes with the team before the final demo.
- Flag any blockers early so they can be addressed in the remaining time.
