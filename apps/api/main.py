from datetime import date

from fastapi import FastAPI, HTTPException

from .models import Forecast, Site, SiteCreate
from .seed import add_site, generate_forecast_for_site, get_seed_sites

app = FastAPI(title="Mifulacm Demo API")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/sites", response_model=list[Site])
def list_sites() -> list[Site]:
    return get_seed_sites()


@app.get("/api/sites/{site_id}", response_model=Site)
def get_site(site_id: int) -> Site:
    site = next((s for s in get_seed_sites() if s.id == site_id), None)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site


@app.get("/api/sites/{site_id}/forecast", response_model=Forecast)
def get_forecast(site_id: int, for_date: date | None = None) -> Forecast:
    site = next((s for s in get_seed_sites() if s.id == site_id), None)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    forecast_date = for_date or date.today()
    return generate_forecast_for_site(site_id, forecast_date)


@app.post("/api/sites", response_model=Site, status_code=201)
def create_site(payload: SiteCreate) -> Site:
    return add_site(payload)
