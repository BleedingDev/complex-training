# E2E updates (summary)
- Centralized selectors in `config.robot` (includes submit/cancel/error/success selectors).
- Unique test data via `Get Unique Test Data` combining timestamp+random.
- Health checks now use timeouts and accept any 2xx (run_tests.sh/py); URLs can be overridden with FRONTEND_URL, API_URL.
- Environment variables: FRONTEND_URL, API_URL, BROWSER, HEADLESS, SLOW_MO, DEFAULT_TIMEOUT, LONG_TIMEOUT (documented in README/SUMMARY; defaults in config.robot).
- Robot runners accept headless/slow-mo/tag filters; run_tests.py enforces 10 min timeout and clearer missing-tool errors.
- Docs list how to open reports (report.html/log.html under apps/e2e/results).
