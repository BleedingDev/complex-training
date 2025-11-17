import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SitesService } from '@solargis-workspace/frontend-data-access';
import { SiteListComponent } from '@solargis-workspace/frontend-ui';

@Component({
  standalone: true,
  selector: 'app-sites-page',
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
    this.router.navigate(['/sites', id]);
  }

  onCreate(): void {
    this.router.navigate(['/sites/new']);
  }
}
