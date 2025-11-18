# Plan to Reach the Goal

1) Create a working plan file
   - In the repo root create `PLAN.md` and record the latest agreed plan (FE/BE, tests, UV, Robot).
   - Add short TODO checklists (done/remaining).

2) Initialize the monorepo
   - `npx create-nx-workspace@latest solargis-demo --preset=empty --nx-cloud=false` (already executed in the target directory).
   - Install dev dependencies: `@nx/angular @nx/jest @nx/cypress tailwindcss postcss autoprefixer @nxlv/python concurrently`.
   - In `nx.json` enable the `@nxlv/python` plugin with `"packageManager": "uv"`.

3) Backend (FastAPI + UV)
   - `nx g @nxlv/python:uv-project api --projectType=application --directory=apps`.
   - Add dependencies to `apps/api/pyproject.toml`: `fastapi uvicorn pydantic python-dotenv pytest httpx robotframework-browser`.
   - In `apps/api/project.json` add targets `serve` (uvicorn) and `test` (pytest).
   - Implement `apps/api/src/api/main.py` + seed data.
   - Verify: `nx serve api` (health endpoint), `nx test api`.

4) Frontend (Angular 20 + Tailwind)
   - `nx g @nx/angular:app frontend --routing --standalone --style=css --e2eTestRunner=none --unitTestRunner=jest`.
   - `nx g @nx/angular:setup-tailwind --project=frontend`.
   - Libraries: `nx g @nx/js:lib shared-types`, `nx g @nx/angular:lib frontend-data-access --standalone`, `nx g @nx/angular:lib frontend-ui --standalone`.
   - Implement services, components (list, detail, form), Tailwind layout.
   - Verify: `nx test frontend`; manual `nx serve frontend` with proxy to API.

5) Proxy and running both servers
   - `proxy.conf.json` and update `apps/frontend/project.json`.
   - Scripts in `package.json`: `"dev": "concurrently \"nx serve api\" \"nx serve frontend\""`.

6) Robot Framework E2E
   - `uv run pip install robotframework-browser` + `uv run rfbrowser init`.
   - `apps/e2e/tests/app.robot` with tests: load list, add new item, validate error.
   - Run: `nx serve api & nx serve frontend &` and `uv run robot apps/e2e/tests/app.robot`.

7) Ongoing validation
   - After each block: `nx test api`, `nx test frontend`, manual UI smoke.
   - Run E2E after FE↔BE is connected.

8) Documentation in `PLAN.md`
   - After each phase, check off tasks and add notes (what changed, commands to run).

9) Final check
   - `npm run dev` (FE+BE), open UI, run Robot E2E, ensure Jest/pytest are green.

10) Handover
    - Ensure `PLAN.md` describes run/test steps and a brief QA guide (Robot command).

---

## TODO overview
- [x] Initialize Nx workspace and install dependencies
- [x] Plugin @nxlv/python in nx.json (`packageManager: "uv"`)
- [x] Backend FastAPI + UV (serve/test, seed data)
- [x] Frontend Angular + Tailwind + libraries (list page connected to API)
- [x] Proxy + dev script
- [x] Robot Framework E2E tests (baseline suite apps/e2e/tests/sites_management.robot)
- [x] Rolling tests (Jest/pytest) green (api, frontend, frontend-data-access)
- [x] Final check and notes

### How to run
- FE/BE dev: `npm run dev` (frontend on 4200 with proxy -> API on 8000)
- Unit tests: `nx test api`, `nx test frontend`, `nx test frontend-data-access`
- E2E (Robot): from `apps/` run `uv run robot e2e/tests/sites_management.robot` (before the first run execute `uv run rfbrowser init`); requires running FE+BE
- [ ] Final check and notes
