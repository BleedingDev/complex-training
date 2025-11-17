import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SitesService } from '@solargis-workspace/frontend-data-access';
import { Forecast, Site } from '@solargis-workspace/shared-types';
import { SiteDetailComponent } from '@solargis-workspace/frontend-ui';

@Component({
  standalone: true,
  selector: 'app-site-detail-page',
  imports: [CommonModule, SiteDetailComponent],
  template: `
    <div class="max-w-4xl mx-auto py-6 space-y-4" data-testid="site-detail-page">
      <div class="flex items-center justify-between">
        <button class="text-sm text-muted hover:text-text focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-bg rounded" (click)="goBack()" data-testid="back-to-list">← Back</button>
      </div>

      <ng-container *ngIf="site(); else loadingTpl">
        <lib-site-detail [site]="site()!" [forecast]="forecast()"></lib-site-detail>
      </ng-container>

      <ng-template #loadingTpl>
        <p class="text-sm text-slate-400" *ngIf="!error(); else errorTpl">Loading site…</p>
      </ng-template>

      <ng-template #errorTpl>
        <p class="text-sm text-red-400" data-testid="detail-error">{{ error() }}</p>
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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorSignal.set('Missing site id');
      return;
    }
    const id = Number(idParam);

    this.service.getSite$(id).subscribe({
      next: (s) => this.siteSignal.set(s),
      error: () => this.errorSignal.set('Site not found'),
    });

    this.service.getForecast$(id).subscribe({
      next: (f) => this.forecastSignal.set(f),
      error: () => this.errorSignal.set('Forecast not available'),
    });
  }

  goBack(): void {
    this.router.navigate(['/sites']);
  }
}
