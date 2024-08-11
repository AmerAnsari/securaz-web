import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '@environments/environment';
import { HttpInterceptorService } from '@services/http-interceptor.service';
import { CRUD_BASE, CRUD_HTTP_CLIENT } from '@amirsavand/ngx-common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: CRUD_BASE, useValue: environment.api },
    { provide: CRUD_HTTP_CLIENT, useClass: HttpClient },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        subscriptSizing: 'dynamic',
      },
    },
    provideAnimationsAsync(),
  ],
};
