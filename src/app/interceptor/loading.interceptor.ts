import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {LoadingService} from '../service/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const loadingService = inject(LoadingService);

  loadingService.setLoading(request.url, true);

  return next(request).pipe(
    finalize(() => {
      loadingService.setLoading(request.url, false);
    })
  );
};
