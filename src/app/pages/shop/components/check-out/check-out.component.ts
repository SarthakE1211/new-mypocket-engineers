import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/Service/modal.service';
import { Subscription } from 'rxjs';
declare var Razorpay: any;
import * as bootstrap from 'bootstrap';
import { CartService } from 'src/app/Service/cart.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent {

  CART_ID: any;
  IMAGEuRL: any;
  @ViewChild('exampleModalCenter') modalElement!: ElementRef;
  modalInstance!: Modal;
  @Input() DefaultAddressArray: any = [];
  @Input() addresses: any[] = [];
  constructor(private apiservice: ApiServiceService, private message: ToastrService, private route: ActivatedRoute, private router: Router, private modalService: ModalService, private cartService: CartService, private modalservice: ModalService,) {

  }

  openModal() {
    this.modalInstance.show();
    this.customerAddress();
  }



  handleImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png'; // Set default image
  }

  serviceId: any | null = null;
  accordionState: { [key: string]: boolean } = {};
  addressSubscription: any = Subscription;
  cart: any
  home: any
  status: any
  maxCharLength: number = 40;

  ngOnInit() {
    this.setMaxCharLength();
    window.addEventListener('resize', this.setMaxCharLength);
    this.serviceId = this.route.snapshot.paramMap.get('sid');
    this.status = this.route.snapshot.paramMap.get('status');

    this.details(this.serviceId, this.status); // Now call details() after CART_ID is set
    const unitId = sessionStorage.getItem("unit_id");
    const unitName = sessionStorage.getItem("unit_name");
    const quantityPerUnit = sessionStorage.getItem("quantity_per_unit");

    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    this.getCustomers();

    this.CartInfo.forEach((product: any) => {
      this.accordionState[product.ID] = true;
    });
    this.addressSubscription = this.modalService.addressUpdated$.subscribe(() => {
      // Refresh the address list when the event is received
      this.getAddresses1();
      // this.details(this.serviceId)
    });

    this.getAddresses1();

    this.cart = sessionStorage.getItem('Cart');
    this.home = sessionStorage.getItem('Home');

    // Setup coupon modal event listener
    setTimeout(() => {
      let modalElement = document.getElementById('couponModal');
      if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', () => {
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          // Reset coupon state when modal is closed
          this.selectedCoupon = null;
          this.searchQuery = '';
          this.newcoupons = false;
        });
      }
    }, 100);
  }
  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  setMaxCharLength = (): void => {
    const screenWidth = window.innerWidth;
    this.maxCharLength = screenWidth < 576 ? 25 : 40;
  };

  get fullAddress(): string {
    const addr = this.defaultAddress;
    if (!addr) return '';
    return `${addr.ADDRESS_LINE_1 || ''}, ${addr.LANDMARK || ''}, ${addr.COUNTRY_NAME || ''}, ${addr.STATE_NAME || ''}, ${addr.DISTRICT_NAME || ''}`.replace(/\s+/g, ' ').trim();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.setMaxCharLength);
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

  toggleAccordion(productId: string) {
    this.accordionState[productId] = !this.accordionState[productId];
  }



  openAddressModal() {
    let modalElement: any = document.getElementById('addressModal');
    let modal = new bootstrap.Modal(modalElement);
    modal.show();
  }


  CartDetails: any = []
  CartInfo: any = []
  IS_CART: any
  CartDetailsCartInfoData: any = []
  loadService: boolean = false
  IS_CART_PAGE: any
  ADDRESS_id: any;
  TERRITORYID: any


  details(CART_ID: any, status: any) {
    // 

    this.loadService = true;
    if (status == 'H') {
      this.IS_CART_PAGE = 0
    } else if (status == 'C') {
      this.IS_CART_PAGE = 1
    }
    this.apiservice.getAddressDetails123(0, 0, 'id', 'desc', '', CART_ID, this.IS_CART_PAGE).subscribe((data) => {
      if (data['code'] == 200) {
        this.CartDetailsCartInfoData = data.data
        this.CartDetails = data.data.CART_DETAILS
        this.loadService = false;
        // this.getAddresses1()
        this.CartInfo = data.data.CART_INFO
        this.TERRITORYID = data.data.CART_INFO[0].TERRITORY_ID
        this.IS_CART = data.data.CART_INFO[0].IS_TEMP_CART
        this.ADDRESS_id = data.data.CART_INFO[0].ADDRESS_ID
      } else {
        this.CartDetails = []
        this.loadService = false;
      }

    })
  }

  CustomerDetails: any = []
  AllAddresses: any = []

  defaultAddress: any;

  customer_id = this.apiservice.getUserId();

  customerAddress() {
    this.loadService = true
    this.apiservice.getcustomerDetails(0, 0, 'IS_DEFAULT', 'desc', ' AND CUSTOMER_id =' + this.customer_id).subscribe((data) => {
      if (data['code'] == 200) {
        this.CustomerDetails = data.data
        this.AllAddresses = data.data



        this.loadService = false;

        // this.defaultAddress =
        //   this.CustomerDetails.find((addr: any) => addr.IS_DEFAULT === 1) || this.CustomerDetails[0];
        // 
      } else {
        this.CustomerDetails = []
        this.loadService = false;

      }
    })
  }


  DefaultAddress() {
    this.loadService = true
    this.apiservice.getDefaultAddress(this.customer_id,).subscribe((data) => {
      if (data['code'] == 200) {
        this.CustomerDetails = data.data
        this.loadService = false;

        this.defaultAddress =
          this.CustomerDetails.find((addr: any) => addr.IS_DEFAULT === 1) || this.CustomerDetails[0];

      } else {
        this.CustomerDetails = []
        this.loadService = false;

      }
    })
  }





  SELECT_ID: any
  passid(SelectID: any) {
    this.SELECT_ID = SelectID

  }

  data: any = {
    SERVICE_PHOTO_FILE: '',
    ID: null,
  };
  userID: any = this.apiservice.getUserId();


  confirmAddress() {
    // 
    // this.data = {
    //   TYPE: 'P',
    //   CUSTOMER_ID: this.userID,
    //   CART_ID: this.serviceId,
    //   ADDRESS_ID: this.SELECT_ID,
    // };

    // 


    // 

    const defaultaddress = this.addresses.filter((data: any) => data.ID == this.selectedAddress)


    this.apiservice.updateAddressDefault(defaultaddress[0]).subscribe(
      (res) => {
        if (res.code === 200) {
          this.message.success('Default address updated successfully.', '');
          this.customerAddress();
          this.closeAddressModal()
          this.details(this.serviceId, this.status);
        } else {
          this.message.error('Default address not updated successfully.', '');
        }
      },
      (error) => {
        this.message.error('Failed to save information.', '');
      }
    );
  }




  editAddress(address: any) {
    address['shop'] = '1'



    this.closeAddressModal();
    this.modalService.setDrawerState(true, address);
  }


  deleteAddress(addressId: number) {
    this.apiservice.DeleteAddress(this.userID, addressId).subscribe(
      (res) => {
        if (res.code === 200) {
          this.message.success('Address deleted successfully.', '');
          this.getAddresses1();
        } else {
          this.message.error('Address deleted successfully.', '');
        }
      },
      (error) => {
        this.message.error('Failed to Delete Address.', '');
      }
    );
  }

  addAddress() {

    // Logic to add a new address
  }

  // Coupon related properties
  searchQuery: string = '';
  selectedCoupon: any = null;
  coupons: any = [];
  isLoadingCoupon: boolean = false;
  newcoupons = false;

  // Get filtered coupons based on search query
  get filteredCoupons() {
    if (!this.coupons || this.coupons.length === 0) {
      return [];
    }

    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return this.coupons;
    }

    const query = this.searchQuery.toLowerCase().trim();

    return this.coupons.filter((coupon: any) =>
      coupon.COUPON_CODE?.toLowerCase().includes(query) ||
      coupon.COUPON_NAME?.toLowerCase().includes(query)
    );
  }


  CART_id: any;
  country_id: any;
  couponcount: any = 0;
  TERRITORY_ID: any;

  openCouponModal(data: any, product: any) {
    if (!data || !product) {
      this.message.error('Invalid data provided. Please try again.', '');
      return;
    }

    this.CART_id = data.CART_ID;
    this.country_id = product.COUNTRY_ID;
    this.isLoadingCoupon = true;
    this.TERRITORY_ID = product.TERRITORY_ID || sessionStorage.getItem('CurrentTerritory');

    // Reset coupon state
    this.selectedCoupon = null;
    this.searchQuery = '';
    this.newcoupons = false;
    this.coupons = [];

    this.apiservice
      .getCoupanDetailsforshop(this.userID, this.CART_id, this.country_id, 'P')
      .subscribe(
        (response) => {
          if (response?.code === 200) {
            this.coupons = response.data || []; // Directly use API response
            this.couponcount = this.coupons.length;
          } else {
            this.couponcount = 0;
            this.coupons = [];
          }
          this.isLoadingCoupon = false;
          this.showCouponModal();
        },
        (error) => {
          this.couponcount = 0;
          this.coupons = [];
          this.isLoadingCoupon = false;
          this.message.error('Failed to load coupons. Please try again.', '');
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




  coupon_code: any;
  cart_id: any
  LoadRemove: boolean = false;
  deleteCoupon(data: any, product: any) {
    this.coupon_code = (product.COUPON_CODE).toLowerCase();

    this.cart_id = data.CART_ID
    if (data && product) {
      this.selectedCoupon = null;

      let payloaddata = {
        CUSTOMER_ID: this.userID,
        CART_ID: this.cart_id,
        COUPON_CODE: this.coupon_code,
        TYPE: 'P',
      };
      this.LoadRemove = true;
      this.apiservice.RemoveCoupan(payloaddata).subscribe((response: any) => {
        if (response?.code === 200) {
          this.LoadRemove = false;
          this.message.success('Coupon successfully removed', '');
          // this.loadbutton = true;

          // this.details('');
          this.details(this.serviceId, this.status);
          // this.fetchOrderReviewDetails(this.cartID);
        } else {
          // this.loadbutton = true;
          this.LoadRemove = false;

          this.message.error('Failed to remove coupon', '');
        }
      }, err => {
        this.LoadRemove = false;
      });
    }

  }

  closeCouponModal() {
    // Reset coupon state
    this.selectedCoupon = null;
    this.searchQuery = '';
    this.newcoupons = false;

    let modalElement = document.getElementById('couponModal');
    if (modalElement) {
      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        // Fallback if modal instance doesn't exist
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
      }
    }

    // Force remove 'modal-open' class & inline styles from body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  selectCoupon(coupon: any) {
    this.selectedCoupon = coupon;
  }


  applySelectedCoupon() {
    if (!this.selectedCoupon) {
      this.message.error('Please select a coupon first!', '');
      return;
    }

    if (!this.selectedCoupon.COUPON_CODE) {
      this.message.error('Invalid coupon selected. Please try again.', '');
      return;
    }

    if (!this.CART_id) {
      this.message.error('Cart ID not found. Please try again.', '');
      return;
    }

    this.isLoadingCoupon = true;
    let data = {
      CUSTOMER_ID: this.userID,
      CART_ID: this.CART_id,
      COUNTRY_ID: this.country_id,
      COUPON_CODE: this.selectedCoupon.COUPON_CODE,
      TYPE: 'P',
    };

    this.apiservice.ApplyCoupan(data).subscribe(
      (response: any) => {
        this.isLoadingCoupon = false;
        if (response?.code === 200) {
          this.message.success('Coupon successfully applied', '');

          // Find the cart item and attach the selected coupon to it
          let cartItem = this.CartInfo.find((item: any) => item.CART_ID === this.CART_id);
          if (cartItem) {
            cartItem.appliedCoupon = this.selectedCoupon;
          }

          this.closeCouponModal();
          this.details(this.serviceId, this.status);
        } else {
          const errorMsg = response?.message || 'Invalid coupon code';
          this.message.error(errorMsg, '');
        }
      },
      (error) => {
        this.isLoadingCoupon = false;
        this.message.error('Failed to apply coupon. Please try again.', '');
      }
    );
  }


  removeCoupon(event: Event, coupon: any) {
    event.stopPropagation();
    this.coupons = this.coupons.filter((c: any) => c.COUPON_ID !== coupon.COUPON_ID);
    if (this.selectedCoupon?.COUPON_ID === coupon.COUPON_ID) {
      this.selectedCoupon = null;
    }
  }

  addCoupon() {
    this.newcoupons = true;
  }

  goBackFromCoupon() {
    this.newcoupons = false;
    this.searchQuery = '';
  }

  newcouponadd(newcopon: any) {
    if (!newcopon || !newcopon.trim()) {
      this.message.error('Please enter a coupon code.', '');
      return;
    }

    if (!this.CART_id) {
      this.message.error('Cart ID not found. Please try again.', '');
      return;
    }

    this.isLoadingCoupon = true;
    let data = {
      CUSTOMER_ID: this.userID,
      CART_ID: this.CART_id,
      COUNTRY_ID: this.country_id,
      COUPON_CODE: newcopon.trim().toUpperCase(),
      TYPE: 'P',
    };

    this.apiservice.ApplyCoupan(data).subscribe(
      (response: any) => {
        this.isLoadingCoupon = false;
        if (response?.code === 200) {
          this.message.success('Coupon successfully applied', '');
          this.closeCouponModal();
          this.newcoupons = false;
          this.searchQuery = '';
          this.details(this.serviceId, this.status);
        } else {
          const errorMsg = response?.message || 'Invalid coupon code';
          this.message.error(errorMsg, '');
        }
      },
      (error) => {
        this.isLoadingCoupon = false;
        this.message.error('Failed to apply coupon. Please try again.', '');
      }
    );
  }


  // Online Payment 


  // selectedPaymentMethod: string = 'ONLINE'; // Default Payment Mode
  selectedPaymentMethod: string = 'ONLINE'; // Default Payment Mode

  RAZOR_PAY_KEY = 'rzp_test_SO1E5ovbNuNP0B'; // Razorpay API Key
  // RAZOR_PAY_KEY = 'rzp_live_UOLu84DuvGULjK'; // Razorpay API Key live
  user: any;

  getFinalAmount(): number {
    const cartInfo = this.CartInfo;

    if (!cartInfo || cartInfo.length === 0) {

      return 0; // Return 0 when cart is empty
    }

    const cart = cartInfo[0]; // Assuming single cart object in array

    const totalTaxableAmount = parseFloat(cart.TOTAL_TAXABLE_AMOUNT) || 0;
    const expectedDeliveryCharges = parseFloat(cart.EXPECTED_DELIVERY_CHARGES) || 0;
    const discountAmount = parseFloat(cart.COUPON_AMOUNT) || 0;

    // Calculate total amount
    const totalAmount = totalTaxableAmount + expectedDeliveryCharges - discountAmount + parseFloat(cart.TAX_AMOUNT) ;






    return totalAmount;
  }

  isLoading: boolean = false;

  proceedToPay() {
    const USERID = this.apiservice.getUserId();
    this.isLoading = true; // Start loader

    const cartInfo = this.CartInfo[0];




    if (!cartInfo || !this.user) {
      this.message.error('Cart or user details are missing. Please try again.');
      this.isLoading = false;
      return;
    }
    const cartId = this.serviceId;

    const finalAmount = this.getFinalAmount();

    if (this.selectedPaymentMethod === 'COD') {
      const payload = {
        CART_ID: cartId,
        PAYMENT_METHOD: 'COD',
        CUSTOMER_ID: this.userID,
        ADDRESS_ID: cartInfo?.ADDRESS_ID,
        IS_TEMP_CART: this.IS_CART,
        TERRITORYID: this.TERRITORYID,
        TYPE: 'P',
      };

      this.apiservice.CreateshopOrder(payload).subscribe((response: any) => {
        this.isLoading = false; // Stop loader
        if (response?.code === 200) {
          this.message.success('Order placed successfully.', '');
          this.cartService.fetchAndUpdateCartDetails(this.customer_id);
          setTimeout(() => {
            this.router.navigate(['/shop/home']);
          }, 2000);
          this.cartService.fetchAndUpdateCartDetails(USERID); // ⭐️ Common Cal

        } else {
          this.message.error('Failed to place order. Please try again.', '');
        }
      }, err => {
        this.isLoading = false;
        this.message.error('Failed to place order. Please try again.', '');
      });
    } else {

      var dataForRzpOrder = {
        CART_ID: cartId,
        ORDER_ID: 0,
        CUSTOMER_ID: this.user?.ID,
        JOB_CARD_ID: 0,
        PAYMENT_FOR: "S",
        amount: finalAmount * 100
      }
      this.apiservice.createRazorpayOrdertoRzp(dataForRzpOrder).subscribe((responserzp: any) => {

        // this.isLoading = false; // Stop loader
        if (responserzp?.code === 200 && responserzp.data.amount) {
          const options = {
            key: this.RAZOR_PAY_KEY,
            amount: finalAmount * 100,
            currency: 'INR',
            name: this.user.NAME,
            // order_id:responserzp.data.id,
            description: 'Order Payment',
            handler: async (data: any) => {

              const body = {
                CART_ID: cartId,
                ORDER_ID: null,
                CUSTOMER_ID: this.user?.ID,
                MOBILE_NUMBER: this.user?.MOBILE_NO,
                PAYMENT_FOR: 'S',
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
                // IS_TEMP_CART :this.IS_CART,
              };

              this.apiservice.addPaymentTransactionsshop(body).subscribe((response: any) => {
                this.isLoading = false; // Stop loader
                if (response?.code === 200) {


                  // start create order

                  const payload = {
                    CART_ID: cartId,
                    PAYMENT_METHOD: 'ONLINE',
                    CUSTOMER_ID: this.userID,
                    ADDRESS_ID: cartInfo?.ADDRESS_ID,
                    IS_TEMP_CART: this.IS_CART,
                    TERRITORYID: this.TERRITORYID,
                    Razorpay_ID: responserzp.data.id,
                    TYPE: 'P',
                  };

                  this.apiservice.CreateshopOrder(payload).subscribe((response: any) => {
                    this.isLoading = false; // Stop loader
                    if (response?.code === 200) {
                      // this.message.success('Order placed successfully via Cash on Delivery.', '');
                      this.cartService.fetchAndUpdateCartDetails(this.customer_id);
                      setTimeout(() => {
                        this.router.navigate(['/shop/home']);
                      }, 2000);
                      this.cartService.fetchAndUpdateCartDetails(USERID); // ⭐️ Common Cal

                    } else {
                      this.message.error('Failed to place order. Please try again.', '');
                    }
                  }, err => {
                    this.isLoading = false;
                    this.message.error('Failed to place order. Please try again.', '');
                  });


                  // End create order

                  this.message.success('Payment successful. Your order has been placed!', '');
                  this.cartService.fetchAndUpdateCartDetails(this.customer_id);
                  setTimeout(() => {
                    this.router.navigate(['/shop/home']);
                  }, 2000);
                  this.cartService.fetchAndUpdateCartDetails(USERID); // ⭐️ Common Cal

                } else {
                  this.message.error('Payment successful, but order processing failed. Please contact support.', '');
                }
              }, err => {
                this.isLoading = false;
                this.message.error('Failed to place order. Please try again.', '');
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
          this.isLoading = false; // Stop loader on failure

          razorpay.on('payment.failed', () => {
            this.isLoading = false; // Stop loader on failure
          });
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

  // closeAddressModal() {
  //   let modalElement: any = document.getElementById('exampleModalCenter');
  //   let modal :any = bootstrap.Modal.getInstance(modalElement);
  //   modal.hide();
  // }

  closeAddressModal() {
    let modalElement: any = document.getElementById('addressModal');
    let modal: any = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }


  AddNewAddress() {


    this.closeAddressModal()
    this.modalService.openModal()
  }
  selectedAddress: string = '';

  getAddresses1() {
    this.apiservice
      .getAddresses1data(
        0,
        0,
        'IS_DEFAULT',
        'desc',
        ' AND CUSTOMER_ID = ' + this.userID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.addresses = data['data'];

            // Get default address
            this.defaultAddress =
              this.addresses.find((addr) => addr.IS_DEFAULT === 1) ||
              this.addresses[0];
            if (this.defaultAddress) {
              this.selectedAddress = this.defaultAddress.ID;
            } else {
              this.message.error('No Default Address Mapped');
            }
            this.DefaultAddressArray = this.defaultAddress;

            if (this.DefaultAddressArray['TERRITORY_ID']) {
              // this.getProjectData();
              // this.getBannerData();
              // this.generateDates(); // Populate the dates array
              // this.geServiceCategories();
              // this.getpincode();
            } else {
              this.message.error('No Default Address Mapped');
            }
          }
        },
        (error) => {

        }
      );
  }



  navigateToAddress() {
    this.modalService.openModal();
  }


  // addNewAddress() {

  //   this.closeAddressModal();

  //   this.modalservice.openModal();
  // }


  addNewAddress() {
    // Open add address form/modal

    this.closeAddressModal();

    this.modalservice.openModal();
  }
  customertype: any = this.apiservice.getCustomerType();

  addressData: any = [];
  // Utility method to navigate to service page and reload
  navigateToServicePage() {
    this.router.navigateByUrl('/service').then(() => {
      window.location.reload();
    });
  }
  CART_ITEM_ID: any;
  INVENTORY_ID: any;

  //     increaseQuantity(data: any) {

  // 


  //         if (this.quantity < data.UNIT_STOCK) {
  //           this.CART_id = this.CartInfo[0].CART_ID;
  //           this.CART_ITEM_ID = this.CartInfo[0].ID;
  //           this.INVENTORY_ID = this.CartInfo[0].INVENTORY_ID;
  //           this.QUANTITY = this.quantity + 1;

  //           // API call to update the cart count
  //           this.apiservice
  //             .CartCountUpdate(
  //               'SH',
  //               this.customer_id,
  //               this.CART_id,
  //               this.CART_ITEM_ID,
  //               this.QUANTITY,
  //               this.INVENTORY_ID
  //             )
  //             .subscribe((response) => {
  //               if (response['code'] == 200) {
  //                 this.message.success('Quantity added successfully.', '');

  //                 this.quantity = this.quantity + 1;
  //                 this.InventoryGet(this.InvertoryId, this.qUANTITY_PER_UNIT, this.uNIT_ID);
  //               } else {
  //                 console.error('Failed to update cart count');
  //               }
  //             });
  //         } else {
  //           this.message.error('No more stock is available', '');
  //         }

  //     }

  //     QUANTITY:any=1;
  //     quantity:any=1;
  //     decreaseQuantity() {
  //       
  //       if (this.QUANTITY > 1) {
  //         this.QUANTITY = this.quantity - 1;
  //         if (this.QUANTITY < 1) {
  //           this.QUANTITY = 1;
  //         }
  //       }
  //     }

}