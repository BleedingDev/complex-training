import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SitesService } from './sites.service';

describe('SitesService', () => {
  let service: SitesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SitesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch sites', () => {
    const mockSites = [
      { id: 1, name: 'A', location: 'Loc', capacity_kw: 10, status: 'active' },
    ];

    service.getSites$().subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].name).toBe('A');
    });

    const req = httpMock.expectOne('/api/sites');
    expect(req.request.method).toBe('GET');
    req.flush(mockSites);
  });

  it('should fetch sites filtered by status', () => {
    const mockSites = [
      { id: 2, name: 'B', location: 'Loc', capacity_kw: 20, status: 'maintenance' },
    ];

    service.getSites$('maintenance').subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].status).toBe('maintenance');
    });

    const req = httpMock.expectOne('/api/sites?status=maintenance');
    expect(req.request.method).toBe('GET');
    req.flush(mockSites);
  });
});
