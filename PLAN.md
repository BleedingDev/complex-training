# Plán k dosažení cíle

1) Založit pracovní soubor s plánem
   - V kořeni repa vytvořit `PLAN.md` a zapsat do něj poslední odsouhlasený plán (FE/BE, testy, UV, Robot).
   - Přidat krátké TODO checklisty (provedeno/zbývá).

2) Inicializace monorepa
   - `npx create-nx-workspace@latest solargis-demo --preset=empty --nx-cloud=false` (už v cílovém adresáři).
   - Instalace dev závislostí: `@nx/angular @nx/jest @nx/cypress tailwindcss postcss autoprefixer @nxlv/python concurrently`.
   - V `nx.json` zapnout plugin `@nxlv/python` s `"packageManager": "uv"`.

3) Backend (FastAPI + UV)
   - `nx g @nxlv/python:uv-project api --projectType=application --directory=apps`.
   - Přidat závislosti do `apps/api/pyproject.toml`: `fastapi uvicorn pydantic python-dotenv pytest httpx robotframework-browser`.
   - V `apps/api/project.json` doplnit targety `serve` (uvicorn) a `test` (pytest).
   - Implementovat `apps/api/src/api/main.py` + seed data.
   - Ověřit: `nx serve api` (zdravotní endpoint), `nx test api`.

4) Frontend (Angular 20 + Tailwind)
   - `nx g @nx/angular:app frontend --routing --standalone --style=css --e2eTestRunner=none --unitTestRunner=jest`.
   - `nx g @nx/angular:setup-tailwind --project=frontend`.
   - Knihovny: `nx g @nx/js:lib shared-types`, `nx g @nx/angular:lib frontend-data-access --standalone`, `nx g @nx/angular:lib frontend-ui --standalone`.
   - Implementovat služby, komponenty (list, detail, form), Tailwind layout.
   - Ověřit: `nx test frontend`; ruční `nx serve frontend` s proxy na API.

5) Proxy a běh obou serverů
   - `proxy.conf.json` a úprava `apps/frontend/project.json`.
   - Skripty v `package.json`: `"dev": "concurrently \"nx serve api\" \"nx serve frontend\""`.

6) Robot Framework E2E
   - `uv run pip install robotframework-browser` + `uv run rfbrowser init`.
   - `apps/e2e/tests/app.robot` s testy: načtení seznamu, přidání nové položky, validace chyby.
   - Spuštění: `nx serve api & nx serve frontend &` a `uv run robot apps/e2e/tests/app.robot`.

7) Průběžné ověřování
   - Po každém bloku: `nx test api`, `nx test frontend`, ruční UI smoke.
   - E2E spustit po napojení FE↔BE.

8) Dokumentace v `PLAN.md`
   - Po každé fázi odškrtnout úkoly, doplnit poznámky (co bylo změněno, příkazy k běhu).

9) Závěrečná kontrola
   - `npm run dev` (FE+BE), otevřít UI, spustit Robot E2E, zkontrolovat Jest/pytest green.

10) Předání
   - Ujistit se, že `PLAN.md` popisuje kroky běhu/testů a stručný návod pro QA (Robot příkaz).

---

## TODO přehled
- [x] Inicializace Nx workspace a instalace závislostí
- [x] Plugin @nxlv/python v nx.json (`packageManager: "uv"`)
- [x] Backend FastAPI + UV (serve/test, seed data)
- [x] Frontend Angular + Tailwind + knihovny (list page napojena na API)
- [x] Proxy + dev skript
- [x] Robot Framework E2E testy (základní suite apps/e2e/tests/sites_management.robot)
- [x] Průběžné testy (Jest/pytest) zelené (api, frontend, frontend-data-access)
- [x] Finální kontrola a poznámky

### Spuštění
- FE/BE dev: `npm run dev` (frontend na 4200 s proxy -> api na 8000)
- Unit testy: `nx test api`, `nx test frontend`, `nx test frontend-data-access`
- E2E (Robot): z `apps/` `uv run robot e2e/tests/sites_management.robot` (před první ranou `uv run rfbrowser init`), potřebuje běžící FE+BE
- [ ] Finální kontrola a poznámky
