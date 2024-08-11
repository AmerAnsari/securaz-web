import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@amirsavand/ngx-common';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (AuthService.token) {

      /** Include authentication token. */
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${AuthService.token}`,
        },
      });
    }
    return next.handle(request).pipe(catchError((error: HttpErrorResponse): Observable<never> => {

      /** Sign out if 401 response. */
      if (error.status === 401) {
        this.auth.signOut();
      }
      return throwError((): any => error);
    }));
  }
}
