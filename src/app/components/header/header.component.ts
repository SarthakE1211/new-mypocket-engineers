import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ModalService } from 'src/app/Service/modal.service';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import * as bootstrap from 'bootstrap';
import { LoaderService } from 'src/app/Service/loader.service';
import { CartService } from 'src/app/Service/cart.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AddressUpdateServiceService } from 'src/app/Service/address-update.service.service';
import { AddressForm } from 'src/app/models/address.model';
import { OrdersOverlayService } from 'src/app/Service/orders-overlay.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
class User {
  ID?: number;
  MOBILE_NO?: string;
  PROFILE_PHOTO?: string = '';
  EMAIL?: string;
  NAME?: string;
}
class Ticketgroup {
  ID?: number;
  CLIENT_ID?: number;
  PARENT_ID?: number;
  TYPE?: string;
  VALUE?: string;
  URL?: string;
  SEQ_NO: number = 0;
  IS_LAST: any = false;
  ALERT_MSG?: string;
  STATUS?: boolean;
  PRIORITY: string = 'M';
  DEPARTMENT_ID?: number;
}
declare var google: any;
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          transform: 'translateX(0%)',
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          transform: 'translateX(-100%)',
          opacity: 0,
          display: 'none',
        })
      ),
      transition('closed => open', [
        animate(
          '0.5s ease-out',
          keyframes([
            style({ transform: 'translateX(-100%)', opacity: 0, offset: 0 }),
            style({ transform: 'translateX(-50%)', opacity: 0.5, offset: 0.5 }),
            style({ transform: 'translateX(0%)', opacity: 1, offset: 1.0 }),
          ])
        ),
      ]),
      transition('open => closed', [
        animate(
          '0.5s ease-in',
          keyframes([
            style({ transform: 'translateX(0%)', opacity: 1, offset: 0 }),
            style({ transform: 'translateX(-50%)', opacity: 0.5, offset: 0.5 }),
            style({ transform: 'translateX(-100%)', opacity: 0, offset: 1.0 }),
          ])
        ),
      ]),
    ]),
    trigger('slideAnimation', [
      state('visible', style({
        opacity: 1
      })),
      state('hidden', style({
        opacity: 0
      })),
      transition('visible => hidden', [
        animate('250ms ease-out')
      ]),
      transition('hidden => visible', [
        animate('250ms ease-in')
      ])
    ])
  ],
})
export class HeaderComponent {
  trackById = (_: number, item: any): any =>
    item?.ID ?? item?.id ?? item?.ORDER_ID ?? _;
  showsearchtruee: boolean = false;
  isProfileMenuOpen = false;
  subscribedChannels: any = this.apiservice.getsubscribedChannels();
  userID: any = this.apiservice.getUserId();
  userNAME: any = this.apiservice.getUserName();
  userAddress: any = this.apiservice.getUserAddress();
  userMobile: any = this.apiservice.getUsermobileNumber();
  userEMAIL: any = this.apiservice.getEmail();
  isLoading: boolean = false;
  loadService: boolean = false;
  cartCount = 0;
  isActive: boolean = false;
  disableService: any;
  disableShop: any;
  BusinessName: any;
  customerType: any;
  customertype1: any = this.apiservice.getCustomerType();
  isServiceDisabled: boolean = false;
  isShopDisabled: boolean = false;
  pincodeforrkey: any = 'B';
  TERRITORY_IDssss: any = [];
  addressline2: any = '';
  addressline1: any = '';
  mainaddress: any = '';
  addressCity: any = '';
  locationName: string = '';
  currentLang = 'en';
  walletBalance: number = 0;
  totalUsed: number = 0;
  expiredAmount: number = 0;
  availableBalance: number = 0;
  firstExpiryDate: any = null;
  recentTransactions: any[] = [];
  allTransactions: any[] = [];
  historyPageIndex: number = 1;
  hasMoreRecentTransactions: boolean = false;
  historyPageSize: number = 10;
  hasMoreTransactions: boolean = true;
  isHistoryLoading: boolean = false;
  customertype: any = this.apiservice.getCustomerType();
  historyFromDate: string = '';
  historyToDate: string = '';
  historySelectedType: string = 'All';
  isFilterApplied: boolean = false;
  walletOpenedFromHeader: boolean = false;
  placeholderTexts: string[] = [];
  currentPlaceholder: string = '';
  placeholderVisible: boolean = true;
  private placeholderInterval: any;
  DefaultAddressArray: any;
  PopularServices: any;
  showPlaceholder = true;
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
  toggleMobileSearch2222() {
    this.showsearchtruee = !this.showsearchtruee;
  }
  public commonFunction = new CommonFunctionService();
  userData: any = [];
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const profileElement = (event.target as HTMLElement).closest(
      '.user-profile'
    );
    if (!profileElement) {
      this.isProfileMenuOpen = false;
    }
  }
  guestaddress: any = (this.userAddress = this.apiservice.getUserAddress());
  constructor(
    private route: ActivatedRoute,
    private cookie: CookieService,
    private modalservice: ModalService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private message: ToastrService,
    private apiservice: ApiServiceService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private cartService: CartService,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private addressUpdateService: AddressUpdateServiceService,
    private ordersOverlay: OrdersOverlayService
  ) {
    translate.addLangs(['en', 'mr']);
    translate.setDefaultLang('en');
  }

  // Lifecycle helpers for the orders-overlay subscription below.
  private destroy$ = new Subject<void>();

  // Opens the same in-drawer "My Orders" view that the profile menu uses
  // (showContent = 'myorder'). Called by:
  //   - FooterComponent's bottom-nav "Order" tap (via OrdersOverlayService)
  //   - this.ngOnInit() when the `pockit.openOrdersOverlay` session flag
  //     is set, which FooterComponent sets when it needs to hard-navigate
  //     home first (e.g. from /my-orders where the header isn't mounted)
  // True when the My Orders drawer was triggered by the bottom-nav Order
  // tap (vs. the profile menu). Drives the drawer's back button: bottom-nav
  // opens are expected to unwind straight to home, profile opens unwind to
  // the profile menu.
  ordersOpenedFromBottomNav: boolean = false;

  openOrdersOverlayFromNav(): void {
    this.walletOpenedFromHeader = false;
    this.isMobileMenuOpen = true;
    this.ordersOpenedFromBottomNav = true;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    this.openOrdersModal();
    // Notify the OrdersOverlayService so the bottom-nav footer highlights
    // the Order tab. This wasn't going through ordersOverlay.open() (which
    // is the normal trigger) because the cart→orders path uses the session
    // flag + ngOnInit rather than the open$ subject.
    this.ordersOverlay.setOpen(true);
  }

  onOrdersBack(): void {
    if (this.ordersOpenedFromBottomNav) {
      this.closeMobileMenu();
    } else {
      this.gotoProfile();
    }
  }
  changeLanguage(language: string) {
    this.currentLang = language;
    this.translate.use(language);
  }
  loadData() {
    this.loaderService.showLoader();
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, 3000);
  }
  openModal() {
    this.modalservice.openModal();
  }
  setDefaultImage(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/blueEmpImage.png';
  }
  cityOnly: string = "";
  ngOnInit(): void {
    // Footer bottom-nav "Order" tap asks us (via a shared service) to open
    // the profile drawer's My Orders view — matches the known-working
    // behaviour of tapping My Orders from the profile menu.
    this.ordersOverlay.open$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.openOrdersOverlayFromNav());

    // Footer requests the drawer be dismissed when Home/Cart is tapped
    // while the My Orders overlay is up — otherwise routerLink=/service
    // is a no-op on the home route and the user appears stuck.
    this.ordersOverlay.close$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.closeMobileMenu());

    // If the footer couldn't reach us because this component wasn't mounted
    // on the previous route (e.g. /my-orders hides <app-header>), it SPA-
    // navigates home and leaves a session flag for us to honour on mount.
    // The field initializers above have already set isMobileMenuOpen +
    // showContent='myorder' so the drawer renders open at first paint —
    // we just need to fetch the data, mark the "from bottom-nav" state,
    // and dismiss the loader veil the footer raised before navigating.
    if (sessionStorage.getItem('pockit.openOrdersOverlay') === '1') {
      sessionStorage.removeItem('pockit.openOrdersOverlay');
      this.openOrdersOverlayFromNav();
      // Hide after the next microtask so the drawer's first frame paints
      // before we reveal the page underneath.
      Promise.resolve().then(() => this.loaderService.hideLoader());
    }

    this.apiservice.getAddressObservable().subscribe((city: any) => {
      if (city) {
        this.mainaddress = city;
      }
    });
    this.locationName =
      this.apiservice.getUserAddressLocal() ||
      this.apiservice.getUserAddress() ||
      this.apiservice.getSessionAddress() ||
      '';
    this.router.events.subscribe(() => {
      this.isActive = true;
    });
    this.userID = this.apiservice.getUserId();
    this.userNAME = this.apiservice.getUserName();
    this.userAddress = this.apiservice.getUserAddress();
    this.userMobile = this.apiservice.getUsermobileNumber();
    this.userEMAIL = this.apiservice.getEmail();
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    this.addressline1 = localStorage.getItem('AddressLine1');
    this.addressline2 = localStorage.getItem('AddressLine2');
    this.addressCity = localStorage.getItem('addressCity');
    this.mainaddress = this.addressCity ? this.addressCity : this.addressline1;
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    if (this.userID != 0 && this.userID != null && this.userID != undefined) {
      this.cartService.cartCount$.subscribe((count) => {
        this.cartCount = count;
      });
      this.cartService.fetchAndUpdateCartDetails(this.userID);
      this.getuserList();
      // this.fetchPopularServicesForPlaceholder(); // Moved for better territory handling
      this.apiservice
        .getAddresses12data(
          0,
          0,
          'IS_DEFAULT',
          'desc',
          ' AND CUSTOMER_ID = ' + this.userID + ' AND IS_DEFAULT = 1',
          localStorage.getItem('token') || ' '
        )
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'].length > 0) {
              const address = data['data'][0];
              localStorage.setItem('AddressLine1', address['ADDRESS_LINE_1']);
              localStorage.setItem('AddressLine2', address['ADDRESS_LINE_2']);
              localStorage.setItem('addressCity', address['CITY_NAME']);
              this.addressline1 = localStorage.getItem('AddressLine1');
              this.addressline2 = localStorage.getItem('AddressLine2');
              this.addressCity = localStorage.getItem('addressCity');
              this.mainaddress = this.addressCity
                ? this.addressCity
                : this.addressline1;
              var pincodeFor = address.PINCODE_FOR
              localStorage.setItem('pincodeFor', pincodeFor);
            }
            if (!this.addressline1) {
              this.isShopDisabled = false;
              this.isServiceDisabled = false;
            } else {
              this.isShopDisabled = !(pincodeFor == 'I' || pincodeFor == 'B');
              this.isServiceDisabled = !(pincodeFor == 'S' || pincodeFor == 'B');
            }
            this.TERRITORY_IDssss = data.data.map(
              (addressssss: any) => addressssss['TERRITORY_ID']
            );
            if (this.TERRITORY_IDssss && this.TERRITORY_IDssss.length > 0) {
              sessionStorage.setItem('CurrentTerritory', this.TERRITORY_IDssss[0]);
              this.fetchPopularServicesForPlaceholder();
            }
            this.pincodeforrkey =
              pincodeFor == 'B'
                ? 'B'
                : pincodeFor == 'I'
                  ? 'SP'
                  : pincodeFor == 'S'
                    ? 'S'
                    : 'B';
            this.cartService.cartDetails$.subscribe((cartDetails) => {
              const itemType = cartDetails[0]?.ITEM_TYPE;
              if (!itemType) {
                this.cartCount = 0;
              } else if (
                (pincodeFor === 'S' && itemType !== 'S' && itemType !== 'B') ||
                (pincodeFor === 'I' && itemType !== 'P' && itemType !== 'B')
              ) {
                this.cartCount = 0;
              } else {
              }
            });
            if (
              window.location.href.split('/')[3] == 'privacy-policy' ||
              window.location.href.split('/')[3] == 'terms-and-conditions' ||
              window.location.href.split('/')[3] == 'contact-us'
            ) {
            } else {
              setTimeout(() => {
                let targetRoute = '/service';
                if (pincodeFor === 'S') {
                  targetRoute = '/service';
                } else if (pincodeFor === 'I') {
                  targetRoute = '/shop/home';
                } else if (pincodeFor === 'B') {
                  targetRoute = '/service';
                }
                if (this.router.url !== targetRoute) {
                  this.router.navigate([targetRoute]);
                }
              }, 100);
            }
          }
        });
    }
    this.updateScreenSize();
    if (this.userID == 0) {
      this.guestaddress = this.userAddress = this.apiservice.getUserAddress();
      var pincodeFor = 'B';
      if (this.guestaddress == '') {
        this.guestaddress = '';
        pincodeFor = 'B';
      } else {
        this.guestaddress = JSON.parse(this.guestaddress);
        pincodeFor = this.guestaddress?.PINCODE_FOR;
      }
      if (!pincodeFor) {
        this.toastr.error(
          'PINCODE_FOR value is missing in the guest address.',
          'Error'
        );
        return;
      }
      localStorage.setItem('pincodeFor', pincodeFor);
      this.isShopDisabled = !(pincodeFor === 'I' || pincodeFor === 'B');
      this.isServiceDisabled = !(pincodeFor === 'S' || pincodeFor === 'B');
      this.fetchPopularServicesForPlaceholder();
    }
    this.startPlaceholderAnimation()
  }
  ngOnDestroy() {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
  onShopClick1(event: Event) {
    if (this.isShopDisabled) {
      this.handleNavClick('I', event);
    } else {
      this.closemodelllllll();
    }
  }
  onNavClick(event: Event) {
    if (this.isServiceDisabled) {
      this.handleNavClick('S', event);
    } else {
      this.closemodelllllll();
    }
  }
  handleNavClick(expected: 'S' | 'I', event: Event) {
    const pincodeFor = localStorage.getItem('pincodeFor');
    const addressline1 = localStorage.getItem('AddressLine1');
    if (addressline1) {
      if (pincodeFor !== expected && pincodeFor !== 'B') {
        event.preventDefault();
        this.toastr.warning(
          expected === 'I'
            ? 'This feature is not available in your current pincode area.'
            : 'This feature is not available in your current pincode area.'
        );
      }
    }
  }
  onServiceClick() {
    if (this.apiservice.isServiceDisabled()) {
      this.toastr.warning(
        'This feature is not available in your current pincode area.'
      );
      return;
    }
  }
  onShopClick() {
    if (this.apiservice.isShopDisabled()) {
      this.toastr.warning(
        'This feature is not available in your current pincode area.'
      );
      return;
    }
  }
  languages = ['en', 'mr'];
  LANGUAGES: any;
  isMobile = false;
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
  isLoggingOut: boolean = false;
  onLogout() {
    this.isLoggingOut = true;
    if (this.userID == 0 || this.userID == null || this.userID == undefined) {
      this.cookie.deleteAll();
      sessionStorage.clear();
      localStorage.clear();
      this.toastr.success('You have been successfully logged out.', 'Success', {
        timeOut: 1500,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true,
        progressAnimation: 'decreasing',
        toastClass: 'ngx-toastr custom-toast',
      });
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
      this.isLoggingOut = false;
    } else {
      const subscribedChannels = JSON.parse(this.subscribedChannels);
      var channelNames = subscribedChannels.map(
        (channel: any) => channel.CHANNEL_NAME
      );
      if (this.subscribedChannels?.length > 0) {
        this.apiservice.unsubscribeToMultipleTopics(channelNames).subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              this.apiservice.userLogout(this.userID).subscribe({
                next: (successCode: any) => {
                  if (successCode.status == 200) {
                    this.cookie.deleteAll();
                    sessionStorage.clear();
                    localStorage.clear();
                    this.toastr.success(
                      'You have been successfully logged out.',
                      'Success',
                      {
                        timeOut: 1500,
                        positionClass: 'toast-top-right',
                        progressBar: true,
                        closeButton: true,
                        progressAnimation: 'decreasing',
                        toastClass: 'ngx-toastr custom-toast',
                      }
                    );
                    this.router.navigate(['/login']).then(() => {
                      window.location.reload();
                    });
                  } else {
                    this.cookie.deleteAll();
                    sessionStorage.clear();
                    localStorage.clear();
                    this.toastr.success(
                      'You have been successfully logged out.',
                      'Success',
                      {
                        timeOut: 1500,
                        positionClass: 'toast-top-right',
                        progressBar: true,
                        closeButton: true,
                        progressAnimation: 'decreasing',
                        toastClass: 'ngx-toastr custom-toast',
                      }
                    );
                    this.router.navigate(['/login']).then(() => {
                      window.location.reload();
                    });
                  }
                  this.isLoggingOut = false;
                },
                error: (errorResponse) => {
                  this.toastr.error('Something went wrong. Please try again.');
                  this.cookie.deleteAll();
                  sessionStorage.clear();
                  localStorage.clear();
                  this.toastr.success(
                    'You have been successfully logged out.',
                    'Success',
                    {
                      timeOut: 1500,
                      positionClass: 'toast-top-right',
                      progressBar: true,
                      closeButton: true,
                      progressAnimation: 'decreasing',
                      toastClass: 'ngx-toastr custom-toast',
                    }
                  );
                  this.router.navigate(['/login']).then(() => {
                    window.location.reload();
                  });
                  this.isLoggingOut = false;
                },
              });
            } else {
              this.cookie.deleteAll();
              sessionStorage.clear();
              localStorage.clear();
              this.toastr.success(
                'You have been successfully logged out.',
                'Success',
                {
                  timeOut: 1500,
                  positionClass: 'toast-top-right',
                  progressBar: true,
                  closeButton: true,
                  progressAnimation: 'decreasing',
                  toastClass: 'ngx-toastr custom-toast',
                }
              );
              this.router.navigate(['/login']).then(() => {
                window.location.reload();
              });
              this.isLoggingOut = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.cookie.deleteAll();
            sessionStorage.clear();
            localStorage.clear();
            this.toastr.success(
              'You have been successfully logged out.',
              'Success',
              {
                timeOut: 1500,
                positionClass: 'toast-top-right',
                progressBar: true,
                closeButton: true,
                progressAnimation: 'decreasing',
                toastClass: 'ngx-toastr custom-toast',
              }
            );
            this.router.navigate(['/login']).then(() => {
              window.location.reload();
            });
            this.isLoggingOut = false;
          }
        );
      } else {
        this.cookie.deleteAll();
        sessionStorage.clear();
        localStorage.clear();
        this.toastr.success(
          'You have been successfully logged out.',
          'Success',
          {
            timeOut: 1500,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true,
            progressAnimation: 'decreasing',
            toastClass: 'ngx-toastr custom-toast',
          }
        );
        this.router.navigate(['/login']).then(() => {
          window.location.reload();
        });
        this.isLoggingOut = false;
      }
    }
  }
  // If we're mounting because the footer hard-redirected from /my-cart or
  // /my-orders with the orders-overlay flag set, open the drawer eagerly at
  // construction time so the home page is never visible underneath. ngOnInit
  // still runs openOrdersOverlayFromNav() below to fetch data and set the
  // "opened from bottom-nav" state.
  isMobileMenuOpen: boolean =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('pockit.openOrdersOverlay') === '1';
  toggleMobileMenu() {
    this.walletOpenedFromHeader = false;
    this.showContent = 'normal';
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const overflow = this.isMobileMenuOpen ? 'hidden' : '';
    document.body.style.overflow = overflow;
    document.documentElement.style.overflow = overflow;
    this.ordersOverlay.setOpen(false);
  }
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.ordersOpenedFromBottomNav = false;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    this.ordersOverlay.setOpen(false);
  }
  editProfilePhoto() { }
  fileChangeEvent(event: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.message.error(
        'Please select a valid image file (JPG, JPEG, PNG).',
        ''
      );
      input.value = '';
      return;
    }

    // Clear the input so the same file can be re-picked after a cancel.
    input.value = '';

    // Close the picker right away so the user's eye is on the avatar, not
    // the modal, while the upload happens in the background.
    this.closeModal();

    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const dateStr = this.datePipe.transform(new Date(), 'yyyyMMdd');
    const filename = `${dateStr}${randomNum}.${fileExt}`;

    // Remember the current avatar so we can roll back if the upload fails.
    const previousPreview = this.imagePreview;

    this.prepareUpload(file)
      .then(({ blob, dataUrl }) => {
        // Optimistic preview – the avatar updates instantly, the POST
        // happens in the background.
        this.imagePreview = dataUrl;
        this.userData.PROFILE_PHOTO = filename;
        this.uploadImage(blob, filename, previousPreview);
      })
      .catch(() => {
        this.message.error(
          "Couldn't process that image. Please try another.",
          ''
        );
      });
  }

  // Downscale phone photos client-side so we don't bounce off the 1MB
  // server limit. Returns { blob, dataUrl } — the blob goes to the server,
  // the dataUrl is shown immediately as the avatar preview.
  private prepareUpload(
    file: File
  ): Promise<{ blob: Blob; dataUrl: string }> {
    const MAX_DIMENSION = 1024;
    const MAX_BYTES = 900 * 1024;

    return this.fileToDataUrl(file).then((originalDataUrl) => {
      if (file.size <= MAX_BYTES) {
        return { blob: file, dataUrl: originalDataUrl };
      }

      return new Promise<{ blob: Blob; dataUrl: string }>((resolve, reject) => {
        const img = new Image();
        img.onerror = () => reject(new Error('image-decode-failed'));
        img.onload = () => {
          const scale = Math.min(
            1,
            MAX_DIMENSION / Math.max(img.width, img.height)
          );
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('canvas-unsupported'));
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('encode-failed'));
              resolve({
                blob,
                dataUrl: canvas.toDataURL('image/jpeg', 0.85),
              });
            },
            'image/jpeg',
            0.85
          );
        };
        img.src = originalDataUrl;
      });
    });
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  isUploading: boolean = false;
  progressPercent: number = 0;
  imagePreview: any = null;
  showModal: boolean = false;
  IMAGEuRL: any;
  uploadImage(file: Blob, filename: string, previousPreview?: any) {
    this.isUploading = true;
    this.progressPercent = 0;
    this.apiservice.onUpload('CustomerProfile', file, filename).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progressPercent = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          this.progressPercent = 100;
          if (event.body?.code === 200) {
            // Swap from the local data-URL preview to the server-hosted URL
            // so future sessions (and other components) see the same photo.
            if (this.userData.PROFILE_PHOTO) {
              this.imagePreview =
                this.IMAGEuRL + 'CustomerProfile/' + this.userData.PROFILE_PHOTO;
            }
            this.showModal = true;
            if (this.showContent == 'normal') {
              this.updateUserProfile();
            }
            this.clearCanvasAndVideo();
          } else {
            this.message.error('Failed to upload image.', '');
            this.imagePreview = previousPreview ?? null;
            this.userData.PROFILE_PHOTO = null;
            this.showModal = false;
          }
        }
      },
      error: () => {
        this.isUploading = false;
        this.message.error('Failed to upload image.', '');
        this.imagePreview = previousPreview ?? null;
        this.userData.PROFILE_PHOTO = null;
        this.showModal = false;
      },
    });
  }
  showContent: any =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('pockit.openOrdersOverlay') === '1'
      ? 'myorder'
      : 'normal';
  editContactInfo() {
    this.showContent = 'updateProfile';
    this.userData.NAME = this.userNAME;
    this.getuserList();
  }
  openAddress() {
    this.showContent = 'addressTab';
    this.getAddressList();
    this.getStateData();
  }
  openSettings() {
    this.showContent = 'settingsTab';
  }
  openLanguage() {
    this.isLanguageDrawerVisible = true;
  }
  isAboutDrawerVisible: boolean = false;
  openAbout() {
    this.isAboutDrawerVisible = true;
  }
  openTermsandServices() {
    this.showContent = 'TermsandServicesTab';
  }
  openLicenses() {
    this.showContent = 'licensesTab';
  }
  addressData: any = [];
  loadAddresses: boolean = false;
  getAddressList() {
    const filter = '';
    const likeQuery = '';
    this.loadAddresses = true;
    this.apiservice
      .getAddresses1data(
        0,
        0,
        'IS_DEFAULT',
        'desc',
        ' AND CUSTOMER_ID=' + this.userID + ' AND STATUS = 1'
      )
      .subscribe({
        next: (data1: any) => {
          this.addressData = data1.data;
          if (this.addressData) {
            const defaultaddress = this.addressData.filter(
              (data: any) => data.IS_DEFAULT == 1
            );
            if (defaultaddress !== null && defaultaddress.length > 0) {
              this.selectedAddress = defaultaddress[0]['ID'];
            }
          }
          this.loadAddresses = false;
        },
        error: (err) => {
          this.loadAddresses = false;
        },
      });
  }
  selectAddress(addressId: any): void {
    this.selectedAddress = addressId;
  }
  confirmAddressold() {
    if (!this.selectedAddress) {
      alert('Please select an address before confirming.');
      return;
    }
    const updateDefaultData = {
      CUSTOMER_ID: this.userID,
      ID: this.selectedAddress,
    };
    const defaultaddress = this.addressData.filter(
      (data: any) => data.ID == this.selectedAddress
    );
    this.apiservice.updateAddressDefault(updateDefaultData).subscribe(
      (res) => {
        if (res.code !== 200) {
          this.message.error('Default address not updated.', '');
          return;
        }
        this.message.success('Default address updated successfully.', '');
        this.apiservice.getCartDetails(this.userID).subscribe(
          (cartRes: any) => {
            const cartDetails = cartRes.data?.CART_DETAILS;
            const cartInfo = cartRes.data?.CART_INFO;
            if (cartDetails?.length > 0 && cartInfo?.length > 0) {
              const condition = ` AND CUSTOMER_ID=${this.userID} `;
              this.apiservice
                .getAddresses1data(0, 0, 'IS_DEFAULT',
                  'desc', condition)
                .subscribe({
                  next: (addressRes: any) => {
                    this.addressData = addressRes.data;
                    const defaultAddress = this.addressData.find(
                      (addr: any) => addr.IS_DEFAULT === 1
                    );
                    localStorage.setItem(
                      'pincodeFor',
                      defaultAddress?.PINCODE_FOR
                    );
                    if (!defaultAddress) return;
                    const updateCartData = {
                      CART_ID: cartDetails[0].CART_ID,
                      ADDRESS_ID: cartInfo[0].ADDRESS_ID,
                      TYPE: cartInfo[0].TYPE,
                      OLD_TERRITORY_ID:
                        sessionStorage.getItem('CurrentTerritory'),
                      NEW_TERRITORY_ID: defaultAddress.TERRITORY_ID,
                      CUSTOMER_ID: cartInfo[0].CUSTOMER_ID,
                    };
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
              this.navigateToServicePage();
            }
          },
          (error) => { }
        );
      },
      (error) => {
        this.message.error('Failed to save information.', '');
      }
    );
  }
  confirmAddress() {
    if (!this.selectedAddress) {
      alert('Please select an address before confirming.');
      return;
    }
    const updateDefaultData = {
      CUSTOMER_ID: this.userID,
      ID: this.selectedAddress,
    };
    const defaultaddress = this.addressData.filter(
      (data: any) => data.ID == this.selectedAddress
    );
    this.apiservice.updateAddressDefault(updateDefaultData).subscribe(
      (res) => {
        if (res.code !== 200) {
          this.message.error('Default address not updated.', '');
          this.settingDefaultAddressId = null;
          return;
        }
        this.message.success('Default address updated successfully.', '');
        this.apiservice.getCartDetails(this.userID).subscribe(
          (cartRes: any) => {
            const cartDetails = cartRes.data?.CART_DETAILS;
            const cartInfo = cartRes.data?.CART_INFO;
            if (cartDetails?.length > 0 && cartInfo?.length > 0) {
              const condition = ` AND CUSTOMER_ID=${this.userID} `;
              this.apiservice
                .getAddresses1data(0, 0, 'IS_DEFAULT', 'desc', condition)
                .subscribe({
                  next: (addressRes: any) => {
                    this.addressData = addressRes.data;
                    const defaultAddress = this.addressData.find(
                      (addr: any) => addr.IS_DEFAULT === 1
                    );
                    localStorage.setItem(
                      'pincodeFor',
                      defaultAddress?.PINCODE_FOR
                    );
                    if (!defaultAddress) return;
                    const updateCartData = {
                      CART_ID: cartDetails[0].CART_ID,
                      ADDRESS_ID: cartInfo[0].ADDRESS_ID,
                      TYPE: cartInfo[0].TYPE,
                      OLD_TERRITORY_ID: sessionStorage.getItem('CurrentTerritory'),
                      NEW_TERRITORY_ID: defaultAddress.TERRITORY_ID,
                      CUSTOMER_ID: cartInfo[0].CUSTOMER_ID,
                    };
                    this.apiservice
                      .updateAddressToUpdateCart(updateCartData)
                      .subscribe(
                        (successCode: any) => {
                          if (successCode.body.code === 200) {
                            sessionStorage.setItem(
                              'CurrentTerritory',
                              defaultAddress.TERRITORY_ID.toString()
                            );
                            this.cartService.fetchAndUpdateCartDetails(this.userID);
                            this.refreshHeaderData();
                            this.getAddressList();
                            this.showContent = 'addressTab';
                            this.settingDefaultAddressId = null;
                          }
                        },
                        (error) => { }
                      );
                  },
                  error: (err) => { },
                });
            } else {
              this.refreshHeaderData();
              this.getAddressList();
              this.showContent = 'addressTab';
              this.settingDefaultAddressId = null;
            }
          },
          (error) => { }
        );
      },
      (error) => {
        this.message.error('Failed to save information.', '');
      }
    );
  }
  navigateToServicePageold() {
    this.router.navigateByUrl('/service').then(() => {
      window.location.reload();
    });
  }
  navigateToServicePage() {
    this.refreshHeaderData();
    this.getAddressList();
    this.showContent = 'addressTab';
  }
  refreshHeaderData() {
    this.apiservice
      .getAddresses12data(
        0,
        0,
        'IS_DEFAULT',
        'desc',
        ' AND CUSTOMER_ID = ' + this.userID + ' AND IS_DEFAULT = 1',
        localStorage.getItem('token') || ' '
      )
      .subscribe((data) => {
        if (data['code'] === 200) {
          if (data['data'].length > 0) {
            const address = data['data'][0];
            localStorage.setItem('AddressLine1', address['ADDRESS_LINE_1']);
            localStorage.setItem('AddressLine2', address['ADDRESS_LINE_2']);
            localStorage.setItem('addressCity', address['CITY_NAME']);
            this.addressline1 = localStorage.getItem('AddressLine1');
            this.addressline2 = localStorage.getItem('AddressLine2');
            this.addressCity = localStorage.getItem('addressCity');
            this.mainaddress = this.addressCity
              ? this.addressCity
              : this.addressline1;
            const pincodeFor = address.PINCODE_FOR;
            localStorage.setItem('pincodeFor', pincodeFor);
            if (address.TERRITORY_ID) {
              sessionStorage.setItem('CurrentTerritory', address.TERRITORY_ID.toString());
            }
            if (!this.addressline1) {
              this.isShopDisabled = false;
              this.isServiceDisabled = false;
            } else {
              this.isShopDisabled = !(pincodeFor == 'I' || pincodeFor == 'B');
              this.isServiceDisabled = !(pincodeFor == 'S' || pincodeFor == 'B');
            }
            this.TERRITORY_IDssss = data.data.map(
              (addressssss: any) => addressssss['TERRITORY_ID']
            );
            this.pincodeforrkey =
              pincodeFor == 'B'
                ? 'B'
                : pincodeFor == 'I'
                  ? 'SP'
                  : pincodeFor == 'S'
                    ? 'S'
                    : 'B';
            this.cartService.cartDetails$.subscribe((cartDetails) => {
              const itemType = cartDetails[0]?.ITEM_TYPE;
              if (!itemType) {
                this.cartCount = 0;
              } else if (
                (pincodeFor === 'S' && itemType !== 'S' && itemType !== 'B') ||
                (pincodeFor === 'I' && itemType !== 'P' && itemType !== 'B')
              ) {
                this.cartCount = 0;
              }
            });
          }
          this.cartService.fetchAndUpdateCartDetails(this.userID);
          this.getuserList();
          this.addressUpdateService.notifyAddressChanged();
          this.fetchPopularServicesForPlaceholder();
        }
      });
  }
  settingDefaultAddressId: any = null;
  setAsDefault(addressId: any) {
    if (this.settingDefaultAddressId) return;
    this.settingDefaultAddressId = addressId;
    this.selectedAddress = addressId;
    this.confirmAddress();
  }
  demochange(data: any) { }
  getuserList() {
    const filter = '';
    const likeQuery = '';
    this.apiservice
      .getUserData(0, 0, '', '', ' AND ID =' + this.userID)
      .subscribe({
        next: (data1: any) => {
          if (data1?.data[0]['ACCOUNT_STATUS'] === 0) {
            this.cookie.deleteAll();
            sessionStorage.clear();
            localStorage.clear();
            this.toastr.success(
              'Your account has been deactivated. Please contact support at itsupport@pockitengineers.com',
              'Success',
              {
                timeOut: 1500,
                positionClass: 'toast-top-right',
                progressBar: true,
                closeButton: true,
                progressAnimation: 'decreasing',
                toastClass: 'ngx-toastr custom-toast',
              }
            );
            this.router.navigate(['/login']).then(() => {
              window.location.reload();
            });
          } else {
          }
          this.userData = { ...data1?.data[0] };
          this.userData.EMAIL = data1.data[0]['EMAIL'];
          this.userData.MOBILE_NO = data1.data[0]['MOBILE_NO'];
          this.userData.NAME = data1.data[0]['NAME'];
          this.userData.IS_HAVE_GST = data1.data[0]['IS_HAVE_GST'];
          this.userData.COMPANY_ADDRESS = data1.data[0]['COMPANY_ADDRESS'];
          this.userData.INDIVIDUAL_COMPANY_NAME = data1.data[0]['INDIVIDUAL_COMPANY_NAME'];
          this.userNAME = data1.data[0]['NAME'];
          this.userMobile = data1.data[0]['MOBILE_NO'];
          this.userEMAIL = data1.data[0]['EMAIL'];
          this.customerType = data1.data[0]['CUSTOMER_TYPE'];
          if (this.customerType == 'B') {
            this.BusinessName = data1.data[0]['COMPANY_NAME'];
          }
          this.userData.PROFILE_PHOTO = data1.data[0]['PROFILE_PHOTO'];
          this.imagePreview =
            this.userData && this.userData.PROFILE_PHOTO
              ? this.IMAGEuRL + 'CustomerProfile/' + this.userData.PROFILE_PHOTO
              : 'assets/img/blueEmpImage.png';
        },
        error: (err) => { },
      });
  }
  gotoProfile() {
    this.showContent = 'normal';
  }
  openWallet() {
    this.showContent = 'walletTab';
    this.getWalletData();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  getWalletData() {
    this.expiredAmount = 0;
    const data = {
      CUSTOMER_ID: this.userID,
      pageIndex: 1,
      pageSize: 6,
      sortKey: '',
      sortValue: '',
      filter: ' AND CUSTOMER_ID = ' + this.userID
    };
    this.apiservice.getCustomerWallet(data).subscribe((res: any) => {
      if (res && res.code === 200 && res.data && res.data.length > 0) {
        this.walletBalance = res.data[0]?.WALLET_AMOUNT || 0;
        this.totalUsed = res.data[0]?.USED_AMOUNT || 0;
        this.availableBalance = res.data[0]?.AVAILABLE_BALANCE || 0;
      }
    });
    this.apiservice.getCustomerWalletTransaction(data).subscribe((res: any) => {
      if (res && res.code === 200 && res.data) {
        if (!this.walletBalance) {
          this.walletBalance = res.data[0]?.BALANCE || res?.BALANCE || 0;
        }
        if (!this.totalUsed) {
          this.totalUsed = res.data[0]?.USED_AMT || res?.USED_AMT || 0;
        }
        if (!this.availableBalance) {
          this.availableBalance = res.data[0]?.AVAILABLE_BALANCE || 0;
        }
        this.hasMoreRecentTransactions = res.data.length > 5;
        this.recentTransactions = res.data.slice(0, 5).map((trans: any) => {
          let mappedTitle = trans.TITLE || 'Transaction';
          let mappedType = (trans.TYPE === 'DW') ? 'Debited' : 'Credit';
          let mappedIcon = 'bi-wallet2';
          if (trans.TYPE === 'PR') {
            mappedTitle = 'Promotional';
            mappedIcon = 'bi-tags';
          } else if (trans.TYPE === 'RF') {
            mappedTitle = 'Refunded';
            mappedIcon = 'bi-arrow-counterclockwise';
          } else if (trans.TYPE === 'AT') {
            mappedTitle = 'Admin Topup';
            mappedIcon = 'bi-person-gear';
          } else if (trans.TYPE === 'DW') {
            mappedTitle = 'Debited';
            mappedIcon = 'bi-cart-dash';
          } else if (trans.TYPE === 'SB') {
            mappedTitle = 'Signup Bonus';
            mappedIcon = 'bi-gift';
          }
          if (mappedType === 'Credit' && mappedTitle === 'Transaction') {
            mappedTitle = '';
          }
          return {
            ...trans,
            mappedTitle: mappedTitle,
            mappedType: mappedType,
            mappedIcon: mappedIcon,
            displayDate: this.formatTransactionDate(trans.TRANSACTION_DATE),
            displayTime: trans.CREATED_TIME || '',
            displayAmount: trans.WALLET_AMOUNT || 0,
            EXPIRY_DATE: trans.EXPIRY_DATE,
            IS_EXPIRED: trans.IS_EXPIRED
          };
        });
        const expiringPrs = res.data.filter((t: any) =>
          t.EXPIRY_DATE &&
          t.IS_EXPIRED === 0 &&
          (t.TYPE === 'PR' || t.TYPE === 'SB' || t.TYPE === 'CR' || t.TYPE === 'AT' || t.TYPE === 'RF')
        );
        if (expiringPrs.length > 0) {
          const earliestExpiryDate = expiringPrs.reduce((prev: any, curr: any) => {
            return new Date(curr.EXPIRY_DATE) < new Date(prev.EXPIRY_DATE) ? curr : prev;
          }, expiringPrs[0]).EXPIRY_DATE;
          const totalAtFirstExpiry = expiringPrs
            .filter((t: any) => t.EXPIRY_DATE === earliestExpiryDate)
            .reduce((sum: number, t: any) => sum + (Number(t.WALLET_AMOUNT) || 0), 0);
          this.expiredAmount = totalAtFirstExpiry;
          this.firstExpiryDate = earliestExpiryDate;
        } else {
          this.expiredAmount = 0;
          this.firstExpiryDate = null;
        }
      }
    });
  }
  formatTransactionDate(date: any): string {
    if (!date) return '';
    try {
      const formatted = this.datePipe.transform(date, 'EEE, MMM d, yyyy');
      if (formatted) {
        return formatted;
      }
      return '';
    } catch (e) {
      return '';
    }
  }
  openAllTransactions() {
    this.showContent = 'allTransactionsTab';
    this.historyPageIndex = 1;
    this.allTransactions = [];
    this.hasMoreTransactions = true;
    this.isHistoryLoading = false;
    this.historyFromDate = '';
    this.historyToDate = '';
    this.historySelectedType = 'All';
    this.isFilterApplied = false;
    this.getAllTransactionsData();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  getAllTransactionsData() {
    if (this.isHistoryLoading) return;
    this.isHistoryLoading = true;
    let filter = ' AND CUSTOMER_ID = ' + this.userID;
    if (this.historyFromDate && this.historyToDate) {
      filter += ` AND TRANSACTION_DATE BETWEEN '${this.historyFromDate} 00:00:00' AND '${this.historyToDate} 23:59:59'`;
    }
    if (this.historySelectedType !== 'All') {
      let typeCode = '';
      if (this.historySelectedType === 'Credit') typeCode = 'CR';
      else if (this.historySelectedType === 'Debit') typeCode = 'DW';
      else if (this.historySelectedType === 'Refunded') typeCode = 'RF';
      else if (this.historySelectedType === 'Admin Topup') typeCode = 'AT';
      else if (this.historySelectedType === 'Promotional') typeCode = 'PR';
      else if (this.historySelectedType === 'Signup Bonus') typeCode = 'SB';
      if (typeCode) {
        filter += ` AND TYPE = '${typeCode}'`;
      }
    }
    const data = {
      CUSTOMER_ID: this.userID,
      pageIndex: this.historyPageIndex,
      pageSize: this.historyPageSize,
      sortKey: 'ID',
      sortValue: 'desc',
      filter: filter
    };
    this.apiservice.getCustomerWalletTransaction(data).subscribe((res: any) => {
      this.isHistoryLoading = false;
      if (res && res.code === 200 && res.data) {
        const newTransactions = res.data.map((trans: any) => {
          let mappedTitle = trans.TITLE || 'Transaction';
          let mappedType = (trans.TYPE === 'DW') ? 'Debited' : 'Credit';
          let mappedIcon = 'bi-wallet2';
          if (trans.TYPE === 'PR') {
            mappedTitle = 'Promotional';
            mappedIcon = 'bi-tags';
          } else if (trans.TYPE === 'RF') {
            mappedTitle = 'Refunded';
            mappedIcon = 'bi-arrow-counterclockwise';
          } else if (trans.TYPE === 'AT') {
            mappedTitle = 'Admin Topup';
            mappedIcon = 'bi-person-gear';
          } else if (trans.TYPE === 'DW') {
            mappedTitle = 'Debited';
            mappedIcon = 'bi-cart-dash';
          } else if (trans.TYPE === 'SB') {
            mappedTitle = 'Signup Bonus';
            mappedIcon = 'bi-gift';
          }
          if (mappedType === 'Credit' && mappedTitle === 'Transaction') {
            mappedTitle = '';
          }
          return {
            ...trans,
            mappedTitle: mappedTitle,
            mappedType: mappedType,
            mappedIcon: mappedIcon,
            displayDate: this.formatTransactionDate(trans.TRANSACTION_DATE),
            displayTime: trans.CREATED_TIME || '',
            displayAmount: trans.WALLET_AMOUNT || 0,
            EXPIRY_DATE: trans.EXPIRY_DATE,
            IS_EXPIRED: trans.IS_EXPIRED
          };
        });
        const batchTransactions = newTransactions.slice(0, this.historyPageSize);
        this.allTransactions = [...this.allTransactions, ...batchTransactions];
        this.hasMoreTransactions = newTransactions.length >= this.historyPageSize;
      } else {
        this.hasMoreTransactions = false;
      }
    }, error => {
      this.isHistoryLoading = false;
      this.hasMoreTransactions = false;
    });
  }
  loadMoreTransactions() {
    this.historyPageIndex++;
    this.getAllTransactionsData();
  }
  applyHistoryFilters() {
    if (!this.historyFromDate) {
      this.toastr.error('Please Slect From Date', '');
      return;
    }
    if (!this.historyToDate) {
      this.toastr.error('Please Select To Date', '');
      return;
    }
    this.applyHistoryFiltersInternal();
  }
  showCalendarPopup: boolean = false;
  selectTransactionTab(type: string) {
    this.historySelectedType = type;
    this.historyPageIndex = 1;
    this.allTransactions = [];
    this.hasMoreTransactions = true;
    this.getAllTransactionsData();
  }
  toggleCalendarPopup() {
    this.showCalendarPopup = !this.showCalendarPopup;
  }
  clearDateFilters() {
    this.historyFromDate = '';
    this.historyToDate = '';
    this.applyHistoryFiltersInternal();
  }
  applyHistoryFiltersInternal() {
    this.historyPageIndex = 1;
    this.allTransactions = [];
    this.hasMoreTransactions = true;
    this.isFilterApplied = !!(this.historyFromDate || this.historyToDate || this.historySelectedType !== 'All');
    this.showCalendarPopup = false;
    this.getAllTransactionsData();
  }
  closeCalendarPopup() {
    this.showCalendarPopup = false;
  }
  clearHistoryFilters() {
    this.historyFromDate = '';
    this.historyToDate = '';
    this.historySelectedType = 'All';
    this.isFilterApplied = false;
    this.applyHistoryFilters();
  }
  onTransactionsScroll(event: any) {
    if (this.showContent !== 'allTransactionsTab') return;
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (atBottom && this.hasMoreTransactions && !this.isHistoryLoading) {
      this.loadMoreTransactions();
    }
  }
  gotoProfileWallet() {
    if (this.walletOpenedFromHeader) {
      this.walletOpenedFromHeader = false;
      this.closeMobileMenu();
    } else {
      this.showContent = 'normal';
    }
  }
  gotoProfile1111() {
    this.showContent = 'normal';
    this.getuserList();
  }
  closeMap() {
    this.showMap = false;
  }
  onshowMap() {
    const customerType = localStorage.getItem('customerType');
    if (customerType == 'I' || localStorage.getItem('skipLocationCheck') === 'true') {
      this.showMap = false;
      return;
    }
    setTimeout(() => this.initializeMapWithLocation('noprofile'), 100);
    this.showMap = true;
  }
  gotoAbout() {
    this.showContent = 'aboutTab';
  }
  gotoHelpSupport() {
    this.showContent = 'HelpandSupportTab';
  }
  gotoSettings() {
    this.showContent = 'settingsTab';
  }
  isprofileLoading: boolean = false;
  statusCode: any = '';
  chagegst(data: any) {
    if (!this.userData.IS_HAVE_GST) {
      this.userData.GST_NO = null;
      this.userData.INDIVIDUAL_COMPANY_NAME = null;
      this.userData.COMPANY_ADDRESS = null;
    }
  }
  updateUserProfile(form?: NgForm) {
    this.registrationSubmitted = true;
    if (form && form.invalid) {
      return;
    }
    this.isprofileLoading = true;
    this.userData.ID = this.userID;
    if (this.userData.CUSTOMER_TYPE == 'B') {
      this.userData.IS_HAVE_GST = false;
      this.userData.INDIVIDUAL_COMPANY_NAME = null;
      this.userData.COMPANY_ADDRESS = null;
    } else {
      this.userData.IS_HAVE_GST = this.userData.IS_HAVE_GST ? true : false;
      this.userData.COMPANY_NAME = null;
      this.userData.PAN = null;
      this.userData.IS_SPECIAL_CATALOGUE = false;
    }
    this.apiservice.updateUserData(this.userData).subscribe(
      (successCode: any) => {
        if (successCode.body.code === 200) {
          this.isprofileLoading = false;
          this.toastr.success('Profile updated successfully', '');
          sessionStorage.setItem(
            'userName',
            this.commonFunction.encryptdata(this.userData.NAME)
          );
          this.statusCode = '';
        } else if (
          successCode.body.code === 300 &&
          successCode.body.message === 'mobile number already exists.'
        ) {
          this.isprofileLoading = false;
          this.statusCode = 'mobile number already exists.';
        } else if (
          successCode.body.code === 300 &&
          successCode.body.message === 'email ID already exists.'
        ) {
          this.isprofileLoading = false;
          this.statusCode = 'email ID already exists.';
        } else {
          this.isprofileLoading = false;
          this.toastr.error(
            'An unexpected error occurred. Please try again later.',
            ''
          );
        }
      },
      (error) => {
        this.isprofileLoading = false;
        if (error.status === 300) {
          this.isprofileLoading = false;
          this.toastr.error('Email-ID is already exists', '');
        } else if (error.status === 500) {
          this.isprofileLoading = false;
          this.toastr.error(
            'An unexpected error occurred. Please try again later.',
            ''
          );
        } else {
          this.isprofileLoading = false;
          this.toastr.error(
            'An unknown error occurred. Please try again later.',
            ''
          );
        }
      }
    );
  }
  addressType = 'home';
  showMap: boolean = false;
  address: any = {
    houseNo: '',
    landmark: '',
    city: '',
    pincode: '',
    state: '',
  };
  map2: any;
  longitude: any;
  latitude: any;
  showPincodeDropdown: boolean = false;
  searchPincode: string = '';
  filteredPincodes: any[] = [];
  selectedPincode: string = '';
  locationCode: string = '';
  locationAddress: string = '';
  pincodeData: any = [];
  pincodeloading: boolean = false;
  selectedLocation: any;
  currentMarker: any;
  initializeMapWithLocation(profileType: any) {
    const customerType = localStorage.getItem('customerType');
    if (profileType != 'profile' && (customerType === 'I' || localStorage.getItem('skipLocationCheck') === 'true')) {
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.loadMap(this.latitude, this.longitude);
        },
        () => {
          this.loadMap(28.6139, 77.209);
        }
      );
    } else {
      this.loadMap(28.6139, 77.209);
    }
  }
  loadMap(lat: number, lng: number) {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      return;
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
    google.maps.event.addListener(this.map2, 'click', (event: any) => {
      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();
      this.currentMarker.setPosition({ lat: clickedLat, lng: clickedLng });
      this.latitude = clickedLat;
      this.longitude = clickedLng;
      this.fetchAddressFromCoords(clickedLat, clickedLng, geocoder);
    });
    this.setupSearchBox(geocoder);
  }
  setupSearchBox(geocoder: any) {
    setTimeout(() => {
      const searchBoxContainer = document.createElement('div');
      searchBoxContainer.style.cssText = `
            position: absolute;
            top: 10px !important;
            left: 10%;
            z-index: 5;
        `;
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
      searchBoxContainer.appendChild(searchInput);
      this.map2.controls[google.maps.ControlPosition.LEFT].push(
        searchBoxContainer
      );
      const searchBox = new google.maps.places.SearchBox(searchInput);
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;
        const place = places[0];
        if (!place.geometry) return;
        const location = place.geometry.location;
        this.latitude = location.lat();
        this.longitude = location.lng();
        this.map2.setCenter(location);
        this.currentMarker.setPosition(location);
        this.fetchAddressFromCoords(this.latitude, this.longitude, geocoder);
      });
    }, 500);
  }
  fetchAddressFromCoords(lat: number, lng: number, geocoder: any) {
    const latLng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ location: latLng }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        const filteredAddress = addressComponents
          .filter(
            (comp: any) =>
              comp.types.includes('route') ||
              comp.types.includes('sublocality_level_1') ||
              comp.types.includes('sublocality') ||
              comp.types.includes('neighborhood')
          )
          .map((comp: any) => comp.long_name)
          .join(', ');
        this.locationAddress = filteredAddress || '';
        this.addressForm.ADDRESS_LINE_2 = this.locationAddress;
        const postalCode =
          addressComponents.find((comp: any) =>
            comp.types.includes('postal_code')
          )?.long_name || '416310';
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
  confirmLocation(): void {
    const defaultLatitude = 28.6139;
    const defaultLongitude = 77.209;
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
    this.getAddress(this.latitude, this.longitude);
    this.showMap = false;
    this.showContent = 'addressForm';
    this.addressForm.GEO_LOCATION = `${this.latitude},${this.longitude}`;
    if (this.userID) {
      this.addressForm.CUSTOMER_ID = this.userID;
      this.addressForm.EMAIL_ID = this.userEMAIL;
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
          this.addressForm.CITY_NAME = city ? city.long_name : '';
          this.selectedState = state ? state.long_name : '';
          this.selectedPincode = '';
          this.addressForm.PINCODE = '';
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
  openAddressForm() {
    this.showContent = 'addressForm';
  }
  showAddressDetailsForm = false;
  filterPincodes(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredPincodes = this.pincodeData.filter(
      (item: any) =>
        item.PINCODE.toLowerCase().includes(query) ||
        item.PINCODE_NUMBER.toLowerCase().includes(query)
    );
  }
  filterStates(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredStates = this.stateData.filter((state: any) =>
      state.NAME.toLowerCase().includes(query)
    );
  }
  addressForm: AddressForm = {
    CUSTOMER_ID: 0,
    TERRITORY_ID: 0,
    CUSTOMER_TYPE: 1,
    CONTACT_PERSON_NAME: '',
    MOBILE_NO: '',
    EMAIL_ID: '',
    ADDRESS_LINE_1: '',
    ADDRESS_LINE_2: '',
    COUNTRY_ID: 0,
    CITY_ID: 0,
    STATE_ID: 0,
    LANDMARK: '',
    CITY_NAME: '',
    PINCODE_ID: 0,
    ID: 0,
    PINCODE: '',
    DISTRICT_ID: 0,
    GEO_LOCATION: '',
    TYPE: 'H',
    IS_DEFAULT: false,
    CLIENT_ID: 1,
    STATUS: true,
    IS_MAPPED_TO_TERRITORY: false,
    PINCODE_FOR: '',
  };
  getpincode(pincodeeeee: any) {
    let rawPincode: string = this.addressForm.PINCODE || '';
    let pincodeMatch = rawPincode.match(/^\d+/);
    let pincode: string = pincodeMatch ? pincodeMatch[0] : '';
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
            if (this.addressForm.PINCODE) {
              this.fetchPincodeData(this.addressForm.PINCODE);
            } else {
              this.fetchPincodeData(pincode);
            }
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
  loadpincodes: boolean = false;
  fetchPincodeData(pincode: string) {
    this.loadpincodes = true;
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
            this.searchPincode = pincode;
            this.filteredPincodes = this.pincodeData;
            this.addressForm.COUNTRY_ID = this.pincodeData[0].COUNTRY_ID;
            this.addressForm.STATE_ID = this.pincodeData[0].STATE;
            this.addressForm.PINCODE_ID = this.pincodeData[0].ID;
            this.getStateData();
            this.loadpincodes = false;
            this.pincodeloading = false;
            this.isLoading = false;
          },
          error: (error: any) => {
            this.pincodeData = [];
            this.loadpincodes = false;
            this.isLoading = false;
            this.pincodeloading = false;
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
          this.pincodeloading = false;
        },
        error: (error: any) => {
          this.stateData = [];
          this.pincodeloading = false;
        },
      });
  }
  searchloading: boolean = false;
  getServiceData() {
    if (this.searchloading == false) {
      this.searchloading = true;
      var address: any = [];
      var TERRITORY_ID: any = [];
      if (this.apiservice.getUserId() == 0) {
        address = JSON.parse(this.userAddress);
        if (address['TERRITORY_ID'] !== null && address['TERRITORY_ID'] !== 0) {
          TERRITORY_ID = [address['TERRITORY_ID']];
          this.apiservice
            .getglobalServiceData(0, 0, '', '', '', 'I', 0, TERRITORY_ID)
            .subscribe({
              next: (dataaaaa: any) => {
                this.optionsList = (dataaaaa.data ?? []).filter(
                  (item: any) =>
                    item['CATEGORY'] == 'Category' ||
                    item['CATEGORY'] == 'Service' ||
                    item['CATEGORY'] == 'SubCategory'
                );
                this.filteredOptions = [...this.optionsList];
                this.searchloading = false;
                this.pincodeloading = false;
                if (this.searchKeyword) {
                  this.filterOptions();
                }
              },
              error: (error: any) => {
                this.optionsList = [];
                this.filteredOptions = [];
                this.searchloading = false;
                this.pincodeloading = false;
              },
            });
        } else {
          this.searchloading = false;
        }
      } else {
        if (
          this.TERRITORY_IDssss !== null ||
          this.TERRITORY_IDssss !== 0 ||
          this.TERRITORY_IDssss !== '' ||
          this.TERRITORY_IDssss.every((item: any) => item == null)
        ) {
          this.searchloading = false;
          this.apiservice
            .getglobalServiceData(
              0,
              0,
              '',
              '',
              '',
              'I',
              this.userID,
              this.TERRITORY_IDssss
            )
            .subscribe({
              next: (dataaaaa: any) => {
                this.optionsList = (dataaaaa.data ?? []).filter(
                  (item: any) =>
                    item['CATEGORY'] == 'Category' ||
                    item['CATEGORY'] == 'Service' ||
                    item['CATEGORY'] == 'SubCategory'
                );
                this.filteredOptions = [...this.optionsList];
                this.searchloading = false;
                if (this.searchKeyword) {
                  this.filterOptions();
                }
              },
              error: (error: any) => {
                this.optionsList = [];
                this.filteredOptions = [];
                this.searchloading = false;
              },
            });
        } else {
          this.apiservice
            .getglobalServiceData(
              0,
              0,
              '',
              '',
              '',
              'I',
              this.userID,
              this.TERRITORY_IDssss
            )
            .subscribe({
              next: (dataaaaa: any) => {
                this.optionsList = (dataaaaa.data ?? []).filter(
                  (item: any) =>
                    item['CATEGORY'] == 'Category' ||
                    item['CATEGORY'] == 'Service' ||
                    item['CATEGORY'] == 'SubCategory'
                );
                this.filteredOptions = [...this.optionsList];
                this.searchloading = false;
                if (this.searchKeyword) {
                  this.filterOptions();
                }
              },
              error: (error: any) => {
                this.optionsList = [];
                this.filteredOptions = [];
                this.searchloading = false;
              },
            });
        }
      }
    }
  }
  getBrandData() {
    this.apiservice.getBrands(0, 0, 'SEQUENCE_NO', 'asc', ' AND STATUS =1 ').subscribe({
      next: (data: any) => {
        this.optionsList = data.data;
        this.pincodeloading = false;
      },
      error: (error: any) => {
        this.optionsList = [];
        this.pincodeloading = false;
      },
    });
  }
  isMapModalOpen = false;
  openMapModal() {
    this.isMapModalOpen = true;
  }
  closeMapModal() {
    this.isMapModalOpen = false;
  }
  addNewAddress() {
    setTimeout(() => this.initializeMapWithLocation("profile"), 100);
    this.showMap = true;
    this.addressForm = {
      CUSTOMER_ID: 0,
      CUSTOMER_TYPE: 1,
      TERRITORY_ID: 0,
      CONTACT_PERSON_NAME: '',
      MOBILE_NO: '',
      IS_MAPPED_TO_TERRITORY: false,
      EMAIL_ID: '',
      ADDRESS_LINE_1: '',
      ADDRESS_LINE_2: '',
      COUNTRY_ID: 0,
      STATE_ID: 0,
      LANDMARK: '',
      CITY_ID: 0,
      CITY_NAME: '',
      PINCODE_ID: 0,
      ID: 0,
      PINCODE: '',
      DISTRICT_ID: 0,
      GEO_LOCATION: '',
      TYPE: 'H',
      IS_DEFAULT: false,
      CLIENT_ID: 0,
      STATUS: true,
      PINCODE_FOR: '',
    };
  }
  VisibleIsDefault: any = true;
  editAddress(data: any) {
    this.showContent = 'addressForm';
    this.addressForm = data;
    this.getpincode(data.PINCODE);
    this.selectedState = data.STATE_NAME;
    this.selectedPincode = data.PINCODE;
    if (data.IS_DEFAULT == 1) {
      this.VisibleIsDefault = false;
    } else {
      this.VisibleIsDefault = true;
    }
  }
  selectedAddress: string = '';
  togglePincodeDropdown(pincode: string) {
    this.showPincodeDropdown = !this.showPincodeDropdown;
    this.filteredPincodes = this.pincodeData;
  }
  showDropdownServiceSearch: boolean = false;
  toggleServiceSearchDropdown() {
    this.showDropdownServiceSearch = !this.showDropdownServiceSearch;
    if (this.showDropdownServiceSearch) {
      this.filteredPincodes = this.pincodeData;
    }
  }
  showStateDropdown: boolean = false;
  searchState: string = '';
  filteredStates: any[] = [];
  selectedState: string = '';
  toggleStatesDropdown() {
    this.showStateDropdown = !this.showStateDropdown;
    if (this.showStateDropdown) {
      this.filteredStates = [...this.stateData];
    }
  }
  selectPincode(pincode: any) {
    this.selectedPincode = pincode.PINCODE_NUMBER;
    this.addressForm.PINCODE = pincode.PINCODE;
    this.addressForm.IS_MAPPED_TO_TERRITORY = pincode.IS_MAPPED_TO_TERRITORY;
    this.addressForm.STATE_ID = pincode.STATE;
    this.selectedState = pincode.STATE_NAME;
    this.addressForm.COUNTRY_ID = pincode.COUNTRY_ID;
    this.addressForm.PINCODE_ID = pincode.ID;
    this.addressForm.DISTRICT_ID = pincode.DISTRICT;
    this.addressForm.PINCODE_FOR = pincode.PINCODE_FOR;
    this.getStateData();
    this.showPincodeDropdown = false;
    this.getTerritory();
  }
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
          this.addressForm.TERRITORY_ID = data['data'][0]?.TERRITORY_ID
            ? data['data'][0]?.TERRITORY_ID
            : 0;
          this.pincodeloading = false;
        },
        error: (error: any) => {
          this.pincodeloading = false;
        },
      });
  }
  selectState(state: any) {
    this.selectedState = state.NAME;
    this.addressForm.STATE_ID = state.ID;
    this.showStateDropdown = false;
  }
  appLanguageData: any = [];
  appLanguageLoading: boolean = false;
  selectedLanguage: any;
  getLanguageData() {
    this.appLanguageLoading = true;
    this.apiservice
      .getAppLanguageData(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE =1 ')
      .subscribe({
        next: (data: any) => {
          this.appLanguageData = data.data;
          const englishLanguage = this.appLanguageData.find(
            (lang: any) => lang.NAME.toLowerCase() === 'english'
          );
          if (englishLanguage) {
            this.selectedLanguage = englishLanguage.ID;
          }
          this.appLanguageLoading = false;
        },
        error: (error: any) => {
          this.appLanguageData = [];
          this.appLanguageLoading = false;
        },
      });
  }
  faqData: any = [];
  faqLoading: boolean = false;
  getfaqData() {
    this.faqLoading = true;
    this.apiservice
      .getfaqData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS =1 AND FAQ_TYPE ="C"')
      .subscribe({
        next: (data: any) => {
          this.faqData = data.data;
          this.faqLoading = false;
        },
        error: (error: any) => {
          this.faqData = [];
          this.faqLoading = false;
        },
      });
  }
  isConfirmLoading: boolean = false;
  addressSubmitted: boolean = false;
  isAddrssSaving: boolean = false;
  saveAddressold(form: NgForm): void {
    this.addressSubmitted = true;
    if (form.invalid) {
      return;
    }
    if (this.latitude && this.longitude) {
      this.addressForm.GEO_LOCATION = `${this.latitude},${this.longitude}`;
    }
    this.isConfirmLoading = true;
    this.addressForm.CUSTOMER_TYPE = 1;
    this.addressForm.CUSTOMER_ID = this.userID;
    this.addressForm.MOBILE_NO = this.userMobile;
    this.addressForm.ADDRESS_LINE_1 = this.addressForm.ADDRESS_LINE_1;
    this.addressForm.CUSTOMER_TYPE = 1;
    this.addressForm.CONTACT_PERSON_NAME = this.userNAME;
    this.addressForm.STATUS = true;
    if (this.addressForm.TYPE == 'Home') {
      this.addressForm.TYPE = 'H';
    } else if (this.addressForm.TYPE == 'Work') {
      this.addressForm.TYPE = 'F';
    } else if (this.addressForm.TYPE == 'Other') {
      this.addressForm.TYPE = 'O';
    }
    if (this.addressForm.ID) {
      this.isConfirmLoading = true;
      this.addressForm.TERRITORY_ID = this.addressForm.TERRITORY_ID
        ? this.addressForm.TERRITORY_ID
        : 0;
      this.apiservice.updateCustomerAddress(this.addressForm).subscribe(
        (successCode: any) => {
          if (successCode.body.code === 200) {
            this.isConfirmLoading = false;
            this.toastr.success(
              'Address has been updated successfully',
              ''
            );
            this.showAddressDetailsForm = false;
            this.getAddressList();
            if (successCode.body?.SUBSCRIBED_CHANNELS?.length > 0) {
              const channelNames = successCode.body.SUBSCRIBED_CHANNELS.map(
                (channel: any) => channel.CHANNEL_NAME
              );
              this.apiservice.subscribeToMultipleTopics(channelNames).subscribe(
                (successCode: any) => { },
                (error) => {
                  if (error.status === 300) {
                  } else if (error.status === 500) {
                    this.toastr.error(
                      'An unexpected error occurred. Please try again later.',
                      ''
                    );
                  } else {
                    this.isConfirmLoading = false;
                    this.toastr.error(
                      'An unknown error occurred. Please try again later.',
                      ''
                    );
                  }
                }
              );
            }
            if (this.addressForm.IS_DEFAULT) {
              this.apiservice.getCartDetails(this.userID).subscribe(
                (cartRes: any) => {
                  if (cartRes.data?.CART_DETAILS.length > 0) {
                    this.apiservice
                      .getAddresses1data(
                        0,
                        0,
                        'IS_DEFAULT',
                        'desc',
                        ' AND CUSTOMER_ID=' + this.userID + ' AND STATUS = 1'
                      )
                      .subscribe({
                        next: (data1: any) => {
                          this.addressData = data1.data;
                          const defaultAddress = this.addressData.find(
                            (addr: any) => addr.IS_DEFAULT === 1
                          );
                          localStorage.setItem(
                            'pincodeFor',
                            defaultAddress?.PINCODE_FOR
                          );
                          const data = {
                            CART_ID: cartRes.data?.CART_DETAILS[0].CART_ID,
                            ADDRESS_ID: cartRes.data?.CART_INFO[0].ADDRESS_ID,
                            TYPE: cartRes.data?.CART_INFO[0].TYPE,
                            OLD_TERRITORY_ID:
                              sessionStorage.getItem('CurrentTerritory'),
                            NEW_TERRITORY_ID: defaultAddress?.TERRITORY_ID
                              ? defaultAddress?.TERRITORY_ID
                              : 0,
                            CUSTOMER_ID: cartRes.data?.CART_INFO[0].CUSTOMER_ID,
                          };
                          this.apiservice
                            .updateAddressToUpdateCart(data)
                            .subscribe(
                              (successCode: any) => {
                                if (successCode.body.code === 200) {
                                  sessionStorage.setItem(
                                    'CurrentTerritory',
                                    defaultAddress?.TERRITORY_ID?.toString()
                                  );
                                  this.cartService.fetchAndUpdateCartDetails(
                                    this.userID
                                  );
                                  if (this.userID != 0 && this.userID != null && this.userID != undefined) {
                                    this.cartService.cartCount$.subscribe((count) => {
                                      this.cartCount = count;
                                    });
                                    this.cartService.fetchAndUpdateCartDetails(this.userID);
                                    this.getuserList();
                                    this.apiservice
                                      .getAddresses12data(
                                        0,
                                        0,
                                        'IS_DEFAULT',
                                        'desc',
                                        ' AND CUSTOMER_ID = ' + this.userID + ' AND IS_DEFAULT = 1',
                                        localStorage.getItem('token') || ' '
                                      )
                                      .subscribe((data) => {
                                        if (data['code'] === 200) {
                                          if (data['data'].length > 0) {
                                            const address = data['data'][0];
                                            localStorage.setItem('AddressLine1', address['ADDRESS_LINE_1']);
                                            localStorage.setItem('AddressLine2', address['ADDRESS_LINE_2']);
                                            localStorage.setItem('addressCity', address['CITY_NAME']);
                                            this.addressline1 = localStorage.getItem('AddressLine1');
                                            this.addressline2 = localStorage.getItem('AddressLine2');
                                            this.addressCity = localStorage.getItem('addressCity');
                                            this.mainaddress = this.addressCity
                                              ? this.addressCity
                                              : this.addressline1;
                                            var pincodeFor = address.PINCODE_FOR
                                            localStorage.setItem('pincodeFor', pincodeFor);
                                          }
                                          if (!this.addressline1) {
                                            this.isShopDisabled = false;
                                            this.isServiceDisabled = false;
                                          } else {
                                            this.isShopDisabled = !(pincodeFor == 'I' || pincodeFor == 'B');
                                            this.isServiceDisabled = !(pincodeFor == 'S' || pincodeFor == 'B');
                                          }
                                          this.TERRITORY_IDssss = data.data.map(
                                            (addressssss: any) => addressssss['TERRITORY_ID']
                                          );
                                          this.pincodeforrkey =
                                            pincodeFor == 'B'
                                              ? 'B'
                                              : pincodeFor == 'I'
                                                ? 'SP'
                                                : pincodeFor == 'S'
                                                  ? 'S'
                                                  : 'B';
                                          this.cartService.cartDetails$.subscribe((cartDetails) => {
                                            const itemType = cartDetails[0]?.ITEM_TYPE;
                                            if (!itemType) {
                                              this.cartCount = 0;
                                            } else if (
                                              (pincodeFor === 'S' && itemType !== 'S' && itemType !== 'B') ||
                                              (pincodeFor === 'I' && itemType !== 'P' && itemType !== 'B')
                                            ) {
                                              this.cartCount = 0;
                                            } else {
                                            }
                                          });
                                          if (
                                            window.location.href.split('/')[3] == 'privacy-policy' ||
                                            window.location.href.split('/')[3] == 'terms-and-conditions' ||
                                            window.location.href.split('/')[3] == 'contact-us'
                                          ) {
                                          } else {
                                            setTimeout(() => {
                                              let targetRoute = '/service';
                                              if (pincodeFor === 'S') {
                                              } else if (pincodeFor === 'I') {
                                              } else if (pincodeFor === 'B') {
                                              }
                                              if (this.router.url !== targetRoute) {
                                                this.router.navigate([targetRoute]);
                                              }
                                            }, 100);
                                          }
                                        }
                                      });
                                  }
                                } else if (successCode.body.code === 300) {
                                }
                              },
                              (error) => {
                                this.isConfirmLoading = false;
                                if (error.status === 300) {
                                  this.isConfirmLoading = false;
                                } else if (error.status === 500) {
                                  this.toastr.error(
                                    'An unexpected error occurred. Please try again later.',
                                    ''
                                  );
                                } else {
                                  this.isConfirmLoading = false;
                                  this.toastr.error(
                                    'An unknown error occurred. Please try again later.',
                                    ''
                                  );
                                }
                              }
                            );
                          this.loadAddresses = false;
                        },
                        error: (err) => {
                          this.loadAddresses = false;
                        },
                      });
                  } else {
                    sessionStorage.setItem(
                      'CurrentTerritory',
                      this.addressForm?.TERRITORY_ID?.toString()
                    );
                    if (this.userID != 0 && this.userID != null && this.userID != undefined) {
                      this.cartService.cartCount$.subscribe((count) => {
                        this.cartCount = count;
                      });
                      this.cartService.fetchAndUpdateCartDetails(this.userID);
                      this.getuserList();
                      this.apiservice
                        .getAddresses12data(
                          0,
                          0,
                          'IS_DEFAULT',
                          'desc',
                          ' AND CUSTOMER_ID = ' + this.userID + ' AND IS_DEFAULT = 1',
                          localStorage.getItem('token') || ' '
                        )
                        .subscribe((data) => {
                          if (data['code'] === 200) {
                            if (data['data'].length > 0) {
                              const address = data['data'][0];
                              localStorage.setItem('AddressLine1', address['ADDRESS_LINE_1']);
                              localStorage.setItem('AddressLine2', address['ADDRESS_LINE_2']);
                              localStorage.setItem('addressCity', address['CITY_NAME']);
                              this.addressline1 = localStorage.getItem('AddressLine1');
                              this.addressline2 = localStorage.getItem('AddressLine2');
                              this.addressCity = localStorage.getItem('addressCity');
                              this.mainaddress = this.addressCity
                                ? this.addressCity
                                : this.addressline1;
                              var pincodeFor = address.PINCODE_FOR
                              localStorage.setItem('pincodeFor', pincodeFor);
                            }
                            if (!this.addressline1) {
                              this.isShopDisabled = false;
                              this.isServiceDisabled = false;
                            } else {
                              this.isShopDisabled = !(pincodeFor == 'I' || pincodeFor == 'B');
                              this.isServiceDisabled = !(pincodeFor == 'S' || pincodeFor == 'B');
                            }
                            this.TERRITORY_IDssss = data.data.map(
                              (addressssss: any) => addressssss['TERRITORY_ID']
                            );
                            this.pincodeforrkey =
                              pincodeFor == 'B'
                                ? 'B'
                                : pincodeFor == 'I'
                                  ? 'SP'
                                  : pincodeFor == 'S'
                                    ? 'S'
                                    : 'B';
                            this.cartService.cartDetails$.subscribe((cartDetails) => {
                              const itemType = cartDetails[0]?.ITEM_TYPE;
                              if (!itemType) {
                                this.cartCount = 0;
                              } else if (
                                (pincodeFor === 'S' && itemType !== 'S' && itemType !== 'B') ||
                                (pincodeFor === 'I' && itemType !== 'P' && itemType !== 'B')
                              ) {
                                this.cartCount = 0;
                              } else {
                              }
                            });
                            if (
                              window.location.href.split('/')[3] == 'privacy-policy' ||
                              window.location.href.split('/')[3] == 'terms-and-conditions' ||
                              window.location.href.split('/')[3] == 'contact-us'
                            ) {
                            } else {
                            }
                          }
                        });
                    }
                    this.showContent = 'addressTab';
                  }
                },
                (error) => { }
              );
            } else {
              this.showContent = 'addressTab';
            }
            this.addressForm = {
              CUSTOMER_ID: 0,
              TERRITORY_ID: 0,
              IS_MAPPED_TO_TERRITORY: false,
              CUSTOMER_TYPE: 1,
              CONTACT_PERSON_NAME: '',
              MOBILE_NO: '',
              EMAIL_ID: '',
              ADDRESS_LINE_1: '',
              ADDRESS_LINE_2: '',
              COUNTRY_ID: 0,
              STATE_ID: 0,
              LANDMARK: '',
              CITY_ID: 0,
              CITY_NAME: '',
              PINCODE_ID: 0,
              ID: 0,
              PINCODE: '',
              DISTRICT_ID: 0,
              GEO_LOCATION: '',
              TYPE: 'H',
              IS_DEFAULT: false,
              CLIENT_ID: 0,
              STATUS: true,
              PINCODE_FOR: '',
            };
          } else if (successCode.body.code === 300) {
            this.isConfirmLoading = false;
          }
          this.isConfirmLoading = false;
        },
        (error) => {
          this.isConfirmLoading = false;
          this.isConfirmLoading = false;
          if (error.status === 300) {
            this.isConfirmLoading = false;
          } else if (error.status === 500) {
            this.toastr.error(
              'An unexpected error occurred. Please try again later.',
              ''
            );
          } else {
            this.isConfirmLoading = false;
            this.toastr.error(
              'An unknown error occurred. Please try again later.',
              ''
            );
          }
        }
      );
    } else {
      this.isConfirmLoading = true;
      this.apiservice.RegistrationCustomerAddress(this.addressForm).subscribe(
        (successCode: any) => {
          if (successCode.body.code === 200) {
            this.isConfirmLoading = false;
            this.toastr.success('Address has been saved successfully.', '');
            this.showAddressDetailsForm = false;
            if (successCode.body?.SUBSCRIBED_CHANNELS?.length > 0) {
              const channelNames = successCode.body.SUBSCRIBED_CHANNELS.map(
                (channel: any) => channel.CHANNEL_NAME
              );
              this.apiservice.subscribeToMultipleTopics(channelNames).subscribe(
                (successCode: any) => { },
                (error) => {
                  if (error.status === 300) {
                  } else if (error.status === 500) {
                    this.toastr.error(
                      'An unexpected error occurred. Please try again later.',
                      ''
                    );
                  } else {
                    this.isConfirmLoading = false;
                    this.toastr.error(
                      'An unknown error occurred. Please try again later.',
                      ''
                    );
                  }
                }
              );
            }
            if (this.addressForm.IS_DEFAULT) {
              this.apiservice.getCartDetails(this.userID).subscribe(
                (cartRes: any) => {
                  if (cartRes.data?.CART_DETAILS.length > 0) {
                    this.apiservice
                      .getAddresses1data(
                        0,
                        0,
                        'IS_DEFAULT',
                        'desc',
                        ' AND CUSTOMER_ID=' + this.userID + ' AND STATUS = 1'
                      )
                      .subscribe({
                        next: (data1: any) => {
                          this.addressData = data1.data;
                          const defaultAddress = this.addressData.find(
                            (addr: any) => addr.IS_DEFAULT === 1
                          );
                          const data = {
                            CART_ID: cartRes.data?.CART_DETAILS[0].CART_ID
                              ? cartRes.data?.CART_DETAILS[0].CART_ID
                              : 0,
                            ADDRESS_ID: cartRes.data?.CART_INFO[0].ADDRESS_ID,
                            TYPE: cartRes.data?.CART_INFO[0].TYPE,
                            OLD_TERRITORY_ID:
                              sessionStorage.getItem('CurrentTerritory'),
                            NEW_TERRITORY_ID: defaultAddress?.TERRITORY_ID
                              ? defaultAddress?.TERRITORY_ID
                              : 0,
                            CUSTOMER_ID: cartRes.data?.CART_INFO[0].CUSTOMER_ID,
                          };
                          this.apiservice
                            .updateAddressToUpdateCart(data)
                            .subscribe(
                              (successCode: any) => {
                                if (successCode.body.code === 200) {
                                  sessionStorage.setItem(
                                    'CurrentTerritory',
                                    defaultAddress?.TERRITORY_ID?.toString()
                                  );
                                  this.cartService.fetchAndUpdateCartDetails(
                                    this.userID
                                  );
                                  if (this.userID != 0 && this.userID != null && this.userID != undefined) {
                                    this.cartService.cartCount$.subscribe((count) => {
                                      this.cartCount = count;
                                    });
                                    this.cartService.fetchAndUpdateCartDetails(this.userID);
                                    this.getuserList();
                                    this.apiservice
                                      .getAddresses12data(
                                        0,
                                        0,
                                        'IS_DEFAULT',
                                        'desc',
                                        ' AND CUSTOMER_ID = ' + this.userID + ' AND IS_DEFAULT = 1',
                                        localStorage.getItem('token') || ' '
                                      )
                                      .subscribe((data) => {
                                        if (data['code'] === 200) {
                                          if (data['data'].length > 0) {
                                            const address = data['data'][0];
                                            localStorage.setItem('AddressLine1', address['ADDRESS_LINE_1']);
                                            localStorage.setItem('AddressLine2', address['ADDRESS_LINE_2']);
                                            localStorage.setItem('addressCity', address['CITY_NAME']);
                                            this.addressline1 = localStorage.getItem('AddressLine1');
                                            this.addressline2 = localStorage.getItem('AddressLine2');
                                            this.addressCity = localStorage.getItem('addressCity');
                                            this.mainaddress = this.addressCity
                                              ? this.addressCity
                                              : this.addressline1;
                                            var pincodeFor = address.PINCODE_FOR
                                            localStorage.setItem('pincodeFor', pincodeFor);
                                          }
                                          if (!this.addressline1) {
                                            this.isShopDisabled = false;
                                            this.isServiceDisabled = false;
                                          } else {
                                            this.isShopDisabled = !(pincodeFor == 'I' || pincodeFor == 'B');
                                            this.isServiceDisabled = !(pincodeFor == 'S' || pincodeFor == 'B');
                                          }
                                          this.TERRITORY_IDssss = data.data.map(
                                            (addressssss: any) => addressssss['TERRITORY_ID']
                                          );
                                          this.pincodeforrkey =
                                            pincodeFor == 'B'
                                              ? 'B'
                                              : pincodeFor == 'I'
                                                ? 'SP'
                                                : pincodeFor == 'S'
                                                  ? 'S'
                                                  : 'B';
                                          this.cartService.cartDetails$.subscribe((cartDetails) => {
                                            const itemType = cartDetails[0]?.ITEM_TYPE;
                                            if (!itemType) {
                                              this.cartCount = 0;
                                            } else if (
                                              (pincodeFor === 'S' && itemType !== 'S' && itemType !== 'B') ||
                                              (pincodeFor === 'I' && itemType !== 'P' && itemType !== 'B')
                                            ) {
                                              this.cartCount = 0;
                                            } else {
                                            }
                                          });
                                          if (
                                            window.location.href.split('/')[3] == 'privacy-policy' ||
                                            window.location.href.split('/')[3] == 'terms-and-conditions' ||
                                            window.location.href.split('/')[3] == 'contact-us'
                                          ) {
                                          } else {
                                          }
                                        }
                                      });
                                  }
                                } else if (successCode.body.code === 300) {
                                }
                              },
                              (error) => {
                                this.isConfirmLoading = false;
                                this.isConfirmLoading = false;
                                if (error.status === 300) {
                                  this.isConfirmLoading = false;
                                } else if (error.status === 500) {
                                  this.toastr.error(
                                    'An unexpected error occurred. Please try again later.',
                                    ''
                                  );
                                } else {
                                  this.isConfirmLoading = false;
                                  this.toastr.error(
                                    'An unknown error occurred. Please try again later.',
                                    ''
                                  );
                                }
                              }
                            );
                          this.loadAddresses = false;
                        },
                        error: (err) => {
                          this.loadAddresses = false;
                        },
                      });
                  } else {
                    sessionStorage.setItem(
                      'CurrentTerritory',
                      this.addressForm?.TERRITORY_ID?.toString()
                    );
                    this.showContent = 'addressTab';
                    if (this.userID != 0 && this.userID != null && this.userID != undefined) {
                      this.cartService.cartCount$.subscribe((count) => {
                        this.cartCount = count;
                      });
                      this.cartService.fetchAndUpdateCartDetails(this.userID);
                      this.getuserList();
                      this.apiservice
                        .getAddresses12data(
                          0,
                          0,
                          'IS_DEFAULT',
                          'desc',
                          ' AND CUSTOMER_ID = ' + this.userID + ' AND IS_DEFAULT = 1',
                          localStorage.getItem('token') || ' '
                        )
                        .subscribe((data) => {
                          if (data['code'] === 200) {
                            if (data['data'].length > 0) {
                              const address = data['data'][0];
                              localStorage.setItem('AddressLine1', address['ADDRESS_LINE_1']);
                              localStorage.setItem('AddressLine2', address['ADDRESS_LINE_2']);
                              localStorage.setItem('addressCity', address['CITY_NAME']);
                              this.addressline1 = localStorage.getItem('AddressLine1');
                              this.addressline2 = localStorage.getItem('AddressLine2');
                              this.addressCity = localStorage.getItem('addressCity');
                              this.mainaddress = this.addressCity
                                ? this.addressCity
                                : this.addressline1;
                              var pincodeFor = address.PINCODE_FOR
                              localStorage.setItem('pincodeFor', pincodeFor);
                            }
                            if (!this.addressline1) {
                              this.isShopDisabled = false;
                              this.isServiceDisabled = false;
                            } else {
                              this.isShopDisabled = !(pincodeFor == 'I' || pincodeFor == 'B');
                              this.isServiceDisabled = !(pincodeFor == 'S' || pincodeFor == 'B');
                            }
                            this.TERRITORY_IDssss = data.data.map(
                              (addressssss: any) => addressssss['TERRITORY_ID']
                            );
                            this.pincodeforrkey =
                              pincodeFor == 'B'
                                ? 'B'
                                : pincodeFor == 'I'
                                  ? 'SP'
                                  : pincodeFor == 'S'
                                    ? 'S'
                                    : 'B';
                            this.cartService.cartDetails$.subscribe((cartDetails) => {
                              const itemType = cartDetails[0]?.ITEM_TYPE;
                              if (!itemType) {
                                this.cartCount = 0;
                              } else if (
                                (pincodeFor === 'S' && itemType !== 'S' && itemType !== 'B') ||
                                (pincodeFor === 'I' && itemType !== 'P' && itemType !== 'B')
                              ) {
                                this.cartCount = 0;
                              } else {
                              }
                            });
                            if (
                              window.location.href.split('/')[3] == 'privacy-policy' ||
                              window.location.href.split('/')[3] == 'terms-and-conditions' ||
                              window.location.href.split('/')[3] == 'contact-us'
                            ) {
                            } else {
                            }
                          }
                        });
                    }
                  }
                },
                (error) => { }
              );
            } else {
              this.showContent = 'addressTab';
            }
            this.getAddressList();
          } else if (successCode.body.code === 300) {
            this.isConfirmLoading = false;
          }
          this.isConfirmLoading = false;
        },
        (error) => {
          this.isConfirmLoading = false;
          this.isConfirmLoading = false;
          if (error.status === 300) {
            this.isConfirmLoading = false;
          } else if (error.status === 500) {
            this.isConfirmLoading = false;
            this.toastr.error(
              'An unexpected error occurred. Please try again later.',
              ''
            );
          } else {
            this.isConfirmLoading = false;
            this.toastr.error(
              'An unknown error occurred. Please try again later.',
              ''
            );
          }
        }
      );
    }
  }
  saveAddress(form: NgForm): void {
    this.addressSubmitted = true;
    if (form.invalid) {
      return;
    }
    if (this.latitude && this.longitude) {
      this.addressForm.GEO_LOCATION = `${this.latitude},${this.longitude}`;
    }
    this.isConfirmLoading = true;
    this.addressForm.CUSTOMER_TYPE = 1;
    this.addressForm.CUSTOMER_ID = this.userID;
    this.addressForm.MOBILE_NO = this.userMobile;
    this.addressForm.ADDRESS_LINE_1 = this.addressForm.ADDRESS_LINE_1;
    this.addressForm.CUSTOMER_TYPE = 1;
    this.addressForm.CONTACT_PERSON_NAME = this.userNAME;
    this.addressForm.STATUS = true;
    if (this.addressForm.TYPE == 'Home') {
      this.addressForm.TYPE = 'H';
    } else if (this.addressForm.TYPE == 'Work') {
      this.addressForm.TYPE = 'F';
    } else if (this.addressForm.TYPE == 'Other') {
      this.addressForm.TYPE = 'O';
    }
    if (this.addressForm.ID) {
      this.isConfirmLoading = true;
      this.addressForm.TERRITORY_ID = this.addressForm.TERRITORY_ID
        ? this.addressForm.TERRITORY_ID
        : 0;
      this.apiservice.updateCustomerAddress(this.addressForm).subscribe(
        (successCode: any) => {
          if (successCode.body.code === 200) {
            this.isConfirmLoading = false;
            this.toastr.success('Address has been updated successfully', '');
            this.showAddressDetailsForm = false;
            this.getAddressList();
            if (successCode.body?.SUBSCRIBED_CHANNELS?.length > 0) {
              const channelNames = successCode.body.SUBSCRIBED_CHANNELS.map(
                (channel: any) => channel.CHANNEL_NAME
              );
              this.apiservice.subscribeToMultipleTopics(channelNames).subscribe(
                (successCode: any) => { },
                (error) => {
                  if (error.status === 500) {
                    this.toastr.error('An unexpected error occurred. Please try again later.', '');
                  } else {
                    this.isConfirmLoading = false;
                    this.toastr.error('An unknown error occurred. Please try again later.', '');
                  }
                }
              );
            }
            if (this.addressForm.IS_DEFAULT) {
              this.apiservice.getCartDetails(this.userID).subscribe(
                (cartRes: any) => {
                  if (cartRes.data?.CART_DETAILS.length > 0) {
                    this.apiservice
                      .getAddresses1data(0, 0, 'IS_DEFAULT', 'desc',
                        ' AND CUSTOMER_ID=' + this.userID + ' AND STATUS = 1')
                      .subscribe({
                        next: (data1: any) => {
                          this.addressData = data1.data;
                          const defaultAddress = this.addressData.find(
                            (addr: any) => addr.IS_DEFAULT === 1
                          );
                          localStorage.setItem('pincodeFor', defaultAddress?.PINCODE_FOR);
                          const cartUpdateData = {
                            CART_ID: cartRes.data?.CART_DETAILS[0].CART_ID,
                            ADDRESS_ID: cartRes.data?.CART_INFO[0].ADDRESS_ID,
                            TYPE: cartRes.data?.CART_INFO[0].TYPE,
                            OLD_TERRITORY_ID: sessionStorage.getItem('CurrentTerritory'),
                            NEW_TERRITORY_ID: defaultAddress?.TERRITORY_ID
                              ? defaultAddress?.TERRITORY_ID : 0,
                            CUSTOMER_ID: cartRes.data?.CART_INFO[0].CUSTOMER_ID,
                          };
                          this.apiservice.updateAddressToUpdateCart(cartUpdateData).subscribe(
                            (successCode: any) => {
                              if (successCode.body.code === 200) {
                                sessionStorage.setItem(
                                  'CurrentTerritory',
                                  defaultAddress?.TERRITORY_ID?.toString()
                                );
                                this.cartService.fetchAndUpdateCartDetails(this.userID);
                                this.refreshHeaderData();
                                this.getAddressList();
                                this.showContent = 'addressTab';
                              }
                            },
                            (error) => {
                              this.isConfirmLoading = false;
                              if (error.status === 500) {
                                this.toastr.error('An unexpected error occurred. Please try again later.', '');
                              } else {
                                this.isConfirmLoading = false;
                                this.toastr.error('An unknown error occurred. Please try again later.', '');
                              }
                            }
                          );
                          this.loadAddresses = false;
                        },
                        error: (err) => {
                          this.loadAddresses = false;
                        },
                      });
                  } else {
                    sessionStorage.setItem(
                      'CurrentTerritory',
                      this.addressForm?.TERRITORY_ID?.toString()
                    );
                    this.cartService.fetchAndUpdateCartDetails(this.userID);
                    this.refreshHeaderData();
                    this.getAddressList();
                    this.showContent = 'addressTab';
                  }
                },
                (error) => { }
              );
            } else {
              this.showContent = 'addressTab';
            }
            this.addressForm = {
              CUSTOMER_ID: 0,
              TERRITORY_ID: 0,
              IS_MAPPED_TO_TERRITORY: false,
              CUSTOMER_TYPE: 1,
              CONTACT_PERSON_NAME: '',
              MOBILE_NO: '',
              EMAIL_ID: '',
              ADDRESS_LINE_1: '',
              ADDRESS_LINE_2: '',
              COUNTRY_ID: 0,
              STATE_ID: 0,
              LANDMARK: '',
              CITY_ID: 0,
              CITY_NAME: '',
              PINCODE_ID: 0,
              ID: 0,
              PINCODE: '',
              DISTRICT_ID: 0,
              GEO_LOCATION: '',
              TYPE: 'H',
              IS_DEFAULT: false,
              CLIENT_ID: 0,
              STATUS: true,
              PINCODE_FOR: '',
            };
          } else if (successCode.body.code === 300) {
            this.isConfirmLoading = false;
          }
          this.isConfirmLoading = false;
        },
        (error) => {
          this.isConfirmLoading = false;
          if (error.status === 500) {
            this.toastr.error('An unexpected error occurred. Please try again later.', '');
          } else {
            this.isConfirmLoading = false;
            this.toastr.error('An unknown error occurred. Please try again later.', '');
          }
        }
      );
    } else {
      this.isConfirmLoading = true;
      this.apiservice.RegistrationCustomerAddress(this.addressForm).subscribe(
        (successCode: any) => {
          if (successCode.body.code === 200) {
            this.isConfirmLoading = false;
            this.toastr.success('Address has been saved successfully.', '');
            this.showAddressDetailsForm = false;
            if (successCode.body?.SUBSCRIBED_CHANNELS?.length > 0) {
              const channelNames = successCode.body.SUBSCRIBED_CHANNELS.map(
                (channel: any) => channel.CHANNEL_NAME
              );
              this.apiservice.subscribeToMultipleTopics(channelNames).subscribe(
                (successCode: any) => { },
                (error) => {
                  if (error.status === 500) {
                    this.toastr.error('An unexpected error occurred. Please try again later.', '');
                  } else {
                    this.isConfirmLoading = false;
                    this.toastr.error('An unknown error occurred. Please try again later.', '');
                  }
                }
              );
            }
            if (this.addressForm.IS_DEFAULT) {
              this.apiservice.getCartDetails(this.userID).subscribe(
                (cartRes: any) => {
                  if (cartRes.data?.CART_DETAILS.length > 0) {
                    this.apiservice
                      .getAddresses1data(0, 0, 'IS_DEFAULT', 'desc',
                        ' AND CUSTOMER_ID=' + this.userID + ' AND STATUS = 1')
                      .subscribe({
                        next: (data1: any) => {
                          this.addressData = data1.data;
                          const defaultAddress = this.addressData.find(
                            (addr: any) => addr.IS_DEFAULT === 1
                          );
                          const cartUpdateData = {
                            CART_ID: cartRes.data?.CART_DETAILS[0].CART_ID
                              ? cartRes.data?.CART_DETAILS[0].CART_ID : 0,
                            ADDRESS_ID: cartRes.data?.CART_INFO[0].ADDRESS_ID,
                            TYPE: cartRes.data?.CART_INFO[0].TYPE,
                            OLD_TERRITORY_ID: sessionStorage.getItem('CurrentTerritory'),
                            NEW_TERRITORY_ID: defaultAddress?.TERRITORY_ID
                              ? defaultAddress?.TERRITORY_ID : 0,
                            CUSTOMER_ID: cartRes.data?.CART_INFO[0].CUSTOMER_ID,
                          };
                          this.apiservice.updateAddressToUpdateCart(cartUpdateData).subscribe(
                            (successCode: any) => {
                              if (successCode.body.code === 200) {
                                sessionStorage.setItem(
                                  'CurrentTerritory',
                                  defaultAddress?.TERRITORY_ID?.toString()
                                );
                                this.cartService.fetchAndUpdateCartDetails(this.userID);
                                this.refreshHeaderData();
                                this.getAddressList();
                                this.showContent = 'addressTab';
                              }
                            },
                            (error) => {
                              this.isConfirmLoading = false;
                              if (error.status === 500) {
                                this.toastr.error('An unexpected error occurred. Please try again later.', '');
                              } else {
                                this.isConfirmLoading = false;
                                this.toastr.error('An unknown error occurred. Please try again later.', '');
                              }
                            }
                          );
                          this.loadAddresses = false;
                        },
                        error: (err) => {
                          this.loadAddresses = false;
                        },
                      });
                  } else {
                    sessionStorage.setItem(
                      'CurrentTerritory',
                      this.addressForm?.TERRITORY_ID?.toString()
                    );
                    this.cartService.fetchAndUpdateCartDetails(this.userID);
                    this.refreshHeaderData();
                    this.getAddressList();
                    this.showContent = 'addressTab';
                  }
                },
                (error) => { }
              );
            } else {
              this.showContent = 'addressTab';
            }
            this.getAddressList();
          } else if (successCode.body.code === 300) {
            this.isConfirmLoading = false;
          }
          this.isConfirmLoading = false;
        },
        (error) => {
          this.isConfirmLoading = false;
          if (error.status === 500) {
            this.isConfirmLoading = false;
            this.toastr.error('An unexpected error occurred. Please try again later.', '');
          } else {
            this.isConfirmLoading = false;
            this.toastr.error('An unknown error occurred. Please try again later.', '');
          }
        }
      );
    }
  }
  registrationSubmitted: any;
  onLanguageChange(data: any) { }
  filterState(data: any) { }
  editProfileDetails() { }
  searchKeyword: string = '';
  showOptionsList: boolean = false;
  optionsList: any[] = [];
  filteredOptions: any[] = [...this.optionsList];
  filterOptions() {
    if (!this.optionsList) {
      this.optionsList = [];
    }
    if (
      this.searchKeyword != null &&
      this.searchKeyword != '' &&
      this.searchKeyword != undefined
    ) {
      if (this.optionsList.length === 0) {
        this.getServiceData();
        this.showOptionsList = true;
        return;
      }
      const keyword = this.searchKeyword.trim().toLowerCase();
      this.filteredOptions = this.optionsList
        .map((category) => ({
          ...category,
          MATCHED_RECORDS: (category.MATCHED_RECORDS ?? []).filter(
            (record: any) =>
              record?.TITLE?.toLowerCase().includes(keyword) ||
              record?.CATEGORY?.toLowerCase().includes(keyword) ||
              record?.DATA?.CATEGORY_NAME?.toLowerCase().includes(keyword) ||
              record?.DATA?.SUB_CATEGORY_NAME?.toLowerCase().includes(keyword)
          ),
        }))
        .filter((category) => category.MATCHED_RECORDS.length > 0);
    } else {
      if (this.optionsList.length == 0) {
        this.getServiceData();
      } else {
        this.filteredOptions = this.optionsList;
      }
    }
    this.showOptionsList = true;
  }
  selectOption(option: any, event: boolean = false) {
    this.searchKeyword = option.TITLE;
    this.showOptionsList = false;
    if (option.CATEGORY == 'Category') {
      var filterid = option['DATA']['ID'];
      sessionStorage.setItem('categoryidforsearch', filterid);
    } else if (option.CATEGORY == 'SubCategory') {
      var filterid = option['DATA']['CATEGORY_ID'];
      sessionStorage.setItem('categoryidforsearch', filterid);
    } else if (option.CATEGORY == 'Service') {
      var filterid = option['DATA']['CATEGORY_ID'];
      var filterid2 = option['DATA']['ID'];
      sessionStorage.setItem('categoryidforsearch', filterid);
      sessionStorage.setItem('categoryidforsearch22', filterid2);
    }
    sessionStorage.setItem('brandid', '');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/services']);
    });
  }
  pageindexxx: any;
  pageSize20: any;
  selectedType: string = 'All';
  opennotification() {
    if (this.userID == 0) {
    } else {
      this.selectedType = 'All';
      this.pageindexxx = 1;
      this.pageSize20 = 20;
      this.notificationloader = true;
      const subscribedChannels = JSON.parse(this.subscribedChannels);
      var channelNames = subscribedChannels.map(
        (channel: any) => "'" + channel.CHANNEL_NAME + "'"
      );
      sessionStorage.setItem('megrecived', 'no');
      var channelfilt1 = '';
      if (channelNames && channelNames.length > 0) {
        channelfilt1 = ` OR (TOPIC_NAME IN (${channelNames}) AND MEMBER_ID=${this.userID})`;
      }
      this.apiservice
        .getnotifications(
          1,
          20,
          '',
          'desc',
          ` AND (TYPE='C' AND MEMBER_ID=${this.userID}) ` + channelfilt1
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response.status == 200) {
              if (response.body.data.length > 0) {
                this.notificationdata = response.body.data;
                this.notificationdata.sort(
                  (a: any, b: any) =>
                    new Date(b.CREATED_MODIFIED_DATE).getTime() -
                    new Date(a.CREATED_MODIFIED_DATE).getTime()
                );
                this.tempCount = response.body.count;
              } else {
                this.notificationdata = [];
                this.tempCount = 0;
              }
              this.notificationloader = false;
            } else {
              this.notificationdata = [];
              this.notificationloader = false;
            }
          },
          (error: any) => { }
        );
    }
  }
  filterNotifications(type: string): void {
    this.selectedType = type;
    this.pageindexxx = 1;
    this.notificationloader = true;
    const subscribedChannels = JSON.parse(this.subscribedChannels);
    const channelNames = subscribedChannels.map(
      (channel: any) => `'${channel.CHANNEL_NAME}'`
    );
    let filterQuery = `AND MEMBER_ID=${this.userID}`;
    if (type !== 'All') {
      if (type === 'J') {
        filterQuery += ` AND NOTIFICATION_TYPE IN ('J', 'JC')`;
      }
      else if (type === 'IR') {
        filterQuery += ` AND NOTIFICATION_TYPE='J' AND MEDIA_TYPE = 'IR'`;
      }
      else {
        filterQuery += ` AND NOTIFICATION_TYPE='${type}'`;
      }
    }
    this.apiservice
      .getnotifications(
        this.pageindexxx,
        this.pageSize20,
        '',
        'desc',
        filterQuery
      )
      .subscribe((response: HttpResponse<any>) => {
        if (response.status == 200) {
          this.notificationdata = response.body.data || [];
          this.tempCount = response.body.count || 0;
        } else {
          this.notificationdata = [];
        }
        this.notificationloader = false;
      });
  }
  tempCount: any;
  getnotificationonscroll(event: any) {
    if (this.notificationloader == false) {
      const scrollContainer = event.target;
      this.notificationloader = true;
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 20
      ) {
        if (this.tempCount == this.notificationdata.length) {
          this.notificationloader = false;
        } else {
          const subscribedChannels = JSON.parse(
            this.apiservice.getsubscribedChannels()
          );
          var channelNames = subscribedChannels.map(
            (channel: any) => "'" + channel.CHANNEL_NAME + "'"
          );
          let filterQuery = '';
          if (this.selectedType !== 'All') {
            filterQuery += ` AND NOTIFICATION_TYPE='${this.selectedType}'`;
          }
          var channelfilt = '';
          if (channelNames && channelNames.length > 0) {
            channelfilt = ` AND TOPIC_NAME IN (${channelNames})`;
          }
          this.pageindexxx++;
          this.apiservice
            .getnotifications(
              this.pageindexxx,
              this.pageSize20,
              '',
              'desc',
              ` AND TYPE='C' AND MEMBER_ID=${this.userID} ` + channelfilt +
              filterQuery
            )
            .subscribe(
              (response: HttpResponse<any>) => {
                if (response.status == 200) {
                  const newData = response.body.data;
                  this.tempCount = response.body.count;
                  this.notificationloader = false;
                  this.notificationdata = [
                    ...this.notificationdata,
                    ...newData,
                  ];
                } else {
                  this.notificationdata = [];
                  this.notificationloader = false;
                }
              },
              (error: any) => { }
            );
        }
      } else {
        this.notificationloader = false;
      }
    }
  }
  private previousDate: string = '';
  shouldShowDateHeader(currentDateStr: string, index: number): boolean {
    const currentDate = this.datePipe.transform(currentDateStr, 'yyyy-MM-dd');
    let showHeader = false;
    if (index === 0) {
      this.previousDate = currentDate || '';
      showHeader = true;
    } else {
      const prevDate = this.datePipe.transform(
        this.notificationdata[index - 1].CREATED_MODIFIED_DATE,
        'yyyy-MM-dd'
      );
      if (currentDate !== prevDate) {
        showHeader = true;
        this.previousDate = currentDate || '';
      }
    }
    return showHeader;
  }
  getDateHeader(dateStr: string): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const notificationDate = new Date(dateStr);
    const formattedNotificationDate = this.datePipe.transform(
      notificationDate,
      'MMM d, y'
    );
    if (
      this.datePipe.transform(notificationDate, 'yyyy-MM-dd') ===
      this.datePipe.transform(today, 'yyyy-MM-dd')
    ) {
      return 'TODAY - ' + formattedNotificationDate?.toUpperCase();
    } else if (
      this.datePipe.transform(notificationDate, 'yyyy-MM-dd') ===
      this.datePipe.transform(yesterday, 'yyyy-MM-dd')
    ) {
      return 'YESTERDAY - ' + formattedNotificationDate?.toUpperCase();
    } else {
      return formattedNotificationDate?.toUpperCase() || 'OLDER';
    }
  }
  getNotificationIcon(data: any): string {
    const title = data.TITLE?.toLowerCase() || '';
    if (title.includes('order')) {
      if (
        title.includes('placed successfully') ||
        title.includes('order placed') ||
        title.includes('order has been placed')
      ) return 'bi bi-clipboard-check';
      if (title.includes('accepted')) return 'bi bi-clipboard2-check';
      if (title.includes('packaged')) return 'bi bi-box-seam';
      if (title.includes('dispatched')) return 'bi bi-truck';
      if (title.includes('out for delivery')) return 'bi bi-truck';
      if (title.includes('sent for pickup')) return 'bi bi-box-arrow-in-up';
      if (
        title.includes('label generated') ||
        title.includes('Label') ||
        title.includes('shipping label') ||
        title.includes('placed in shiprocket')
      ) return 'bi bi-barcode';
      return 'bi bi-file-earmark-text';
    }
    if (title.includes('job')) {
      if (title.includes('completed')) return 'bi bi-check-circle';
      if (title.includes('scheduled')) return 'bi bi-calendar-check';
      if (title.includes('technician has arrived')) return 'bi bi-geo-alt';
      if (title.includes('created')) return 'bi bi-person-workspace';
      return 'bi bi-briefcase';
    }
    if (title.includes('inventory') || title.includes('payment')) {
      if (title.includes('payment request') || title.includes('payment status updated')) return 'bi bi-currency-rupee';
      if (title.includes('low stock alert')) return 'bi bi-exclamation-triangle';
      return 'bi bi-box';
    }
    if (title.includes('happy code')) {
      return 'bi bi-key';
    }
    if (title.includes('shop')) {
      return 'bi bi-shop';
    }
    if (title.includes('ticket')) {
      return 'bi bi-ticket-perforated';
    }
    if (title.includes('feedback')) {
      return 'bi bi-chat-dots';
    }
    return 'bi bi-bell';
  }
  getNotificationIconClass(data: any): string {
    const title = data.TITLE?.toLowerCase() || '';
    if (title.includes('order')) {
      return 'icon-order';
    }
    if (title.includes('job')) {
      if (title.includes('completed')) return 'icon-completed';
      if (title.includes('technician has arrived')) return 'icon-arrival';
      return 'icon-job';
    }
    if (title.includes('inventory') || title.includes('payment')) {
      if (title.includes('payment request') || title.includes('payment status updated')) return 'icon-payment';
      if (title.includes('low stock alert')) return 'icon-alert';
      return 'icon-inventory';
    }
    if (title.includes('happy code')) {
      return 'icon-code';
    }
    if (title.includes('shop')) {
      return 'icon-shop';
    }
    if (title.includes('ticket')) {
      return 'icon-ticket';
    }
    if (title.includes('feedback')) {
      return 'icon-feedback';
    }
    return 'icon-default';
  }
  orders: any = [];
  selectedTab: 'current' | 'past' = 'current';
  loading: boolean = false;
  Shoporders: any[] = [];
  openOrdersModal() {
    this.showContent = 'myorder';
    this.switchTab('current');
  }
  // Profile-menu path: clear the bottom-nav flag so the back button
  // returns to the profile rather than unwinding to home.
  openOrdersModalFromProfile() {
    this.ordersOpenedFromBottomNav = false;
    this.openOrdersModal();
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  goToOrderDetails(orderId: string) {
    this.isMobileMenuOpen = false;
    this.ordersOverlay.setOpen(false);
    this.gotoProfile();
    document.body.classList.remove('modal-open');
    // Mark this navigation as "from the orders drawer" so the order-details
    // back button can reopen the drawer instead of dropping us on home.
    sessionStorage.setItem('pockit.reopenOrdersDrawerOnBack', '1');
    // Loader veils the drawer-close transition + target page's initial
    // data fetch so the user doesn't see home flash between them.
    this.loaderService.showLoader();
    this.router.navigate(['/order-details', orderId]).then(() => {
      Promise.resolve().then(() => this.loaderService.hideLoader());
    });
  }
  openIndex: number | null = null;
  toggleFAQ(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
  isLargeScreen = true;
  showMobileSearch = false;
  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
  }
  @HostListener('window:resize', [])
  updateScreenSize() {
    this.isLargeScreen = window.innerWidth >= 768;
    if (this.isLargeScreen) {
      this.showMobileSearch = false;
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.showStateDropdown = false;
    this.showPincodeDropdown = false;
  }
  goToOrderShopDetails(orderId: string) {
    this.isMobileMenuOpen = false;
    this.ordersOverlay.setOpen(false);
    this.gotoProfile();
    document.body.classList.remove('modal-open');
    sessionStorage.setItem('pockit.reopenOrdersDrawerOnBack', '1');
    this.loaderService.showLoader();
    this.router.navigate(['/shop/order_details', orderId]).then(() => {
      Promise.resolve().then(() => this.loaderService.hideLoader());
    });
  }
  switchTab(tab: 'current' | 'past') {
    this.selectedTab = tab;
    this.loading = true;
    if (tab === 'current') {
      this.apiservice
        .getorderData(0, 0, 'id', 'desc', ` AND CUSTOMER_ID = ${this.userID}`)
        .subscribe(
          (data) => {
            if (data?.code === 200) {
              this.orders = data.data;
              const completedOrders = this.orders.filter(
                (order: any) => order.ORDER_STATUS?.trim()?.toUpperCase() === 'CO'
              );
              if (completedOrders.length > 0) {
                const technicianDataStr = sessionStorage.getItem('TECHNICIAN_DATA');
                if (!technicianDataStr) {
                  console.log(' No technician data in session.');
                }
                let decryptedText = '';
                let technicianData = [];
                if (technicianDataStr) {
                  if (technicianDataStr.startsWith('U2FsdGVk')) {
                    decryptedText = this.commonFunction.decryptdata(technicianDataStr);
                  } else {
                    decryptedText = technicianDataStr;
                  }
                  technicianData = JSON.parse(decryptedText) || [];
                  if (!Array.isArray(technicianData)) {
                    technicianData = [];
                  }
                  completedOrders.forEach((completed: any) => {
                    technicianData = technicianData.filter(
                      (tech: any) => tech.ORDER_NO !== completed.ORDER_NUMBER
                    );
                  });
                  const encrypted = this.commonFunction.encryptdata(
                    JSON.stringify(technicianData)
                  );
                  sessionStorage.setItem('TECHNICIAN_DATA', encrypted);
                }
              }
            }
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          }
        );
    } else {
      this.orders = [];
      this.apiservice
        .getShoporderData(
          0,
          0,
          'id',
          'desc',
          ` AND CUSTOMER_ID = ${this.userID}`
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            if (
              response.status === 200 &&
              response.body &&
              response.body.data
            ) {
              this.loading = false;
              this.Shoporders = response.body.data;
            } else {
              this.Shoporders = [];
              this.message.error(`Something went wrong.`, '');
              this.loading = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.loading = false;
            if (err.status === 0) {
              this.message.error(
                'Network error: Please check your internet connection.',
                ''
              );
            } else {
              this.message.error(
                `HTTP Error: ${err.status}. Something Went Wrong.`,
                ''
              );
            }
          }
        );
    }
  }
  manageTickets() {
    this.showDrawer();
  }
  isDrawerVisible = false;
  showDrawer() {
    this.isDrawerVisible = true;
  }
  selectedDevice: any = null;
  isActionDrawerOpen123 = false;
  isDrawerOpen123 = false;
  KnowledgeBaseCategory: any = [];
  KnowledgeBase: any = [];
  openServiceDrawer() {
    const offcanvas = new bootstrap.Offcanvas(
      document.getElementById('isServiceDrawerOpen123')!
    );
    offcanvas.show();
    this.isActionDrawerOpen123 = false;
    this.isDrawerOpen123 = false;
    this.getKBCategory();
  }
  closeDrawer() {
    this.isActionDrawerOpen123 = false;
    this.isDrawerOpen123 = false;
  }
  openLoginModal() {
    this.message.info('Please login as a customer');
  }
  getKBCategory() {
    this.loading123 = true;
    this.apiservice.getKnowledgeBaseCategory(0, 0, 'id', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        if (response.status == 200) {
          this.KnowledgeBaseCategory = response.body.data;
          this.loading123 = false;
        } else {
          this.loading123 = false;
        }
      },
      (error: any) => {
        this.loading123 = false;
      }
    );
  }
  KnowledgeBaseSubCategory: any = [];
  isCategoryVisible: boolean = true;
  isSubCategoryVisible: boolean = false;
  isKBvisible: boolean = false;
  loading123: boolean = false;
  getsubcategory(data: any) {
    this.loading123 = true;
    this.getKBSubCategory(data);
    this.isCategoryVisible = false;
  }
  getKB(data: any) {
    this.getAllKB(data);
    this.loading123 = true;
  }
  getKBSubCategory(data: any) {
    this.apiservice
      .getKnowledgeBaseSubCategory(
        0,
        0,
        'id',
        'desc',
        ' AND KNOWLEDGEBASE_CATEGORY_ID = ' + data.ID
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status == 200) {
            this.KnowledgeBaseSubCategory = response.body.data;
            this.isSubCategoryVisible = true;
            this.loading123 = false;
          } else {
          }
        },
        (error: any) => { }
      );
  }
  downloadDocument(link: string): void {
    if (!link) {
      return;
    }
    var newlink = 'KnowledgeBaseDoc/' + link;
    this.apiservice.downloadFile(newlink).subscribe(
      (response: Blob) => {
        if (!response || response.size === 0) {
          return;
        }
        const fileName = link.split('/').pop() || 'downloaded-file';
        const mimeType = response.type || this.getMimeType(fileName);
        const blob = new Blob([response], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => { }
    );
  }
  isTextOverflowing(element: HTMLElement): boolean {
    return element.scrollWidth > element.clientWidth;
  }
  getMimeType(fileName: string): string {
    const extension: any = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      csv: 'text/csv',
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
      mp3: 'audio/mpeg',
      mp4: 'video/mp4',
      json: 'application/json',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }
  getAllKB(data: any) {
    this.apiservice
      .getKnowledgeBase(
        0,
        0,
        'id',
        'desc',
        ' AND KNOWLEDGEBASE_CATEGORY_ID = ' + data.ID
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status == 200) {
            this.KnowledgeBase = response.body.data;
            this.loading123 = false;
            this.isSubCategoryVisible = false;
            this.isKBvisible = true;
          } else {
          }
        },
        (error: any) => { }
      );
  }
  backtoSubCategory() {
    this.isSubCategoryVisible = true;
    this.isKBvisible = false;
    this.isCategoryVisible = false;
  }
  backtoCategory() {
    this.isCategoryVisible = true;
    this.isKBvisible = false;
    this.isSubCategoryVisible = false;
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
      }
    }, 300);
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  closemodelllllll() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    this.ordersOverlay.setOpen(false);
  }
  notificationdata: any = [];
  notificationloader: boolean = false;
  urllll = this.apiservice.retriveimgUrl;
  toggleOptionsList() {
    this.showOptionsList = true;
  }
  onblurclick() {
    setTimeout(() => {
      this.showOptionsList = false;
    }, 500);
  }
  isFAQDrawerVisible = false;
  openHelpandSupport() {
    this.isFAQDrawerVisible = true;
    setTimeout(() => {
      const faqDrawer = document.getElementById('offcanvasFAQ');
      if (faqDrawer) {
        const offcanvasInstance = new bootstrap.Offcanvas(faqDrawer);
        offcanvasInstance.show();
      }
    }, 100);
  }
  @ViewChild('closefaq') closefaq!: any;
  FAQdrawerClose() {
    this.closefaq.nativeElement.click();
    this.isFAQDrawerVisible = false;
  }
  get FAQcloseCallback() {
    return this.FAQdrawerClose.bind(this);
  }
  isLanguageDrawerVisible: boolean = false;
  LanguagedrawerClose() {
    this.isLanguageDrawerVisible = false;
    setTimeout(() => {
      const serviceDrawer = document.getElementById('offcanvasRight11');
      if (serviceDrawer) {
        const offcanvasInstance =
          bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
    }, 300);
  }
  get LanguagecloseCallback() {
    return this.LanguagedrawerClose.bind(this);
  }
  AboutdrawerClose() {
    this.isAboutDrawerVisible = false;
    setTimeout(() => {
      const serviceDrawer = document.getElementById('offcanvasRight11');
      if (serviceDrawer) {
        const offcanvasInstance =
          bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
    }, 300);
  }
  get aboutcloseCallback() {
    return this.AboutdrawerClose.bind(this);
  }
  openprofileModal() {
    const modal = document.getElementById('photoModal')!;
    // flex (not block) so the CSS centering on #photoModal.modal kicks in
    // without needing !important — which was blocking closeModal() from
    // hiding the dialog.
    modal.style.display = 'flex';
    // Intentionally NOT adding 'modal-open' to body — the footer's bottom
    // nav hides itself whenever body.modal-open is present, and we want
    // the nav to stay visible while the small photo picker is on screen.
  }
  closeModal() {
    const modal = document.getElementById('photoModal')!;
    modal.style.display = 'none';
  }
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef;
  ngAfterViewInit() {
    this.videoElement = this.videoElement?.nativeElement;
    this.canvasElement = this.canvasElement?.nativeElement;
  }
  capturedImage: string | null = null;
  isCapturePhotoModalOpen: boolean = false;
  private stream!: MediaStream;
  openCamera() {
    // Close the outer "Select Photo" picker so the camera modal doesn't
    // stack on top of it.
    this.closeModal();
    this.isCapturePhotoModalOpen = true;
    const modal = document.getElementById('CapturePhotoModal')!;
    // flex + inline style. CSS forces opacity/transform so Bootstrap's
    // default invisible-until-.show state doesn't freeze the screen.
    // Intentionally NOT toggling body.modal-open (keeps the bottom nav).
    modal.style.display = 'flex';
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        this.stream = stream;
        const video = this.videoElement.nativeElement;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => console.error('Error accessing camera:', err));
  }
  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Close both modals and stop the camera stream right away so the user
    // immediately sees the avatar updating in the background.
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    this.closeCapturePhotoModal();
    this.closeModal();

    // Remember the current preview so we can roll back on upload failure.
    const previousPreview = this.imagePreview;

    // Downscale the captured frame to JPEG (smaller + no alpha) so we stay
    // within the server's size limit and the preview swap is fast.
    const MAX_DIMENSION = 1024;
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(canvas.width, canvas.height)
    );
    let uploadCanvas: HTMLCanvasElement = canvas;
    if (scale < 1) {
      uploadCanvas = document.createElement('canvas');
      uploadCanvas.width = Math.round(canvas.width * scale);
      uploadCanvas.height = Math.round(canvas.height * scale);
      const uctx = uploadCanvas.getContext('2d');
      if (uctx) uctx.drawImage(canvas, 0, 0, uploadCanvas.width, uploadCanvas.height);
    }

    // Optimistic preview from the local data URL — avatar fills instantly.
    this.capturedImage = uploadCanvas.toDataURL('image/jpeg', 0.85);
    this.imagePreview = this.capturedImage;

    uploadCanvas.toBlob(
      (blob: any) => {
        if (!blob) {
          this.message.error("Couldn't process the captured image.", '');
          this.imagePreview = previousPreview ?? null;
          return;
        }
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const dateStr = this.datePipe.transform(new Date(), 'yyyyMMdd');
        const filename = `${dateStr}${randomNum}.jpg`;
        this.userData.PROFILE_PHOTO = filename;
        this.uploadImage(blob, filename, previousPreview);
      },
      'image/jpeg',
      0.85
    );
  }
  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
  clearCanvasAndVideo() {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const video = this.videoElement.nativeElement;
    if (video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    this.capturedImage = '';
    this.isCapturePhotoModalOpen = false;
  }
  closeCapturePhotoModal() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    this.isCapturePhotoModalOpen = false;
    this.capturedImage = null;
    const modal = document.getElementById('CapturePhotoModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  viewattachmenttt(eventt: any) {
    window.open(
      this.apiservice.retriveimgUrl + 'notificationAttachment/' + eventt
    );
  }
  gotoProfile123() {
    this.showContent = 'normal';
    this.isActionDrawerOpen123 = false;
    this.isDrawerOpen123 = false;
  }
  activeIndex: number | null = null;
  toggleAccordion(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
  sanitizeDescription(description: string): SafeHtml {
    if (description.startsWith('"') && description.endsWith('"')) {
      description = description.slice(1, -1);
    }
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
  togglePincodeDropdown123(pincode: string) {
    this.filteredPincodes = this.pincodeData.filter(
      (p: any) => p.PINCODE === pincode
    );
  }
  deleteAddress(addressId: number) {
    this.apiservice.DeleteAddress(this.userID, addressId).subscribe(
      (res) => {
        if (res.code === 200) {
          this.message.success('Address deleted successfully.', '');
          this.getAddressList();
        } else {
          this.message.error('Address deleted successfully.', '');
        }
      },
      (error) => {
        this.message.error('Failed to Delete Address.', '');
      }
    );
  }
  isAccordionOpenStatus = false;
  expandedOrderId: number | null = null;
  toggleAccordionStatus(order: any, event: Event): void {
    event.stopPropagation();
    const isOpening = this.expandedOrderId !== order.ID;
    this.expandedOrderId = isOpening ? order.ID : null;
    if (isOpening) {
      this.fetchOrderLogs(order.ID);
    }
  }
  isScheduled: boolean = false;
  orderDetails: any = {
    statusHistory: [],
  };
  fetchOrderLogs(serviceId: string) {
    const orderId = Number(serviceId);
    if (isNaN(orderId)) {
      return;
    }
    const filter: any = {
      $and: [
        { ORDER_ID: { $in: [orderId] } },
        { LOG_TYPE: { $in: ['Order'] } },
      ],
    };
    this.apiservice
      .getorderLogs(1, 10, 'DATE_TIME', 'ASC', filter, orderId, 'O')
      .subscribe({
        next: (data) => {
          if (data?.code === 200 && Array.isArray(data?.data)) {
            this.orderDetails.statusHistory = data.data.map((log: any) => ({
              title: log.ORDER_STATUS,
              date: this.datePipe.transform(
                log.DATE_TIME,
                'dd/MM/yyyy HH:mm a'
              ),
              description: log.ACTION_DETAILS,
              completed: true,
            }));
            this.isScheduled = this.orderDetails.statusHistory.some(
              (data: any) =>
                data.title.replace(/\.$/, '').trim() === 'Order scheduled'
            );
          } else {
            this.orderDetails.statusHistory = [];
          }
        },
        error: (error) => {
          this.orderDetails.statusHistory = [];
        },
      });
  }
  openImage(imgUrl: string) {
    this.apiservice.openModal(imgUrl);
  }
  msgreciveddd: boolean = false;
  msggettt() {
    return sessionStorage.getItem('megrecived') != undefined &&
      sessionStorage.getItem('megrecived') != null &&
      sessionStorage.getItem('megrecived') == 'yes'
      ? (this.msgreciveddd = true)
      : (this.msgreciveddd = false);
  }
  clickonbrand(productttt: any) {
    var product = productttt['DATA'];
    this.searchKeyword = product.BRAND_NAME;
    sessionStorage.setItem('brandid', product.ID);
    this.showOptionsList = false;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/shop/brands']);
    });
  }
  InventoryId(productttt: any) {
    var product = productttt['DATA'];
    this.searchKeyword = product.ITEM_NAME;
    this.showOptionsList = false;
    const ID = product.ID;
    const UNIT_ID = product.UNIT_ID;
    const QUANTITY_PER_UNIT = product.QUANTITY_PER_UNIT;
    sessionStorage.setItem('brandid', '');
    sessionStorage.setItem('InventoryID', ID.toString());
    sessionStorage.setItem('UNIT_ID', UNIT_ID.toString());
    sessionStorage.setItem('QUANTITY_PER_UNIT', QUANTITY_PER_UNIT.toString());
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/shop/buy_now', ID]);
    });
  }
  isdeleteAccount: boolean = false;
  deleteAccount() {
    this.isdeleteAccount = true;
    const subscribedChannels = JSON.parse(this.subscribedChannels);
    var channelNames = subscribedChannels.map(
      (channel: any) => channel.CHANNEL_NAME
    );
    var userdata = {
      CUSTOMER_ID: this.userID,
      NAME: this.userNAME,
      MOBILE_NO: this.userMobile,
    };
    if (this.subscribedChannels?.length > 0) {
      this.apiservice.unsubscribeToMultipleTopics(channelNames).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.apiservice.deleteAccount(userdata).subscribe({
              next: (successCode: any) => {
                if (successCode.status == 200) {
                  this.cookie.deleteAll();
                  sessionStorage.clear();
                  localStorage.clear();
                  this.toastr.success(
                    'Account deleted successfully',
                    'Success',
                    {
                      timeOut: 1500,
                      positionClass: 'toast-top-right',
                      progressBar: true,
                      closeButton: true,
                      progressAnimation: 'decreasing',
                      toastClass: 'ngx-toastr custom-toast',
                    }
                  );
                  this.router.navigate(['/login']).then(() => {
                    window.location.reload();
                  });
                } else {
                  this.isdeleteAccount = false;
                  this.toastr.error('Something went wrong. Please try again.');
                }
                this.isdeleteAccount = false;
              },
              error: (errorResponse) => {
                this.toastr.error('Something went wrong. Please try again.');
                this.isdeleteAccount = false;
              },
            });
          } else {
            this.apiservice.deleteAccount(userdata).subscribe({
              next: (successCode: any) => {
                if (successCode.status == 200) {
                  this.cookie.deleteAll();
                  sessionStorage.clear();
                  localStorage.clear();
                  this.toastr.success(
                    'Account deleted successfully',
                    'Success',
                    {
                      timeOut: 1500,
                      positionClass: 'toast-top-right',
                      progressBar: true,
                      closeButton: true,
                      progressAnimation: 'decreasing',
                      toastClass: 'ngx-toastr custom-toast',
                    }
                  );
                  this.router.navigate(['/login']).then(() => {
                    window.location.reload();
                  });
                } else {
                  this.isdeleteAccount = false;
                  this.toastr.error('Something went wrong. Please try again.');
                }
                this.isdeleteAccount = false;
              },
              error: (errorResponse) => {
                this.toastr.error('Something went wrong. Please try again.');
                this.isdeleteAccount = false;
              },
            });
            this.isdeleteAccount = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.apiservice.deleteAccount(userdata).subscribe({
            next: (successCode: any) => {
              if (successCode.status == 200) {
                this.cookie.deleteAll();
                sessionStorage.clear();
                localStorage.clear();
                this.toastr.success('Account deleted successfully', 'Success', {
                  timeOut: 1500,
                  positionClass: 'toast-top-right',
                  progressBar: true,
                  closeButton: true,
                  progressAnimation: 'decreasing',
                  toastClass: 'ngx-toastr custom-toast',
                });
                this.router.navigate(['/login']).then(() => {
                  window.location.reload();
                });
              } else {
                this.isdeleteAccount = false;
                this.toastr.error('Something went wrong. Please try again.');
              }
              this.isdeleteAccount = false;
            },
            error: (errorResponse) => {
              this.toastr.error('Something went wrong. Please try again.');
              this.isdeleteAccount = false;
            },
          });
          this.isdeleteAccount = false;
        }
      );
    } else {
      this.apiservice.deleteAccount(userdata).subscribe({
        next: (successCode: any) => {
          if (successCode.status == 200) {
            this.cookie.deleteAll();
            sessionStorage.clear();
            localStorage.clear();
            this.toastr.success('Account deleted successfully', 'Success', {
              timeOut: 1500,
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              progressAnimation: 'decreasing',
              toastClass: 'ngx-toastr custom-toast',
            });
            this.router.navigate(['/login']).then(() => {
              window.location.reload();
            });
          } else {
            this.isdeleteAccount = false;
            this.toastr.error('Something went wrong. Please try again.');
          }
          this.isdeleteAccount = false;
        },
        error: (errorResponse) => {
          this.toastr.error('Something went wrong. Please try again.');
          this.isdeleteAccount = false;
        },
      });
    }
  }
  openWalletFromHeader() {
    this.walletOpenedFromHeader = true;
    this.isMobileMenuOpen = true;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    this.openWallet();
  }
  currentIndex = 0;
  desktopAnimState: 'visible' | 'hidden' = 'visible';
  mobileAnimState: 'visible' | 'hidden' = 'visible';
  isAnimating = false;
  placeholderIndex = 0;
  startPlaceholderRotation() {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
    this.placeholderInterval = setInterval(() => {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.desktopAnimState = 'hidden';
      this.mobileAnimState = 'hidden';
      setTimeout(() => {
        this.currentIndex =
          (this.currentIndex + 1) % this.placeholderTexts.length;
        this.currentPlaceholder =
          this.placeholderTexts[this.currentIndex];
        this.desktopAnimState = 'visible';
        this.mobileAnimState = 'visible';
        setTimeout(() => {
          this.isAnimating = false;
        }, 250);
      }, 250);
    }, 2500);
  }
  startPlaceholderAnimation() {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
    this.placeholderInterval = setInterval(() => {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.desktopAnimState = 'hidden';
      this.mobileAnimState = 'hidden';
      setTimeout(() => {
        this.currentIndex =
          (this.currentIndex + 1) % this.placeholderTexts.length;
        this.currentPlaceholder =
          this.placeholderTexts[this.currentIndex];
        this.desktopAnimState = 'visible';
        this.mobileAnimState = 'visible';
        setTimeout(() => {
          this.isAnimating = false;
        }, 250);
      }, 250);
    }, 2500);
  }
  updatePlaceholderTexts(services: string[]) {
    if (services && services.length > 0) {
      this.placeholderTexts = [...services];
      this.currentIndex = 0;
      this.currentPlaceholder = this.placeholderTexts[0];
      this.startPlaceholderRotation();
    }
  }
  fetchPopularServicesForPlaceholder() {
    let territoryId = sessionStorage.getItem('CurrentTerritory');
    // Fallback to default territory if not set (e.g. for guest users)
    if (!territoryId || territoryId === '0' || territoryId === 'null') {
      territoryId = '1'; // Default to Delhi/Global territory
    }
    const cid = this.userID || 0;
    const ctype = this.customertype || 'I';
    this.apiservice.getPoppulerServicesForWeb(
      parseInt(territoryId),
      cid,
      ctype,
      'ID',
      'asc'
    ).subscribe((data: any) => {
      if (data?.data?.length > 0) {
        const names = data.data
          .slice(0, 10)
          .map((s: any) => s.NAME)
          .filter(Boolean);
        this.updatePlaceholderTexts(names);
      }
    }, () => {
      // If API fails, we still have the default placeholders from initialization
    });
  }
  handleNotificationClick(dataa: any) {
    const title = dataa.TITLE || '';
    const description = dataa.DESCRIPTION || '';

    if (dataa.MEDIA_TYPE === 'IR' ||
      title.includes('Inventory request for job') ||
      title.includes('Inventory Payment request') ||
      title.includes('New Message') ||
      description.toLowerCase().includes('new message')) {

      let orderId = dataa.ORDER_ID;

      // Extract Order ID from description if missing (robust regex for formats like ORD/2026/04/03/00052)
      if (!orderId && description) {
        const match = description.match(/(ORD\/[^\s,\-]+)/);
        if (match) {
          orderId = match[1];
        }
      }

      if (orderId) {
        const notificationDrawer = document.getElementById('offcanvasRight');
        if (notificationDrawer) {
          const offcanvasInstance = bootstrap.Offcanvas.getInstance(notificationDrawer);
          if (offcanvasInstance) {
            offcanvasInstance.hide();
          }
        }
        // Force cleanup of backdrops and page state
        const backdrops = document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop');
        backdrops.forEach((el) => el.remove());
        document.body.classList.remove('modal-open', 'offcanvas-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        const queryParams: any = {};
        const isNewMessage = title.includes('New Message') || description.toLowerCase().includes('new message');

        if (title.includes('Inventory Payment request')) {
          queryParams.openPartPayment = 'true';
        } else if (isNewMessage) {
          queryParams.openChat = 'true';
        } else {
          queryParams.openPartDetails = 'true';
        }

        this.router.navigate(['/order-details', orderId], { queryParams: queryParams });
      }
    }
  }

}

