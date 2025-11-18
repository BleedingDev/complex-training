export type SiteStatus = 'active' | 'maintenance' | 'offline';

export interface Site {
  id: number;
  name: string;
  location: string;
  capacity_kw: number;
  status: SiteStatus;
}

export interface Forecast {
  site_id: number;
  date: string; // ISO date
  irradiance_wm2: number;
  expected_generation_kwh: number;
}
