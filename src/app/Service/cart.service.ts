import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiServiceService } from './api-service.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCountSource = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSource.asObservable();
  private cartDetailsSource = new BehaviorSubject<any[]>([]);
  cartDetails$ = this.cartDetailsSource.asObservable();
  constructor(private apiService: ApiServiceService) {}
  updateCartCount(count: number) {
    this.cartCountSource.next(count);
  }
  updateCartDetails(details: any[]) {
    this.cartDetailsSource.next(details);
  }
  fetchAndUpdateCartDetails(userID: number) {
    this.apiService.getCartDetails(userID).subscribe(
      (data: any) => {
        if (data['code'] === 200) {
          const cartDetails = data['data']['CART_DETAILS'];
          this.updateCartDetails(cartDetails);
          this.updateCartCount(cartDetails.length);
        } else {
          this.updateCartDetails([]);
          this.updateCartCount(0);
        }
      },
      (error) => {
        this.updateCartDetails([]);
        this.updateCartCount(0);
      }
    );
  }
}
