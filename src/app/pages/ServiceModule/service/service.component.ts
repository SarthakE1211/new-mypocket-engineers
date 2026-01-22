import { Component, ElementRef, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent {
  @ViewChild('exampleModalCenter') modalElement!: ElementRef;
  modalInstance!: Modal;
  IMAGEuRL: any;
  PopularServices: any[] = [];
  loadepage: boolean = false;
  DefaultAddressArray: any = [];
  addresses: any[] = [];
  defaultAddress: any;
  userID: any = this.apiservice.getUserId();
  addressID: any = this.apiservice.getUserAddress();
  constructor(
    private cookie: CookieService,
    private apiservice: ApiServiceService,
    private message: ToastrService,
    private metaService: Meta,
    private titleService: Title,
    private modalService: NgbModal,
    private router: Router, public sanitizer: DomSanitizer,
  ) {
    this.updateSEO();
  }
  customertype: any = this.apiservice.getCustomerType();
  updateSEO() {
    this.titleService.setTitle('Services - PockIT Web');
    this.metaService.updateTag({
      name: 'description',
      content:
        'PockIT Web provides IT network solutions, cybersecurity, cloud services, and high-quality laptop & computer parts. Secure and reliable IT solutions for businesses.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'IT network services, cybersecurity solutions, cloud computing, firewall security, computer parts, laptop accessories, network monitoring',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'IT Network Services & Computer Parts - PockIT Web',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Get professional IT network services and shop high-quality computer parts at PockIT Web. Secure, fast, and reliable solutions.',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://my.pockitengineers.com/services',
    });
    this.metaService.updateTag({
      name: 'twitter:title',
      content: 'IT Network Services & Computer Parts - PockIT Web',
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content:
        'Find expert IT network solutions and high-quality computer parts at PockIT Web. Secure & reliable solutions for businesses.',
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
  token = this.cookie.get('token');
  ngOnInit() {
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    if (this.userID === 0) {
      if (typeof this.addressID === 'string') {
        try {
          this.addressID = JSON.parse(this.addressID);
        } catch (error) {
          return; 
        }
      }
      if (this.addressID?.PINCODE) {
        this.apiservice
          .getterritoryPincodeData(
            0,
            0,
            'id',
            'desc',
            `AND PINCODE = ${this.addressID.PINCODE}`
          )
          .subscribe(
            (data: any) => {
              if (data?.code === 200 && data?.data?.length > 0) {
                this.DefaultAddressArray = data.data[0];
                this.geServiceCategories();
              } else {
              }
            },
            (error: any) => {}
          );
      } else {
      }
    } else {
      this.getAddresses1();
    }
    setTimeout(() => {
      if (document.documentElement.scrollHeight <= window.innerHeight) {
        document.body.style.overflowY = 'auto'; 
      } else {
        document.body.style.overflowY = ''; 
      }
    }, 300); 
  }
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
            this.defaultAddress =
              this.addresses.find((addr) => addr.IS_DEFAULT === 1) ||
              this.addresses[0];
            this.DefaultAddressArray = this.defaultAddress;
            if (this.DefaultAddressArray['TERRITORY_ID']) {
              this.geServiceCategories();
            } else {
              this.message.error(
                'Territory not found, Please select other pincode'
              );
            }
          }
        },
        (error) => {}
      );
  }
  handleImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png'; 
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
      this.modalService.dismissAll();
    }
  }
  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }
  ModalData: any;
  quantity: number = 1;
ServiceDescription:any='';
  openModal(data: any) {
        this.ServiceDescription = data.DESCRIPTION? this.sanitizer.bypassSecurityTrustHtml(data.DESCRIPTION):'No description available.';
    this.ModalData = data;
    this.quantity = 1; 
    this.modalInstance.show();
  }
  increaseQty() {
    if (this.quantity < this.ModalData?.MAX_QTY) {
      this.quantity++;
    } else {
      this.message.info(
        `Maximum quantity allowed is ${this.ModalData.MAX_QTY}`,
        'Limit Exceeded'
      );
    }
  }
  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  categories: any[] = [];
  ServiceCategories: any[] = [];
  groupedCategories: any[] = [];
  selectedCategory: string = '';
  filterdata = '';
  geServiceCategories() {
    this.apiservice
      .getCategorieservices(
        this.DefaultAddressArray['TERRITORY_ID'],
        this.apiservice.getCustomerType(),
        this.userID,  'SEQ_NO',
        'asc'
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.ServiceCategories = data.data;
            this.groupedCategories = data.data.filter(
              (item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => t.NAME === item.NAME)
            );
            this.selectedCategory = this.groupedCategories[0]?.NAME || '';
            if (
              sessionStorage.getItem('categoryidforsearch') != null &&
              sessionStorage.getItem('categoryidforsearch') !== '' &&
              sessionStorage.getItem('categoryidforsearch') !== undefined
            ) {
              const categoryIdFromSession = sessionStorage.getItem(
                'categoryidforsearch'
              );
              const selectedCategory = this.groupedCategories.find(
                (category) => category.ID.toString() === categoryIdFromSession
              );
              this.selectedCategory = selectedCategory?.NAME;
              if (
                sessionStorage.getItem('categoryidforsearch22') != null &&
                sessionStorage.getItem('categoryidforsearch22') !== '' &&
                sessionStorage.getItem('categoryidforsearch22') !== undefined
              ) {
                this.filterdata =
                  " AND S.ID='" +
                  sessionStorage.getItem('categoryidforsearch22') +
                  "'";
              } else {
                this.filterdata = '';
              }
              this.getProjectData(selectedCategory, true);
              sessionStorage.setItem('categoryidforsearch', '');
              sessionStorage.setItem('categoryidforsearch22', '');
            } else {
              sessionStorage.setItem('categoryidforsearch', '');
              sessionStorage.setItem('categoryidforsearch22', '');
              this.filterdata = '';
              this.getProjectData(this.groupedCategories[0], false);
            }
          } else {
          }
        },
        (error) => {}
      );
  }
  loadingpage: boolean = false; 
  getProjectData(category: any, event: boolean, eventt: boolean = false) {
    if (eventt) {
      this.selectedCategory = category.NAME;
    } else {
    }
    this.loadingpage = true;
    if (event) {
      this.apiservice
        .getServicesForWeb(
          this.DefaultAddressArray['TERRITORY_ID'],
          this.userID,
          category['ID'],
          '',
          0,
          this.apiservice.getCustomerType(),
          this.filterdata
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data.data.length > 0) {
                this.PopularServices = data.data;
              } else {
                this.PopularServices = [];
              }
              this.loadingpage = false; 
            } else {
              this.loadingpage = false; 
              this.message.error('Error fetching popular services', '');
            }
          },
          (error) => {
            this.loadingpage = false; 
          }
        );
    } else {
      this.apiservice
        .getServicesForWeb(
          this.DefaultAddressArray['TERRITORY_ID'],
          this.userID,
          category['ID'],
          '',
          0,
          this.apiservice.getCustomerType(),
          this.filterdata
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data.data.length > 0) {
                this.PopularServices = data.data;
              } else {
                this.PopularServices = [];
              }
              this.loadingpage = false; 
            } else {
              this.loadingpage = false; 
              this.message.error('Error fetching popular services', '');
            }
          },
          (error) => {
            this.loadingpage = false; 
          }
        );
    }
  }
  displayCount: number = 10;
  loadMore() {
    this.loadingpage = true;
    setTimeout(() => {
      if (this.displayCount < this.PopularServices.length) {
        this.displayCount += 10;
      }
      this.loadingpage = false;
    }, 1000);
  }
  isDrawerVisible: boolean = false;
  drawerData: any = [];
  originalBackdropOpacity: string = '';
  imagePreview: any = null;
  showModal: boolean = false;
  cartquantity: any;
  homepageprogress: any = 0;
  decreaseProgress() {
    if (this.homepageprogress > 0) {
      this.homepageprogress -= 50; 
    }
  }
  fromservice: boolean = false;
  updateProgress1() {
    this.fromservice = true;
    this.homepageprogress += 50; 
    if (this.homepageprogress > 100) {
      this.homepageprogress = 100;
    }
  }
  openNextDrawer(data: any) {
    setTimeout(() => {
      const serviceDrawer = document.getElementById('offcanvasRight11');
      if (serviceDrawer) {
        let offcanvasInstance = bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (!offcanvasInstance) {
          offcanvasInstance = new bootstrap.Offcanvas(serviceDrawer);
        }
        offcanvasInstance.show();
        this.updateProgress1();
      }
      this.drawerData = data;
      this.cartquantity =this.drawerData.QTY == 0 ? 1 : this.drawerData.QTY;
      this.showModal = false;
      this.imagePreview = null;
      this.drawerData.SERVICE_PHOTO_FILE = '';
      this.drawerData.DESCRIPTION = '';
      this.isDrawerVisible = true;
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
          this.decreaseProgress();
        }
      }
    }, 300);
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  activeIndex: number | null = null; 
  toggleAccordion(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index; 
  }
  cartspinner: boolean = false;
  increaseQty1(item: any, maxQty: number, event: Event) {
    event.stopPropagation();
    if (item.QTY < maxQty) {
      this.ModalData.QTY++;
    } else {
     this.message.info('You have reached the limit of max quantity','');
    }
  }
  decreaseQty1(item: any, event: Event) {
    event.stopPropagation();
    if (item.QTY > 1) {
      this.ModalData.QTY--;
    } else {
     this.message.info('Quantity cannot be less than 1','');
    }
  }
}
