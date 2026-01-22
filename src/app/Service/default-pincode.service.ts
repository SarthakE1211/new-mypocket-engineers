import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class DefaultPincodeService {
  readonly DEFAULT_PINCODE = '110011';
  getDefaultPincode(): string {
    return this.DEFAULT_PINCODE;
  }
  buildTerritoryFilterForPincode(pincode: string): string {
    if (!pincode) return '';
    return ` AND PINCODE = ${pincode}`;
  }
}
