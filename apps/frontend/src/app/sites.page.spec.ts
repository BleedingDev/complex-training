import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SitesPage } from './sites.page';
import { SitesService } from '@mifulacm-workspace/frontend-data-access';

class SitesServiceMock {
  loadSites = jest.fn();
  sites = () => [];
  loading = () => false;
  error = () => null;
}

describe('SitesPage', () => {
  let fixture: ComponentFixture<SitesPage>;
  let component: SitesPage;
  let service: SitesServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitesPage],
      providers: [{ provide: SitesService, useClass: SitesServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SitesPage);
    component = fixture.componentInstance;
    service = TestBed.inject(SitesService) as unknown as SitesServiceMock;
    fixture.detectChanges();
  });

  it('should request filtered sites when filter changes', () => {
    component.onFilterChange('active');
    expect(service.loadSites).toHaveBeenCalledWith('active');
  });

  it('should clear filter when selecting All', () => {
    component.onFilterChange(null);
    expect(service.loadSites).toHaveBeenCalledWith(undefined);
  });
});
