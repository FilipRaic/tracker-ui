import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from './app.routes';
import {loadingInterceptor} from './interceptor/loading.interceptor';
import {errorInterceptor} from './interceptor/error.interceptor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from './app.translate';
import {authInterceptor} from './interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      })
    )
  ]
};
