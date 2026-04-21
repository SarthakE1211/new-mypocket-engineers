import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only attach Authorization if the caller hasn't already set it.
    // Existing ApiServiceService methods set headers inline and will win.
    const token = localStorage.getItem('token');
    let authed = req;
    if (token && token.trim() && !req.headers.has('Authorization')) {
      authed = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(authed).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.handleUnauthorized();
        }
        return throwError(() => err);
      })
    );
  }

  private handleUnauthorized(): void {
    // Clear session-scoped auth data; keep durable prefs like cookiesAccepted.
    const keysToClear = [
      'token',
      'userId',
      'isLogged',
      'userName',
      'mobileNumber',
      'customertype',
    ];
    keysToClear.forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
