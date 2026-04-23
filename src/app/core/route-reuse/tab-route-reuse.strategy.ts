import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

// Keeps the bottom-tab routes (Home / My Orders / My Cart) alive when the
// user switches between them. Each route's component is created once per
// browser session — subsequent visits reattach the live instance, preserving
// scroll position and already-fetched API data instead of re-running ngOnInit
// and re-hitting the network. A full page refresh or a login redirect (which
// uses window.location.href) is a hard reload and naturally clears this cache.
export class TabRouteReuseStrategy implements RouteReuseStrategy {
  private static readonly REUSABLE_KEYS = new Set<string>([
    'service',
    'my-orders',
    'my-cart',
  ]);

  private storedHandles = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return TabRouteReuseStrategy.REUSABLE_KEYS.has(this.getCacheKey(route));
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    const key = this.getCacheKey(route);
    if (handle && TabRouteReuseStrategy.REUSABLE_KEYS.has(key)) {
      this.storedHandles.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedHandles.has(this.getCacheKey(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedHandles.get(this.getCacheKey(route)) ?? null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  // `/` and `/service` both render HomeComponent — collapse them onto the
  // same cache slot so navigating between them via the bottom nav reuses one
  // instance instead of building two.
  private getCacheKey(route: ActivatedRouteSnapshot): string {
    const path = route.routeConfig?.path ?? '';
    return path === '' ? 'service' : path;
  }
}
