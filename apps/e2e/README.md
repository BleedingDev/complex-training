# E2E Tests (Robot Framework Browser)

End-to-end checks for the Solargis demo (Angular frontend + FastAPI backend) using Robot Framework Browser (Playwright).

## Prerequisites
- Node.js 18+
- Python 3.10+ with uv (api deps install via uv)
- Playwright browsers (installed via `rfbrowser init`)

## Install & init (pinned rfbrowser 19.1.0)
```bash
cd apps
uv pip install -r e2e/requirements.txt   # includes pinned robotframework-browser
rfbrowser init                           # downloads Playwright browsers
```

## Environment variables (overridable via `-v` or env)
- FRONTEND_URL (default http://localhost:4200)
- API_URL (default http://localhost:8000)
- BROWSER (chromium|firefox|webkit, default chromium)
- HEADLESS (true|false, default false)
- SLOW_MO (seconds, default 0.0)
- DEFAULT_TIMEOUT (default 10s)
- LONG_TIMEOUT (default 30s)

## Selectors (data-testid)
Defined in `config.robot`:
- List: `${SITES_LIST_SELECTOR}`, `${SITE_ITEM_SELECTOR}`
- Buttons: `${ADD_SITE_BUTTON}`, `${SUBMIT_BUTTON}`, `${CANCEL_BUTTON}`
- Form: `${SITE_FORM_SELECTOR}`, `${NAME_INPUT}`, `${LOCATION_INPUT}`, `${CAPACITY_INPUT}`, `${STATUS_SELECT}`
- Messages: `${ERROR_MESSAGE_SELECTOR}`, `${SUCCESS_MESSAGE_SELECTOR}`
- Detail: `${SITE_DETAIL_SELECTOR}`

## Unique test data
`Get Unique Test Data` (ms timestamp + random suffix) avoids name collisions; used in create tests.

## Health checks
Runners call backend `/health` and frontend root with timeouts; any 2xx is success. URLs come from FRONTEND_URL / API_URL; timeouts are built in (curl/pyst requests).

## Running tests
- Bash runner (with health checks/timeouts):
```bash
cd apps
e2e/run_tests.sh            # defaults
HEADLESS=true SLOW_MO=1.0 e2e/run_tests.sh -t smoke
```
- Python runner (10m timeout, health checks env-driven):
```bash
cd apps
python e2e/run_tests.py --headless
python e2e/run_tests.py -s sites_list -t smoke
```

## Reports
Results in `apps/e2e/results/` (gitignored). Open `report.html` / `log.html` (macOS `open`, Linux `xdg-open`).

## Hygiene
- Logs/reports/screenshots in `apps/e2e/results/` are gitignored; avoid committing transient artifacts.

## Suites
- `tests/sites_list.robot` – list smoke/seed/responsive
- `tests/sites_form.robot` – create + validation
- `tests/sites_management.robot` – combined list/create/validation

## Key keywords
- `Setup Browser For Tests`, `Navigate To Sites List Page`, `Verify API/Frontend Is Running`
- `Get Unique Test Data`, `Verify Site In List`, `Wait For Element And Click`
