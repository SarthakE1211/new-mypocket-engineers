import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

// Lightweight pub/sub so FooterComponent's bottom-nav "Order" tap can ask
// HeaderComponent to pop open its My Orders modal/drawer — matching the
// "open My Orders from profile" flow the user confirmed works reliably on
// mobile, instead of navigating to the /my-orders route which currently
// suffers a flash-home redirect bug on some mobile paths.
@Injectable({ providedIn: 'root' })
export class OrdersOverlayService {
  private openSubject = new Subject<void>();
  private closeSubject = new Subject<void>();
  private isOpenSubject = new BehaviorSubject<boolean>(false);

  readonly open$: Observable<void> = this.openSubject.asObservable();
  // Fires when a bottom-nav sibling (Home/Cart) is tapped while the My
  // Orders drawer is up — HeaderComponent listens and dismisses the drawer.
  readonly close$: Observable<void> = this.closeSubject.asObservable();
  // Mirrors whether the header's My Orders drawer is currently shown, so
  // the bottom-nav Order tab can highlight itself while the drawer is up.
  readonly isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

  open(): void {
    this.isOpenSubject.next(true);
    this.openSubject.next();
  }

  close(): void {
    this.isOpenSubject.next(false);
    this.closeSubject.next();
  }

  setOpen(value: boolean): void {
    if (this.isOpenSubject.getValue() !== value) {
      this.isOpenSubject.next(value);
    }
  }
}
