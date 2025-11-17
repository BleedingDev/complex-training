from datetime import date
from enum import Enum

from pydantic import BaseModel, Field


class SiteStatus(str, Enum):
    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    OFFLINE = "offline"


class SiteBase(BaseModel):
    name: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    capacity_kw: float = Field(..., gt=0)
    status: SiteStatus = SiteStatus.ACTIVE


class SiteCreate(SiteBase):
    pass


class Site(SiteBase):
    id: int


class Forecast(BaseModel):
    site_id: int
    date: date
    irradiance_wm2: float
    expected_generation_kwh: float
