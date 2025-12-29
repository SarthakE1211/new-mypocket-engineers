import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DefaultPincodeService {
  // Central place to change the default pincode used when no location is available
  readonly DEFAULT_PINCODE = '110011';

  getDefaultPincode(): string {
    return this.DEFAULT_PINCODE;
  }

  // Utility to build a filter string for territory API calls
  // Some call-sites expect numeric unquoted PINCODE in filter, keep it simple
  buildTerritoryFilterForPincode(pincode: string): string {
    if (!pincode) return '';
    return ` AND PINCODE = ${pincode}`;
  }
}
