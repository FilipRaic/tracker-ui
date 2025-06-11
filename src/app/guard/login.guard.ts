import {inject, Injector} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';

export const canActivate: CanActivateFn = () => {
  const injector = inject(Injector);
  const authService = injector.get(AuthService);
  const router = injector.get(Router);

  if (authService.isLoggedIn) {
    return true;
  }

  router.navigate(['/login']).then();
  return false;
};
