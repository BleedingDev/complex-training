import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { SitesService } from "@mifulacm-workspace/frontend-data-access";
import { SiteListComponent } from "@mifulacm-workspace/frontend-ui";

@Component({
	standalone: true,
	selector: "app-sites-page",
	imports: [CommonModule, SiteListComponent],
	template: `
    <div class="space-y-5" data-testid="sites-page">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.12em] text-muted">Overview</p>
          <h1 class="text-2xl font-semibold text-text">Sites</h1>
        </div>
        <button
          data-testid="add-site-button"
          class="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface shadow-soft transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-bg"
          (click)="onCreate()"
        >
          + Add Site
        </button>
      </div>
      <div class="flex items-center gap-3 text-sm text-muted">
        <label for="status-filter" class="text-xs uppercase tracking-[0.08em]">Status</label>
        <select
          id="status-filter"
          data-testid="status-filter"
          class="rounded-md border border-border bg-panel px-3 py-2 text-text shadow-soft focus-visible:ring-2 focus-visible:ring-accent"
          [value]="filter() ?? ''"
          (change)="onFilterChange($any($event.target).value || null)"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>
      </div>

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
	filter = signal<SiteStatus | null>(null);

  ngOnInit(): void {
    this.service.loadSites();
  }

	onSelect(id: number): void {
		this.router.navigate(["/sites", id]);
	}

	onCreate(): void {
		this.router.navigate(["/sites/new"]);
	}

  onFilterChange(status: string | null): void {
    const normalized = (status as 'active' | 'maintenance' | 'offline' | null) || null;
    this.filter.set(normalized as any);
    this.service.loadSites(normalized ?? undefined);
  }
}
