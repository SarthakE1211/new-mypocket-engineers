import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Offcanvas } from 'bootstrap';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from 'src/app/Service/cart.service';
import * as bootstrap from 'bootstrap';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-all-brands',
  templateUrl: './all-brands.component.html',
  styleUrls: ['./all-brands.component.scss'],
})
export class AllBrandsComponent {
  updateSEO() {
    this.titleService.setTitle('Top Laptop & Computer Brands - PockIT Web');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Explore the best laptop and computer brands at PockIT Web. Find top-quality products from Dell, HP, Lenovo, ASUS, Acer, and more.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'laptop brands, computer brands, Dell, HP, Lenovo, ASUS, Acer, gaming laptops, workstation PCs, laptop accessories',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Top Laptop & Computer Brands - PockIT Web',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Find top-quality products from leading laptop and computer brands like Dell, HP, Lenovo, ASUS, Acer, and more at PockIT Web.',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://my.pockitengineers.com/shop/brands',
    });
    this.metaService.updateTag({
      name: 'twitter:title',
      content: 'Top Laptop & Computer Brands - PockIT Web',
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content:
        'Shop high-quality laptops, PCs, and accessories from the best brands like Dell, HP, Lenovo, ASUS, and Acer.',
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
    private apiservice: ApiServiceService,
    private router: Router,
    private message: ToastrService,
    private metaService: Meta,
    private cartService: CartService,
    private cookie: CookieService,
    private titleService: Title
  ) {
    this.updateSEO();
  }
  showAll: boolean = false;
  loading: boolean = false;
  IMAGEuRL: any;
  USERID: any;
  ngOnInit() {
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    this.brands();
    this.getInventoryCategory()
    this.Address();
    this.USERID = this.apiservice.getUserId();
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
  handleImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png'; 
  }
  onImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png';
  }
  brand: any[] = [];
  displayedBrands: any[] = [];
  displayLimit: number = 8;
  loadService: boolean = false;
  loadingMore: boolean = false; 
  isDropdownOpen1: boolean   = false
  InventoryCategory: any = [];
  brands() {
    this.loadService = true;
    var filter = '';
    if (
      sessionStorage.getItem('brandid') != null &&
      sessionStorage.getItem('brandid') != undefined &&
      sessionStorage.getItem('brandid') != ''
    ) {
      filter = " AND ID='" + sessionStorage.getItem('brandid') + "'";
    } else {
      filter = '';
    }
    this.apiservice
      .getBrands(0, 0, 'SEQUENCE_NO', 'asc', ' AND STATUS = 1' + filter)
      .subscribe(
        (response: HttpResponse<any>) => {
          this.loadService = false;
          if (response.status === 200 && response.body?.data) {
            this.brand = response.body.data;
            sessionStorage.setItem('brandid', '');
            this.updateDisplayedBrands();
          } else {
            this.brand = [];
          }
        },
        (err: HttpErrorResponse) => {
          this.loadService = false;
        }
      );
  }
  selectedOption1: any = 'All';
  updateDisplayedBrands() {
    this.displayedBrands = this.brand.slice(0, this.displayLimit);
  }
    getInventoryCategory() {
    this.apiservice.InventoryCategoryget(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1').subscribe(
      (data) => {
        if (data.body.code === 200) {
        this.InventoryCategory = data.body.data.filter((cat: any) => cat.IS_ACTIVE === 1);
        } else {
          this.InventoryCategory = [];
        }
      },
      (error) => {
        this.InventoryCategory = [];
      }
    );
  }
  toggleDropdown1() {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
  }
  getCategoryNameById(id: any): string {
    const found = this.InventoryCategory.find((cat: any) => cat.ID == id);
    return found ? found.CATEGORY_NAME : 'All';
  }
  selectFilter2(option: any) {
    this.selectedOption1 = option;
    this.displayLimitnventory = 4; 
    this.updateDisplayedInventorydata();
  }
  loadMore() {
    this.loadingMore = true; 
    setTimeout(() => {
      this.displayLimit = this.brand.length;
      this.updateDisplayedBrands();
      this.loadingMore = false; 
    }, 1000); 
  }
  DrawerName: any;
  inventorydata: any = [];
  displayednventory: any[] = [];
  displayLimitnventory: number = 4;
  loadingMoreInventory: boolean = false;
  filteredTotalCount: number = 0;
  loadServicefordrawer: boolean = false;
  openDrawer(data: any) {
    this.isDropdownOpen1 = false
    this.DrawerName = data.BRAND_NAME;
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
        ' AND STATUS = 1 AND IS_HAVE_VARIANTS = 0 AND INVENTORY_TYPE IN ("B", "P") AND BRAND_ID = ' +
          data.ID,
        USERID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.inventorydata = data.data;
          this.loadServicefordrawer = false;
          this.updateDisplayedInventorydata();
        } else {
          this.inventorydata = [];
          this.loadServicefordrawer = false;
        }
      });
  }
    updateDisplayedInventorydata() {
    let filteredData = [];
    if (this.selectedOption1 === 'All') {
      filteredData = this.inventorydata;
    } else {
      filteredData = this.inventorydata.filter((item:any) =>
        String(item.INVENTORY_CATEGORY_ID) === String(this.selectedOption1)
      );
    }
    this.filteredTotalCount = filteredData.length;
    this.displayednventory = filteredData.slice(0, this.displayLimitnventory);
  }
  loadMoreInventory() {
    this.loadingMoreInventory = true; 
    setTimeout(() => {
      this.displayLimitnventory = this.inventorydata.length;
      this.updateDisplayedInventorydata();
      this.loadingMoreInventory = false; 
    }, 1000); 
  }
  showFilter = false;
  selectedFilter = 'Latest';
  sortKey = 'ID';
  sortValue = 'DESC';
  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.showFilter = false;
    switch (filter) {
      case 'Latest':
        this.sortKey = 'ID';
        this.sortValue = 'DESC';
        break;
      case 'Alphabetic':
        this.sortKey = 'ITEM_NAME';
        this.sortValue = 'ASC';
        break;
      case 'Top Rated':
        this.sortKey = 'RATING';
        this.sortValue = 'DESC';
        break;
      case 'Price: Low to High':
        this.sortKey = 'DISCOUNTED_PRICE';
        this.sortValue = 'ASC';
        break;
      case 'Price: High to Low':
        this.sortKey = 'DISCOUNTED_PRICE';
        this.sortValue = 'DESC';
        break;
    }
    this.openDrawer('');
  }
  @ViewChild('offcanvas') offcanvas!: ElementRef;
  private offcanvasInstance: Offcanvas | null = null;
  ngAfterViewInit() {
    this.offcanvasInstance = new Offcanvas(this.offcanvas.nativeElement);
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
  InventoryId(product: any) {
    const ID = product.ID;
    const UNIT_ID = product.UNIT_ID;
    const QUANTITY_PER_UNIT = product.QUANTITY_PER_UNIT;
    sessionStorage.setItem('InventoryID', ID.toString()); 
    sessionStorage.setItem('UNIT_ID', UNIT_ID.toString()); 
    sessionStorage.setItem('QUANTITY_PER_UNIT', QUANTITY_PER_UNIT.toString()); 
  }
  Addressdata: any = [];
  STATE_ID: any;
  ADDRESS_ID: any;
  teritory_id: any;
  CUSTOMER_ID = this.apiservice.getUserId();
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
  inventoryMappingdata: any = [];
  UNIT_ID: any;
  UNIT_NAME: any;
  QUANTITY_PER_UNIT: any;
  InventoryunitMapping(ID: any) {
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
  }
  customer_id = this.apiservice.getUserId();
  quantity: number = 1;
  IS_TEMP_CART = 1;
  TYPE = 'SH';
  DEMO: any;
  cartdata: any = [];
  ID: any;
  unit_id: any;
  quentity_per_unit: any;
  unit_name: any;
  loadingBuyNow: boolean = false;
  handleBuyNow(product: any) {
  this.buyNow(product);
  this.InventoryunitMapping(product.ID);
}
  buyNow(product: any) {
    if (this.USERID == 0) {
      this.openLoginModal();
      return;
    }
    product.loadingBuyNow = true; 
    this.ID = product.ID;
    this.unit_id = product.UNIT_ID;
    this.quentity_per_unit = product.QUANTITY_PER_UNIT;
    this.unit_name = product.UNIT_NAME;
    this.apiservice
      .CartGet(
        this.customer_id,
        this.ID,
        this.quantity,
        this.IS_TEMP_CART,
        this.STATE_ID,
        this.teritory_id,
        this.ADDRESS_ID,
        this.TYPE,
        this.unit_id,
        this.quentity_per_unit,
        this.unit_name
      )
      .subscribe((data) => {
        product.loadingBuyNow = false; 
        if (data['code'] == 200) {
          this.cartdata.CART_ID = data.data.CART_ID; 
          sessionStorage.setItem('CART_ID', this.cartdata.CART_ID.toString()); 
          this.DEMO = data.data.CART_ID;
          this.router.navigate(['/shop/check-out', this.DEMO, 'H']);
        } else {
          product.loadingBuyNow = false; 
          this.cartdata = [];
        }
      });
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
    }
  IS_TEMP_CART1 = 0;
  TYPE1 = 'P';
  addTOcartdata: any = [];
  loadingBuyNowcart: boolean = false;
  addToCart(product: any, type: any) {
    if (this.USERID == 0) {
      this.openLoginModal();
      return;
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
                  this.inventorydata = data.data;
                  this.updateDisplayedInventorydata();
                } else {
                  this.inventorydata = [];
                }
              });
          } else {
          }
        } else {
          this.addTOcartdata = [];
          product.loadingBuyNowcart = false;
        }
      });
  }
}
