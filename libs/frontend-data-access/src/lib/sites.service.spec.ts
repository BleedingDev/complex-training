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

  it('should fetch sites with active status filter', () => {
    const mockSites = [
      { id: 1, name: 'A', location: 'Loc', capacity_kw: 10, status: 'active' },
    ];

    service.getSites$('active').subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].status).toBe('active');
    });

    const req = httpMock.expectOne('/api/sites?status=active');
    expect(req.request.method).toBe('GET');
    req.flush(mockSites);
  });

  it('should fetch sites without filter when status is undefined', () => {
    const mockSites = [
      { id: 1, name: 'A', location: 'Loc', capacity_kw: 10, status: 'active' },
    ];

    service.getSites$(undefined).subscribe((res) => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/sites');
    expect(req.request.method).toBe('GET');
    req.flush(mockSites);
  });

  it('should call loadSites with status filter', () => {
    const mockSites = [
      { id: 1, name: 'A', location: 'Loc', capacity_kw: 10, status: 'maintenance' },
    ];

    service.loadSites('maintenance');

    const req = httpMock.expectOne('/api/sites?status=maintenance');
    expect(req.request.method).toBe('GET');
    req.flush(mockSites);

    expect(service.sites()).toEqual(mockSites);
    expect(service.loading()).toBe(false);
  });

  it('should call loadSites without filter', () => {
    const mockSites = [
      { id: 1, name: 'A', location: 'Loc', capacity_kw: 10, status: 'active' },
    ];

    service.loadSites();

    const req = httpMock.expectOne('/api/sites');
    expect(req.request.method).toBe('GET');
    req.flush(mockSites);

    expect(service.sites()).toEqual(mockSites);
    expect(service.loading()).toBe(false);
  });
});
