import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
declare var Razorpay: any;
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from 'src/app/Service/cart.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-order-review-page',
  templateUrl: './order-review-page.component.html',
  styleUrls: ['./order-review-page.component.scss'],
})
export class OrderReviewPageComponent {
  PopularServices: any[] = [];
  addresses: any[] = [];
  defaultAddress: any = [];
  servicesList: any[] = [];
  OrderReviewDetails: any;
  searchQuery: string = '';
  selectedCoupon: any = null;
  isLoading: boolean = false;
  isLoadingPayment: boolean = false;
  customertype: any = this.apiservice.getCustomerType();
  selectedPaymentMethod: string = 'ONLINE';
  userID: any = this.apiservice.getUserId();
  user: any;
  coupons: any = [];
  IMAGEuRL: any;
  orderDetailsVisible: { [key: string]: boolean } = {
    contactDetails: false,
    orderStatus: false,
    reschedulePolicy: false,
    cancelPolicy: false,
    paymentSummary: false,
    walletSummary: false,
  };
  walletAmount: number = 0;
  updateSEO() {
    this.titleService.setTitle('Review Your Order - Pockit Web');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Review your order details before proceeding to checkout. Verify your selected laptop parts, computer accessories, and payment method.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'order review, final order check, online shopping review, verify cart, secure checkout, confirm order details',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Review Your Order - Pockit Web',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Verify your cart items and confirm your order details at Pockit Web before secure checkout.',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://pockitweb.uvtechsoft.com/order-review',
    });
    this.metaService.updateTag({
      name: 'twitter:title',
      content: 'Review Your Order - Pockit Web',
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content:
        'Check your order details before completing the purchase at Pockit Web. Fast and secure checkout.',
    });
    this.metaService.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    let link: HTMLLinkElement =
      document.querySelector("link[rel='canonical']") ||
      document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.href);
    document.head.appendChild(link);
  }
  constructor(
    private route: ActivatedRoute,
    private apiservice: ApiServiceService,
    private message: ToastrService,
    private cartService: CartService,
    private router: Router,
    private metaService: Meta,
    private titleService: Title
  ) {
    this.updateSEO();
  }
  cartID: any;
  maxCharLength: number = 16;
  maxCharData: number = 30;
  ngOnInit() {
    this.setMaxCharLengthBasedOnScreen();
    window.addEventListener('resize', () => this.setMaxCharLengthBasedOnScreen());
    const serviceId = this.route.snapshot.paramMap.get('id');
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    if (this.customertype === 'B') {
      this.selectedPaymentMethod = 'COD';
    }
    if (serviceId) {
      this.cartID = serviceId;
      this.fetchOrderReviewDetails(serviceId);
      this.getCustomers();
      this.getWalletAmount();
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.style.overflowY = 'auto';
      document.body.style.paddingRight = '0px';
    }, 500);
  }
  setMaxCharLengthBasedOnScreen(): void {
    const screenWidth = window.innerWidth;
    this.maxCharLength = screenWidth < 576 ? 8 : 16;
    this.maxCharData = screenWidth < 576 ? 8 : 30;
  }
  ngAfterViewInit() {
    let modalElement = document.getElementById('couponModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      });
    }
  }
  formatPeriodCommon(days: number): string {
    if (!days || isNaN(days)) return '-';
    const years = Math.floor(days / 365);
    const remainingDaysAfterYears = days % 365;
    const months = Math.floor(remainingDaysAfterYears / 30);
    const remainingDays = remainingDaysAfterYears % 30;
    let result: string[] = [];
    if (years > 0) {
      result.push(`${years} ${years > 1 ? 'yrs' : 'year'}`);
    }
    if (months > 0) {
      result.push(`${months} ${months > 1 ? 'months' : 'month'}`);
    }
    if (remainingDays > 0) {
      result.push(`${remainingDays} ${remainingDays > 1 ? 'days' : 'day'}`);
    }
    return result.length > 0 ? result.join(' ') : '-';
  }
  calculateExpirationDate(days: number): string {
    if (!days || isNaN(days)) {
      return '-';
    }
    return 'Valid upto ' + moment().add(days, 'days').format('DD/MMM/YY');
  }
  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
  getCustomers() {
    this.apiservice
      .getcustomer(0, 0, 'id', 'desc', ' AND ID = ' + this.userID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.user = data['data'][0];
          }
        },
        (error) => {
        }
      );
  }
  getWalletAmount() {
    const data = {
      CUSTOMER_ID: this.userID,
      pageIndex: 0,
      pageSize: 5,
      sortKey: '',
      sortValue: '',
      filter: ' AND CUSTOMER_ID = ' + this.userID
    };
    this.apiservice.getCustomerWallet(data).subscribe((res: any) => {
      if (res && res.code === 200 && res.data) {
        this.walletAmount = Number(res.data[0]?.AVAILABLE_BALANCE || res?.AVAILABLE_BALANCE || 0);
      }
    });
  }
  loadFullPage: boolean = false;
  fetchOrderReviewDetails(serviceId: any) {
    this.loadFullPage = true;
    this.apiservice.getCartGetDetails(serviceId).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.loadFullPage = false;
          this.OrderReviewDetails = data['data'];
        }
      },
      (error) => {
      }
    );
  }
  get filteredCoupons() {
    const query = this.searchQuery.toLowerCase();
    return this.coupons.filter((coupon: any) =>
      coupon.COUPON_CODE?.toLowerCase().includes(query) ||
      coupon.COUPON_NAME?.toLowerCase().includes(query)
    );
  }
  countryID: any;
  couponcount: any = 0;
  TERRITORY_ID: any;
  openCouponModal(data: any) {
    this.countryID = data.COUNTRY_ID;
    this.isLoading = true;
    this.TERRITORY_ID = sessionStorage.getItem('CurrentTerritory');
    this.apiservice
      .getCoupanDetails(this.userID, data.ID, data.COUNTRY_ID, 'S', this.TERRITORY_ID)
      .subscribe(
        (response) => {
          if (response?.code === 200) {
            this.coupons = response.data;
            this.couponcount = this.coupons.length;
          } else {
            this.couponcount = 0;
          }
          this.isLoading = false;
          this.showCouponModal();
        },
        (error) => {
          this.couponcount = 0;
          this.isLoading = false;
        }
      );
  }
  showCouponModal() {
    let modalElement = document.getElementById('couponModal');
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  selectCoupon(coupon: any) {
    this.selectedCoupon = coupon;
  }
  applySelectedCoupon() {
    if (this.selectedCoupon) {
      let data = {
        CUSTOMER_ID: this.userID,
        CART_ID: this.cartID,
        COUNTRY_ID: this.countryID,
        COUPON_CODE: this.selectedCoupon.COUPON_CODE,
        TYPE: 'S',
        TERRITORY_ID: this.TERRITORY_ID
      };
      this.apiservice.ApplyCoupan(data).subscribe((response: any) => {
        if (response?.code === 200) {
          this.message.success('Coupon successfully applied', '');
          this.closeCouponModal();
        } else {
          this.message.error('Invalid coupon code', '');
        }
      });
    } else {
      this.message.error('Please select a coupon first!');
    }
  }
  removeCoupon(event: Event, coupon: any) {
    event.stopPropagation();
    this.coupons = this.coupons.filter(
      (c: any) => c.COUPON_ID !== coupon.COUPON_ID
    );
    if (this.selectedCoupon?.COUPON_ID === coupon.COUPON_ID) {
      this.selectedCoupon = null;
      let data = {
        CUSTOMER_ID: this.userID,
        CART_ID: this.cartID,
        COUPON_CODE: coupon.COUPON_CODE,
        TYPE: 'S',
      };
      this.apiservice.RemoveCoupan(data).subscribe((response: any) => {
        if (response?.code === 200) {
          this.message.success('Coupon successfully removed', '');
          this.closeCouponModal();
        } else {
          this.message.error('Failed to remove coupon', '');
        }
      });
    }
  }
  loadbutton: boolean = false;
  LoadRemove: boolean = false;
  deleteCoupon(data: any) {
    this.loadbutton = true;
    if (data) {
      this.selectedCoupon = null;
      let payloaddata = {
        CUSTOMER_ID: this.userID,
        CART_ID: this.cartID,
        COUPON_CODE: data.COUPON_CODE,
        TYPE: 'S',
      };
      this.LoadRemove = true;
      this.apiservice.RemoveCoupan(payloaddata).subscribe((response: any) => {
        if (response?.code === 200) {
          this.LoadRemove = false;
          this.message.success('Coupon successfully removed', '');
          this.loadbutton = true;
          this.fetchOrderReviewDetails(this.cartID);
        } else {
          this.LoadRemove = false;
          this.loadbutton = true;
          this.message.error('Failed to remove coupon', '');
        }
      }, err => {
        this.LoadRemove = false;
      });
    }
  }
  closeCouponModal() {
    this.fetchOrderReviewDetails(this.cartID);
    this.loadbutton = false;
    let modalElement = document.getElementById('couponModal');
    if (modalElement) {
      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  toggleAccordion(section: string) {
    this.orderDetailsVisible[section] = !this.orderDetailsVisible[section];
  }
  RAZOR_PAY_KEY = environment.razorPayKey;
  getFinalAmount(): number {
    const cartInfo = this.OrderReviewDetails?.CART_INFO[0]?.TOTAL_AMOUNT;
    return cartInfo
  }
  proceedToPay() {
    if (this.customertype === 'B') {
      this.selectedPaymentMethod = 'COD'
    }
    const cartInfo = this.OrderReviewDetails?.CART_INFO[0];
    if (!cartInfo || !this.user) {
      this.message.error('Cart or user details are missing. Please try again.');
      return;
    }
    const cartId = this.cartID;
    const finalAmount = this.getFinalAmount();
    if (this.selectedPaymentMethod === 'COD') {
      const payload = {
        CART_ID: cartId,
        PAYMENT_METHOD: 'COD',
        CUSTOMER_ID: this.userID,
        ADDRESS_ID: cartInfo?.ADDRESS_ID,
        TERRITORYID: cartInfo?.TERRITORY_ID,
        TYPE: 'S',
      };
      this.apiservice.CreateOrder(payload).subscribe((response: any) => {
        if (response?.code === 200) {
          this.cartService.fetchAndUpdateCartDetails(this.userID);
          if (this.customertype === 'B') {
            this.message.success('Order placed successfully.', '');
          } else {
            this.message.success('Order placed successfully via Cash on Delivery.', '');
          }
          this.router.navigate(['/service']);
        } else {
          this.message.error('Failed to place order. Please try again.', '');
        }
      });
    } else if (this.selectedPaymentMethod === 'WALLET' && this.walletAmount >= finalAmount) {
      const body = {
        CART_ID: cartId,
        ORDER_ID: null,
        CUSTOMER_ID: this.userID,
        MOBILE_NUMBER: this.user?.MOBILE_NO,
        PAYMENT_FOR: 'O',
        PAYMENT_MODE: 'W',
        PAYMENT_TYPE: 'W',
        TRANSACTION_DATE: moment().format('YYYY-MM-DD'),
        TRANSACTION_ID: 'WALLET-' + Date.now(),
        TRANSACTION_STATUS: 'Success',
        TRANSACTION_AMOUNT: finalAmount,
        PAYLOAD: { method: 'WALLET' },
        RESPONSE_DATA: { status: 'Success' },
        RESPONSE_CODE: 200,
        MERCHENT_ID: 'WALLET',
        RESPONSE_MESSAGE: 'Transaction success',
        CLIENT_ID: 1,
        TERRITORYID: cartInfo?.TERRITORY_ID,
      };
      this.apiservice.addPaymentTransactions(body).subscribe((res: any) => {
        if (res?.code === 200) {
          const payload = {
            CART_ID: cartId,
            PAYMENT_METHOD: 'WALLET',
            CUSTOMER_ID: this.userID,
            ADDRESS_ID: cartInfo?.ADDRESS_ID,
            TERRITORYID: cartInfo?.TERRITORY_ID,
            TYPE: 'S',
            IS_WALLET_USED: true
          };
          this.apiservice.CreateOrder(payload).subscribe((response: any) => {
            if (response?.code === 200) {
              this.cartService.fetchAndUpdateCartDetails(this.userID);
              this.message.success('Order placed successfully using Wallet.', '');
              this.router.navigate(['/service']);
            } else {
              this.message.error(response?.message || 'Failed to place order. Please try again.', '');
            }
          });
        } else {
          this.message.error('Failed to record wallet transaction.', '');
        }
      });
    } else {
      // ONLINE or WALLET with insufficient balance
      const isHybrid = this.selectedPaymentMethod === 'WALLET' && this.walletAmount < finalAmount;
      const payableAmount = isHybrid ? (finalAmount - this.walletAmount) : finalAmount;
      var dataForRzpOrder = {
        CART_ID: cartId,
        ORDER_ID: 0,
        CUSTOMER_ID: this.user?.ID,
        JOB_CARD_ID: 0,
        PAYMENT_FOR: "O",
        amount: payableAmount * 100
      }
      this.apiservice.createRazorpayOrdertoRzp(dataForRzpOrder).subscribe((responserzp: any) => {
        if (responserzp?.code === 200 && !responserzp.data) {
          const payload = {
            CART_ID: cartId,
            PAYMENT_METHOD: isHybrid ? 'WALLET' : 'ONLINE',
            CUSTOMER_ID: this.userID,
            ADDRESS_ID: cartInfo?.ADDRESS_ID,
            TERRITORYID: cartInfo?.TERRITORY_ID,
            TYPE: 'S',
            IS_WALLET_USED: isHybrid
          };
          this.apiservice.CreateOrder(payload).subscribe((response: any) => {
            if (response?.code === 200) {
              this.cartService.fetchAndUpdateCartDetails(this.userID);
              this.message.success('Order placed successfully.', '');
              this.router.navigate(['/service']);
            } else {
              this.message.error('Failed to place order. Please try again.', '');
            }
          });
          return;
        }
        if (responserzp?.code === 200 && responserzp.data?.amount) {
          const options = {
            key: this.RAZOR_PAY_KEY,
            amount: payableAmount * 100,
            currency: 'INR',
            name: this.user.NAME,
            order_id: responserzp.data.id,
            description: 'Order Payment',
            handler: async (data: any) => {
              const body = {
                CART_ID: cartId,
                ORDER_ID: null,
                CUSTOMER_ID: this.user?.ID,
                MOBILE_NUMBER: this.user?.MOBILE_NO,
                PAYMENT_FOR: 'O',
                PAYMENT_MODE: 'O',
                PAYMENT_TYPE: 'O',
                TRANSACTION_DATE: moment().format('YYYY-MM-DD'),
                TRANSACTION_ID: data.razorpay_payment_id,
                TRANSACTION_STATUS: 'Success',
                TRANSACTION_AMOUNT: payableAmount,
                PAYLOAD: options,
                RESPONSE_DATA: data,
                RESPONSE_CODE: 200,
                MERCHENT_ID: this.RAZOR_PAY_KEY,
                RESPONSE_MESSAGE: 'Transaction success',
                CLIENT_ID: 1,
                TERRITORYID: cartInfo?.TERRITORY_ID,
              };
              this.apiservice.addPaymentTransactions(body).subscribe((response: any) => {
                if (response?.code === 200) {
                  const payload = {
                    CART_ID: cartId,
                    PAYMENT_METHOD: isHybrid ? 'WALLET' : 'ONLINE',
                    CUSTOMER_ID: this.userID,
                    ADDRESS_ID: cartInfo?.ADDRESS_ID,
                    TERRITORYID: cartInfo?.TERRITORY_ID,
                    Razorpay_ID: responserzp.data.id,
                    TYPE: 'S',
                    IS_WALLET_USED: isHybrid
                  };
                  this.apiservice.CreateOrder(payload).subscribe((response: any) => {
                    if (response?.code === 200) {
                      this.cartService.fetchAndUpdateCartDetails(this.userID);
                      this.message.success('Order placed successfully', '');
                      this.router.navigate(['/service']);
                    } else {
                      this.message.error('Failed to place order. Please try again.', '');
                    }
                  });
                } else {
                  this.message.error('Payment successful, but order processing failed. Please contact support.', '');
                }
              });
            },
            prefill: {
              name: this.user?.NAME,
              email: this.user?.EMAIL,
              contact: this.user?.MOBILE_NO,
            },
            theme: {
              color: '#3399cc',
            },
          };
          const razorpay = new Razorpay(options);
          razorpay.open();
        } else {
          this.isLoading = false;
          this.message.error(responserzp?.data?.error?.description || 'Failed to create payment order.', '');
        }
      }, err => {
        this.isLoading = false;
        this.message.error(err?.error?.data?.error?.description || 'Something went wrong.', '');
      });
    }
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.setMaxCharLengthBasedOnScreen);
  }
  newcoupons = false;
  addCoupon() {
    this.newcoupons = true;
  }
  goBackFromCoupon() {
    this.newcoupons = false;
  }
  newcouponadd(newcopon: any) {
    let data = {
      CUSTOMER_ID: this.userID,
      CART_ID: this.cartID,
      COUNTRY_ID: this.countryID,
      COUPON_CODE: newcopon,
      TYPE: 'S',
      TERRITORY_ID: this.TERRITORY_ID
    };
    this.apiservice.ApplyCoupan(data).subscribe((response: any) => {
      if (response?.code === 200) {
        this.message.success('Coupon successfully applied', '');
        this.closeCouponModal();
        this.newcoupons = false;
        newcopon = '';
        this.searchQuery = '';
      } else {
        this.message.error('Invalid coupon code', '');
      }
    });
  }
}
