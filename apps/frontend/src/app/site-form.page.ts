import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { SitesService } from "@mifulacm-workspace/frontend-data-access";
import {
	SiteFormComponent,
	SiteFormValue,
} from "@mifulacm-workspace/frontend-ui";

@Component({
	standalone: true,
	selector: "app-site-form-page",
	imports: [CommonModule, SiteFormComponent],
	template: `
    <div class="max-w-3xl mx-auto py-6 space-y-4" data-testid="site-form-page">
      <div class="flex items-center justify-start">
        <div>
          <p class="text-sm uppercase tracking-[0.12em] text-muted">Create</p>
          <h2 class="text-2xl font-semibold text-text">Add New Site</h2>
        </div>
      </div>

      <lib-site-form (submitSite)="onSubmit($event)"></lib-site-form>

      <p *ngIf="error" class="text-sm text-red-400" data-testid="form-error">{{ error }}</p>
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
				this.error = "Create site failed";
			},
		});
	}
}
