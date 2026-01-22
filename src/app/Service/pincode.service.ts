import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { ApiServiceService } from './api-service.service';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PincodeService {
  private pincodeSource = new BehaviorSubject<string | null>(null);
  pincode$ = this.pincodeSource.asObservable();
  constructor(private apiService: ApiServiceService) {}
  setPincodeFor(pincode: string) {
    sessionStorage.setItem('pincodeFor', pincode);
    this.pincodeSource.next(pincode);
  }
  fetchAndSetPincodeFor(userID: string, token: string) {
    this.apiService.getAddresses12data(
      0,
      0,
      'id',
      'desc',
      ` AND CUSTOMER_ID = ${userID} AND IS_DEFAULT = 1`,
      token
    ).pipe(
      map((res: any) => {
        if (res.code === 200 && res.data.length > 0) {
          const pincodeFor = res.data[0].PINCODE_FOR;
          this.setPincodeFor(pincodeFor);
        }
      }),
      catchError((err) => {
        return of(null);
      })
    ).subscribe();
  }
}
