import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Forecast, Site } from '@solargis-workspace/shared-types';

@Component({
  selector: 'lib-site-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.css'],
})
export class SiteDetailComponent {
  @Input() site!: Site;
  @Input() forecast: Forecast | null = null;
}
