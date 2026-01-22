import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ElementRef, ViewChild } from '@angular/core';
import { Offcanvas } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/Service/cart.service';
import { Meta, Title } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { CommonmapComponent } from 'src/app/commonmap/commonmap.component';
@Component({
  selector: 'app-shop-home',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.scss'],
})
export class ShopHomeComponent {
  isAddressLine1Stored = false;
  valuez = localStorage.getItem('AddressLine1');
  isAddressLine1Stored1 = this.valuez !== null && this.valuez !== undefined && this.valuez !== ''? true : false;
  @ViewChild(CommonmapComponent) commonMap!: CommonmapComponent;
  onOpenMapClicked() {
    this.commonMap.openMapModalz();
  }
  carouselOptions1 = {
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: [
    ],
    responsive: {
      0: { items: 1 }, 
      480: { items: 2 }, 
      768: { items: 4 }, 
      992: { items: 5 }, 
      1100: { items: 6 }, 
      1500: { items: 8 }, 
    },
  };
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Latest';
  isDropdownOpen1: boolean = false;
  selectedOption1: any = 'All';
  InventoryCategory: any = [];
  Addressdata: any = [];
  STATE_ID: any;
  ADDRESS_ID: any;
  teritory_id: any;
  CUSTOMER_ID = this.apiservice.getUserId();
  customer_id = this.apiservice.getUserId();
  quantity: number = 1;
  IS_TEMP_CART = 1;
  TYPE = 'SH';
  DEMO: any;
  cartdata: any = [];
  customertype1: any = this.apiservice.getCustomerType();
  ID: any;
  unit_id: any;
  quentity_per_unit: any;
  unit_name: any;
  loadingBuyNow: boolean = false;
  IMAGEuRL: any;
  inventorydata: any[] = [];
  brand: any[] = [];
  carouselItems: any[] = [];
  InvertoryId: any;
  constructor(
    private apiservice: ApiServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private message: ToastrService,
    private cartService: CartService,
    private cookie: CookieService,
    private metaService: Meta,
    private titleService: Title
  ) {
    this.updateSEO();
  }
  updateSEO() {
    this.titleService.setTitle('Shop - PockIT Web');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Shop the best laptop and computer parts at PockIT Web. Find high-quality SSDs, RAM, processors, and accessories at unbeatable prices.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'buy laptop parts, computer accessories, best SSDs online, gaming PC components, laptop chargers, processors, RAM, motherboards',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Buy Laptop & Computer Parts Online - PockIT Web',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Find top-quality laptop parts, computer accessories, SSDs, RAM, and processors at the best prices only at PockIT Web.',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://my.pockitengineers.com/shop',
    });
    this.metaService.updateTag({
      name: 'twitter:title',
      content: 'Buy Laptop & Computer Parts Online - PockIT Web',
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content:
        'Shop high-quality laptop and PC components at PockIT Web. Best prices on SSDs, RAM, motherboards, and accessories.',
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
  USERID: any;
  isMobile: boolean = false;
  dataToOpen: any = null; 
  guestaddressss: any;
  ngOnInit() {
    this.selectFilter('Latest')
    this.brands()
    this.isMobile = window.innerWidth < 768; 
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
    this.getTopSellingLaptops()
    this.getBannerData();
    this.getInventoryCategory();
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    this.USERID = this.apiservice.getUserId();
    this.InvertoryId = sessionStorage.getItem('InventoryID');
    if (this.USERID !== 0) {
      this.Address();
    } else {
      this.guestaddressss = this.apiservice.getUserAddressLocal();
      if (this.guestaddressss !== '') {
        this.guestaddressss = JSON.parse(this.guestaddressss);
        sessionStorage.setItem(
          'CurrentTerritory',
          this.guestaddressss.TERRITORY_ID?.toString()
        );
        if (
          this.guestaddressss.TERRITORY_ID !== null &&
          this.guestaddressss.TERRITORY_ID !== undefined &&
          this.guestaddressss.TERRITORY_ID !== 0 &&
          this.guestaddressss.TERRITORY_ID !== ''
        ) {
          this.teritory_id = this.guestaddressss.TERRITORY_ID;
          this.getTopSellingLaptops();
          this.brands();
          this.inventory();
          this.InventoryunitMapping(this.InvertoryId);
          this.refurbishedInventory();
        } else {
          this.getTopSellingLaptops();
          this.brands();
          this.inventory();
          this.InventoryunitMapping(this.InvertoryId);
          this.refurbishedInventory();
          this.teritory_id = 0;
        }
      } else {
        this.teritory_id = 0;
      }
    }
    this.route.queryParams.subscribe((params) => {
      if (params['data']) {
        try {
          const parsedData = JSON.parse(params['data']); 
          this.dataToOpen = parsedData; 
        } catch (error) {
        }
      }
    });
    const addressJustSaved = sessionStorage.getItem('addressJustSaved');
    if (addressJustSaved === 'true') {
      sessionStorage.removeItem('addressJustSaved');
      const lastBrandId = sessionStorage.getItem('lastOpenedBrandId');
      if (lastBrandId) {
        setTimeout(() => {
          const brand = this.brand?.find((b: any) => b.ID == lastBrandId);
          if (brand) {
            this.openDrawer(brand);
          }
        }, 800); 
      }
    }
  }
  loadServiceforRefurbished: boolean = false;
  refurbishedInventoryData: any[] = [];
  refurbishedInventory() {
    this.loadServiceforRefurbished = true;
    const refurbishedUserId = this.apiservice.getUserId();
    this.apiservice
      .getsimpleinventoryforcart(
        0,
        0,
        'ID',
        'asc',
        ' AND IS_REFURBISHED=1 AND STATUS = 1 AND IS_HAVE_VARIANTS = 0 AND INVENTORY_TYPE IN ("B", "P")',
        refurbishedUserId
      )
      .subscribe((refurbishedResponse) => {
        this.loadServiceforRefurbished = false;
        if (refurbishedResponse['code'] === 200) {
          this.refurbishedInventoryData = refurbishedResponse.data;
        } else {
          this.refurbishedInventoryData = [];
        }
      });
  }
  TopSellingLaptops: any[] = [];
  loadLaptops: boolean = false;
  getTopSellingLaptops() {
    this.loadLaptops = true;
    this.apiservice.getTopSellingLaptopsForWeb('ID', 'asc').subscribe(
      (data) => {
        if (data.data.length > 0) {
          this.loadLaptops = false;
          this.TopSellingLaptops = data.data.slice(0, 10); 
        } else {
          this.loadLaptops = false;
          this.TopSellingLaptops = [];
        }
      },
      (error) => {
        this.TopSellingLaptops = [];
        this.loadLaptops = false;
      }
    );
  }
  userID: any = this.apiservice.getUserId();
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
  onImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png';
  }
  handleImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png'; 
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
        " AND STATUS = 1 AND IS_FOR_SHOP = 1 AND BANNER_TYPE = 'M' AND BANNER_FOR = 'W'" +
        filter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.carouselItems = data['data'];
            if (data.data.length > 0) {
            } else {
            }
          }
        },
        (error) => { }
      );
  }
  loadService: boolean = false;
  brands() {
    this.loadService = true;
    this.apiservice
      .getBrands(0, 0, 'SEQUENCE_NO', 'asc', ' AND IS_POPULAR = 1 AND STATUS = 1')
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.loadService = false;
            this.brand = response.body.data; 
          } else {
            this.loadService = false;
            this.brand = [];
          }
        },
        (err: HttpErrorResponse) => {
        }
      );
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleDropdown1() {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
  }
  chooseOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false; 
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const button = document.querySelector('.dropdown-toggle');
    if (button && !button.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }
  showFilter = false;
  selectedFilter = 'Latest';
  sortKey = 'ID';
  sortValue = 'DESC';
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }
  selectFilter(filter: any) {
    this.selectedOption = filter;
    this.isDropdownOpen = false;
    switch (filter) {
      case 'Latest':
        this.sortKey = 'ID';
        this.sortValue = 'DESC';
        break;
      case 'Alphabetic':
        this.sortKey = 'ITEM_NAME';
        this.sortValue = 'ASC';
        break;
      case 'Price: Low to High':
        this.sortKey = 'SELLING_PRICE';
        this.sortValue = 'ASC';
        break;
      case 'Price: High to Low':
        this.sortKey = 'SELLING_PRICE';
        this.sortValue = 'DESC';
        break;
    }
    this.inventory();
  }
  selectFilter1(filter: any) {
    this.selectedOption = filter;
    this.isDropdownOpen = false;
  }
  @ViewChild('offcanvas') offcanvas!: ElementRef;
  private offcanvasInstance: Offcanvas | null = null;
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.offcanvas) {
        this.offcanvasInstance = new Offcanvas(this.offcanvas.nativeElement);
        if (this.dataToOpen) {
          this.openDrawer(this.dataToOpen);
          this.dataToOpen = null; 
        }
      } else {
      }
    }, 100); 
  }
  DrawerName: any;
  inventorydataForDrawer: any[] = [];
  displayednventory: any[] = [];
  displayLimitnventory: number = 4;
  filteredTotalCount: number = 0;
  loadingMoreInventory: boolean = false;
  loadServicefordrawer: boolean = false;
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;
  guestuser = false;
  closeloginmodal() {
    this.guestuser = false;
  }
  getInventoryCategory() {
    this.apiservice
      .InventoryCategoryget(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          if (data.body.code === 200) {
            this.InventoryCategory = data.body.data.filter(
              (cat: any) => cat.IS_ACTIVE === 1
            );
          } else {
            this.InventoryCategory = [];
          }
        },
        (error) => {
          this.InventoryCategory = [];
        }
      );
  }
  getCategoryNameById(id: any): string {
    const found = this.InventoryCategory.find((cat: any) => cat.ID == id);
    return found ? found.CATEGORY_NAME : 'All';
  }
  openDrawer(data: any) {
    this.isDropdownOpen1 = false
    this.DrawerName = data.BRAND_NAME;
    sessionStorage.setItem('lastOpenedBrandId', data.ID);
    if (this.offcanvasInstance) {
      this.offcanvasInstance.show();
    }
    const USERID = this.apiservice.getUserId();
    this.loadServicefordrawer = true;
    this.apiservice
      .getinventoryData1(
        0,
        0,
        'ID',
        'asc',
        ` AND STATUS = 1 AND IS_HAVE_VARIANTS = 0 AND INVENTORY_TYPE IN ("B", "P") AND BRAND_ID = ${data.ID}`,
        USERID
      )
      .subscribe((data) => {
        if (data.code === 200) {
          this.inventorydataForDrawer = data.data;
          this.loadServicefordrawer = false;
          this.updateDisplayedInventorydata(); 
        } else {
          this.inventorydataForDrawer = [];
          this.loadServicefordrawer = false;
        }
      });
  }
  selectFilter2(option: any) {
    this.selectedOption1 = option;
    this.displayLimitnventory = 4; 
    this.updateDisplayedInventorydata();
    try {
      const dropdownEl = this.dropdownToggle?.nativeElement;
      const dropdownInstance =
        bootstrap.Dropdown.getInstance(dropdownEl) ||
        new bootstrap.Dropdown(dropdownEl);
      dropdownInstance.hide();
    } catch (err) {
      console.warn('Dropdown close failed', err);
    }
  }
  updateDisplayedInventorydata() {
    let filteredData = [];
    if (this.selectedOption1 === 'All') {
      filteredData = this.inventorydataForDrawer;
    } else {
      filteredData = this.inventorydataForDrawer.filter(
        (item) =>
          String(item.INVENTORY_CATEGORY_ID) === String(this.selectedOption1)
      );
    }
    this.filteredTotalCount = filteredData.length;
    this.displayednventory = filteredData.slice(0, this.displayLimitnventory);
  }
  loadMoreInventory() {
    this.loadingMoreInventory = true;
    setTimeout(() => {
      this.displayLimitnventory += 4;
      this.updateDisplayedInventorydata();
      this.loadingMoreInventory = false;
    }, 500);
  }
  inventorydatadatails: any = [];
  inventoryDetail(data: any) {
    this.apiservice
      .getinventoryData(
        0,
        0,
        'ID',
        'asc',
        ' AND STATUS = 1 AND ID = ' + data.ID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.inventorydatadatails = data.data;
        } else {
          this.inventorydatadatails = [];
        }
      });
  }
  inventoryId: any;
  showAll: boolean = false;
  loading: boolean = false;
  loadServiceforinventory: boolean = false;
  inventory() {
    this.loadServiceforinventory = true;
    const USERID = this.apiservice.getUserId();
    this.apiservice
      .getsimpleinventoryforcart(
        0,
        0,
        'ID',
        'asc',
        ' AND IS_REFURBISHED=0 AND STATUS = 1 AND IS_HAVE_VARIANTS = 0 AND INVENTORY_TYPE IN ("B", "P")',
        USERID
      )
      .subscribe((data) => {
        this.loadServiceforinventory = false;
        if (data['code'] == 200) {
          this.inventorydata = data.data;
        } else {
          this.inventorydata = [];
        }
      });
  }
  loadMore() {
    this.loading = true;
    setTimeout(() => {
      this.showAll = true;
      this.loading = false;
    }, 1000); 
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
  teritory_id_for_buy: any;
  Address() {
    this.apiservice
      .getAddress(
        0,
        0,
        'IS_DEFAULT',
        'desc',
        ' AND IS_DEFAULT = 1 AND CUSTOMER_ID =' + this.CUSTOMER_ID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.Addressdata = data.data;
          if (true) {
            if (this.Addressdata.length > 0) {
              this.STATE_ID = this.Addressdata[0].STATE_ID;
              this.ADDRESS_ID = this.Addressdata[0].ID; 
              this.teritory_id = this.Addressdata[0].TERRITORY_ID;
              this.teritory_id_for_buy = this.Addressdata[0].TERRITORY_ID;
            }
            this.getTopSellingLaptops();
            this.brands();
            this.inventory();
            this.InventoryunitMapping(this.InvertoryId);
            this.refurbishedInventory();
          } else {
          }
        } else {
          this.Addressdata = [];
        }
      });
  }
  inventoryMappingdata: any = [];
  UNIT_ID: any;
  UNIT_NAME: any;
  QUANTITY_PER_UNIT: any;
  InventoryunitMapping(ID: any) {
    if (this.USERID == 0) {
      return;
    }
    this.apiservice
      .getinventoryunitMapping(0, 0, 'id', 'desc', ' AND ITEM_ID = ' + ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.inventoryMappingdata = data.data;
          this.UNIT_ID = data.data.UNIT_ID;
          this.UNIT_NAME = data.data.UNIT_NAME;
          this.QUANTITY_PER_UNIT = data.data.QUANTITY_PER_UNIT;
        } else {
          this.inventoryMappingdata = [];
        }
      });
    this.apiservice
      .getinventoryDatacart(0, 0, 'id', 'desc', ' AND ID = ' + ID + ' AND UNIT_ID = ' + this.UNIT_ID + ' AND QUANTITY_PER_UNIT = ' + this.QUANTITY_PER_UNIT, this.userID, ID, this.QUANTITY_PER_UNIT, this.UNIT_ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.inventoryMappingdata = data.data;
          this.UNIT_ID = data.data.UNIT_ID;
          this.UNIT_NAME = data.data.UNIT_NAME;
          this.QUANTITY_PER_UNIT = data.data.QUANTITY_PER_UNIT;
        } else {
          this.inventoryMappingdata = [];
        }
      });
  }
  handleBuyNow(product: any) {
    this.buyNow(product);
    this.InventoryunitMapping(product.ID);
  }
  usercheckid = localStorage.getItem('userId');
  buyNow(product: any) {
    if (!this.usercheckid) {
      this.guestuser = true;
    }
    product.loadingBuyNow = true; 
    this.ID = product.ID;
    this.unit_id = product.UNIT_ID;
    this.quentity_per_unit = product.QUANTITY_PER_UNIT;
    this.unit_name = product.UNIT_NAME;
    let Home: any = 1;
    this.apiservice
      .CartGet(
        this.customer_id,
        this.ID,
        this.quantity,
        this.IS_TEMP_CART,
        this.STATE_ID,
        this.teritory_id_for_buy,
        this.ADDRESS_ID,
        this.TYPE,
        this.unit_id,
        this.quentity_per_unit,
        this.unit_name
      )
      .subscribe(
        (data) => {
          product.loadingBuyNow = false; 
          if (data['code'] == 200) {
            this.cartdata.CART_ID = data.data.CART_ID;
            sessionStorage.setItem('CART_ID', this.cartdata.CART_ID.toString());
            this.router.navigate([
              '/shop/check-out',
              this.cartdata.CART_ID,
              'H',
            ]);
          } else {
            this.cartdata = [];
          }
        },
        (error) => {
          product.loadingBuyNow = false; 
        }
      );
  }
  IS_TEMP_CART1 = 0;
  TYPE1 = 'P';
  addTOcartdata: any = [];
  loadingBuyNowcart: boolean = false;
  addToCart(product: any, type: any) {
    if (!this.usercheckid) {
      this.guestuser = true;
    }
    product.loadingBuyNowcart = true; 
    const ID = product.ID;
    const unit_id = product.UNIT_ID;
    const quentity_per_unit = product.QUANTITY_PER_UNIT;
    const unit_name = product.UNIT_NAME;
    const SERVICE_ID = 0;
    this.apiservice
      .CartGetforaddtocart1(
        this.customer_id,
        ID,
        this.quantity,
        this.IS_TEMP_CART1,
        this.STATE_ID,
        this.teritory_id,
        this.ADDRESS_ID,
        this.TYPE1,
        SERVICE_ID,
        unit_id,
        quentity_per_unit,
        unit_name
      )
      .subscribe((data) => {
        product.loadingBuyNowcart = false; 
        if (data['code'] == 200) {
          this.addTOcartdata.CART_ID = data.data.CART_ID; 
          this.cartService.fetchAndUpdateCartDetails(this.USERID); 
          this.message.success('Item added to cart successfully.');
          sessionStorage.setItem(
            'CART_ID_FOR_CART',
            this.addTOcartdata.CART_ID.toString()
          ); 
          if (type == 'S') {
            const USERID = this.apiservice.getUserId();
            this.apiservice
              .getinventoryData1(
                0,
                0,
                'ID',
                'asc',
                ' AND STATUS = 1 AND IS_HAVE_VARIANTS = 0 AND INVENTORY_TYPE IN ("B", "P") AND BRAND_ID = ' +
                product.BRAND_ID,
                USERID
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.inventorydataForDrawer = data.data;
                  this.updateDisplayedInventorydata();
                  this.inventory();
                } else {
                  this.inventorydataForDrawer = [];
                }
              });
          } else {
            this.inventory();
          }
        } else {
          product.loadingBuyNowcart = false; 
          this.addTOcartdata = [];
        }
      });
  }
  InventoryId(product: any) {
    const ID = product.ID;
    const UNIT_ID = product.UNIT_ID;
    const QUANTITY_PER_UNIT = product.QUANTITY_PER_UNIT;
    sessionStorage.setItem('InventoryID', ID.toString()); 
    sessionStorage.setItem('UNIT_ID', UNIT_ID.toString()); 
    sessionStorage.setItem('QUANTITY_PER_UNIT', QUANTITY_PER_UNIT.toString()); 
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
}
