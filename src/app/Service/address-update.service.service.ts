import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AddressUpdateServiceService {
  private addressChanged = new Subject<void>();
  addressChanged$ = this.addressChanged.asObservable();
  notifyAddressChanged(): void {
    this.addressChanged.next();
  }
}