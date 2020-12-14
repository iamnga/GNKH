import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from  } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { OktaAuthService } from '@okta/okta-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private oktaAuth: OktaAuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.isAuthenticated()
      .pipe(mergeMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return next.handle(request);
        }

        return this.getAccessToken()
          .pipe(mergeMap((accessToken) => {
            console.log("at: " + accessToken);
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${accessToken}`
              }
            });

            return next.handle(request);
          }))
      }));
  }

  private isAuthenticated(): Observable<boolean> {
    return from(this.oktaAuth.isAuthenticated());
  }

  private getAccessToken(): Observable<string> {
    return from(this.oktaAuth.getAccessToken());
  }
}
