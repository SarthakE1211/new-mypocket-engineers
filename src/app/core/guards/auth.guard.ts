import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const isLogged = localStorage.getItem('isLogged') === 'true';
    const userId = localStorage.getItem('userId');
    if (isLogged && userId && userId !== '0') {
      return true;
    }
    return this.router.createUrlTree(['/login']);
  }
}
