import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {NotificationService} from '../service/notification.service';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: unknown) => {
      const errorMessage = getErrorMessage(error);
      notificationService.addNotification(errorMessage, 'error');

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
