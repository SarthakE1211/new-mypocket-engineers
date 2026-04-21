import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  footerLogo: string = 'assets/img/PockIT_Logo.png';
  currentYear: number = new Date().getFullYear();
  activeTab: 'home' | 'order' | 'cart' = 'home';
  showBottomNav: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateActiveTab(this.router.url);
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => this.updateActiveTab(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateActiveTab(url: string): void {
    const path = (url || '/').split('?')[0].split('#')[0];
    if (path.startsWith('/my-orders')) {
      this.activeTab = 'order';
      this.showBottomNav = true;
    } else if (path.startsWith('/my-cart')) {
      this.activeTab = 'cart';
      this.showBottomNav = true;
    } else if (path === '/' || path === '' || path === '/service') {
      this.activeTab = 'home';
      this.showBottomNav = true;
    } else {
      this.activeTab = 'home';
      this.showBottomNav = false;
    }
  }
}
