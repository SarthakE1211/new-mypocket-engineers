import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
declare var Razorpay: any;
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from 'src/app/Service/cart.service';

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
  selectedPaymentMethod: string = 'ONLINE'; // Default Payment Mode

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
  };

  updateSEO() {
    // alert('ddd')
    this.titleService.setTitle('Review Your Order - PockIT Web');

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

    // Open Graph (For Facebook, LinkedIn)
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Review Your Order - PockIT Web',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Verify your cart items and confirm your order details at PockIT Web before secure checkout.',
    });
    // this.metaService.updateTag({ property: 'og:image', content: 'https://pockitweb.uvtechsoft.com/assets/images/order-review.jpg' });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://pockitweb.uvtechsoft.com/order-review',
    });

    // Twitter Card
    this.metaService.updateTag({
      name: 'twitter:title',
      content: 'Review Your Order - PockIT Web',
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content:
        'Check your order details before completing the purchase at PockIT Web. Fast and secure checkout.',
    });
    // this.metaService.updateTag({ name: 'twitter:image', content: 'https://pockitweb.uvtechsoft.com/assets/images/order-review.jpg' });
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
    }

    // Ensure scrollbar is present if missing
    setTimeout(() => {
      const doc = document.documentElement;
      const body = document.body;

      // Check if content fits within the viewport height
      if (doc.scrollHeight <= window.innerHeight) {
        body.style.overflowY = 'auto'; // Force scrollbar if missing
        body.style.paddingRight = '0px'; // Prevent extra padding
      } else {
        body.style.overflowY = ''; // Keep default behavior
        body.style.paddingRight = ''; // Reset padding when scrollbar exists
      }
    }, 300);
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

  // formatPeriod(days: number): string {
  //   if (!days || isNaN(days)) return '-';

  //   if (days >= 365) {
  //     const years = Math.floor(days / 365);
  //     return `${years} ${years > 1 ? 'yrs' : 'yr'}`;
  //   } else if (days >= 30) {
  //     const months = Math.floor(days / 30);
  //     return `${months} ${months > 1 ? 'months' : 'month'}`;
  //   } else {
  //     return `${days} ${days > 1 ? 'days' : 'day'}`;
  //   }
  // }

  // formatPeriod1(days: number): string {
  //   if (!days || isNaN(days)) return '-';

  //   const years = Math.floor(days / 365);
  //   const remainingDaysAfterYears = days % 365; // Remaining days after extracting years
  //   const months = Math.floor(remainingDaysAfterYears / 30);
  //   const remainingDays = remainingDaysAfterYears % 30; // Remaining days after extracting months

  //   let result = '';

  //   if (years > 0) {
  //     result += `${years} ${years > 1 ? 'yrs' : 'yr'}`;
  //   }

  //   if (months > 0) {
  //     result += ` ${months} ${months > 1 ? 'months' : 'month'}`;
  //   }

  //   if (remainingDays > 0 && months === 0) { // Show days only if there are no months
  //     result += ` ${remainingDays} ${remainingDays > 1 ? 'days' : 'day'}`;
  //   }

  //   return result.trim(); // Remove any extra spaces
  // }


  // formatPeriod(days: number): string {
  //   if (!days || isNaN(days)) return '-';

  //   if (days >= 365) {
  //     const years = Math.floor(days / 365);
  //     return `${years} ${years > 1 ? 'yrs' : 'year'}`;
  //   } else if (days >= 30) {
  //     const months = Math.floor(days / 30);
  //     const remainingDays = days % 30;
  //     return remainingDays > 0
  //       ? `${months} ${months > 1 ? 'months' : 'month'} ${remainingDays} ${remainingDays > 1 ? 'days' : 'day'}`
  //       : `${months} ${months > 1 ? 'months' : 'month'}`;
  //   } else {
  //     return `${days} ${days > 1 ? 'days' : 'day'}`;
  //   }
  // }


  formatPeriodCommon(days: number): string {
    if (!days || isNaN(days)) return '-';

    const years = Math.floor(days / 365);
    const remainingDaysAfterYears = days % 365;
    const months = Math.floor(remainingDaysAfterYears / 30);
    const remainingDays = remainingDaysAfterYears % 30;

    let result: string[] = []; // Explicitly defining the type as string[]

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
  loadFullPage: boolean = false;
  // Fetch order review details
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

  // Get filtered coupons based on search query
  // get filteredCoupons() {
  //   return this.coupons.filter((coupon: any) =>
  //     coupon.COUPON_CODE.toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }
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
  // Open Coupon Modal
  openCouponModal(data: any) {
    this.countryID = data.COUNTRY_ID;
    this.isLoading = true;
    this.TERRITORY_ID = sessionStorage.getItem('CurrentTerritory');

    this.apiservice
      .getCoupanDetails(this.userID, data.ID, data.COUNTRY_ID, 'S', this.TERRITORY_ID)
      .subscribe(
        (response) => {
          if (response?.code === 200) {
            this.coupons = response.data; // Directly use API response
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

  // Show Coupon Modal
  showCouponModal() {
    let modalElement = document.getElementById('couponModal');
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Select Coupon
  selectCoupon(coupon: any) {
    this.selectedCoupon = coupon;
  }

  // Apply Selected Coupon
  applySelectedCoupon() {
    if (this.selectedCoupon) {
      let data = {
        CUSTOMER_ID: this.userID,
        CART_ID: this.cartID,
        COUNTRY_ID: this.countryID,
        COUPON_CODE: this.selectedCoupon.COUPON_CODE,
        TYPE: 'S',
      };

      this.apiservice.ApplyCoupan(data).subscribe((response: any) => {
        if (response?.code === 200) {
          this.message.success('Coupon successfully applied', '');
          this.closeCouponModal();
        } else {
          this.message.error('Invalid coupan code', '');
        }
      });
    } else {
      this.message.error('Please select a coupon first!');
    }
  }

  // Remove Coupon
  removeCoupon(event: Event, coupon: any) {
    event.stopPropagation(); // Prevent parent click event

    // Remove coupon from list
    this.coupons = this.coupons.filter(
      (c: any) => c.COUPON_ID !== coupon.COUPON_ID
    );

    // If the removed coupon was selected, reset selectedCoupon
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

  // Close Coupon Modal
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

    // Force remove 'modal-open' class & inline styles from body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }


  // Toggle Accordion Section
  toggleAccordion(section: string) {
    this.orderDetailsVisible[section] = !this.orderDetailsVisible[section];
  }

  RAZOR_PAY_KEY = 'rzp_test_SO1E5ovbNuNP0B'; // Razorpay API Keytest
  // RAZOR_PAY_KEY = 'rzp_live_UOLu84DuvGULjK'; // Razorpay API Key live

  getFinalAmount(): number {

    const cartInfo = this.OrderReviewDetails?.CART_INFO[0]?.TOTAL_AMOUNT;

    return cartInfo
    // if (!cartInfo) return 0;

    // // Calculate Final Amount with Discount
    // return (
    //   cartInfo.FINAL_AMOUNT - (cartInfo.COUPON_ID ? cartInfo.COUPON_AMOUNT : 0)
    // );
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
          this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call

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
    } else {
      var dataForRzpOrder = {
        CART_ID: cartId,
        ORDER_ID: 0,
        CUSTOMER_ID: this.user?.ID,
        JOB_CARD_ID: 0,
        PAYMENT_FOR: "O",
        amount: finalAmount * 100
      }
      this.apiservice.createRazorpayOrdertoRzp(dataForRzpOrder).subscribe((responserzp: any) => {

        // this.isLoading = false; // Stop loader
        if (responserzp?.code === 200 && responserzp.data.amount) {
          const options = {
            key: this.RAZOR_PAY_KEY,
            amount: finalAmount * 100, // Razorpay expects amount in paisa
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
                TRANSACTION_AMOUNT: finalAmount,
                PAYLOAD: options,
                RESPONSE_DATA: data,
                RESPONSE_CODE: 200,
                MERCHENT_ID: this.RAZOR_PAY_KEY,
                RESPONSE_MESSAGE: 'Transaction success',
                CLIENT_ID: 1,
                TERRITORYID: cartInfo?.TERRITORY_ID,

              };

              this.apiservice
                .addPaymentTransactions(body)
                .subscribe((response: any) => {
                  if (response?.code === 200) {

                    // create order call

                    const payload = {
                      CART_ID: cartId,
                      PAYMENT_METHOD: 'ONLINE',
                      CUSTOMER_ID: this.userID,
                      ADDRESS_ID: cartInfo?.ADDRESS_ID,
                      TERRITORYID: cartInfo?.TERRITORY_ID,
                      Razorpay_ID: responserzp.data.id,
                      TYPE: 'S',
                    };

                    this.apiservice.CreateOrder(payload).subscribe((response: any) => {
                      if (response?.code === 200) {
                        this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call

                        if (this.customertype === 'B') {
                          // this.message.success('Order placed successfully.', '');
                        } else {
                          this.message.success('Order placed successfully', '');
                        }

                        this.router.navigate(['/service']);
                      } else {
                        this.message.error('Failed to place order. Please try again.', '');
                      }
                    });



                    // End create order call
                    this.message.success(
                      'Payment successful. Your order has been placed!',
                      ''
                    );
                    setTimeout(() => {
                      this.router.navigate(['/service']); // Change '/home' to your actual route
                    }, 1000); // 1 second delayyyyy
                  } else {
                    this.message.error(
                      'Payment successful, but order processing failed. Please contact support.',
                      ''
                    );
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
          this.message.error(responserzp.data.error.description, '');
        }
      }, err => {
        this.isLoading = false;
        this.message.error(err.error.data.error.description, '');
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
    };
    this.apiservice.ApplyCoupan(data).subscribe((response: any) => {
      if (response?.code === 200) {
        this.message.success('Coupon successfully applied', '');
        this.closeCouponModal();
        this.newcoupons = false;
        newcopon = '';
        this.searchQuery = '';

      } else {
        this.message.error('Invalid coupan code', '');
      }
    });



  }

}
