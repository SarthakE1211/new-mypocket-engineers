import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

// Tracks how many in-app navigations have happened in this tab so the
// mobile back button can choose between Location.back() and a fallback
// route. window.history.length is unreliable (it counts cross-origin
// entries too), so we count NavigationEnd events instead. The first
// NavigationEnd is the initial load — we have "internal history" only
// once a second NavigationEnd has fired.
@Injectable({ providedIn: 'root' })
export class NavigationHistoryService {
  private navCount = 0;

  constructor(router: Router) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.navCount++;
    });
  }

  hasInternalHistory(): boolean {
    return this.navCount > 1;
  }
}
