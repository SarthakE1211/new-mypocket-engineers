import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Lightweight pub/sub so FooterComponent's bottom-nav "Order" tap can ask
// HeaderComponent to pop open its My Orders modal/drawer — matching the
// "open My Orders from profile" flow the user confirmed works reliably on
// mobile, instead of navigating to the /my-orders route which currently
// suffers a flash-home redirect bug on some mobile paths.
@Injectable({ providedIn: 'root' })
export class OrdersOverlayService {
  private openSubject = new Subject<void>();

  readonly open$: Observable<void> = this.openSubject.asObservable();

  open(): void {
    this.openSubject.next();
  }
}
