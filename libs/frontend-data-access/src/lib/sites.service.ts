import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Site, Forecast, SiteStatus } from "@mifulacm-workspace/shared-types";

@Injectable({ providedIn: "root" })
export class SitesService {
	private http = inject(HttpClient);
	private baseUrl = "/api";

	private sitesSignal = signal<Site[] | null>(null);
	private loadingSignal = signal(false);
	private errorSignal = signal<string | null>(null);

	readonly sites = this.sitesSignal.asReadonly();
	readonly loading = this.loadingSignal.asReadonly();
	readonly error = this.errorSignal.asReadonly();

	getSites$(status?: SiteStatus): Observable<Site[]> {
		const query = status ? `?status=${status}` : "";
		return this.http.get<Site[]>(`${this.baseUrl}/sites${query}`);
	}

	getSite$(id: number): Observable<Site> {
		return this.http.get<Site>(`${this.baseUrl}/sites/${id}`);
	}

	getForecast$(id: number, forDate?: string): Observable<Forecast> {
		const query = forDate ? `?for_date=${forDate}` : "";
		return this.http.get<Forecast>(
			`${this.baseUrl}/sites/${id}/forecast${query}`,
		);
	}

	createSite$(payload: Omit<Site, "id">): Observable<Site> {
		return this.http.post<Site>(`${this.baseUrl}/sites`, payload);
	}

	loadSites(status?: SiteStatus): void {
		this.loadingSignal.set(true);
		this.errorSignal.set(null);
		this.getSites$(status).subscribe({
			next: (sites) => {
				this.sitesSignal.set(sites);
				this.loadingSignal.set(false);
			},
			error: () => {
				this.errorSignal.set("Nepodařilo se načíst seznam lokalit");
				this.loadingSignal.set(false);
			},
		});
	}
}
