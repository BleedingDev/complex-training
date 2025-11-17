# E2E Summary

## Structure
- config.robot: env defaults, timeouts, centralized SELECTORS, test data defaults
- resources/common_keywords.robot: shared keywords (unique data helper, waits, health checks)
- tests/: suites (sites_list, sites_form, sites_management)
- run_tests.sh / run_tests.py: runners with health checks and timeouts
- results/ (gitignored): reports and logs

## Selectors (config.robot)
- List: ${SITES_LIST_SELECTOR}, ${SITE_ITEM_SELECTOR}
- Buttons: ${ADD_SITE_BUTTON}, ${SUBMIT_BUTTON}, ${CANCEL_BUTTON}
- Form: ${SITE_FORM_SELECTOR}, ${NAME_INPUT}, ${LOCATION_INPUT}, ${CAPACITY_INPUT}, ${STATUS_SELECT}
- Messages: ${ERROR_MESSAGE_SELECTOR}, ${SUCCESS_MESSAGE_SELECTOR}
- Detail: ${SITE_DETAIL_SELECTOR}

## Env & timeouts
Defaults: FRONTEND_URL, API_URL, BROWSER, HEADLESS, SLOW_MO, DEFAULT_TIMEOUT, LONG_TIMEOUT. Override via env or `-v`.

## Unique data
`Get Unique Test Data` (timestamp ms + random) used for site names to avoid collisions.

## Runners
- run_tests.sh: curl checks with timeouts, HEADLESS/SLOW_MO/tag options.
- run_tests.py: 2xx health checks, env-driven URLs/headless/slow, 10m timeout, rerun-failed support.

## Reports
Open apps/e2e/results/report.html (macOS: `open`, Linux: `xdg-open`).
