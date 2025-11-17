# E2E Architecture

- **Stack**: Robot Framework + Browser (Playwright)
- **Layout**:
  - `config.robot` – env vars (FRONTEND_URL, API_URL), browser opts (BROWSER, HEADLESS, SLOW_MO), timeouts, centralized selectors, default test data.
  - `resources/common_keywords.robot` – shared keywords (health checks, waits, unique data helper, click/fill helpers).
  - `tests/` – suites for list, form, management.
  - Runners: `run_tests.sh` (curl health checks with timeouts), `run_tests.py` (requests-based 2xx checks, 10m timeout, env overrides).
  - Results: `results/` (gitignored) with log.html/report.html/screenshots.
- **Selectors**: data-testid based; includes list, buttons, form fields, messages, detail card.
- **Data**: `Get Unique Test Data` to avoid name collisions (timestamp ms + random).
- **Env flow**: defaults in config.robot; override via env or `-v` for FRONTEND_URL, API_URL, BROWSER, HEADLESS, SLOW_MO, DEFAULT_TIMEOUT, LONG_TIMEOUT.
- **Reports**: after runs, open `apps/e2e/results/report.html` (`open` on macOS, `xdg-open` on Linux).
