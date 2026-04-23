import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { selectUserId } from 'src/app/store/user/user.selectors';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  userId: number | null = null;
  orders: any[] = [];
  loading: boolean = false;
  imageUrl: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiServiceService,
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.applyBodyClass(this.router.url);
    this.imageUrl = this.api.retriveimgUrl2();
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe((id) => {
        // Hydrated user id; fall back to the legacy getter so we still show
        // orders when the NgRx store has not been populated yet (e.g. right
        // after a hard reload before hydrateUserFromStorage completes).
        this.userId = (id as number | null) ?? this.api.getUserId() ?? null;
        this.fetchOrders();
      });

    // The TabRouteReuseStrategy keeps this component alive while the user
    // visits other routes (e.g. /order-details/:id), so ngOnDestroy does not
    // fire on tap-through and the `page-mobile-subpage` body class — which
    // hides the app header — would otherwise leak onto pages that need the
    // header. Toggle the class on every NavigationEnd based on the current
    // URL instead.
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((e) => this.applyBodyClass(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    document.body.classList.remove('page-mobile-subpage');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private applyBodyClass(url: string): void {
    const onMyOrders = (url || '').split('?')[0].split('#')[0].startsWith('/my-orders');
    document.body.classList.toggle('page-mobile-subpage', onMyOrders);
  }

  private fetchOrders(): void {
    if (!this.userId) {
      this.orders = [];
      return;
    }
    this.loading = true;
    this.api
      .getorderData(0, 0, 'id', 'desc', ` AND CUSTOMER_ID = ${this.userId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.orders = data?.code === 200 && Array.isArray(data.data) ? data.data : [];
          this.loading = false;
        },
        () => {
          this.orders = [];
          this.loading = false;
        },
      );
  }

  trackByOrderId = (_: number, order: any): any => order?.ID ?? order?.ORDER_NUMBER ?? _;

  openOrder(order: any): void {
    if (!order?.ID) return;
    // On mobile a plain SPA router.navigate() into /order-details flashes
    // the target page and then pops back to home. Reasons include
    // TabRouteReuseStrategy replaying a cached HomeComponent, stale
    // subscriptions on the detached MyOrdersComponent, and the header
    // component (hidden on /my-orders) re-mounting with its own API calls.
    // Force a hard browser navigation on mobile so the order-details page
    // loads fresh with no leftover SPA state. Desktop keeps the smooth SPA
    // transition since the bug doesn't reproduce there.
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      window.location.href = `/order-details/${order.ID}`;
      return;
    }
    this.router.navigate(['/order-details', order.ID]);
  }

  statusLabel(order: any): string {
    if (order?.ORDER_STATUS_NAME === 'OP' && order?.REFUND_STATUS === 'P') return 'Cancel Requested';
    return order?.ORDER_STATUS_NAME || '';
  }
}
