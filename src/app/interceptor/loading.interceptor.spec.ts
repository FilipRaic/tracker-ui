import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../service/loading.service';

describe('LoadingInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    loadingService = jasmine.createSpyObj('LoadingService', ['setLoading']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingService },
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should set loading to true when a request starts', () => {
    httpClient.get('/api/test').subscribe();

    expect(loadingService.setLoading).toHaveBeenCalledWith('/api/test', true);

    const req = httpTestingController.expectOne('/api/test');
    req.flush({});
  });

  it('should set loading to false when a request completes successfully', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpTestingController.expectOne('/api/test');
    req.flush({});

    expect(loadingService.setLoading).toHaveBeenCalledWith('/api/test', false);
  });

  it('should set loading to false when a request fails', () => {
    httpClient.get('/api/test').subscribe({
      next: () => fail('Expected the request to fail'),
      error: () => {}
    });

    const req = httpTestingController.expectOne('/api/test');
    req.error(new ErrorEvent('Network error'));

    expect(loadingService.setLoading).toHaveBeenCalledWith('/api/test', false);
  });

  it('should handle multiple concurrent requests', () => {
    httpClient.get('/api/test1').subscribe();
    httpClient.get('/api/test2').subscribe();

    expect(loadingService.setLoading).toHaveBeenCalledWith('/api/test1', true);
    expect(loadingService.setLoading).toHaveBeenCalledWith('/api/test2', true);

    const req1 = httpTestingController.expectOne('/api/test1');
    req1.flush({});

    expect(loadingService.setLoading).toHaveBeenCalledWith('/api/test1', false);

    const req2 = httpTestingController.expectOne('/api/test2');
    req2.flush({});

    expect(loadingService.setLoading).toHaveBeenCalledWith('/api/test2', false);
  });
});
