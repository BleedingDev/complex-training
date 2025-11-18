# Mifulacm Demo App (Nx: Angular + FastAPI)

## Co potřebujete
- Node.js 18+ (npm součástí)
- Python 3.10+ (uv spustí Nx při sync)
- git

## Instalace (poprvé)
```
npm install              # JS dependency
npx nx run api:sync      # vytvoří .venv v apps/ a nainstaluje Python deps přes uv
```

## Spuštění vývoje
```
npm run dev              # FE na http://localhost:4200, BE na http://localhost:8000
```
Alternativně samostatně:
```
npx nx serve api
npx nx serve frontend -- --host=0.0.0.0 --port=4200
```

## Docker (nejjednodušší způsob)
- Potřebujete jen Docker + Docker Compose.
- Spustit obě aplikace: `docker compose up --build`
  - FE: http://localhost:4200
  - API: http://localhost:8000
- Spustit všechny testy: `docker compose run --rm tests`
  - Použije stejné image; pokud změníte závislosti, přidejte `--build`.

### Docker vývoj s hot reloading (ekvivalent `npm run dev`)
- Spusťte: `docker compose -f docker-compose.dev.yml up --build`
- Frontend: http://localhost:4200 (Nx dev server s HMR)
- API: http://localhost:8000 (uvicorn --reload)
- Konec: `Ctrl+C` a `docker compose -f docker-compose.dev.yml down`
  - Proxy v dev módě směruje `/api` na službu `api:8000` (viz `proxy.conf.docker.json`).

## Testy
- FE unit: `npx nx test frontend`
- FE data-access: `npx nx test frontend-data-access`
- BE pytest: `npx nx test api`
- E2E (Robot Browser, volitelné):
```
cd apps
uv run pip install robotframework-browser
uv run rfbrowser init
uv run robot e2e/tests/sites_management.robot
```
(vyžaduje běžící dev servery)

## Poznámky
- Bez Dockeru; běží lokálně na Node + Python.
- `data-testid` zachováno pro Robot E2E; UI je v dark mode.
- Backend/Frontend URL lze přepsat env proměnnými (API_URL, FRONTEND_URL); není potřeba žádný Docker.

## VS Code tipy
- Rozšíření: Nx Console, Prettier, ESLint, Jest Runner (viz `.vscode/extensions.json`).
- Nastavení: `.vscode/settings.json` zapíná Prettier jako default formatter, formatOnSave a ESLint fix on save.
- **Test artifact hygiene**: Robot Framework výstupy (log.html, report.html, output.xml) jsou automaticky ignorovány. `robotframework-browser` je pinováno na verzi 19.1.0 pro stabilitu.
