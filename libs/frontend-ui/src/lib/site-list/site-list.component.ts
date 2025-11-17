import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Site } from '@solargis-workspace/shared-types';

@Component({
  selector: 'lib-site-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css'],
})
export class SiteListComponent {
  @Input() sites: Site[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() siteSelected = new EventEmitter<Site>();

  onSelect(site: Site): void {
    this.siteSelected.emit(site);
  }

  trackBySite(index: number, site: Site): number | string {
    return site?.id ?? index;
  }
}
