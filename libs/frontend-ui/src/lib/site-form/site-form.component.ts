import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Site } from '@solargis-workspace/shared-types';

export type SiteFormValue = Omit<Site, 'id'>;

@Component({
  selector: 'lib-site-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './site-form.component.html',
  styleUrls: ['./site-form.component.css'],
})
export class SiteFormComponent {
  @Output() submitSite = new EventEmitter<SiteFormValue>();

  private fb = new FormBuilder();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    location: ['', [Validators.required]],
    capacity_kw: [1000, [Validators.required, Validators.min(1)]],
    status: ['active' as SiteFormValue['status'], [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitSite.emit(this.form.getRawValue());
  }
}
