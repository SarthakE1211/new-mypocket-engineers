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
        // Only force a full logout when the 401 is unambiguously session-
        // critical (login / token refresh / session check). A 401 from a
        // feature endpoint like /orderDetails is treated as a per-request
        // failure and passed through to the caller — previously we logged
        // out on any 401, which caused the order-details page to flash and
        // redirect to /login on click-through from /my-orders.
        if (err.status === 401 && this.isSessionCriticalRequest(req)) {
          this.handleUnauthorized();
        }
        return throwError(() => err);
      })
    );
  }

  private isSessionCriticalRequest(req: HttpRequest<any>): boolean {
    const url = (req.url || '').toLowerCase();
    return /(login|logout|refresh|session|verifyotp|verify-otp)/.test(url);
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
