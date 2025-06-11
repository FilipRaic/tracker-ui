import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {NotificationService} from '../service/notification.service';
import {Router} from '@angular/router';

const accessTokenKey = 'auth_token';
const refreshTokenKey = 'refresh_token';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = getErrorMessage(error);
      notificationService.addNotification(errorMessage, 'error');

      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem(accessTokenKey);
        sessionStorage.removeItem(refreshTokenKey);

        if (!router.url.includes('/login')) {
          router.navigate(['/']).then();
        }
      }

      return throwError(() => error);
    })
  );
};

function getErrorMessage(error: any): string {
  if (error?.error?.message) {
    return error.error.message;
  }

  return 'An unexpected error occurred';
}
