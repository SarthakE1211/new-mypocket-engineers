import { Component, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { LoaderService } from 'src/app/Service/loader.service';
import { OrdersOverlayService } from 'src/app/Service/orders-overlay.service';

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
  overlayOpen: boolean = false;
  // True while the header's My Orders drawer is visible. Keeps the Order
  // tab highlighted even though the URL hasn't changed to /my-orders.
  private ordersOverlayActive: boolean = false;

  private destroy$ = new Subject<void>();
  private bodyClassObserver: MutationObserver | null = null;
  private unlistenFns: Array<() => void> = [];

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private zone: NgZone,
    private ordersOverlay: OrdersOverlayService,
    private loaderService: LoaderService,
  ) {}

  // Bottom-nav "Order" tap. Instead of navigating to the /my-orders route
  // (which flashes and redirects to home on some mobile paths), ask
  // HeaderComponent to open its My Orders modal drawer — the same flow a
  // user gets when they tap My Orders from the profile menu, which the
  // user has confirmed works reliably on mobile.
  //
  // If the current route doesn't mount <app-header> (e.g. /my-orders,
  // /my-cart — hidden via *ngIf in app.component.html), there's no header
  // instance to receive the Subject event. In that case we set a session
  // flag and hard-navigate home so the newly-mounted header picks it up
  // and opens the overlay on arrival.
  onOrderTap(event: Event): void {
    event.preventDefault();
    const path = (this.router.url || '/').split('?')[0].split('#')[0];
    const headerMounted = path !== '/my-orders' && path !== '/my-cart';
    if (headerMounted) {
      this.ordersOverlay.open();
    } else {
      // Header isn't mounted on /my-orders or /my-cart, so we can't call
      // ordersOverlay.open() here — nothing would listen. Drop a session
      // flag the header reads in its ngOnInit and SPA-navigate to /service
      // via the Angular router (no page reload). The loader veils the
      // unavoidable intermediate paint of home before the drawer opens —
      // HeaderComponent hides the loader once the drawer is mounted.
      sessionStorage.setItem('pockit.openOrdersOverlay', '1');
      this.loaderService.showLoader();
      this.router.navigateByUrl('/service');
    }
  }

  // Home/Cart taps share this: if the My Orders drawer is up, dismiss it
  // so the user isn't stuck behind it — routerLink alone is a no-op when
  // the target matches the current route (e.g. Home while on /service).
  onSiblingTabTap(): void {
    if (this.ordersOverlayActive) {
      this.ordersOverlay.close();
    }
  }

  ngOnInit(): void {
    this.updateActiveTab(this.router.url);
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => this.updateActiveTab(e.urlAfterRedirects));

    // Header flips this when its My Orders drawer opens/closes. The drawer
    // doesn't change the URL, so we need the explicit signal to keep the
    // Order tab highlighted.
    this.ordersOverlay.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((open) => {
        this.ordersOverlayActive = open;
        if (open) {
          this.activeTab = 'order';
        } else {
          this.updateActiveTab(this.router.url);
        }
      });

    // Hide the bottom nav whenever a drawer, offcanvas, or modal is on screen
    // so booking flows are not obstructed. We watch three signals, since
    // different UIs use different mechanisms:
    //   1. `body.drawer-open` — set manually by HomeComponent for the unified
    //      service-booking drawer.
    //   2. `body.modal-open` — set by Bootstrap whenever a modal is shown.
    //   3. Any live `.offcanvas.show` element — Bootstrap offcanvas does not
    //      add a body class, so we listen for its shown/hidden events.
    this.bodyClassObserver = new MutationObserver(() => this.recomputeOverlayOpen());
    this.bodyClassObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Run outside Angular because these events can fire repeatedly during
    // open/close animations and we only need one change-detection pass at the
    // end — recomputeOverlayOpen() re-enters the zone itself if state changed.
    this.zone.runOutsideAngular(() => {
      for (const evt of ['shown.bs.offcanvas', 'hidden.bs.offcanvas', 'shown.bs.modal', 'hidden.bs.modal']) {
        this.unlistenFns.push(this.renderer.listen(document, evt, () => this.recomputeOverlayOpen()));
      }
    });

    this.recomputeOverlayOpen();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.bodyClassObserver?.disconnect();
    this.bodyClassObserver = null;
    this.unlistenFns.forEach((off) => off());
    this.unlistenFns = [];
  }

  private updateActiveTab(url: string): void {
    const path = (url || '/').split('?')[0].split('#')[0];
    if (this.ordersOverlayActive || path.startsWith('/my-orders')) {
      this.activeTab = 'order';
    } else if (path.startsWith('/my-cart')) {
      this.activeTab = 'cart';
    } else {
      this.activeTab = 'home';
    }
    const hiddenPrefixes = [
      '/order-details',
      '/order-review',
      '/shop',
      '/privacy_policy_page',
      '/terms-conditions',
    ];
    this.showBottomNav = !hiddenPrefixes.some((p) => path.startsWith(p));
  }

  private recomputeOverlayOpen(): void {
    const next =
      document.body.classList.contains('drawer-open') ||
      document.body.classList.contains('modal-open') ||
      !!document.querySelector('.offcanvas.show') ||
      !!document.querySelector('.modal.show');
    if (next === this.overlayOpen) return;
    // Writes back to a component field bound in the template — re-enter the
    // zone so Angular picks up the change even when triggered from outside.
    this.zone.run(() => (this.overlayOpen = next));
  }
}
