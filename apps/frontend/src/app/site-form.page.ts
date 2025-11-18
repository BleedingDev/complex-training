import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { SitesService } from "@mifulacm-workspace/frontend-data-access";
import {
	SiteFormComponent,
	SiteFormValue,
} from "@mifulacm-workspace/frontend-ui";

@Component({
	standalone: true,
	selector: "app-site-form-page",
	imports: [CommonModule, SiteFormComponent, RouterLink],
	template: `
    <div class="max-w-2xl mx-auto space-y-8" data-testid="site-form-page">
      <!-- Header -->
      <div>
        <a routerLink="/sites" class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent transition-colors">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Sites
        </a>
        <h1 class="text-3xl font-bold text-white tracking-tight">Add New Site</h1>
        <p class="mt-2 text-muted">Enter the details of your solar installation.</p>
      </div>

      <div class="glass-panel p-6 sm:p-8 rounded-2xl">
        <lib-site-form (submitSite)="onSubmit($event)"></lib-site-form>
      </div>

      <div *ngIf="error" class="rounded-lg bg-danger/10 border border-danger/20 p-4">
        <p class="text-sm font-medium text-danger flex items-center gap-2" data-testid="form-error">
           <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           {{ error }}
        </p>
      </div>
    </div>
  `,
})
export class SiteFormPage {
	private service = inject(SitesService);
	private router = inject(Router);

	error: string | null = null;

	onSubmit(value: SiteFormValue): void {
		this.error = null;
		this.service.createSite$(value).subscribe({
			next: () => this.router.navigate(["/sites"]),
			error: (err) => {
				console.error("Create site failed", err);
				this.error = "Create site failed. Please try again.";
			},
		});
	}
}
