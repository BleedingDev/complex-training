# Mifulacm Demo App (Nx: Angular + FastAPI)

## Requirements
- Node.js 18+ (npm included)
- Python 3.10+ (uv is used by Nx during sync)
- git

## Installation (first time)
```
npm install              # Installs JS dependencies
npx nx run api:sync      # Creates .venv in apps/ and installs Python deps via uv
```

## Start development
```
npm run dev              # FE at http://localhost:4200, BE at http://localhost:8000
```
Alternatively, run them separately:
```
npx nx serve api
npx nx serve frontend -- --host=0.0.0.0 --port=4200
```

## Docker (easiest way)
- You only need Docker + Docker Compose.
- Start both apps: `docker compose up --build`
  - FE: http://localhost:4200
  - API: http://localhost:8000
- Run all tests: `docker compose run --rm tests`
  - Uses the same images; add `--build` if you change dependencies.

### Docker development with hot reloading (equivalent to `npm run dev`)
- Run: `docker compose -f docker-compose.dev.yml up --build`
- Frontend: http://localhost:4200 (Nx dev server with HMR)
- API: http://localhost:8000 (uvicorn --reload)
- Stop: `Ctrl+C` then `docker compose -f docker-compose.dev.yml down`
  - The dev proxy routes `/api` to service `api:8000` (see `proxy.conf.docker.json`).

## Tests
- FE unit: `npx nx test frontend`
- FE data-access: `npx nx test frontend-data-access`
- BE pytest: `npx nx test api`
- E2E (Robot Browser, optional):
```
cd apps
uv run pip install robotframework-browser
uv run rfbrowser init
uv run robot e2e/tests/sites_management.robot
```
(requires running dev servers)

## Notes
- Without Docker everything runs locally on Node + Python.
- `data-testid` is preserved for Robot E2E; UI uses dark mode by default.
- Backend/Frontend URLs can be overridden via env vars (API_URL, FRONTEND_URL); Docker is not required.

## VS Code tips
- Extensions: Nx Console, Prettier, ESLint, Jest Runner (see `.vscode/extensions.json`).
- Settings: `.vscode/settings.json` enables Prettier as default formatter, formatOnSave, and ESLint fix on save.
- **Test artifact hygiene**: Robot Framework outputs (log.html, report.html, output.xml) are ignored. `robotframework-browser` is pinned to 19.1.0 for stability.
