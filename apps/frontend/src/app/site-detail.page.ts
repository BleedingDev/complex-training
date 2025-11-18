import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { SitesService } from "@mifulacm-workspace/frontend-data-access";
import { Forecast, Site } from "@mifulacm-workspace/shared-types";
import { SiteDetailComponent } from "@mifulacm-workspace/frontend-ui";

@Component({
	standalone: true,
	selector: "app-site-detail-page",
	imports: [CommonModule, SiteDetailComponent, RouterLink],
	template: `
    <div class="max-w-4xl mx-auto space-y-6" data-testid="site-detail-page">
      <!-- Header Navigation -->
      <div class="flex items-center justify-between">
        <a routerLink="/sites" class="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent transition-colors">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Sites
        </a>
      </div>

      <!-- Main Content -->
      <ng-container *ngIf="site(); else loadingTpl">
        <lib-site-detail [site]="site()!" [forecast]="forecast()"></lib-site-detail>
      </ng-container>

      <ng-template #loadingTpl>
        <div class="glass-panel h-64 animate-pulse rounded-2xl flex items-center justify-center">
          <p class="text-sm font-medium text-muted">Loading site details...</p>
        </div>
        <p class="mt-4 text-sm text-danger" *ngIf="error()" data-testid="detail-error">{{ error() }}</p>
      </ng-template>
    </div>
  `,
})
export class SiteDetailPage implements OnInit {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private service = inject(SitesService);

	private siteSignal = signal<Site | null>(null);
	private forecastSignal = signal<Forecast | null>(null);
	private errorSignal = signal<string | null>(null);

	site = this.siteSignal.asReadonly();
	forecast = this.forecastSignal.asReadonly();
	error = this.errorSignal.asReadonly();

	ngOnInit(): void {
		const idParam = this.route.snapshot.paramMap.get("id");
		if (!idParam) {
			this.errorSignal.set("Missing site id");
			return;
		}
		const id = Number(idParam);

		this.service.getSite$(id).subscribe({
			next: (s) => this.siteSignal.set(s),
			error: () => this.errorSignal.set("Site not found"),
		});

		this.service.getForecast$(id).subscribe({
			next: (f) => this.forecastSignal.set(f),
			error: () => this.errorSignal.set("Forecast not available"),
		});
	}
}
