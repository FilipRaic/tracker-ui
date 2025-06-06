import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../service/notification.service';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notificationService = jasmine.createSpyObj('NotificationService', ['addNotification']);

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: notificationService },
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should catch HTTP errors and display a notification', () => {
    httpClient.get('/api/test').subscribe({
      next: () => fail('Expected the request to fail'),
      error: (error) => {
        expect(error instanceof HttpErrorResponse).toBe(true);
        expect(error.status).toBe(500);
      }
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(notificationService.addNotification).toHaveBeenCalledWith('An unexpected error occurred', 'error');
  });

  it('should extract error message from error.error.message if available', () => {
    httpClient.get('/api/test').subscribe({
      next: () => fail('Expected the request to fail'),
      error: (error) => {
        expect(error instanceof HttpErrorResponse).toBe(true);
        expect(error.status).toBe(400);
      }
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush({ message: 'Custom error message' }, { status: 400, statusText: 'Bad Request' });

    expect(notificationService.addNotification).toHaveBeenCalledWith('Custom error message', 'error');
  });

  it('should use a generic error message if no specific message is available', () => {
    httpClient.get('/api/test').subscribe({
      next: () => fail('Expected the request to fail'),
      error: (error) => {
        expect(error instanceof HttpErrorResponse).toBe(true);
        expect(error.status).toBe(404);
      }
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush(null, { status: 404, statusText: 'Not Found' });

    expect(notificationService.addNotification).toHaveBeenCalledWith('An unexpected error occurred', 'error');
  });
});
