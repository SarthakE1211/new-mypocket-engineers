
import {
  Component,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { format, addDays } from 'date-fns';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpResponse,

} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/Service/modal.service';
import { FormsModule } from '@angular/forms';
import { CartService } from 'src/app/Service/cart.service';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { registerdata } from '../pages/login/login.component';
import { NgForm } from '@angular/forms';
import { LoaderService } from 'src/app/Service/loader.service';


declare var google: any;


interface User {
  ID: number;
  EMAIL_ID?: string;
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

interface LocationOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-commonmap',
  templateUrl: './commonmap.component.html',
  styleUrls: ['./commonmap.component.scss']
})
export class CommonmapComponent {
  map2: any;
  longitude: any;
  latitude: any;
  currentMarker: any;
  userID: any = this.apiservice.getUserId();
  addressID: any = this.apiservice.getUserAddressLocal();
  sessionAddress: any = this.apiservice.getSessionAddress();
  token = this.cookie.get('token');
  carouselItems: any[] = [];
  PopularServices: any[] = [];
  ServiceCateogries: any[] = [];
  public commonFunction = new CommonFunctionService();

  IMAGEuRL: any;
  services = [
    { name: 'Computer', image: '' },
    { name: 'WiFi', image: '' },
    { name: 'Printer', image: '' },
    { name: 'CCTV', image: '' },
    { name: 'Big Service', image: '' }, // This should be the large card
  ];




  public openMapModalz(): void {


    this.initializemap();
    const modal = document.getElementById('addressmodalSubCatClick');

    if (modal) {
      modal.style.display = 'block';
      // Ensure modal has high z-index to be above all other modals
      modal.style.zIndex = '11010';
    }

    this.renderer.addClass(document.body, 'modal-open'); // Prevent background scroll & blur
    this.modalVisible = true;
    this.showMap = true;
    const el = document.getElementById('addressmodalSubCatClick');

    // this.confirmLocation();

    if (el) {
      const m = new bootstrap.Modal(el);
      m.show();
    }
  }

  public closeMapModalz(): void {
    const el = document.getElementById('addressmodalSubCatClick');
    if (el) {
      const m = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
      m.hide();
    }
  }
  handleImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png'; // Set default image
  }

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
  carouselOptions1 = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: [
      '<i class="bi bi-chevron-left" ></i>',
      '<i class="bi bi-chevron-right" ></i>',

      // '<i class="bi bi-chevron-left" style="color: #007bff;"></i>',
      // '<i class="bi bi-chevron-right" style="color: #007bff;"></i>'
    ],

    responsive: {
      0: { items: 1 }, // Mobile (Portrait)
      480: { items: 2 }, // Small devices (Landscape)
      768: { items: 3 }, // Tablets
      1024: { items: 4 }, // Default for larger screens
      1200: { items: 5 }, // Default for larger screens
    },
  };

  carouselOptions2 = {
    loop: true,
    margin: 10,
    nav: false,
    dots: true,
    autoplay: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 },
    },
  };

  carouselOptions3 = {
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: [
      // '<i class="bi bi-chevron-left" ></i>',
      // '<i class="bi bi-chevron-right" ></i>'
    ],

    responsive: {
      0: { items: 2 }, // Mobile (Portrait)
      480: { items: 4 }, // Small devices (Landscape)
      768: { items: 6 }, // Tablets
      1500: { items: 8 }, // Default for larger screens
    },
  };

  carouselOptions4 = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: [
      '<i class="bi bi-chevron-left" ></i>',
      '<i class="bi bi-chevron-right" ></i>',

      // '<i class="bi bi-chevron-left" style="color: #007bff;"></i>',
      // '<i class="bi bi-chevron-right" style="color: #007bff;"></i>'
    ],

    responsive: {
      0: { items: 2 }, // Mobile (Portrait)
      480: { items: 2 }, // Small devices (Landscape)
      768: { items: 4 }, // Tablets
      1024: { items: 6 }, // Default for larger screens
    },
  };
  isFocused: string = '';
  customertype1: any = this.apiservice.getCustomerType();
  today = new Date();
  selectedDate: string = format(this.today, 'EEE, MMM d, yyyy'); // Default to today
  dates: { display: string; fullDate: string }[] = [];

  timeSlots = [
    {
      period: 'Morning',
      times: { start: '09:00', end: '12:00', disabled: false }, // 24-hour format
    },
    {
      period: 'Afternoon',
      times: { start: '12:00', end: '15:00', disabled: false },
    },
    {
      period: 'Evening',
      times: { start: '15:00', end: '24:00', disabled: false }, // Change '12:00 AM' to '23:59'
    },
  ];
  selectedSlot: string = ''; // Stores the selected time slot

  formatTime(time: string): string {
    let [hours, minutes] = time.split(':').map(Number);
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert '00' or '12-23' to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  constructor(
    private router: Router,
    private cookie: CookieService,
    private message: ToastrService,
    private datePipe: DatePipe,
    private apiservice: ApiServiceService,
    private modalService1: ModalService,
    private cartService: CartService,
    private metaService: Meta,
    private titleService: Title,
    private modalService: NgbModal,
    public sanitizer: DomSanitizer,
    private loaderService: LoaderService, private renderer: Renderer2,
  ) {
    this.updateSEO();

    this.generateDates();
  }
  updateSEO() {
    // alert('ddd')
    this.titleService.setTitle('PockIT - Your Digital Service Marketplace');

    this.metaService.updateTag({
      name: 'description',
      content:
        'PockIT Web is a digital platform that connects customers with service providers for seamless transactions, service tracking, and payments.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'PockIT Web, service marketplace, digital services, e-commerce platform, online bookings',
    });

    // Open Graph (For Facebook, LinkedIn)
    this.metaService.updateTag({
      property: 'og:title',
      content: 'PockIT Web - Your Digital Service Marketplace',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Find, book, and manage services effortlessly with PockIT Web, the ultimate digital service marketplace.',
    });
    // this.metaService.updateTag({ property: 'og:image', content: 'https://pockitapp.pockitengineers.com/assets/images/logo.png' });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://my.pockitengineers.com/',
    });

    // Twitter Card
    this.metaService.updateTag({
      name: 'twitter:title',
      content: 'PockIT Web - Your Digital Service Marketplace',
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content:
        'Find, book, and manage services effortlessly with PockIT Web, the ultimate digital service marketplace.',
    });
    // this.metaService.updateTag({ name: 'twitter:image', content: 'https://pockitapp.pockitengineers.com/assets/images/logo.png' });
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

    //
  }

  openLoginModal() {
    // this.message.info('Please log in to access services and other features.');
    if (this.userID === 0) {
      // Open modal if user is guest
      const modalElement = document.getElementById('guestModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }
  addressSubscription: any = Subscription;
  customertype: any = this.apiservice.getCustomerType();
  isMobile: boolean = false;

  loadingPage: boolean = false;

  ngOnInit() {

    this.isMobile = window.innerWidth < 768; // Detect mobile screen
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });

    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    //
    this.geServiceCategoriesViewOnly();
    if (this.userID === 0 || !this.userID) {

      this.getBannerData();

      // Ensure addressID is an object
      if (typeof this.addressID === 'string') {
        try {
          this.addressID = JSON.parse(this.addressID);
        } catch (error) {



          return; // Stop execution if JSON parsing fails
        }
      }

      if (this.addressID?.PINCODE) {


        this.apiservice
          .getterritoryPincodeData(
            0,
            0,
            'id',
            'desc',
            ` AND PINCODE = ${this.addressID.PINCODE}`
          )
          .subscribe(
            (data: any) => {
              if (data?.code === 200 && data?.data?.length > 0) {
                this.DefaultAddressArray = data.data[0];

                if (
                  this.DefaultAddressArray?.TERRITORY_ID == 0 ||
                  this.DefaultAddressArray?.TERRITORY_ID == null ||
                  this.DefaultAddressArray.length == 0
                ) {
                  this.geServiceCategoriesViewOnly();
                } else {
                  // Fetch related data
                  this.getProjectData();
                  this.geServiceCategories();
                }
              } else {
                this.geServiceCategoriesViewOnly();
              }
            },
            (error: any) => { }
          );
      } else {
      }
    } else {


      this.getBannerData();
      this.getAddresses1();
      const subscribedChannelsStr = this.apiservice.getsubscribedChannels();

      let channelsArray2: string[] = [];

      if (subscribedChannelsStr) {
        try {
          const parsed = JSON.parse(subscribedChannelsStr);

          if (Array.isArray(parsed)) {
            channelsArray2 = parsed
              .map((item: any) => {
                if (typeof item === 'string') {
                  return item;
                } else if (typeof item === 'object' && item?.CHANNEL_NAME) {
                  return item.CHANNEL_NAME;
                }
                return null;
              })
              .filter((name: string | null) =>
                name &&
                typeof name === 'string' &&
                name.trim() !== '' &&
                !['null', 'undefined'].includes(name.trim().toLowerCase())
              ) as string[];
          }

          this.getNonSubscribedChannels(channelsArray2);
        } catch (e) {

        }

      }




      setTimeout(() => {
        if (document.documentElement.scrollHeight <= window.innerHeight) {
          document.body.style.overflowY = 'auto'; // Force scrollbar if missing
        } else {
          document.body.style.overflowY = ''; // Keep default behavior
        }
      }, 200); // Delay to allow content to load
    }

  }
  getNonSubscribedChannels(channelsArray2: string[]) {
    const channelFilter = {
      $and: [
        { USER_ID: this.userID },
        { STATUS: true },
        { TYPE: 'C' },
        {
          CHANNEL_NAME: {
            $nin: channelsArray2,
          },
        },
      ],
    };


    this.apiservice.NonSubscribedChannels(channelFilter).subscribe(
      (response) => {
        let newChannels: string[] = response?.body?.data?.map((item: any) => item.CHANNEL_NAME) || [];

        const isValidChannel = (c: any) =>
          typeof c === 'string' &&
          c.trim() !== '' &&
          c.trim().toLowerCase() !== 'null' &&
          c.trim().toLowerCase() !== 'undefined';

        const cleanChannelsArray2 = channelsArray2.filter(isValidChannel);
        const cleanNewChannels = newChannels.filter(isValidChannel);

        if (cleanNewChannels.length > 0) {
          this.apiservice.subscribeToMultipleTopics(cleanNewChannels).subscribe({
            next: () => {
              const updatedChannelsArray = [
                ...cleanChannelsArray2,
                ...cleanNewChannels
              ];



              const encrypted = this.commonFunction.encryptdata(
                JSON.stringify(updatedChannelsArray)
              );

              localStorage.setItem('subscribedChannels', encrypted);

              const decrypted = this.commonFunction.decryptdata(
                localStorage.getItem('subscribedChannels') || ''
              );



            },
            error: (err) => {

            }
          });
        } else {

        }
      },
      (error) => {

      }
    );





    if (this.locationmodel) {

      this.modalVisible = true;
      localStorage.removeItem('locationby');
    }

  }
  locationmodel = localStorage.getItem('locationby');

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadService = false;
    }, 100); //
  }

  CartDetailsForCheck: any = [];
  getCartDetsils() {
    this.apiservice.getCartDetails(this.userID).subscribe((data: any) => {
      if (data['code'] === 200) {
        this.CartDetailsForCheck = data['data'];
      } else {
        this.CartDetailsForCheck = [];
      }
    });
  }


  DefaultAddressArray: any = [];
  getAddresses1() {
    this.loadingPage = true;
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
            this.loadingPage = false;

            this.addresses = data['data'];

            if (this.addresses.length > 0) {
              // Get default address
              this.defaultAddress =
                this.addresses.find((addr) => addr.IS_DEFAULT === 1) ||
                this.addresses[0];

              sessionStorage.setItem(
                'CurrentTerritory',
                this.defaultAddress?.TERRITORY_ID?.toString()
              );

              this.DefaultAddressArray = this.defaultAddress;

              if (this.DefaultAddressArray['TERRITORY_ID']) {
                this.getProjectData();
                // this.brands();
                // this.getTopSellingLaptops();
                this.getOfferData();
                this.generateDates(); // Populate the dates array
                this.geServiceCategories();
              } else {
                // this.message.error(
                //   'Territory not found, Please select other pincode'
                // );
                // sessionStorage.setItem('closemodalfalse', 'false');
                // this.modalservice.openModal();
                this.geServiceCategoriesViewOnly();
              }
            } else {

              // this.message.error(
              //   "You don't have any default address. Please add an address."
              // );
              sessionStorage.setItem('closemodalfalse', 'false');
              this.modalService1.openModal();
            }
          }
        },
        (error) => { }
      );
  }

  // IF Pincode has no data show view only data

  ServiceCateogriesView: any[] = [];
  displayedCategories1: any[] = [];
  loadCategories1 = false;
  loadMoreLoading1 = false;
  itemsPerPage = 10;
  currentPage = 1;

  geServiceCategoriesViewOnly() {


    this.loadCategories1 = true;
    this.apiservice
      .getCategoriesServicesViewOnly(0, 0, 'SEQ_NO', 'asc', ' AND STATUS = 1')
      .subscribe(
        (data) => {
          if (data.data && data.data.length > 0) {
            this.ServiceCateogriesView = data.data.map((item: any) => ({
              ...item,
              title: item.NAME, // for HTML binding
            }));
            this.currentPage = 1;
            this.updateDisplayedCategories();
          } else {
            this.ServiceCateogriesView = [];
            this.displayedCategories1 = [];
          }
          this.loadCategories1 = false;
        },
        (error) => {
          this.loadCategories1 = false;
        }
      );
  }



  viewOnlySubCategories: any[] = [];
  viewOnlySelectedCategoryTitle: string = '';
  loadingViewOnly = false;



  // closeViewOnlyCategoryDrawer() {
  //   this.viewOnlySubCategories = [];
  //   this.viewOnlySelectedCategoryTitle = '';
  //          const drawer = document.getElementById('viewOnlyServiceDrawer');
  //         if (drawer) {
  //           const bsDrawer = new bootstrap.Offcanvas(drawer);
  //           bsDrawer.hide();
  //         }
  // }

  closeViewOnlyCategoryDrawer() {
    this.viewOnlySubCategories = [];
    this.viewOnlySelectedCategoryTitle = '';

    const drawer1 = document.getElementById('viewOnlyServiceDrawer');
    const drawer2 = document.getElementById('viewOnlyServiceDrawerFinal');

    // if (drawer1) {
    //   const instance1 = bootstrap.Offcanvas.getInstance(drawer1);
    //   if (instance1) {
    //     instance1.hide();
    //   }
    // }

    // if (drawer2) {
    //   const instance2 = bootstrap.Offcanvas.getInstance(drawer2);
    //   if (instance2) {
    //     instance2.hide();
    //   }
    // }

    // setTimeout(() => {
    //   const backdrops = document.querySelectorAll('.offcanvas-backdrop');
    //   backdrops.forEach((backdrop) => backdrop.remove());
    //   document.body.classList.remove('offcanvas-backdrop', 'modal-open');
    // }, 300);
  }

  viewOnlyServicesList: any[] = [];
  viewOnlySelectedDevice: any = null;
  cartspinner: boolean = false;

  initializemap() {


    setTimeout(() => {
      // Ensure modal is fully visible before initializing map
      const mapElement = document.getElementById('map');
      if (mapElement && mapElement.offsetHeight > 0) {
        this.initializeMapWithLocation();
      } else {
        // If map element not ready, try again after a short delay
        setTimeout(() => this.initializeMapWithLocation(), 200);
      }
    }, 300);
  }

  selectedDevicename: any = '';
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
  guestuser = false;



  closeloginmodal() {
    this.guestuser = false;
  }
  openActionDrawerViewOnly(subcategory: any, type: any) {
    const pincodeFor = localStorage.getItem('pincodeFor');

    if (!this.userID) {

      this.guestuser = true;


    } else {



      if (!pincodeFor) {
        this.initializemap();
        const modal = document.getElementById('addressmodalSubCatClick');

        modal.style.display = 'block';
        this.renderer.addClass(document.body, 'modal-open'); // Prevent background scroll & blur
        this.modalVisible = true;
        this.showMap = true;
        const drawer = document.getElementById('addressmodalSubCatClick');
        if (drawer) {


          const bsDrawer = new bootstrap.Offcanvas(drawer);

          bsDrawer.show();

        }


      } else {
        this.selectedDevicename = subcategory.NAME;
        let filter = '';

        if (type === 'parrent1') {
          filter = " AND (SERVICE_TYPE= 'O' OR SERVICE_TYPE= 'C' OR SERVICE_TYPE IS NULL) AND IS_FOR_B2B = 0 AND PARENT_ID=" + subcategory.ID;
        } else {
          filter =
            " AND (SERVICE_TYPE= 'O' OR SERVICE_TYPE= 'C' OR SERVICE_TYPE IS NULL) AND PARENT_ID=0 AND IS_FOR_B2B = 0 AND SUB_CATEGORY_ID=" +
            subcategory.ID;
        }

        this.viewOnlySelectedDevice = subcategory;
        this.viewOnlySelectedCategoryTitle = subcategory.CATEGORY_NAME || 'Service';
        this.cartspinner = true;

        this.apiservice
          .getParentServicesViewOnly(0, 0, 'id', 'asc', filter)
          .subscribe(
            (data) => {
              this.cartspinner = false;
              const services = data.data;

              if (services && services.length > 0) {
                this.viewOnlyServicesList = services;
                setTimeout(() => {
                  const drawer = document.getElementById(
                    'viewOnlyServiceDrawerFinal'
                  );
                  if (drawer) {
                    const bsDrawer = new bootstrap.Offcanvas(drawer);
                    bsDrawer.show();
                  }
                }, 100);

              } else {
                this.viewOnlyServicesList = [];
                this.showServiceUnavailableModal();
              }
            },
            (error) => {
              this.cartspinner = false;
              this.showServiceUnavailableModal();
            }
          );
      }
    }
  }

  saveAddressAdd(form: NgForm): void {

    this.addressSubmitted = true;
    if (form.invalid) {
      return;
    }
    if (this.latitude && this.longitude) {
      this.addressForm.GEO_LOCATION = `${this.latitude},${this.longitude}`;
    }

    // Add validation here

    this.isAddrssSaving = true;
    // this.data.STATUS = 1;
    this.addressForm.CUSTOMER_TYPE = 1;
    this.addressForm.CUSTOMER_ID = this.userID;
    this.addressForm.CONTACT_PERSON_NAME = this.data.CUSTOMER_NAME;
    this.addressForm.MOBILE_NO = this.data.CUSTOMER_MOBILE_NO;
    this.addressForm.EMAIL_ID = this.data.EMAIL_ID;
    this.addressForm.ADDRESS_LINE_1 = this.addressForm.ADDRESS_LINE_1;
    // this.addressForm.CONTACT_PERSON_NAME =  this.use

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
// Auto-update header address everywhere
           // this.apiservice.setAddress(this.addressForm.ADDRESS_LINE_2);
           this.apiservice.setAddress(this.addressForm.CITY_NAME);

            sessionStorage.setItem(
              'CurrentTerritory',

              this.addressForm?.TERRITORY_ID?.toString()
            );
            this.isloginSendOTP = false;
            this.modalService1.closeModal();
            // this.otpSent = true;
            // this.showOtpModal = true;
            // this.userID = successCode.USER_ID;
            // this.USER_NAME = successCode.USER_NAME;
            this.showAddressDetailsForm = false;
            this.statusCode = '';
            // this.data = registerData;
            const pincodeFor = this.addressForm.PINCODE_FOR;

            // Save to localStorage
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
                    // Handle server-side error
                    this.message.error(
                      'An unexpected error occurred. Please try again later.',
                      ''
                    );
                  } else {
                    this.isConfirmLoading = false;
                    // Generic error handling
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
            // window.location.href = '/service';
            this.redirectAfterAddressSave();
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
          // Handle error if login fails
          if (error.status === 300) {
            this.isAddrssSaving = false;
            // Handle specific HTTP error (e.g., invalid credentials)
            this.message.error('Email-ID is already exists', '');
          } else if (error.status === 500) {
            // Handle server-side error
            this.message.error(
              'An unexpected error occurred. Please try again later.',
              ''
            );
          } else {
            this.isAddrssSaving = false;
            // Generic error handling
            this.message.error(
              'An unknown error occurred. Please try again later.',
              ''
            );
          }
        }
      );
    } else {
      const addressFormString = JSON.stringify(this.addressForm); // Convert object to string
      const encryptedAddress =
        this.commonFunction.encryptdata(addressFormString); // Encrypt string
      sessionStorage.setItem('userAddress', encryptedAddress);
      localStorage.setItem('userAddress', encryptedAddress);
      // sessionStorage.setItem('userAddress', this.commonFunction.encryptdata(this.addressForm));
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

      // window.location.href = '/service';
      this.redirectAfterAddressSave();
    }

    // Call your API to save the address
    // Reset form and hide after successful save
  }

  openServiceDrawerViewOnly(category: any) {


    this.loadingViewOnly = true;
    this.viewOnlySelectedCategoryTitle = category.NAME;

    this.apiservice
      .getSubCategoriesServicesViewOnly(
        0,
        0,
        'SEQ_NO',
        'asc',
        ' AND STATUS = 1 AND CATEGORY_ID = ' + category.ID
      )
      .subscribe(
        (data) => {
          this.loadingViewOnly = false;
          if (data.data && data.data.length > 0) {
            this.viewOnlySubCategories = data.data.map((item: any) => ({
              ...item,
              title: item.NAME,
              ICON: item.IMAGE,
            }));
          } else {
            this.viewOnlySubCategories = [];
          }

          // Open the drawer
          const drawer = document.getElementById('viewOnlyServiceDrawer');
          if (drawer) {
            const bsDrawer = new bootstrap.Offcanvas(drawer);

            // const bsModal = new bootstrap.Modal(document.getElementById('viewOnlyServiceDrawer'), {
            //   backdrop: false
            // });
            // bsModal.show()
            bsDrawer.show();
          }
        },
        (error) => {
          this.loadingViewOnly = false;
          this.viewOnlySubCategories = [];
        }
      );
  }

  showServiceUnavailableModal() {
    const modalEl = document.getElementById('suggestionModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  openSuggestionModal() {
    const modalEl = document.getElementById('suggestionModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeSuggestionModal() {
    const modalEl = document.getElementById('suggestionModal');
    if (modalEl) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }

    // Remove all possible backdrops
    setTimeout(() => {
      const backdrops = document.querySelectorAll(
        '.modal-backdrop, .offcanvas-backdrop'
      );
      backdrops.forEach((backdrop) => backdrop.remove());

      // Clean up body classes
      document.body.classList.remove('modal-open', 'offcanvas-backdrop');
      document.body.style.overflow = ''; // just in case it's blocked
    }, 300);
  }

  closeFinalDrawer() {
    const drawer = document.getElementById('viewOnlyServiceDrawerFinal');
    if (drawer) {
      const bsDrawer = bootstrap.Offcanvas.getInstance(drawer);
      if (bsDrawer) {
        bsDrawer.hide();
      }
    }
  }

  updateDisplayedCategories() {
    const start = 0;
    const end = this.itemsPerPage * this.currentPage;
    this.displayedCategories1 = this.ServiceCateogriesView.slice(start, end);
  }

  loadMore2() {
    this.loadMoreLoading1 = true;
    setTimeout(() => {
      this.currentPage++;
      this.updateDisplayedCategories();
      this.loadMoreLoading1 = false;
    }, 500);
  }

  getBannerData() {
    var filter: any = '';
    if (this.customertype1 == 'B') {
      filter = " AND ( CUSTOMER_TYPE='BB' OR CUSTOMER_TYPE='BO')";
    } else if (this.customertype1 == 'I') {
      filter = " AND (CUSTOMER_TYPE='BC' OR CUSTOMER_TYPE='BO')";
    } else {
      filter = " AND CUSTOMER_TYPE='BO'";
    }
    this.apiservice
      .getBannerData(
        0,
        0,
        'SEQ_NO',
        'asc',
        " AND STATUS = 1 AND IS_FOR_SHOP = 0 AND BANNER_TYPE = 'M' AND BANNER_FOR = 'W'" +
        filter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.carouselItems = data['data'];
          }
        },
        (error) => { }
      );
  }

  TopSellingLaptops: any[] = [];
  loadLaptops: boolean = false;
  OfferData: any[] = [];

  getOfferData() {
    this.apiservice
      .getBannerData(
        0,
        0,
        'SEQ_NO',
        'asc',
        ' AND STATUS = 1 AND IS_FOR_SHOP = 0  AND BANNER_TYPE = "O"  '
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.OfferData = data['data'];
            if (data.data.length > 0) {
              // this.PopularServices = data.data.slice(0, 4); // Only take the first 4 records
            } else {
            }
          } else {
            this.OfferData = [];
          }
        },
        (error) => {
          this.OfferData = [];
        }
      );
  }

  getTopSellingLaptops() {
    this.loadLaptops = true;
    this.apiservice.getTopSellingLaptopsForWeb('ID', 'asc').subscribe(
      (data) => {
        if (data.data.length > 0) {
          this.loadLaptops = false;
          this.TopSellingLaptops = data.data.slice(0, 10); // Show top 10
        } else {
          this.loadLaptops = false;
          this.TopSellingLaptops = [];
        }
      },
      (error) => {
        this.loadLaptops = false;
      }
    );
  }

  loadBrands: boolean = false;
  brand: any[] = [];

  brands() {
    this.loadBrands = true;
    this.apiservice
      .getBrands(0, 0, 'SEQUENCE_NO', 'asc', ' AND IS_POPULAR = 1 AND STATUS = 1')
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.loadBrands = false;
            this.brand = response.body.data; // Store all brands
          } else {
            this.loadBrands = false;
            this.brand = [];
          }
        },
        (err: HttpErrorResponse) => { }
      );
  }

  loadService: boolean = false;
  getProjectData() {
    this.homepageprogress = 0;
    this.loadService = true;

    this.isLoading = false;
    this.apiservice
      .getPoppulerServicesForWeb(
        this.DefaultAddressArray['TERRITORY_ID'],
        this.userID,
        this.customertype, 'ID', 'asc'
      )
      .subscribe(
        (data) => {
          if (data.data.length > 0) {
            this.loadService = false;
            this.PopularServices = data.data.slice(0, 10); // Only take the first 4 records
          } else {
            this.loadService = false;

            this.PopularServices = [];
          }
        },
        (error) => {
          this.loadService = false;
        }
      );
  }
  loadMoreLoading: boolean = false; // New loader for "Load More" button

  loadCategories: boolean = false;
  itemsToShow: number = 10; // Initially show 6 items
  displayedCategories: any[] = [];
  geServiceCategories() {
    this.loadCategories = true;
    this.apiservice
      .getCategoriesServices(
        0,
        0,
        '', '',
        '',
        this.DefaultAddressArray['TERRITORY_ID'],
        this.userID,
        this.customertype
      )
      .subscribe(
        (data) => {
          if (data.data.length > 0) {
            // this.ServiceCateogries = [];
            // this.ServiceCateogries.push(...data.data, ...data.data);
            this.ServiceCateogries = data.data;

            // this.ServiceCateogries = [...data.data, ...data.data , ...data.data]; // Duplicate data
            this.displayedCategories = this.ServiceCateogries.slice(
              0,
              this.itemsToShow
            ); // Show initial items

            this.loadCategories = false;
          } else {
            this.ServiceCateogries = [];
            this.loadCategories = false;
          }
        },
        (error) => {
          this.loadCategories = false;
        }
      );
  }

  loadMore() {
    this.loadMoreLoading = true; // Show "Load More" spinner
    setTimeout(() => {
      let newLength = this.displayedCategories.length + 6;
      this.displayedCategories = this.ServiceCateogries.slice(0, newLength);
      this.loadMoreLoading = false; // Hide spinner after timeout
    }, 500); // 500ms delay
  }

  isDrawerOpen1 = false;
  isMapModalOpen = false;
  isEdit = false;
  addressType = 'home';
  showMap: boolean = false;

  address: any = {
    houseNo: '',
    landmark: '',
    city: '',
    pincode: '',
    state: '',
  };
  showPincodeDropdown: boolean = false;
  searchPincode: string = '';
  filteredPincodes: any[] = [];
  selectedPincode: string = '';
  locationCode: string = '';
  locationAddress: string = '';
  pincodeData: any = [];
  pincodeloading: boolean = false;
  selectedLocation: any;
  isPincodeLoading: boolean=true;
 

  closeDrawer2() {
    this.isDrawerOpen1 = false;
  }

  setAddressType(type: string) {
    this.addressType = type;
  }

  openMapModal() {
    this.isMapModalOpen = true;
    this.modalVisible1 = true;
  }

  closeMapModal() {
    this.isMapModalOpen = false;
    this.modalVisible1 = false;
  }

  saveLocation() {
    this.address.plusCode = 'XYZ123';
    this.address.addressLine = 'Sample Street, Pune';
    this.address.city = 'Pune';
    this.address.state = 'Maharashtra';
    this.closeMapModal();
  }

  confirmAddress2(form: any) {
    if (form.valid) {
      this.closeDrawer();
    }
  }
  setDefaultAddress() {
    // if (this.selectedAddress) {
    //   this.defaultAddress = this.addresses.find(addr => addr.ID === this.selectedAddress);
    // }
  }

  addressData: any = [];

  confirmAddress() {
    // Step 1: Check if address is selected
    if (!this.selectedAddress) {
      alert('Please select an address before confirming.');
      return;
    }
    //
    const defaultaddress = this.addresses.filter(
      (data: any) => data.ID == this.selectedAddress
    );
    //
    this.apiservice.updateAddressDefault(defaultaddress[0]).subscribe(
      (res) => {
        if (res.code !== 200) {
          this.message.error('Default address not updated successfully.', '');
          return;
        }

        this.message.success('Default address updated successfully.', '');

        // Step 3: Get cart details
        this.apiservice.getCartDetails(this.userID).subscribe(
          (cartRes: any) => {
            const cartDetails = cartRes.data?.CART_DETAILS;
            const cartInfo = cartRes.data?.CART_INFO;

            if (cartDetails?.length > 0 && cartInfo?.length > 0) {
              // Step 4: Get latest address list and find default
              const condition = ` AND CUSTOMER_ID=${this.userID} AND STATUS = 1`;

              this.apiservice
                .getAddresses1data(0, 0, 'IS_DEFAULT',
                  'desc', condition)
                .subscribe({
                  next: (addressRes: any) => {
                    this.addressData = addressRes.data;

                    const defaultAddress = this.addressData.find(
                      (addr: any) => addr.IS_DEFAULT === 1
                    );

                    if (!defaultAddress) return;

                    // Step 5: Prepare data to update cart
                    const updateCartData = {
                      CART_ID: cartDetails[0].CART_ID,
                      ADDRESS_ID: cartInfo[0].ADDRESS_ID,
                      TYPE: cartInfo[0].TYPE,
                      OLD_TERRITORY_ID:
                        sessionStorage.getItem('CurrentTerritory'),
                      NEW_TERRITORY_ID: defaultAddress.TERRITORY_ID,
                      CUSTOMER_ID: cartInfo[0].CUSTOMER_ID,
                    };

                    // Step 6: Update cart with new address info
                    this.apiservice
                      .updateAddressToUpdateCart(updateCartData)
                      .subscribe(
                        (successCode: any) => {
                          if (successCode.body.code === 200) {
                            sessionStorage.setItem(
                              'CurrentTerritory',
                              defaultAddress.TERRITORY_ID.toString()
                            );
                            this.cartService.fetchAndUpdateCartDetails(
                              this.userID
                            );
                            this.navigateToServicePage();
                          }
                        },
                        (error) => { }
                      );
                  },
                  error: (err) => { },
                });
            } else {
              // No cart items, just navigate
              this.navigateToServicePage();
            }
          },
          (error) => { }
        );

        // Step 7: Close the modal
        this.closeAddressModal();
      },
      (error) => {
        this.message.error('Failed to save information.', '');
      }
    );
  }

  // Utility method to navigate to service page and reload
  navigateToServicePage() {
    this.router.navigateByUrl('/service').then(() => {
      window.location.reload();
    });
  }

  // editAddress(address: any) {
  //   // Open edit form/modal
  // }
  editAddress(address: any) {
    address['shop'] = '0';
    this.modalService1.setDrawerState(true, address);
    this.closeAddressModal();
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

  addNewAddress() {
    // Open add address form/modal

    this.closeAddressModal();

    this.modalService1.openModal();
  }
  closeAddressModal() {
    let modalElement: any = document.getElementById('addressModal');
    let modal: any = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
  //

  selectedService: any = [];
  uploadedImageUrl: string | null = null;
  // Service opencode

  quantity = 1;
  // uploadedImageUrl: string | null = null;

  addresses: any[] = [];
  defaultAddress: any;
  selectedAddress: string = '';

  data: any = {
    SERVICE_PHOTO_FILE: '',
    ID: null,
  };

  isInCart: boolean = false;

  // userId = sessionStorage.getItem('userId');
  // decrepteduserIDString = this.userId ? this.commonFunction.decryptdata(this.userId) : '';
  // decrepteduserID = parseInt(this.decrepteduserIDString, 10);

  homepageprogress = 0;
  openDrawer(service: any) {
    service.DESCRIPTION = '';
    this.selectedService = service;
    this.showModal = false;
    this.defaultAddress = this.addresses.find((addr) => addr.IS_DEFAULT === 1);
    this.selectedAddress = this.defaultAddress?.ID; // Set default preselected
    const offcanvas = new bootstrap.Offcanvas(
      document.getElementById('serviceOffcanvas')!
    );
    offcanvas.show();

    this.updateProgress1();
    this.isInCart = false;
  }

  updateProgress1() {
    this.homepageprogress += 50; // Adjust increment as needed
    if (this.homepageprogress > 100) {
      this.homepageprogress = 100;
    }
  }

  increaseQty() {
    if (this.quantity < this.selectedService?.MAX_QTY) {
      this.quantity++;
    } else {
      this.message.info(
        `Maximum quantity allowed is ${this.selectedService.MAX_QTY}`,
        'Limit Exceeded'
      );
    }
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  imagePreview: any = null;
  showModal: boolean = false;
  isUploading: boolean = false;
  progressPercent: number = 0;

  fileChangeEvent(event: any) {
    const file = event.target.files[0];
    const maxFileSize = 1 * 1024 * 1024; // 5MB limit
    // this.message.success('File size should not exceed 5MB.','');

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.message.error(
        'Please select a valid image file (JPG, JPEG, PNG).',
        ''
      );
      return;
    }

    if (file.size > maxFileSize) {
      this.message.error('File size should not exceed 1MB.', '');
      return;
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const dateStr = this.datePipe.transform(new Date(), 'yyyyMMdd');
    const filename = `${dateStr}${randomNum}.${fileExt}`;

    // Show preview
    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   this.imagePreview = e.target.result;
    // };
    // reader.readAsDataURL(file);

    this.selectedService.SERVICE_PHOTO_FILE = filename; // Store the generated filename
    this.uploadImage(file, filename);
  }

  uploadImage(file: File, filename: string) {
    this.isUploading = true;
    this.progressPercent = 0;

    this.apiservice.onUpload('CartItemPhoto', file, filename).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressPercent = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          if (event.body?.code === 200) {
            this.message.success('Image uploaded successfully.', '');
            // this.data.SERVICE_PHOTO_FILE = event.body.fileUrl; // Store uploaded image URL

            this.imagePreview =
              this.IMAGEuRL +
              'CartItemPhoto/' +
              this.selectedService.SERVICE_PHOTO_FILE;
            this.showModal = true;
          } else {
            this.message.error('Failed to upload image.', '');
            this.imagePreview = null;
            this.selectedService.SERVICE_PHOTO_FILE = null;
            this.showModal = false;
          }
        }
      },
      error: () => {
        this.isUploading = false;
        this.message.error('Failed to upload image.', '');
        this.imagePreview = null;
        this.selectedService.SERVICE_PHOTO_FILE = null;
        this.showModal = false;
      },
    });
  }

  removeImage() {
    this.selectedService.SERVICE_PHOTO_FILE = null;
    this.imagePreview = null;
    this.showModal = false;
  }

  openModal() {
    this.imagePreview =
      this.IMAGEuRL +
      'CartItemPhoto/' +
      this.selectedService.SERVICE_PHOTO_FILE;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  IconDeleteConfirm(data: any) { }
  viewImage(data: any) { }

  openAddressModal() {
    let modalElement: any = document.getElementById('addressModal');
    let modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);
    }
  }
  IS_EXPRESS: number = 0; // 0 = not selected, 1 = selected

  toggleExpressService() {
    this.IS_EXPRESS = this.IS_EXPRESS === 1 ? 0 : 1;
    // this.selectedService.IS_EXPRESS1 = this.IS_EXPRESS;
  }

  isLoading = false; // Add this property in your component

  toggleCart(selectedService: any) {
    if (!selectedService || !this.DefaultAddressArray) {
      this.message.error('Invalid service or address details.');
      return;
    }

    this.isLoading = true; // Start loading
    this.isInCart = !this.isInCart;

    if (this.isInCart) {
      const formatteddataadd = {
        SERVICE_ID: selectedService.ID,
        QUANTITY: this.quantity,
        INVENTORY_ID: 0,
        TYPE: 'S',
        SERVICE_CATALOGUE_ID: selectedService.PARENT_ID,
        BRAND_NAME: selectedService.BRAND_NAME,
        MODEL_NUMBER: selectedService.MODEL_NUMBER,
        SERVICE_PHOTO_FILE: selectedService.SERVICE_PHOTO_FILE,
        DESCRIPTION: selectedService.DESCRIPTION,
        IS_TEMP_CART: 0,
        CUSTOMER_ID: this.userID,
        ADDRESS_ID: this.DefaultAddressArray?.ID,
        TERITORY_ID: this.DefaultAddressArray?.TERRITORY_ID,
        STATE_ID: this.DefaultAddressArray?.STATE_ID,
      };

      this.apiservice.AddToCart(formatteddataadd).subscribe(
        (res) => {
          this.isLoading = false;
          this.apiservice.addItemToCart(formatteddataadd);

          if (res.code == 200) {
            this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
          }

          res.code === 200
            ? this.message.success('Item added to cart successfully.')
            : this.message.error('Failed to add item to cart.');
        },
        (error) => {
          this.isLoading = false;

          this.message.error('Error adding item to cart.');
        }
      );
    } else {
      this.apiservice.getCartDetails(this.userID).subscribe(
        (cartRes: any) => {
          if (cartRes?.code !== 200) {
            this.isLoading = false;
            this.message.error(
              'Cart is empty or failed to fetch cart details.'
            );
            return;
          }

          const cartItem = cartRes.data?.CART_DETAILS?.find(
            (item: any) =>
              Number(item.SERVICE_ID) === Number(selectedService.ID)
          );

          if (!cartItem) {
            this.isLoading = false;
            this.message.error('Item not found in cart.');
            return;
          }

          const formatteddataremove = {
            CUSTOMER_ID: this.userID,
            SERVICE_ID: selectedService.ID,
            CART_ID: cartItem.CART_ID,
            CART_ITEM_ID: cartItem.ID,
            TYPE: 'S',
          };

          this.apiservice.RemoveFromCart(formatteddataremove).subscribe(
            (res) => {
              this.isLoading = false;
              if (res.code == 200) {
                this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
              }
              res.code === 200
                ? this.message.success('Item removed from cart successfully.')
                : this.message.error('Failed to remove item from cart.');
            },
            (error) => {
              this.isLoading = false;

              this.message.error('Error removing item from cart.');
            }
          );
        },
        (error) => {
          this.isLoading = false;

          this.message.error('Error fetching cart details.');
        }
      );
    }
  }

  offcanvasInstance!: bootstrap.Offcanvas | null;
  updatedselectedService: any = [];
  TerritoryData: any = [];
  loadepage: boolean = false;
  cartId: any;
  openDrawer2(data: any) {
    this.updatedselectedService = [data];
    this.selectedSlot = '';
    if (!this.selectedService || !this.selectedService.ID) {
      return;
    }
    this.selectedService.IS_EXPRESS1 = this.selectedService.IS_EXPRESS;
    this.loadepage = true;
    this.apiservice
      .Getterritory(
        0,
        0,
        '',
        '',
        ' AND ID = ' + this.DefaultAddressArray['TERRITORY_ID']
      )
      .subscribe(
        (response) => {
          if (response?.code === 200) {
            this.TerritoryData = response.data;

            if (this.TerritoryData && this.TerritoryData.length > 0) {
              if (this.dates && this.dates.length > 0) {
                this.getCartSlots(this.TerritoryData);
              } else {
              }
            } else {
            }
          } else {
            this.TerritoryData = [];
          }
          this.loadepage = false;
        },
        (error) => {
          this.loadepage = false;
        }
      );

    const formatteddataadd = {
      SERVICE_ID: this.selectedService.ID,
      QUANTITY: this.quantity,
      INVENTORY_ID: 0,
      TYPE: 'S',
      SERVICE_CATALOGUE_ID: this.selectedService.PARENT_ID,
      BRAND_NAME: this.selectedService.BRAND_NAME,
      MODEL_NUMBER: this.selectedService.MODEL_NUMBER,
      SERVICE_PHOTO_FILE: this.selectedService.SERVICE_PHOTO_FILE,
      DESCRIPTION: this.selectedService.DESCRIPTION,
      IS_TEMP_CART: 1,
      CUSTOMER_ID: this.userID,
      ADDRESS_ID: this.DefaultAddressArray?.ID,
      TERITORY_ID: this.DefaultAddressArray?.TERRITORY_ID,
      STATE_ID: this.DefaultAddressArray?.STATE_ID,
    };

    this.apiservice.AddToCart(formatteddataadd).subscribe(
      (res) => {
        this.loadepage = false;
        if (res.code == 200) {
          this.cartService.fetchAndUpdateCartDetails(this.userID);
          this.message.success('Item added to cart successfully.');
          this.cartId = res.data.CART_ID;
          this.openDrawerUI(this.cartId);
        } else {
          this.message.error('Failed to add item to cart.');
        }
      },
      (error) => {
        this.loadepage = false;

        this.message.error('Error adding item to cart.');
      }
    );
  }

  decreaseHomeProgress() {
    if (this.homepageprogress > 0) {
      this.homepageprogress -= 50; // Decrease progress on back
    }
  }

  backaddress() {
    this.isInCart = false;
    this.decreaseHomeProgress();
  }
  getCartSlots(cartId: any) {
    if (!cartId || cartId.length === 0 || !cartId[0]?.ID) {
      return;
    }

    const cartID = cartId[0]['ID'];

    this.apiservice.CartslotGet(this.userID, cartID).subscribe(
      (response) => {
        if (response?.code === 200 && response.data?.length > 0) {
          const slot = response.data[0]; // First object from response

          this.timeSlots = [
            {
              period: 'Morning',
              times: {
                start: slot?.SLOT1_START_TIME?.slice(0, 5) || '09:00',
                end: slot?.SLOT1_END_TIME?.slice(0, 5) || '12:00',
                disabled: false,
              },
            },
            {
              period: 'Afternoon',
              times: {
                start: slot?.SLOT2_START_TIME?.slice(0, 5) || '12:00',
                end: slot?.SLOT2_END_TIME?.slice(0, 5) || '15:00',
                disabled: false,
              },
            },
            {
              period: 'Evening',
              times: {
                start: slot?.SLOT3_START_TIME?.slice(0, 5) || '15:00',
                end:
                  slot?.SLOT3_END_TIME === '23:00:00'
                    ? '23:59'
                    : slot?.SLOT3_END_TIME?.slice(0, 5) || '23:00',
                disabled: false,
              },
            },
          ];

          this.selectedDate = this.dates[0].fullDate;

          this.updateTimeSlots(this.selectedDate);
          this.updateProgress1();
        } else {
        }
      },
      (error) => { }
    );
  }

  /** Function to open the drawer */
  openDrawerUI(data: any) {
    const drawerElement = document.getElementById('addressSlotDrawer');
    if (drawerElement) {
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(drawerElement);
      this.cartId = data;
      offcanvas.show();
    } else {
    }
  }

  generateDates() {
    this.dates = []; // Clear previous dates to avoid duplicates
    const startDate = this.today; // Start from today
    const endDate = addDays(startDate, 30); // Go up to 30 days from today
    let currentDate = startDate;

    while (currentDate <= endDate) {
      this.dates.push({
        display: format(currentDate, 'EEE d'),
        fullDate: format(currentDate, 'EEE, MMM d, yyyy'), // Ensure format consistency
      });
      currentDate = addDays(currentDate, 1);
    }
  }
  MaxEndValue: any;
  remark: any;
  selectDate(date: string) {
    this.selectedSlot = ''; // Reset slot
    this.selectedDate = date;

    if (this.TerritoryData && this.TerritoryData.length > 0) {
      this.updateTimeSlots(date);
    } else {
      // Wait until TerritoryData is available
      const interval = setInterval(() => {
        if (this.TerritoryData && this.TerritoryData.length > 0) {
          clearInterval(interval);
          this.updateTimeSlots(date);
        }
      }, 100);
    }
  }

  updateTimeSlots(date: any) {
    const activeTerritory = this.TerritoryData?.find(
      (t: any) => t.IS_ACTIVE === 1
    );
    if (!activeTerritory) {
      return;
    }

    const selectedDateMoment = moment(date, 'ddd, MMM D, YYYY');

    if (!Array.isArray(this.updatedselectedService)) {
      this.updatedselectedService = [];
    }

    if (!this.timeSlots || this.timeSlots.length === 0) {
      return;
    }

    // ✅ Get calculated time range
    const { serviceStart, serviceEnd } =
      this.getServiceTimeRange(selectedDateMoment);

    if (!serviceStart || !serviceEnd || serviceStart.isAfter(serviceEnd)) {
      this.timeSlots = this.timeSlots.map((period) => ({
        ...period,
        times: { ...period.times, disabled: true },
      }));
      return;
    }

    this.timeSlots = this.timeSlots.map((period) => {
      const slotStart = moment(period.times.start, 'HH:mm');
      const slotEnd = moment(period.times.end, 'HH:mm');

      const isValid =
        (slotStart.isSameOrAfter(serviceStart) &&
          slotEnd.isSameOrBefore(serviceEnd)) ||
        serviceStart.isBetween(slotStart, slotEnd, null, '[)') ||
        serviceEnd.isBetween(slotStart, slotEnd, null, '(]');

      return {
        ...period,
        times: { ...period.times, disabled: !isValid },
      };
    });
  }

  getServiceTimeRange(selectedDate: moment.Moment) {
    const activeTerritory = this.TerritoryData?.find(
      (t: any) => t.IS_ACTIVE === 1
    );
    if (!activeTerritory) return { serviceStart: null, serviceEnd: null };

    // Prepare start times
    const startTimes = [
      ...this.updatedselectedService.map((service: any) =>
        moment(service.START_TIME || '00:00:01', 'HH:mm:ss')
      ),
      moment(activeTerritory.START_TIME, 'HH:mm:ss'),
    ].filter((time) => time.isValid());

    // Prepare end times
    const endTimes = [
      ...this.updatedselectedService.map((service: any) =>
        moment(service.END_TIME || '23:59:59', 'HH:mm:ss')
      ),
      moment(activeTerritory.END_TIME, 'HH:mm:ss'),
    ].filter((time) => time.isValid());

    if (selectedDate.isSame(moment(), 'day')) {
      const maxPrepMinutes = this.updatedselectedService.reduce(
        (maxTime: number, service: any) => {
          const hours =
            service.T_PREPARATION_HOURS != null
              ? parseInt(service.T_PREPARATION_HOURS, 10)
              : service.PREPARATION_HOURS != null
                ? parseInt(service.PREPARATION_HOURS, 10)
                : 0;

          const minutes =
            service.T_PREPARATION_MINUTES != null
              ? parseInt(service.T_PREPARATION_MINUTES, 10)
              : service.PREPARATION_MINUTES != null
                ? parseInt(service.PREPARATION_MINUTES, 10)
                : 0;

          const totalMinutes = hours * 60 + minutes;

          return Math.max(maxTime, totalMinutes);
        },
        0
      );

      if (maxPrepMinutes > 0) {
        startTimes.push(moment().add(maxPrepMinutes, 'minutes'));
      }
    }

    if (startTimes.length === 0 || endTimes.length === 0) {
      return { serviceStart: null, serviceEnd: null };
    }

    // Get max start and min end
    const serviceStart = moment.max(startTimes);
    const serviceEnd = moment.min(endTimes);

    this.MaxEndValue = serviceStart.format('hh:mm A'); // For bookNow()

    return { serviceStart, serviceEnd };
  }

  // Select slot as before
  selectSlot(times: any) {
    this.selectedSlot = `${this.formatTime(times.start)} - ${this.formatTime(
      times.end
    )}`;
  }

  isAllSlotsDisabled(): boolean {
    return this.timeSlots?.every((slot) => slot.times.disabled);
  }

  bookNow() {
    if (!this.selectedDate) {
      this.message.warning('Please select a date.');
      return;
    }
    if (!this.selectedSlot) {
      this.message.warning('Please select a time slot.');
      return;
    }

    this.isLoading = true;
    try {
      const [startTime, endTime] = this.selectedSlot.split(' - ');
      const formattedDate = this.datePipe.transform(
        this.selectedDate,
        'yyyy-MM-dd'
      );

      const formattedStartTime = moment(startTime, 'hh:mm A').format(
        'HH:mm:ss'
      );
      const formattedEndTime = moment(endTime, 'hh:mm A').format('HH:mm:ss');

      const today = moment().format('YYYY-MM-DD');
      const maxEndMoment = moment(
        `${today} ${this.MaxEndValue}`,
        'YYYY-MM-DD hh:mm A'
      );
      const slotStartMoment = moment(
        `${today} ${formattedStartTime}`,
        'YYYY-MM-DD HH:mm:ss'
      );
      const slotEndMoment = moment(
        `${today} ${formattedEndTime}`,
        'YYYY-MM-DD HH:mm:ss'
      );

      let expectedTime: string;

      if (maxEndMoment.isBefore(slotStartMoment)) {
        expectedTime = formattedStartTime;
      } else if (
        maxEndMoment.isBetween(slotStartMoment, slotEndMoment, undefined, '[]')
      ) {
        expectedTime = maxEndMoment.format('HH:mm:ss');
      } else {
        expectedTime = formattedEndTime;
      }

      // Round to next 10 min
      const roundedTime = moment(expectedTime, 'HH:mm:ss');
      const minutes = roundedTime.minutes();
      const remainder = minutes % 10;
      if (remainder !== 0) {
        roundedTime.add(10 - remainder, 'minutes').seconds(0);
      } else {
        roundedTime.seconds(0); // To ensure seconds are 0 even if already on 10-min mark
      }

      //

      expectedTime = roundedTime.format('HH:mm:ss');

      const expectedDateTime = `${formattedDate} ${expectedTime}`;

      const payload = {
        SCHEDULE_DATE: formattedDate,
        SCHEDULE_START_TIME: formattedStartTime,
        SCHEDULE_END_TIME: formattedEndTime,
        EXPECTED_DATE_TIME: expectedDateTime,
        IS_EXPRESS: this.IS_EXPRESS ? 1 : 0,
        REMARK: this.remark || '',
        CART_ID: this.cartId,
      };

      // API Call
      this.apiservice.BookOrder(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.code === 200) {
            this.message.success('Order scheduled successfully!');
            this.router.navigate(['/order-review', this.cartId]);
          } else {
            this.message.error('Failed to schedule order.');
          }
        },
        error: (err) => {
          this.isLoading = false;

          this.message.error('Error occurred while scheduling.');
        },
      });
    } catch (error) {
      this.isLoading = false;

      this.message.error('Something went wrong.');
    }
  }

  // Service code

  selectedDevice: any = null;
  isServiceDrawerOpen = false;
  isActionDrawerOpen = false;
  isDrawerOpen = false;
  servicesList: any[] = [];

  calculateEstimatedTime(service: any): string {
    if (!service.START_TIME || !service.END_TIME) return 'N/A';

    const startTime = new Date(`1970-01-01T${service.START_TIME}`);
    const endTime = new Date(`1970-01-01T${service.END_TIME}`);

    const diffMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours ? hours + ' hr ' : ''}${minutes} mins`;
  }
  quantityMap: { [key: number]: number } = {}; // प्रत्येक service साठी qty स्टोअर करणारं object
  CartDetails: any;

  // @ViewChild('guestModal') guestModal!: TemplateRef<any>;

  increaseQty1(service: any, maxQty: number, event: Event) {
    event.stopPropagation();

    if (this.userID === 0) {
      // Open modal if user is guest
      const modalElement = document.getElementById('guestModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      if (service.QUANTITY < maxQty) {
        this.detailsAndUpdateCart(service);
      } else {
        this.message.info(
          `Maximum quantity allowed is ${maxQty}`,
          'Limit Exceeded'
        );
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
      this.modalService.dismissAll();
    }
  }
  detailsAndUpdateCart(service: any) {
    this.cartspinner = true;
    let CartDetails: any = [];
    this.apiservice.getCartDetails(this.userID).subscribe((data: any) => {
      if (data['code'] === 200) {
        CartDetails = data?.data?.CART_DETAILS || [];

        if (CartDetails.length === 0) {
          this.addToCart(service);
        } else {
          const existingItem = CartDetails.find(
            (item: any) => item.SERVICE_ID === service.ID
          );

          if (existingItem) {
            this.increaseQuantity(existingItem, service);
          } else {
            this.addToCart(service);
          }
        }
      } else {
        CartDetails = [];
        this.addToCart(service);
      }
    });
  }

  addToCart(service: any) {
    const formatteddataadd = {
      SERVICE_ID: service.ID,
      QUANTITY: service.QUANTITY + 1,
      // INVENTORY_ID: 0,
      TYPE: 'S',
      SERVICE_CATALOGUE_ID: service.PARENT_ID,
      BRAND_NAME: service.BRAND_NAME,
      MODEL_NUMBER: service.MODEL_NUMBER,
      SERVICE_PHOTO_FILE: service.SERVICE_PHOTO_FILE,
      DESCRIPTION: service.DESCRIPTION,
      IS_TEMP_CART: 0,
      CUSTOMER_ID: this.userID,
      ADDRESS_ID: this.DefaultAddressArray?.ID,
      TERITORY_ID: this.DefaultAddressArray?.TERRITORY_ID,
      STATE_ID: this.DefaultAddressArray?.STATE_ID,
    };
    service.QUANTITY = formatteddataadd.QUANTITY;

    this.apiservice.AddToCart(formatteddataadd).subscribe(
      (res) => {
        this.isLoading = false;
        this.cartspinner = false;

        if (res.code == 200) {
          this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
        }
        res.code === 200
          ? this.message.success('Item added to cart successfully.')
          : this.message.error('Failed to add item to cart.');
      },
      (error) => {
        this.isLoading = false;
        this.cartspinner = false;

        this.message.error('Error adding item to cart.');
      }
    );
  }

  increaseQuantity(data: any, service: any) {
    const payload = {
      TYPE: 'S',
      customer_id: this.userID,
      CART_id: data.CART_ID,
      CART_ITEM_ID: data.ID,
      QUANTITY: data.QUANTITY + 1,
      SERVICE_ID: data.SERVICE_ID,
    };

    service.QUANTITY = payload.QUANTITY;

    this.apiservice
      .CartCountUpdateService(
        payload.TYPE,
        payload.customer_id,
        payload.CART_id,
        payload.CART_ITEM_ID,
        payload.QUANTITY,
        payload.SERVICE_ID
      )
      .subscribe((response) => {
        if (response['code'] === 200) {
          this.cartspinner = false;

          data.QUANTITY++;
          this.apiservice.addItemToCart(service);
          setTimeout(() => { }, 0); // UI Update workaround
          this.message.success('Add Quantity Updated successfully.', '');
        } else {
          this.cartspinner = false;
        }
      });
  }

  decreaseQty1(service: any, event: Event) {
    event.stopPropagation();

    if (this.userID === 0) {
      // Open modal if user is guest
      const modalElement = document.getElementById('guestModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      if (service.QUANTITY === 0) {
        this.message.error('Please add quantity first.', '');
        // You can replace console.error with an alert or a toast notification
        return;
      }

      if (service.QUANTITY > 1) {
        this.cartspinner = true;

        this.decreaseQuantity(service);
      } else {
        this.cartspinner = true;

        this.removeItemFromCart(service);
      }
    }
  }
  decreaseQuantity(service: any) {
    this.apiservice.getCartDetails(this.userID).subscribe((data: any) => {
      if (data['code'] === 200) {
        const CartDetails = data?.data?.CART_DETAILS || [];

        this.cartspinner = false;

        const existingItem = CartDetails.find(
          (item: any) => item.SERVICE_ID === service.ID
        );

        if (existingItem) {
          if (existingItem.QUANTITY > 1) {
            const payload = {
              TYPE: 'S',
              customer_id: this.userID,
              CART_id: existingItem.CART_ID,
              CART_ITEM_ID: existingItem.ID,
              QUANTITY: existingItem.QUANTITY - 1,
              SERVICE_ID: existingItem.SERVICE_ID,
            };

            service.QUANTITY = payload.QUANTITY;

            this.apiservice
              .CartCountUpdateService(
                payload.TYPE,
                payload.customer_id,
                payload.CART_id,
                payload.CART_ITEM_ID,
                payload.QUANTITY,
                payload.SERVICE_ID
              )
              .subscribe((response) => {
                if (response['code'] === 200) {
                  this.message.success('Quantity decreased successfully.', '');
                } else {
                }
              });
          } else {
            this.removeItemFromCart(existingItem);
          }
        }
      }
    });
  }

  removeItemFromCart(service: any) {
    this.apiservice.getCartDetails(this.userID).subscribe((data: any) => {
      if (data['code'] === 200) {
        const CartDetails = data?.data?.CART_DETAILS || [];
        const existingItem = CartDetails.find(
          (item: any) => item.SERVICE_ID === service.ID
        );

        //

        if (existingItem) {
          const payload = {
            SERVICE_ID: existingItem.SERVICE_ID,
            CART_ID: existingItem.CART_ID,
            CART_ITEM_ID: existingItem.ID,
            CUSTOMER_ID: this.userID,
            TYPE: 'S',
          };

          this.apiservice.RemoveFromCart(payload).subscribe((response) => {
            if (response['code'] === 200) {
              this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
              this.cartspinner = false;

              service.QUANTITY = 0;

              // this.CartDetails = this.CartDetails.filter((item: any) => item.ID !== existingItem.ID);
              this.message.success('Item removed from cart.', '');
            } else {
              this.cartspinner = false;

              this.message.error('Failed to remove item.');
            }
          });
        }
      }
    });
  }

  progress: any = 0; // Initial progress

  openServiceDrawer(service: any) {
    this.progress = 0;
    this.loadCategories = true;
    // if(service)
    // {
    this.selectedService = service;
    this.loadCategories = false;
    // }
    // this.isServiceDrawerOpen = true;
    // this.renderer.addClass(document.body, 'offcanvas-backdrop-custom'); // Add backdrop

    this.updateProgress(); // Update progress

    const offcanvas = new bootstrap.Offcanvas(
      document.getElementById('isServiceDrawerOpen')!
    );

    offcanvas.show();
    this.isActionDrawerOpen = false;
    this.isDrawerOpen = false;
  }

  updateProgress() {
    this.progress += 25; // Adjust increment as needed
    if (this.progress > 100) {
      this.progress = 100;
    }
  }

  openActionDrawer(device: any) {
    // event.stopPropagation();

    this.selectedDevice = device;

    if (device.children && device.children.length > 0) {
      this.isActionDrawerOpen = true;
      this.isDrawerOpen = false;
      this.isServiceDrawerOpen = false;
    } else {
      this.fetchServices(device); // Fetch service details dynamically
    }
  }

  openActionDrawercomplete(action: any) {
    if (action) {
      this.selectedDevice = action;

      this.isActionDrawerOpen = true;
      this.isDrawerOpen = false;
      this.isServiceDrawerOpen = false;
      this.fetchServices(action); // Fetch service details dynamically
    }
  }

  selectedServiceReviews: any[] = [];

  loadingReviews: boolean = false; // Loader flag

  openReviews(service: any, event: Event) {
    event.stopPropagation();

    this.loadingReviews = true;

    this.apiservice
      .getCustomerServiceFeedback(
        0,
        0,
        '',
        '',
        ' AND SERVICE_ID =' + service.ID
      )
      .subscribe(
        (response) => {
          this.loadingReviews = false;

          if (response?.code === 200 && response.data?.length > 0) {
            this.selectedServiceReviews = response.data.map((review: any) => ({
              ...review,
              RATING: Number(review.RATING), // Convert rating to number
            }));
          } else {
            this.selectedServiceReviews = [];
          }
        },
        (error) => {
          this.loadingReviews = false;
        }
      );

    // const modalElement = document.getElementById('reviewsModal');
    // if (modalElement) {
    //   const modal = new bootstrap.Modal(modalElement);
    //   modal.show();
    // }
    setTimeout(() => {
      const modalElement = document.getElementById('reviewsModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100); // slight delay to ensure modal is rendered
  }
  loading: boolean = false;

  fetchServices(id: any) {
    this.loading = true;
    const categoryId = id['key'] ? id['key'] : id.SUB_CATEGORY_ID;
    const parentId = id.IS_PARENT == 1 ? id.ID : 0;

    this.apiservice
      .getCategories(
        this.customertype,
        parentId,
        '',
        categoryId,
        this.userID,
        this.DefaultAddressArray?.TERRITORY_ID, 'ID', 'asc'
      )
      .subscribe(
        (categoriesResponse) => {
          this.loading = false;

          if (
            categoriesResponse?.code === 200 &&
            categoriesResponse.data?.length > 0
          ) {
            this.updateProgress(); // Update progress

            this.servicesList = categoriesResponse.data;
            if (this.userID !== 0) {
              this.apiservice.getCartDetails(this.userID).subscribe(
                (cartResponse) => {
                  // Always iterate over servicesList, regardless of CART_DETAILS length
                  this.servicesList.forEach((service: any) => {
                    const cartItem = cartResponse?.data?.CART_DETAILS?.find(
                      (item: any) => item.SERVICE_ID === service.ID
                    );

                    service.QUANTITY =
                      cartItem?.QUANTITY ||
                      (service.QUANTITY > 0 ? service.QUANTITY : 0);
                  });

                  // Open drawer after short delay
                  setTimeout(() => {
                    this.isDrawerOpen = true;
                  }, 100);
                },
                (cartError) => {
                  // Even on error, set default QUANTITY to 1
                  this.servicesList.forEach((service: any) => {
                    service.QUANTITY =
                      service.QUANTITY > 0 ? service.QUANTITY : 1;
                  });

                  setTimeout(() => {
                    this.isDrawerOpen = true;
                  }, 100);
                }
              );
            } else {
              // If userID is zero, set default QUANTITY and open drawer
              this.servicesList.forEach((service: any) => {
                service.QUANTITY = service.QUANTITY > 0 ? service.QUANTITY : 1;
              });

              setTimeout(() => {
                this.isDrawerOpen = true; // Open drawer when userID is zero
              }, 100);
            }
          } else {
            this.servicesList = [];
            this.message.info(
              'There is no service available for this service type....',
              ''
            );
          }
        },
        (categoriesError) => {
          this.loading = false; // Hide loader on error
        }
      );
  }

  // openDrawer() {
  //
  //   this.isDrawerOpen = true; // जर तुम्ही *ngIf वापरत असाल तर
  // }

  // closeDrawer() {
  //   this.isServiceDrawerOpen = false;
  //   this.isActionDrawerOpen = false;
  //   this.selectedService = null;
  //   this.selectedDevice = null;
  // }

  closeDrawer() {
    this.isServiceDrawerOpen = false;
    this.isActionDrawerOpen = false;
    this.isDrawerOpen = false;
    this.loading = false;
  }

  onBackClick() {
    this.isDrawerOpen = false; // Close the drawer
    this.decreaseProgress(); // Decrease progress
  }

  isDrawerVisible: boolean = false;
  drawerData: any = [];
  originalBackdropOpacity: string = '';
  // isDrawerVisible: boolean = false;
  // drawerData: any = [];

  cartquantity: any;
  openNextDrawer(data: any) {
    this.drawerData = data;

    setTimeout(() => {
      const serviceDrawer = document.getElementById('offcanvasRight11');
      if (serviceDrawer) {
        let offcanvasInstance = bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (!offcanvasInstance) {
          offcanvasInstance = new bootstrap.Offcanvas(serviceDrawer);
        }
        this.updateProgress(); // Update progress

        offcanvasInstance.show();
      }
      this.cartquantity =
        this.drawerData.QUANTITY == 0 ? 1 : this.drawerData.QUANTITY;

      this.drawerData.DESCRIPTION = '';
      this.showModal = false;
      this.imagePreview = null;
      this.drawerData.SERVICE_PHOTO_FILE = '';

      this.isDrawerVisible = true;

      // this.drawerData.QUANTITY =
      //   this.drawerData.QUANTITY == 0 ? 1 : this.drawerData.QUANTITY;
      // this.drawerData.SELECTED_QTY

      document.body.style.overflow = '';

      //
    }, 200);
  }

  drawerClose() {
    this.isDrawerVisible = false;
    setTimeout(() => {
      const serviceDrawer = document.getElementById('offcanvasRight11');
      if (serviceDrawer) {
        const offcanvasInstance =
          bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
        this.decreaseProgress();
      }
    }, 300);

    //

    // this.drawerData.QUANTITY = this.drawerData.QUANTITY
    //   ? 0
    //   : this.drawerData.QUANTITY;
  }

  decreaseProgress() {
    if (this.progress > 0) {
      this.progress -= 25; // Decrease progress on back
    }
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  USERID = this.apiservice.getUserId();
  selectedServiceDescription: any = '';

  serviceData: any;
  openDescriptionModal(service: any) {
    this.serviceData = service;

    this.selectedServiceDescription = service.DESCRIPTION ? this.sanitizer.bypassSecurityTrustHtml(service.DESCRIPTION) : 'No description available.';

    const modal = new bootstrap.Modal(
      document.getElementById('descriptionModal')!
    );
    modal.show();
  }

  InventoryId(product: any) {
    const ID = product.ID;
    const UNIT_ID = product.UNIT_ID;
    const QUANTITY_PER_UNIT = product.QUANTITY_PER_UNIT;

    sessionStorage.setItem('InventoryID', ID.toString()); // Store ID correctly
    sessionStorage.setItem('UNIT_ID', UNIT_ID.toString()); // Store ID correctly
    sessionStorage.setItem('QUANTITY_PER_UNIT', QUANTITY_PER_UNIT.toString()); // Store ID correctly
    // this.inventoryId = ID;
    //
  }

  // Open Brands

  openBrandsDrawer(data: any) {
    const brandData = { ID: data.ID, BRAND_NAME: data.BRAND_NAME }; // Extract only required properties
    this.router.navigate(['/shop/home'], {
      queryParams: { data: JSON.stringify(brandData) },
    });
  }
  openRegister: boolean = false;
  whichOTP = '';


  @ViewChild('register') register!: TemplateRef<any>;
  isloginSendOTP: boolean = false;
  issignUpLoading: boolean = false;
  registrationSubmitted = false;
  statusCode = '';
  modalVisible: boolean = false;
  openVerify: boolean = false;
  mobileNumberorEmail: string = '';
  mobileNumberlogin: any;
  otp = ['', '', '', ''];
  isOk = true;
  selectedState: any = '';
  showStateDropdown: boolean = false;
  USER_ID: any;
  USER_NAME: any;
  selectedCountryCode: string = '+91';
  showRegisterModal() {
    this.registrationSubmitted = false;
    this.isloginSendOTP = false;
    this.issignUpLoading = false;
    this.selectedCountryCode = '+91';
    this.statusCode = '';
    this.modalVisible = false;
    this.openRegister = true;
  }
  loadData() {
    this.loaderService.showLoader();
  }
  dataLoaded = false;
  stopLoader() {
    this.dataLoaded = true;
    this.loaderService.hideLoader();
  }
  selectPincode(pincode: any) {
    this.isPincodeLoading = true;

    this.selectedPincode = pincode.PINCODE_NUMBER;
    this.addressForm.PINCODE = pincode.PINCODE;
    this.addressForm.PINCODE_ID = pincode.ID;
    this.addressForm.PINCODE_FOR = pincode.PINCODE_FOR;



    this.showPincodeDropdown = false;

    this.getTerritory();
    setTimeout(() => {
      this.addressForm.PINCODE = pincode.PINCODE;
      this.isPincodeLoading = false;
 
    }, 500);
  }
  terrotaryData: any = [];
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
          // this.addressForm.TERRITORY_ID = this.terrotaryData[0].TERRITORY_ID;
          const territory = this.terrotaryData[0];
          this.addressForm.TERRITORY_ID = territory.TERRITORY_ID ? territory.TERRITORY_ID : 0;

          // this.getStateData();

          this.pincodeloading = false; // Hide loading state
        },
        error: (error: any) => {

          this.terrotaryData = []; // Clear data on error
          this.pincodeloading = false; // Hide loading state
        },
      });
  }


  showConfirmPasswordError: boolean = false;
  asGuest: boolean = false
  showAddressDetailsForm = false;
  onshowMap() {
    this.showAddressDetailsForm = false;
    this.closeregister();
    setTimeout(() => this.initializeMapWithLocation(), 100);
    this.openVerify = false;
    this.modalVisible = true;
    this.showMap = true;
    // modalVisible
    this.showAddressDetailsForm = false;
    this.asGuest = true;
    // localStorage.setItem('isLogged', 'true');
    // window.location.href='/service'
  }
  closeregister() {
    this.modalService.dismissAll();
    this.mobileNumberorEmail = '';
    this.mobileNumberlogin = '';
    this.otp = ['', '', '', '', '', ''];
    this.data = new registerdata();
    this.showAddressDetailsForm = false;
  }

  //  address: any = {
  // houseNo: '',
  // landmark: '',
  // city: '',
  // pincode: '',
  // state: '',
  // };
  // map2: any;
  // longitude: any;
  // latitude: any;

  // locationCode: string = '';
  // locationAddress: string = '';
  // pincodeData: any = [];
  // pincodeloading: boolean = false;
  // selectedLocation: any;
  // currentMarker: any;

  // ngAfterViewInit() {
  //   this.initializeMapWithLocation();
  // }

  // 1. Initialize Map with Current Location or Default Location

  initializeMapWithLocation() {



    // const customerType = localStorage.getItem('customerType');
    // if (customerType === 'I' || localStorage.getItem('skipLocationCheck') === 'true') {
    //   // Skip map init for home users
    //   return;
    // }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.loadMap(this.latitude, this.longitude);
        },
        () => {
          this.loadMap(28.6139, 77.209); // Default to Delhi if denied
        }
      );

    } else {
      this.loadMap(28.6139, 77.209); // Default to Delhi if geolocation not supported
    }
  }

  // 2. Load Map and Place Marker
  loadMap(lat: number, lng: number) {

    const mapElement = document.getElementById('map');

    if (!mapElement) {
      return;
    }

    // Destroy previous map instance if it exists to avoid memory leaks
    if (this.map2) {
      google.maps.event.clearInstanceListeners(this.map2);
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
      }
    }

    this.map2 = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    this.currentMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map2,
      draggable: true,
    });

    const geocoder = new google.maps.Geocoder();
    this.fetchAddressFromCoords(lat, lng, geocoder);

    google.maps.event.addListener(
      this.currentMarker,
      'dragend',
      (event: any) => {
        this.latitude = event.latLng.lat();
        this.longitude = event.latLng.lng();
        this.fetchAddressFromCoords(this.latitude, this.longitude, geocoder);
      }
    );

    // 🟢 Point select: Add click event on map
    google.maps.event.addListener(this.map2, 'click', (event: any) => {
      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();

      // Move marker to clicked location
      this.currentMarker.setPosition({ lat: clickedLat, lng: clickedLng });

      // Update stored coordinates
      this.latitude = clickedLat;
      this.longitude = clickedLng;

      // Fetch address of clicked location
      this.fetchAddressFromCoords(clickedLat, clickedLng, geocoder);
    });

    this.setupSearchBox(geocoder);
  }
  setupSearchBox(geocoder: any) {
    setTimeout(() => {
      // Create a container div for positioning
      const searchBoxContainer = document.createElement('div');
      searchBoxContainer.style.cssText = `
            position: absolute;
            top: 10px !important;
            left: 10%;
            z-index: 5;
        `;

      // Create search box input dynamically
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.id = 'searchBox';
      searchInput.placeholder = 'Search location...';
      searchInput.style.cssText = `
            width: 250px;
            padding: 10px;
            font-size: 14px;
            border-radius: 5px;
            border: 1px solid #ccc;
            background-color: white;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
        `;

      // Append input to the container
      searchBoxContainer.appendChild(searchInput);

      // Add container as a custom control on the map
      this.map2.controls[google.maps.ControlPosition.LEFT].push(
        searchBoxContainer
      );

      // Initialize Google Places SearchBox
      const searchBox = new google.maps.places.SearchBox(searchInput);

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;

        const place = places[0];
        if (!place.geometry) return;

        const location = place.geometry.location;
        this.latitude = location.lat();
        this.longitude = location.lng();

        // Center map and move marker
        this.map2.setCenter(location);
        this.currentMarker.setPosition(location);

        // Fetch address for selected location
        this.fetchAddressFromCoords(this.latitude, this.longitude, geocoder);
      });
    }, 500);
  }
  fetchAddressFromCoords(lat: number, lng: number, geocoder: any) {


    const latLng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;

        // Filter out unwanted address components
        const filteredAddress = addressComponents
          .filter(
            (comp: any) =>
              comp.types.includes('route') || // Street name
              comp.types.includes('sublocality_level_1') || // Area/Locality
              comp.types.includes('sublocality') ||
              comp.types.includes('neighborhood') // Neighborhood
          )
          .map((comp: any) => comp.long_name)
          .join(', ');

        this.locationAddress = filteredAddress || '';
        this.addressForm.ADDRESS_LINE_2 = this.locationAddress;

        const postalCode =
          addressComponents.find((comp: any) =>
            comp.types.includes('postal_code')
          )?.long_name || '416310'; // Fallback Pincode if not found

        if (results[0].plus_code && results[0].plus_code.global_code) {
          this.locationCode = results[0].plus_code.global_code.split(' ').pop();
        }
      } else {

      }
    });
  }

  getAddressComponent(components: any[], type: string): string {
    const component = components.find((comp) => comp.types.includes(type));
    return component ? component.long_name : '';
  }

  getpincode(pincodeeeee: any) {
    let pincode: string = this.addressForm.PINCODE || ''; // Use existing PINCODE if available

    if (pincode || pincodeeeee) {
      // If PINCODE is already available, use it directly
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
      // Get current location's PINCODE if not available
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

            this.fetchPincodeData(pincode); // Fetch data with detected pincode
          } catch (error: any) {

            this.pincodeData = []; // Clear data on error
            this.pincodeloading = false; // Hide loading state
          }
        },
        (error) => {

          this.pincodeData = []; // Clear data on error
          this.pincodeloading = false; // Hide loading state
        }
      );
    }
  }

  // Common method to fetch pincode data
  fetchPincodeData(pincode: string) {
    this.isLoading = true;
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
            // this.searchPincode = pincode;
            // if (!this.addressForm.PINCODE_ID) {
            //   this.addressForm.PINCODE_ID = this.pincodeData[0].ID;
            // }
            this.addressForm.PINCODE = '';
            this.addressForm.COUNTRY_ID = this.pincodeData[0].COUNTRY_ID;
            this.addressForm.STATE_ID = this.pincodeData[0].STATE;
            this.addressForm.DISTRICT_ID = this.pincodeData[0].DISTRICT;
            this.addressForm.DISTRICT_NAME = this.pincodeData[0].DISTRICT_NAME;
            // this.addressForm.TERRITORY_ID = this.pincodeData[0].TERRITORY_ID;
            if (
              this.addressForm.PINCODE !== '' &&
              this.addressForm.PINCODE !== undefined &&
              this.addressForm.PINCODE !== null
            ) {
              // this.selectPincode(this.addressForm.PINCODE)
              this.getTerritory();
            } else {
            }
            // alert(this.addressForm.TERRITORY_ID)
            this.getStateData();

            this.pincodeloading = false; // Hide loading state
            this.isLoading = false;
          },
          error: (error: any) => {

            this.pincodeData = []; // Clear data on error
            this.pincodeloading = false; // Hide loading state
            this.isLoading = false;
          },
        });
    }
  }

  stateData: any = [];
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

          this.pincodeloading = false; // Hide loading state
        },
        error: (error: any) => {

          this.stateData = []; // Clear data on error
          this.pincodeloading = false; // Hide loading state
        },
      });
  }
  selectState(state: any) {
    this.selectedState = state.NAME;
    this.addressForm.STATE_ID = state.ID;

    this.showStateDropdown = false;
  }
  // showAddressDetailsForm = false;
  user: User | null = null;

  confirmLocation(): void {
    const customerType = localStorage.getItem('customerType');

    // if (customerType == 'I') {
    //
    //   this.showMap = false;
    //   this.showAddressDetailsForm = false;
    //   window.location.href = '/service';
    //   return;
    // }
    // Define a default static location (e.g., New Delhi)
    const defaultLatitude = 28.6139; // Example: New Delhi latitude
    const defaultLongitude = 77.209; // Example: New Delhi longitude
    this.addressForm.PINCODE = '';
    if (this.currentMarker) {
      const position = this.currentMarker.getPosition();
      if (position) {
        this.latitude = position.lat();
        this.longitude = position.lng();
      } else {
        // Fallback to default location if marker position is not available
        this.latitude = defaultLatitude;
        this.longitude = defaultLongitude;
      }
    } else {
      // If no marker is present, set to default location directly
      this.latitude = defaultLatitude;
      this.longitude = defaultLongitude;
    }
    const registerData = this.data;
    // Fetch address based on coordinates

    this.getAddress(this.latitude, this.longitude);

    // Hide the map
    this.modalVisible = false;
    this.closeregister();

    // Show the address form and initialize with location data
    this.showAddressDetailsForm = true;
    this.addressForm.GEO_LOCATION = `${this.latitude},${this.longitude}`;
    this.data = registerData;

    // Pre-fill user data if available
    if (this.user && this.user.ID) {
      this.addressForm.CUSTOMER_ID = this.user.ID;
      if (this.user.EMAIL_ID) {
        this.addressForm.EMAIL_ID = this.user.EMAIL_ID;
      }
    }
  }

  getAddress(latitude: number, longitude: number): void {
    const geocoder = new google.maps.Geocoder();
    this.isPincodeLoading = true;
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const addressComponents = results[0].address_components;

          // Extract relevant address details
          // this.addressForm.ADDRESS_LINE_1 = results[0].formatted_address;

          const city = addressComponents.find((comp: any) =>
            comp.types.includes('locality')
          );
          const state = addressComponents.find((comp: any) =>
            comp.types.includes('administrative_area_level_1')
          );
          const country = addressComponents.find((comp: any) =>
            comp.types.includes('country')
          );
          // const postalCode = addressComponents.find((comp: any) =>
          //   comp.types.includes('postal_code')
          // );

          const postalCode = addressComponents.find((comp: any) =>
            comp.types.includes('postal_code')
          )?.long_name; // Fallback Pincode if not found
          this.selectedPincode = '';
          this.addressForm.PINCODE = '';

          this.addressForm.PINCODE_ID = '';
          this.addressForm.CITY_NAME = city ? city.long_name : '';
          this.selectedState = state ? state.long_name : '';
          // this.addressForm.COUNTRY_ID = country ? country.long_name : '';
          // this.addressForm.PINCODE = postalCode ? postalCode.long_name : '';
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

  // Mock data for dropdowns - replace with actual API calls
  countries: LocationOption[] = [{ id: 1, name: 'India' }];

  states: LocationOption[] = [{ id: 1, name: 'Maharashtra' }];

  cities: LocationOption[] = [
    { id: 1, name: 'Mumbai' },
    { id: 2, name: 'Pune' },
  ];

  districts: LocationOption[] = [
    { id: 1, name: 'Mumbai City' },
    { id: 2, name: 'Mumbai Suburban' },
  ];
  isConfirmLoading = false;
  addressSubmitted: boolean = false;
  isAddrssSaving: boolean = false;

  saveAddress(form: NgForm): void {

    this.addressSubmitted = true;
    if (form.invalid) {
      return;
    }
    if (this.latitude && this.longitude) {
      this.addressForm.GEO_LOCATION = `${this.latitude},${this.longitude}`;
    }

    // Add validation here

    this.isAddrssSaving = true;
    // this.data.STATUS = 1;
    this.addressForm.CUSTOMER_TYPE = 1;
    this.addressForm.CUSTOMER_ID = this.USER_ID;
    this.addressForm.CONTACT_PERSON_NAME = this.data.CUSTOMER_NAME;
    this.addressForm.MOBILE_NO = this.data.CUSTOMER_MOBILE_NO;
    this.addressForm.EMAIL_ID = this.data.EMAIL_ID;
    this.addressForm.ADDRESS_LINE_1 = this.addressForm.ADDRESS_LINE_1;
    // this.addressForm.CONTACT_PERSON_NAME =  this.use

    this.data.CUSTOMER_TYPE = 1;
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
            this.isloginSendOTP = false;
            this.modalService1.closeModal();
            // this.otpSent = true;
            // this.showOtpModal = true;
            this.USER_ID = successCode.USER_ID;
            this.USER_NAME = successCode.USER_NAME;
            this.showAddressDetailsForm = false;
            this.statusCode = '';
            this.data = registerData;

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
                    // Handle server-side error
                    this.message.error(
                      'An unexpected error occurred. Please try again later.',
                      ''
                    );
                  } else {
                    this.isConfirmLoading = false;
                    // Generic error handling
                    this.message.error(
                      'An unknown error occurred. Please try again later.',
                      ''
                    );
                  }
                }
              );
            }
            window.location.href = '/service';
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
          // Handle error if login fails
          if (error.status === 300) {
            this.isAddrssSaving = false;
            // Handle specific HTTP error (e.g., invalid credentials)
            this.message.error('Email-ID is already exists', '');
          } else if (error.status === 500) {
            // Handle server-side error
            this.message.error(
              'An unexpected error occurred. Please try again later.',
              ''
            );
          } else {
            this.isAddrssSaving = false;
            // Generic error handling
            this.message.error(
              'An unknown error occurred. Please try again later.',
              ''
            );
          }
        }
      );
    } else {
      const addressFormString = JSON.stringify(this.addressForm); // Convert object to string
      const encryptedAddress =
        this.commonFunction.encryptdata(addressFormString); // Encrypt string
      sessionStorage.setItem('userAddress', encryptedAddress);
      localStorage.setItem('userAddress', encryptedAddress);
      // sessionStorage.setItem('userAddress', this.commonFunction.encryptdata(this.addressForm));
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
      window.location.href = '/service';
    }

    // Call your API to save the address
    // Reset form and hide after successful save
  }



  cancelAddressForm(): void {
    this.showAddressDetailsForm = false;
    // Reset form data
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
  modalVisible1: boolean = false;



  // handleNextClick(service: any, event: Event) {
  //   event.stopPropagation();

  //   if (this.userID !== 0) {
  //     // Logged-in user → directly open map modal
  //     this.openMapModal();
  //   } else {
  //     // Guest → open login modal first, then after login show map modal
  //     this.openLoginModal();
  //   }
  // }

  closeMap() {
    this.modalService1.closeModal();
  }

  gettruecondition() {
    if (sessionStorage.getItem('closemodalfalse') == 'false') {
      return false;
    } else {
      return true;
    }
  }
  filteredStates: any[] = [];
  searchState: string = '';
  toggleStatesDropdown() {
    this.showStateDropdown = !this.showStateDropdown;
    if (this.showStateDropdown) {
      this.filteredStates = this.stateData;
    }
  }
  filterStates(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredStates = this.stateData.filter(
      (item: any) =>
        item.NAME.toLowerCase().includes(query) ||
        item.NAME.toLowerCase().includes(query)
    );
  }

  //for navigation after address save
  redirectAfterAddressSave() {
    const currentUrl = this.router.url;
    sessionStorage.setItem('addressJustSaved', 'true');
      window.location.reload();
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigateByUrl(currentUrl);
    // });
  }


}
