import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { SitesService } from "@mifulacm-workspace/frontend-data-access";
import { SiteListComponent } from "@mifulacm-workspace/frontend-ui";

@Component({
	standalone: true,
	selector: "app-sites-page",
	imports: [CommonModule, SiteListComponent],
	template: `
    <div class="space-y-8" data-testid="sites-page">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sites Overview
          </h1>
          <p class="mt-2 text-base text-muted">
            Manage your solar installations and view generation forecasts.
          </p>
        </div>
        <button
          data-testid="add-site-button"
          class="btn-primary flex items-center gap-2"
          (click)="onCreate()"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Site
        </button>
      </div>

      <!-- Stats Grid (Optional placeholder for "Fresh" look) -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="glass-panel p-4 rounded-xl">
          <p class="text-sm font-medium text-muted">Total Sites</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ (sites() || []).length }}</p>
        </div>
        <div class="glass-panel p-4 rounded-xl">
          <p class="text-sm font-medium text-muted">Active Forecasts</p>
          <p class="mt-2 text-2xl font-bold text-accent2">--</p>
        </div>
        <div class="glass-panel p-4 rounded-xl">
          <p class="text-sm font-medium text-muted">Total Capacity</p>
          <p class="mt-2 text-2xl font-bold text-success">-- kW</p>
        </div>
      </div>

      <!-- List Component -->
      <lib-site-list
        [sites]="sites() ?? []"
        [loading]="loading()"
        [error]="error()"
        (siteSelected)="onSelect($event.id)"
      ></lib-site-list>
    </div>
  `,
})
export class SitesPage implements OnInit {
	private readonly service = inject(SitesService);
	private readonly router = inject(Router);

	sites = this.service.sites;
	loading = this.service.loading;
	error = this.service.error;

	ngOnInit(): void {
		this.service.loadSites();
	}

	onSelect(id: number): void {
		this.router.navigate(["/sites", id]);
	}

	onCreate(): void {
		this.router.navigate(["/sites/new"]);
	}
}
