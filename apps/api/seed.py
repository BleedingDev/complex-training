from __future__ import annotations

from datetime import date
from random import uniform

from .models import Forecast, Site, SiteCreate, SiteStatus

_sites: list[Site] = [
    Site(
        id=1,
        name="Desert Alpha",
        location="Nevada, US",
        capacity_kw=5000,
        status=SiteStatus.ACTIVE,
    ),
    Site(
        id=2,
        name="Coastal Beta",
        location="California, US",
        capacity_kw=3200,
        status=SiteStatus.MAINTENANCE,
    ),
    Site(
        id=3,
        name="Mountain Gamma",
        location="Colorado, US",
        capacity_kw=2100,
        status=SiteStatus.ACTIVE,
    ),
]


def get_seed_sites() -> list[Site]:
    return list(_sites)


def _estimate_generation(capacity_kw: float) -> float:
    # Simple heuristic for demo purposes
    capacity_mw = capacity_kw / 1000
    return round(capacity_mw * uniform(3.0, 5.5), 2)


def generate_forecast_for_site(site_id: int, forecast_date: date) -> Forecast:
    site = next((s for s in _sites if s.id == site_id), None)
    if not site:
        raise ValueError(f"Site not found: {site_id}")

    # Simple seasonal factor: winter lower, summer higher
    month = forecast_date.month
    seasonal = 0.75 if month in (11, 12, 1, 2) else 1.15 if month in (6, 7, 8) else 1.0

    irradiance = round(uniform(400, 900) * seasonal, 1)
    expected_gen = _estimate_generation(site.capacity_kw) * seasonal
    return Forecast(
        site_id=site_id,
        date=forecast_date,
        irradiance_wm2=irradiance,
        expected_generation_kwh=round(expected_gen, 2),
    )


def add_site(payload: SiteCreate) -> Site:
    new_id = max([s.id for s in _sites] or [0]) + 1
    site = Site(id=new_id, **payload.model_dump())
    _sites.append(site)
    return site
