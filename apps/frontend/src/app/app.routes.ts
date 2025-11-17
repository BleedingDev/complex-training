import { Route } from '@angular/router';
import { SitesPage } from './sites.page';
import { SiteDetailPage } from './site-detail.page';
import { SiteFormPage } from './site-form.page';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'sites' },
  { path: 'sites', component: SitesPage },
  { path: 'sites/new', component: SiteFormPage },
  { path: 'sites/:id', component: SiteDetailPage },
];
