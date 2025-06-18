import {HttpClient, HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, switchMap, throwError} from 'rxjs';
import {NotificationService} from '../service/notification.service';
import {Router} from '@angular/router';
import {LoginResponse} from '../model/Auth';

const accessTokenKey = 'auth_token';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  const httpClient = inject(HttpClient);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        return refreshToken(router, httpClient).pipe(
          switchMap((response: LoginResponse) => {
            localStorage.setItem(accessTokenKey, response.accessToken);

            const updatedRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            });

            return next(updatedRequest);
          }),
          catchError((refreshError: HttpErrorResponse) => {
            router.navigate(['/login']).then();
            const errorMessage = getErrorMessage(error);
            notificationService.addNotification(errorMessage, 'error');

            return throwError(() => refreshError);
          })
        );
      } else {
        const errorMessage = getErrorMessage(error);
        notificationService.addNotification(errorMessage, 'error');

        return throwError(() => error);
      }
    })
  );
};

function getErrorMessage(error: any): string {
  if (error?.error?.message) {
    return error.error.message;
  }

  return 'An unexpected error occurred';
}

function refreshToken(router: Router, httpClient: HttpClient) {
  const accessToken = localStorage.getItem(accessTokenKey);
  if (!accessToken) {
    router.navigate(['/login']).then();
  }

  return httpClient.put<LoginResponse>(`/api/auth/refresh-token`, {});
}
