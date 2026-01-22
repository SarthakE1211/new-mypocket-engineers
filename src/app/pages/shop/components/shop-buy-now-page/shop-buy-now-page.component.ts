import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { Offcanvas } from 'bootstrap';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from 'src/app/Service/cart.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from 'src/app/Service/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonmapComponent } from 'src/app/commonmap/commonmap.component';
declare var google: any;
export class registerdata {
  CUSTOMER_NAME: string = '';
  TYPE: any;
  CUSTOMER_MOBILE_NO: any = '';
  MOBILE_NO: any = '';
  COMPANY_NAME: '';
  EMAIL_ID: any = '';
  STATUS: any;
  TYPE_VALUE: any;
  OTP: any;
  IS_NEW_CUSTOMER: any = 1;
  USER_ID: any;
  CUSTOMER_EMAIL_ID: any;
  CUSTOMER_CATEGORY_ID: any;
  IS_SPECIAL_CATALOGUE: any;
  ACCOUNT_STATUS: any;
  CUSTOMER_TYPE: any;
  CLOUD_ID: any;
  W_CLOUD_ID: any;
  COUNTRY_CODE: any;
  SHORT_CODE: any;
  PAN_NUMBER: any;
  GST_NUMBER: any;
  CONTACT_PERSON_NAME: any;
}
interface AddressForm {
  CUSTOMER_ID: number;
  CUSTOMER_TYPE: number;
  CONTACT_PERSON_NAME: string;
  MOBILE_NO: string;
  EMAIL_ID: string;
  ADDRESS_LINE_1: string;
  ADDRESS_LINE_2: string;
  COUNTRY_ID: number;
  STATE_ID: number;
  CITY_ID: number;
  CITY_NAME: string;
  PINCODE_ID: any;
  PINCODE: string;
  TERRITORY_ID: any;
  DISTRICT_ID: number;
  GEO_LOCATION: string;
  DISTRICT_NAME: string;
  TYPE: string;
  IS_DEFAULT: boolean;
  CLIENT_ID: number;
  LANDMARK: '';
  PINCODE_FOR: '';
}
@Component({
  selector: 'app-shop-buy-now-page',
  templateUrl: './shop-buy-now-page.component.html',
  styleUrls: ['./shop-buy-now-page.component.scss']
})
export class ShopBuyNowPageComponent {
  data: any;
  user: any;
  isConfirmLoading: boolean;
  isOk: boolean;
  commonFunction: any;
  isloginSendOTP: boolean;
  modalService1: any;
  statusCode: string;
  mobileNumberorEmail: string;
  mobileNumberlogin: string;
  otp: string[];
  openVerify: boolean;
  showMap: boolean;
  searchQuery: string = '';
  selectedCoupon: any = null;
  isLoading: boolean = false;
  coupons: any = [];
  countryID: any;
  couponcount: any = 0;
  TERRITORY_ID: any;
  newcoupons = false;
  cartID: any;
  constructor(private apiservice: ApiServiceService, private cartService: CartService, private router: Router, private message: ToastrService, private cookie: CookieService, public sanitizer: DomSanitizer
    , private modalService: NgbModal,) { }
  @ViewChild(CommonmapComponent) commonMap!: CommonmapComponent;
  InvertoryId: any;
  inventorydata: any = []
  inventoryMappingdata: any = []
  inventoryImageMappingdata: any = []
  IMAGEuRL: any;
  IMAGEurl: any;
  selectedImage: string = '';
  carouselOptions = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 },
    },
  };
  qUANTITY_PER_UNIT: any
  uNIT_ID: any
  USERID: any;
  ngOnInit() {
    this.Address();
    this.InvertoryId = sessionStorage.getItem("InventoryID");
    this.qUANTITY_PER_UNIT = sessionStorage.getItem("QUANTITY_PER_UNIT")
    this.uNIT_ID = sessionStorage.getItem("UNIT_ID")
    this.USERID = this.apiservice.getUserId();
    this.InventoryGet(this.InvertoryId, this.qUANTITY_PER_UNIT, this.uNIT_ID)
    this.InventoryunitMapping(this.InvertoryId)
    this.InventoryImageMapping(this.InvertoryId)
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    this.IMAGEurl = this.apiservice.retriveimgUrl2();
    this.details()
    setTimeout(() => {
      let modalElement = document.getElementById('couponModal');
      if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', () => {
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          this.selectedCoupon = null;
          this.searchQuery = '';
          this.newcoupons = false;
        });
      }
    }, 100);
  }
  locationAddress: string = '';
  userID: any = this.apiservice.getUserId();
  CartDetails: any = []
  CART_IDI: any
  IS_STATIC_QTY: any
  onOpenMapClicked() { 
    this.commonMap.openMapModalz();
  }
  details() {
    this.loadService = true;
    this.apiservice
      .getcartinfo(0, 0, '', '', ' AND INVENTORY_ID =' + this.InvertoryId, this.userID).subscribe((data: any) => {
        if (data['code'] == 200) {
          this.CartDetails = data['data']['CART_DETAILS'][0];
          if (this.CartDetails == undefined) {
            this.quantity = 1
            this.IS_STATIC_QTY = 'Y'
          } else {
            this.quantity = this.CartDetails.QUANTITY;
            this.IS_STATIC_QTY = 'N'
          }
          this.CART_IDI = data?.data?.CART_DETAILS[0]?.CART_ID;
        } else {
          this.CartDetails = [];
          this.loadService = false;
        }
      });
  }
  handleImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png'; 
  }
  loadService: boolean = false
  InventoryGet(ID: any, qUANTITY_PER_UNIT: any, uNIT_ID: any) {
    this.loadService = true
    this.apiservice.getinventoryDatacart(0, 0, 'id', 'desc', ' AND ID = ' + ID + ' AND UNIT_ID = ' + uNIT_ID + ' AND QUANTITY_PER_UNIT = ' + qUANTITY_PER_UNIT, this.userID, ID, qUANTITY_PER_UNIT, uNIT_ID).subscribe((data) => {
      if (data['code'] == 200) {
        this.loadService = false;
        this.inventorydata = data.data
      } else {
        this.inventorydata = []
        this.loadService = false;
      }
    })
  }
  convertWarranty(days: number): string {
    if (days < 30) {
      return `${days} days warranty`;
    } else {
      const months = Math.floor(days / 30); 
      return `${months} months warranty`;
    }
  }
  gethtmlconent(dataa: any) {
    return this.sanitizer.bypassSecurityTrustHtml(dataa)
  }
  UpdateStok: any = [];
  unit_id: any;
  item_id: any;
  Showstock: boolean = true;
  ShowUNitstock: boolean = false;
  current_stock: any
  onUnitClick(data: any) {
    this.unit_id = data.UNIT_ID;
    this.item_id = data.ITEM_ID;
    this.apiservice.getchnageUnitcount(0, 0, '', '', '', this.unit_id, this.item_id)
      .subscribe((response) => {
        if (response['code'] == 200) {
          this.UpdateStok = response.data;
          this.current_stock = response.data[0].CURRENT_STOCK
          this.Showstock = false;
          this.ShowUNitstock = true;
        } else {
          this.UpdateStok = [];
        }
      });
  }
  InventoryunitMapping(ID: any) {
    this.apiservice.getinventoryunitMapping(0, 0, 'id', 'desc', ' AND ITEM_ID = ' + ID).subscribe((data) => {
      if (data['code'] == 200) {
        this.inventoryMappingdata = data.data
      } else {
        this.inventoryMappingdata = []
      }
    })
  }
  InventoryImageMapping(ID: any) {
    this.apiservice.inventoryImageMapping(0, 0, 'id', 'desc', ' AND STATUS = 1 AND INVENTORY_ID = ' + ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.inventoryImageMappingdata = data.data;
          if (this.inventoryImageMappingdata.length > 0) {
            this.selectedImage = this.IMAGEuRL + 'InventoryImages/' + this.inventoryImageMappingdata[0].IMAGE_URL;
          }
        } else {
          this.inventoryImageMappingdata = [];
          this.selectedImage = '';
        }
      });
  }
  selectImage(imageUrl: string) {
    this.selectedImage = this.IMAGEuRL + 'InventoryImages/' + imageUrl;
  }
  selectedUnit: any = null;
  QUANTITY_PER_UNIT: any
  UNIT_ID: any
  UNIT_NAME: any
  selectUnit(unit: any) {
    this.QUANTITY_PER_UNIT = unit.QUANTITY_PER_UNIT
    this.UNIT_ID = unit.UNIT_ID
    this.UNIT_NAME = unit.UNIT_NAME
    if (this.selectedUnit === unit) {
      this.selectedUnit = null; 
    } else {
      this.selectedUnit = unit; 
    }
  }
  Addressdata: any = []
  STATE_ID: any;
  ADDRESS_ID: any;
  teritory_id: any
  CUSTOMER_ID = this.apiservice.getUserId()
  Address() {
    this.apiservice.getAddress(0, 0, 'IS_DEFAULT', 'desc', ' AND IS_DEFAULT = 1 AND CUSTOMER_ID =' + this.CUSTOMER_ID).subscribe((data) => {
      if (data['code'] == 200) {
        this.Addressdata = data['data'];
        if (this.Addressdata.length > 0) { 
          this.STATE_ID = this.Addressdata[0].STATE_ID;
          this.ADDRESS_ID = this.Addressdata[0].ID; 
          this.teritory_id = this.Addressdata[0].TERRITORY_ID; 
        }
      } else {
        this.Addressdata = [];
      }
    });
  }
  openLoginModal() {
    if (this.userID === 0) {
      const modalElement = document.getElementById('guestModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }
  redirectToLogin() {
    if (this.userID == 0 || this.userID == null || this.userID == undefined) {
      this.cookie.deleteAll();
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }
  }
  cartdata: any = []
  customer_id = this.apiservice.getUserId()
  IS_TEMP_CART = 1
  TYPE = 'SH'
  DEMO: any
  ID: any
  unit_id_bynow: any
  quentity_per_unit: any
  unit_name: any
  loadingStates: { [key: number]: boolean } = {};
  buyNow(data: any) {
    if (this.USERID == 0) {
      this.openLoginModal();
      return
    }
    this.loadingStates[data.ID] = true; 
    this.ID = data.ID
    this.unit_id_bynow = data.UNIT_ID
    this.quentity_per_unit = data.QUANTITY_PER_UNIT
    this.unit_name = data.UNIT_NAME
    this.apiservice.CartGet(this.customer_id, this.ID, this.quantity, this.IS_TEMP_CART, this.STATE_ID, this.teritory_id, this.ADDRESS_ID, this.TYPE, this.unit_id_bynow, this.quentity_per_unit, this.unit_name).subscribe((data) => {
      if (data['code'] == 200) {
        this.cartdata.CART_ID = data.data.CART_ID;  
        sessionStorage.setItem("CART_ID", this.cartdata.CART_ID.toString());
        this.DEMO = data.data.CART_ID
        this.router.navigate(['/shop/check-out', this.DEMO, '']);
      } else {
        this.cartdata = [];
      }
      this.loadingStates[data.ID] = false; 
    });
  }
  IS_TEMP_CART1 = 0
  TYPE1 = 'P'
  addTOcartdata: any = []
  loadingStatesforcart: { [key: number]: boolean } = {};
  addToCart(data: any) {
    if (this.USERID == 0) {
      this.openLoginModal();
      return
    }
    this.loadingStatesforcart[data.ID] = true; 
    const ID = data.ID
    const unit_id = data.UNIT_ID
    const quentity_per_unit = data.QUANTITY_PER_UNIT
    const unit_name = data.UNIT_NAME
    const SERVICE_ID = 0
    this.apiservice.CartGetforaddtocart1(this.customer_id, ID, this.quantity, this.IS_TEMP_CART1, this.STATE_ID, this.teritory_id, this.ADDRESS_ID, this.TYPE1, SERVICE_ID, unit_id, quentity_per_unit, unit_name).subscribe((data) => {
      if (data['code'] == 200) {
        this.addTOcartdata.CART_ID = data.data.CART_ID;  
        this.apiservice.addItemToCart(ID)
        this.cartService.fetchAndUpdateCartDetails(this.userID);
        this.message.success('Item added to cart successfully.');
        this.InventoryGet(this.InvertoryId, this.qUANTITY_PER_UNIT, this.uNIT_ID)
        sessionStorage.setItem("CART_ID_FOR_CART", this.addTOcartdata.CART_ID.toString()); 
      } else {
        this.addTOcartdata = [];
      }
      this.loadingStatesforcart[data.ID] = false; 
    });
  }
  CART_id: any;
  CART_ITEM_ID: any;
  INVENTORY_ID: any;
  QUANTITY: any;
  quantity: any;
  increaseQuantity(data: any) {
    if (this.IS_STATIC_QTY == 'Y') {
      if (this.quantity < data.UNIT_STOCK) {
        this.quantity = this.quantity + 1;
        this.message.success('Quantity added successfully.', '');
      } else {
        this.message.error('No more stock is available', '');
      }
    } else {
      const cartData = this.CartDetails;
      if (this.quantity < data.UNIT_STOCK) {
        this.CART_id = cartData.CART_ID;
        this.CART_ITEM_ID = cartData.ID;
        this.INVENTORY_ID = cartData.INVENTORY_ID;
        this.QUANTITY = this.quantity + 1;
        this.apiservice
          .CartCountUpdate(
            this.TYPE,
            this.customer_id,
            this.CART_id,
            this.CART_ITEM_ID,
            this.QUANTITY,
            this.INVENTORY_ID
          )
          .subscribe((response) => {
            if (response['code'] == 200) {
              this.message.success('Quantity added successfully.', '');
              this.quantity = this.quantity + 1;
              this.InventoryGet(this.InvertoryId, this.qUANTITY_PER_UNIT, this.uNIT_ID);
            } else {
            }
          });
      } else {
        this.message.error('No more stock is available', '');
      }
    }
  }
  decreaseQuantity() {
    const data = this.CartDetails
    this.CART_id = data.CART_ID;
    this.CART_ITEM_ID = data.ID;
    this.INVENTORY_ID = data.INVENTORY_ID;
    if (this.QUANTITY > 1) {
      this.QUANTITY = this.quantity - 1;
      if (this.QUANTITY < 1) {
        this.QUANTITY = 1;
      }
      this.apiservice
        .CartCountUpdate(
          this.TYPE,
          this.customer_id,
          this.CART_id,
          this.CART_ITEM_ID,
          this.QUANTITY,
          this.INVENTORY_ID
        )
        .subscribe((response) => {
          if (response['code'] == 200) {
            this.message.success('Remove Quantity Count successfully.', '');
            this.quantity = this.quantity - 1
          } else {
          }
        });
    }
  }
  formatPeriod(days: number): string {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} ${years > 1 ? 'yrs' : 'yr'}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} ${months > 1 ? 'months' : 'month'}`;
    } else {
      return `${days} ${days > 1 ? 'days' : 'day'}`;
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
  handleBuyNow(product: any) {
    this.buyNow(product);
    this.InventoryunitMapping(product.ID);
  }
  guestuser = false;
  closeloginmodal() {
    this.guestuser = false;
  }
  isAddressStored = !!localStorage.getItem('AddressLine1');
  openSuggestionModal() {
    if (!this.userID) {
      this.guestuser = true;
      return;
    } else if ((!this.isAddressStored || this.isAddressStored === null || this.isAddressStored === undefined) && this.userID) {
      localStorage.setItem('locationby', '1');
      this.onOpenMapClicked();
    } else {
      const modalEl = document.getElementById('suggestionModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    }
  }
  closeSuggestionModal() {
    const modalEl = document.getElementById('suggestionModal');
    if (modalEl) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  }
  modalVisible = false;
  showAddressDetailsForm = false;
  closeaddressmodalSubCatClick() {
    this.modalVisible = false;
    this.showAddressDetailsForm = false;
    let modalElement = document.getElementById('addressmodalSubCatClick');
    if (modalElement) {
      let modal = bootstrap.Modal.getInstance(modalElement);
      modalElement.style.display = 'none';
      if (modal) {
        modal.hide();
      }
    }
    const serviceDrawer = document.getElementById('addressmodalSubCatClick');
    if (serviceDrawer) {
      const offcanvasInstance =
        bootstrap.Offcanvas.getInstance(serviceDrawer);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    }
  }
  addressSubmitted: boolean = false;
  terrotaryData: any = [];
  pincodeloading = false;
  getTerritory() {
    this.apiservice
      .getTerretoryData(
        0,
        0,
        '',
        '',
        " AND IS_ACTIVE =1 AND PINCODE_ID='" + this.addressForm.PINCODE_ID + "'"
      )
      .subscribe({
        next: (data: any) => {
          this.terrotaryData = data.data;
          const territory = this.terrotaryData[0];
          this.addressForm.TERRITORY_ID = territory.TERRITORY_ID ? territory.TERRITORY_ID : 0;
          this.pincodeloading = false; 
        },
        error: (error: any) => {
          this.terrotaryData = []; 
          this.pincodeloading = false; 
        },
      });
  }
  gettruecondition() {
    if (sessionStorage.getItem('closemodalfalse') == 'false') {
      return false;
    } else {
      return true;
    }
  }
  selectedPincode: string = '';
  selectedState: any = '';
  showStateDropdown: boolean = false;
  searchState: string = '';
  filteredStates: any[] = [];
  isAddrssSaving = false;
  stateData: any = [];
  latitude: any;
  longitude: any;
  currentMarker: any;
  pincodeData = [];
  showPincodeDropdown: boolean = false;
  selectPincode(pincode: any) {
    this.selectedPincode = pincode.PINCODE_NUMBER;
    this.addressForm.PINCODE = pincode.PINCODE;
    this.addressForm.PINCODE_ID = pincode.ID;
    this.addressForm.PINCODE_FOR = pincode.PINCODE_FOR;
    this.showPincodeDropdown = false;
    this.getTerritory();
    setTimeout(() => {
      this.addressForm.PINCODE = pincode.PINCODE;
    }, 500);
  }
  getStateData() {
    this.apiservice
      .getStateData(
        0,
        0,
        'SEQ_NO',
        'asc',
        ' AND IS_ACTIVE =1 AND COUNTRY_ID =' + this.addressForm.COUNTRY_ID
      )
      .subscribe({
        next: (data: any) => {
          this.stateData = data.data;
          this.pincodeloading = false; 
        },
        error: (error: any) => {
          this.stateData = []; 
          this.pincodeloading = false; 
        },
      });
  }
  fetchPincodeData(pincode: string) {
    if (pincode) {
      this.apiservice
        .getPincodeData(
          0,
          0,
          'SEQ_NO',
          'asc',
          " AND IS_ACTIVE =1 AND PINCODE='" + pincode + "'"
        )
        .subscribe({
          next: (data: any) => {
            this.pincodeData = data.data;
            this.selectPincode(this.pincodeData[0]);
            this.addressForm.PINCODE = '';
            this.addressForm.COUNTRY_ID = this.pincodeData[0].COUNTRY_ID;
            this.addressForm.STATE_ID = this.pincodeData[0].STATE;
            this.addressForm.DISTRICT_ID = this.pincodeData[0].DISTRICT;
            this.addressForm.DISTRICT_NAME = this.pincodeData[0].DISTRICT_NAME;
            if (
              this.addressForm.PINCODE !== '' &&
              this.addressForm.PINCODE !== undefined &&
              this.addressForm.PINCODE !== null
            ) {
              this.getTerritory();
            } else {
            }
            this.getStateData();
            this.pincodeloading = false; 
            this.isLoading = false;
          },
          error: (error: any) => {
            this.pincodeData = []; 
            this.pincodeloading = false; 
            this.isLoading = false;
          },
        });
    }
  }
  getpincode(pincodeeeee: any) {
    let pincode: string = this.addressForm.PINCODE || ''; 
    if (pincode || pincodeeeee) {
      if (pincode != null && pincode != null && pincode != '') {
        this.fetchPincodeData(pincode);
      } else if (
        pincodeeeee != null &&
        pincodeeeee != null &&
        pincodeeeee != ''
      ) {
        this.fetchPincodeData(pincodeeeee);
      }
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            pincode = data.address.postcode || '';
            this.fetchPincodeData(pincode); 
          } catch (error: any) {
            this.pincodeData = []; 
            this.pincodeloading = false; 
          }
        },
        (error) => {
          this.pincodeData = []; 
          this.pincodeloading = false; 
        }
      );
    }
  }
  getAddress(latitude: number, longitude: number): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const addressComponents = results[0].address_components;
          const city = addressComponents.find((comp: any) =>
            comp.types.includes('locality')
          );
          const state = addressComponents.find((comp: any) =>
            comp.types.includes('administrative_area_level_1')
          );
          const country = addressComponents.find((comp: any) =>
            comp.types.includes('country')
          );
          const postalCode = addressComponents.find((comp: any) =>
            comp.types.includes('postal_code')
          )?.long_name; 
          this.selectedPincode = '';
          this.addressForm.PINCODE = '';
          this.addressForm.PINCODE_ID = '';
          this.addressForm.CITY_NAME = city ? city.long_name : '';
          this.selectedState = state ? state.long_name : '';
          this.getpincode(postalCode);
        } else {
          this.addressForm.ADDRESS_LINE_1 = 'Unknown Area';
          this.addressForm.ADDRESS_LINE_2 = 'Unknown City';
          this.addressForm.CITY_ID = 0;
          this.addressForm.STATE_ID = 0;
          this.addressForm.COUNTRY_ID = 0;
          this.addressForm.PINCODE = '';
        }
      }
    );
  }
  confirmLocation(): void {
    const customerType = localStorage.getItem('customerType');
    const defaultLatitude = 28.6139; 
    const defaultLongitude = 77.209; 
    this.addressForm.PINCODE = '';
    if (this.currentMarker) {
      const position = this.currentMarker.getPosition();
      if (position) {
        this.latitude = position.lat();
        this.longitude = position.lng();
      } else {
        this.latitude = defaultLatitude;
        this.longitude = defaultLongitude;
      }
    } else {
      this.latitude = defaultLatitude;
      this.longitude = defaultLongitude;
    }
    const registerData = this.data;
    this.getAddress(this.latitude, this.longitude);
    this.modalVisible = false;
    this.closeregister();
    this.showAddressDetailsForm = true;
    this.addressForm.GEO_LOCATION = `${this.latitude},${this.longitude}`;
    this.data = registerData;
    if (this.user && this.user.ID) {
      this.addressForm.CUSTOMER_ID = this.user.ID;
      if (this.user.EMAIL_ID) {
        this.addressForm.EMAIL_ID = this.user.EMAIL_ID;
      }
    }
  }
  selectState(state: any) {
    this.selectedState = state.NAME;
    this.addressForm.STATE_ID = state.ID;
    this.showStateDropdown = false;
  }
  filterStates(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredStates = this.stateData.filter(
      (item: any) =>
        item.NAME.toLowerCase().includes(query) ||
        item.NAME.toLowerCase().includes(query)
    );
  }
  toggleStatesDropdown() {
    this.showStateDropdown = !this.showStateDropdown;
    if (this.showStateDropdown) {
      this.filteredStates = this.stateData;
    }
  }
  addressForm: AddressForm = {
    CUSTOMER_ID: 0,
    CUSTOMER_TYPE: 1,
    CONTACT_PERSON_NAME: '',
    MOBILE_NO: '',
    EMAIL_ID: '',
    ADDRESS_LINE_1: '',
    ADDRESS_LINE_2: '',
    COUNTRY_ID: 0,
    TERRITORY_ID: 0,
    LANDMARK: '',
    STATE_ID: 0,
    CITY_ID: 0,
    CITY_NAME: '',
    PINCODE_ID: 0,
    PINCODE: '',
    DISTRICT_ID: 0,
    DISTRICT_NAME: '',
    GEO_LOCATION: '',
    TYPE: 'H',
    IS_DEFAULT: false,
    CLIENT_ID: 1,
    PINCODE_FOR: '',
  };
  asGuest: boolean = false
  saveAddressAdd(form: NgForm): void {
    this.addressSubmitted = true;
    if (form.invalid) {
      return;
    }
    if (this.latitude && this.longitude) {
      this.addressForm.GEO_LOCATION = `${this.latitude},${this.longitude}`;
    }
    this.isAddrssSaving = true;
    this.addressForm.CUSTOMER_TYPE = 1;
    this.addressForm.CUSTOMER_ID = this.userID;
    this.addressForm.CONTACT_PERSON_NAME = this.data.CUSTOMER_NAME;
    this.addressForm.MOBILE_NO = this.data.CUSTOMER_MOBILE_NO;
    this.addressForm.EMAIL_ID = this.data.EMAIL_ID;
    this.addressForm.ADDRESS_LINE_1 = this.addressForm.ADDRESS_LINE_1;
    this.addressForm.CUSTOMER_TYPE = 1;
    if (this.addressForm.TYPE == 'Home') {
      this.addressForm.TYPE = 'H';
    } else if (this.addressForm.TYPE == 'Work') {
      this.addressForm.TYPE = 'F';
    } else if (this.addressForm.TYPE == 'Other') {
      this.addressForm.TYPE = 'O';
    }
    this.addressForm.IS_DEFAULT = true;
    const registerData = this.data;
    this.isConfirmLoading = true;
    if (!this.asGuest) {
      this.loadData();
      this.apiservice.RegistrationCustomerAddress(this.addressForm).subscribe(
        (successCode: any) => {
          if (successCode.body.code === 200) {
            this.stopLoader();
            this.isAddrssSaving = false;
            this.isOk = false;
            this.message.success('Address has been saved successfully.', '');
            sessionStorage.setItem(
              'userAddress',
              this.commonFunction.encryptdata(this.addressForm.ADDRESS_LINE_2)
            );
            localStorage.setItem(
              'userAddress',
              this.commonFunction.encryptdata(this.addressForm.ADDRESS_LINE_2)
            );
            this.apiservice.setAddress(this.addressForm.CITY_NAME);
            sessionStorage.setItem(
              'CurrentTerritory',
              this.addressForm?.TERRITORY_ID?.toString()
            );
            this.isloginSendOTP = false;
            this.modalService1.closeModal();
            this.showAddressDetailsForm = false;
            this.statusCode = '';
            const pincodeFor = this.addressForm.PINCODE_FOR;
            localStorage.setItem('pincodeFor', pincodeFor);
            this.isConfirmLoading = false;
            if (successCode.body?.SUBSCRIBED_CHANNELS.length > 0) {
              const channelNames = successCode.body.SUBSCRIBED_CHANNELS.map(
                (channel: any) => channel.CHANNEL_NAME
              );
              this.apiservice.subscribeToMultipleTopics(channelNames).subscribe(
                (successCode: any) => { },
                (error) => {
                  if (error.status === 300) {
                  } else if (error.status === 500) {
                    this.message.error(
                      'An unexpected error occurred. Please try again later.',
                      ''
                    );
                  } else {
                    this.isConfirmLoading = false;
                    this.message.error(
                      'An unknown error occurred. Please try again later.',
                      ''
                    );
                  }
                }
              );
            }
            this.modalVisible = false;
            this.showAddressDetailsForm = false;
            let modalElement = document.getElementById('addressmodalSubCatClick');
            if (modalElement) {
              let modal = bootstrap.Modal.getInstance(modalElement);
              modalElement.style.display = 'none';
              if (modal) {
                modal.hide();
              }
            }
            const serviceDrawer = document.getElementById('addressmodalSubCatClick');
            if (serviceDrawer) {
              const offcanvasInstance =
                bootstrap.Offcanvas.getInstance(serviceDrawer);
              if (offcanvasInstance) {
                offcanvasInstance.hide();
              }
            }
            window.location.href = '/shop/home';
          } else if (successCode.body.code === 300) {
            this.isAddrssSaving = false;
            this.statusCode = 'mobile number already exists.';
            this.isConfirmLoading = false;
            this.stopLoader();
          } else {
            this.isAddrssSaving = false;
            this.isConfirmLoading = false;
            this.stopLoader();
          }
          this.isConfirmLoading = false;
          this.stopLoader();
        },
        (error) => {
          this.isConfirmLoading = false;
          this.isAddrssSaving = false;
          this.stopLoader();
          if (error.status === 300) {
            this.isAddrssSaving = false;
            this.message.error('Email-ID is already exists', '');
          } else if (error.status === 500) {
            this.message.error(
              'An unexpected error occurred. Please try again later.',
              ''
            );
          } else {
            this.isAddrssSaving = false;
            this.message.error(
              'An unknown error occurred. Please try again later.',
              ''
            );
          }
        }
      );
    } else {
      const addressFormString = JSON.stringify(this.addressForm); 
      const encryptedAddress =
        this.commonFunction.encryptdata(addressFormString); 
      sessionStorage.setItem('userAddress', encryptedAddress);
      localStorage.setItem('userAddress', encryptedAddress);
      var abc = 0;
      sessionStorage.setItem(
        'userId',
        this.commonFunction.encryptdata(abc.toString())
      );
      localStorage.setItem(
        'userId',
        this.commonFunction.encryptdata(abc.toString())
      );
      sessionStorage.getItem('userId');
      sessionStorage.setItem(
        'customertype',
        this.commonFunction.encryptdata('I')
      );
      localStorage.setItem(
        'customertype',
        this.commonFunction.encryptdata('I')
      );
      localStorage.setItem('isLogged', 'true');
      this.modalService1.closeModal();
      this.showAddressDetailsForm = false;
      this.statusCode = '';
      this.modalVisible = false;
      this.showAddressDetailsForm = false;
      let modalElement = document.getElementById('addressmodalSubCatClick');
      if (modalElement) {
        let modal = bootstrap.Modal.getInstance(modalElement);
        modalElement.style.display = 'none';
        if (modal) {
          modal.hide();
        }
      }
      const serviceDrawer = document.getElementById('addressmodalSubCatClick');
      if (serviceDrawer) {
        const offcanvasInstance =
          bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
      window.location.href = '/shop/home';
    }
  }
  loadData() {
    throw new Error('Method not implemented.');
  }
  stopLoader() {
    throw new Error('Method not implemented.');
  }
  closeregister() {
    this.modalService.dismissAll();
    this.mobileNumberorEmail = '';
    this.mobileNumberlogin = '';
    this.otp = ['', '', '', '', '', ''];
    this.data = new registerdata();
    this.showAddressDetailsForm = false;
  }
  onshowMap() {
    this.showAddressDetailsForm = false;
    this.closeregister();
    setTimeout(() => this.initializeMapWithLocation(), 100);
    this.openVerify = false;
    this.modalVisible = true;
    this.showMap = true;
    this.showAddressDetailsForm = false;
    this.asGuest = true;
  }
  initializeMapWithLocation(): void {
    throw new Error('Method not implemented.');
  }
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
  openCouponModal(data: any) {
    if (!data) {
      this.message.error('Invalid data provided. Please try again.', '');
      return;
    }
    this.countryID = data.COUNTRY_ID || this.Addressdata[0]?.COUNTRY_ID || 1; 
    this.isLoading = true;
    this.TERRITORY_ID = sessionStorage.getItem('CurrentTerritory') || this.teritory_id || 0;
    this.selectedCoupon = null;
    this.searchQuery = '';
    this.newcoupons = false;
    this.coupons = [];
    this.cartID = sessionStorage.getItem("CART_ID") || this.DEMO || this.CART_IDI;
    if (!this.cartID) {
      this.message.error('Cart ID not found. Please create a cart first.', '');
      this.isLoading = false;
      return;
    }
    if (!data.ID) {
      this.message.error('Inventory ID not found. Please try again.', '');
      this.isLoading = false;
      return;
    }
    this.apiservice
      .getCoupanDetails(this.USERID, data.ID, this.countryID, 'S', this.TERRITORY_ID)
      .subscribe(
        (response) => {
          if (response?.code === 200) {
            this.coupons = response.data || []; 
            this.couponcount = this.coupons.length;
          } else {
            this.couponcount = 0;
            this.coupons = [];
          }
          this.isLoading = false;
          this.showCouponModal();
        },
        (error) => {
          this.couponcount = 0;
          this.coupons = [];
          this.isLoading = false;
          this.message.error('Failed to load coupons. Please try again.', '');
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
    if (!this.selectedCoupon) {
      this.message.error('Please select a coupon first!', '');
      return;
    }
    if (!this.selectedCoupon.COUPON_CODE) {
      this.message.error('Invalid coupon selected. Please try again.', '');
      return;
    }
    const cartId = sessionStorage.getItem("CART_ID") || this.DEMO || this.cartID || this.CART_IDI;
    if (!cartId) {
      this.message.error('Cart ID not found. Please create a cart first.', '');
      return;
    }
    if (!this.countryID) {
      this.countryID = this.Addressdata[0]?.COUNTRY_ID || 1;
    }
    let data = {
      CUSTOMER_ID: this.USERID,
      CART_ID: cartId,
      COUNTRY_ID: this.countryID,
      COUPON_CODE: this.selectedCoupon.COUPON_CODE,
      TYPE: 'S',
    };
    this.isLoading = true;
    this.apiservice.ApplyCoupan(data).subscribe((response: any) => {
      this.isLoading = false;
      if (response?.code === 200) {
        this.message.success('Coupon successfully applied', '');
        this.closeCouponModal();
      } else {
        const errorMsg = response?.message || 'Invalid coupon code';
        this.message.error(errorMsg, '');
      }
    }, (error) => {
      this.isLoading = false;
      this.message.error('Failed to apply coupon. Please try again.', '');
    });
  }
  removeCoupon(event: Event, coupon: any) {
    event.stopPropagation(); 
    if (!coupon || !coupon.COUPON_CODE) {
      this.message.error('Invalid coupon selected.', '');
      return;
    }
    this.coupons = this.coupons.filter(
      (c: any) => c.COUPON_ID !== coupon.COUPON_ID
    );
    if (this.selectedCoupon?.COUPON_ID === coupon.COUPON_ID) {
      this.selectedCoupon = null;
      const cartId = sessionStorage.getItem("CART_ID") || this.DEMO || this.cartID || this.CART_IDI;
      if (!cartId) {
        this.message.error('Cart ID not found. Please try again.', '');
        return;
      }
      this.isLoading = true;
      let data = {
        CUSTOMER_ID: this.USERID,
        CART_ID: cartId,
        COUPON_CODE: coupon.COUPON_CODE,
        TYPE: 'S',
      };
      this.apiservice.RemoveCoupan(data).subscribe((response: any) => {
        this.isLoading = false;
        if (response?.code === 200) {
          this.message.success('Coupon successfully removed', '');
          this.closeCouponModal();
        } else {
          const errorMsg = response?.message || 'Failed to remove coupon';
          this.message.error(errorMsg, '');
        }
      }, (error) => {
        this.isLoading = false;
        this.message.error('Failed to remove coupon. Please try again.', '');
      });
    }
  }
  closeCouponModal() {
    this.selectedCoupon = null;
    this.searchQuery = '';
    this.newcoupons = false;
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
    const cartId = sessionStorage.getItem("CART_ID") || this.DEMO || this.cartID || this.CART_IDI;
    if (!cartId) {
      this.message.error('Cart ID not found. Please create a cart first.', '');
      return;
    }
    if (!this.countryID) {
      this.countryID = this.Addressdata[0]?.COUNTRY_ID || 1;
    }
    this.isLoading = true;
    let data = {
      CUSTOMER_ID: this.USERID,
      CART_ID: cartId,
      COUNTRY_ID: this.countryID,
      COUPON_CODE: newcopon.trim().toUpperCase(),
      TYPE: 'S',
    };
    this.apiservice.ApplyCoupan(data).subscribe((response: any) => {
      this.isLoading = false;
      if (response?.code === 200) {
        this.message.success('Coupon successfully applied', '');
        this.closeCouponModal();
        this.newcoupons = false;
        this.searchQuery = '';
      } else {
        const errorMsg = response?.message || 'Invalid coupon code';
        this.message.error(errorMsg, '');
      }
    }, (error) => {
      this.isLoading = false;
      this.message.error('Failed to apply coupon. Please try again.', '');
    });
  }
  cancelAddressForm(): void {
    this.showAddressDetailsForm = false;
    this.addressForm = {
      CUSTOMER_ID: 0,
      CUSTOMER_TYPE: 1,
      CONTACT_PERSON_NAME: '',
      MOBILE_NO: '',
      EMAIL_ID: '',
      ADDRESS_LINE_1: '',
      ADDRESS_LINE_2: '',
      COUNTRY_ID: 0,
      STATE_ID: 0,
      CITY_ID: 0,
      CITY_NAME: '',
      PINCODE_ID: 0,
      TERRITORY_ID: 0,
      PINCODE: '',
      DISTRICT_ID: 0,
      DISTRICT_NAME: '',
      GEO_LOCATION: '',
      TYPE: 'H',
      IS_DEFAULT: false,
      CLIENT_ID: 1,
      LANDMARK: '',
      PINCODE_FOR: '',
    };
  }
}
