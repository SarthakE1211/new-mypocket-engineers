import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CartService } from 'src/app/Service/cart.service';

@Component({
  selector: 'app-all-refurbished-products',
  templateUrl: './all-refurbished-products.component.html',
  styleUrls: ['./all-refurbished-products.component.scss'],
})
export class AllRefurbishedProductsComponent {
  loadServiceforinventory: boolean = false;
  inventorydata: any[] = [];
  sortKey = 'ID';
  sortValue = 'DESC';
  USERID: any;
  userID: any = this.apiservice.getUserId();
  loading: boolean = false;
  guestaddressss: any;

  showAll: boolean = false;

  constructor(
    private apiservice: ApiServiceService,
    private message: ToastrService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  IMAGEuRL: any;
  Addressdata: any = [];

  isDropdownOpen1: boolean = false;

  toggleDropdown1() {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
  }

  ngOnInit() {
    this.inventory();
    this.getInventoryCategory();
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    this.USERID = this.apiservice.getUserId();

    if (this.USERID !== 0) {
      this.Address();
    } else {
      this.guestaddressss = this.apiservice.getUserAddress();

      if (this.guestaddressss !== '') {
        this.guestaddressss = JSON.parse(this.guestaddressss);
        if (
          this.guestaddressss.TERRITORY_ID !== null &&
          this.guestaddressss.TERRITORY_ID !== undefined &&
          this.guestaddressss.TERRITORY_ID !== 0 &&
          this.guestaddressss.TERRITORY_ID !== ''
        ) {
          //  if( this.teritory_id !==0 &&  this.teritory_id !==undefined &&  this.teritory_id !==null){
          this.teritory_id = this.guestaddressss.TERRITORY_ID;
          // this.getTopSellingLaptops();
          // this.brands();
          this.inventory();
          // this.InventoryunitMapping(this.InvertoryId);

          // }
        } else {
          this.teritory_id = 0;
        }
      } else {
        this.teritory_id = 0;
      }
    }
  }

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
            // Ensure array has at least one entry
            this.STATE_ID = this.Addressdata[0].STATE_ID;
            this.ADDRESS_ID = this.Addressdata[0].ID; // Use "ID" instead of "ADDRESS_ID" as per JSON
            this.teritory_id = this.Addressdata[0].TERRITORY_ID;
            if (
              this.teritory_id !== 0 &&
              this.teritory_id !== undefined &&
              this.teritory_id !== null
            ) {
              // this.getTopSellingLaptops();
              // this.brands();
              // this.inventory();
              // this.InventoryunitMapping(this.InvertoryId);
            }
          } else {
          }
        } else {
          this.Addressdata = [];
        }
      });
  }

  loadServiceforRefurbished: boolean = false;
  InventoryCategory: any[] = [];

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
filteredInventoryData: any[] = [];

  inventory() {
    this.loadServiceforinventory = true;
    const USERID = this.apiservice.getUserId();
    this.apiservice
      .getsimpleinventoryforcart(
        0,
        0,
        'ID',
        'asc',
        ' AND IS_REFURBISHED=1 AND STATUS = 1 AND IS_HAVE_VARIANTS = 0 AND INVENTORY_TYPE IN ("B", "P")',
        USERID
      )
      .subscribe((data) => {
        this.loadServiceforinventory = false;
        if (data['code'] == 200) {
          this.inventorydata = data.data;
           this.applyCategoryFilter();
        } else {
          this.inventorydata = [];
        }
      });
  }



selectFilter2(option: any) {
  this.selectedOption1 = option;
  this.applyCategoryFilter();
  this.showAll = false;
}


applyCategoryFilter() {

  
  
  if (this.selectedOption1 === 'All') {
    this.filteredInventoryData = this.inventorydata;
  } else {
    const selectedId = parseInt(this.selectedOption1, 10); // convert to number
    this.filteredInventoryData = this.inventorydata.filter(
      (item) => item.INVENTORY_CATEGORY_ID == selectedId
    );
  }
  
  
}



  getCategoryNameById(id: any): string {
    const found = this.InventoryCategory.find((cat: any) => cat.ID == id);
    return found ? found.CATEGORY_NAME : 'All';
  }

  addTOcartdata: any = [];
  STATE_ID: any;
  ADDRESS_ID: any;
  teritory_id: any;
  CUSTOMER_ID = this.apiservice.getUserId();
  customer_id = this.apiservice.getUserId();
  quantity: number = 1;
  IS_TEMP_CART = 1;
  displayednventory: any[] = [];
  displayLimitnventory: number = 4;

  IS_TEMP_CART1 = 0;
  TYPE1 = 'P';
  selectedOption1: any = 'All';

  inventorydataForDrawer: any[] = [];

  addToCart(product: any, type: any) {
    // if (this.USERID == 0) {
    //   this.message.error('Log in to shop and use all features..');

    // } else {

    if (this.USERID == 0) {
      this.openLoginModal();
      return;
    }
    product.loadingBuyNowcart = true; // Activate loader for clicked product

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
        product.loadingBuyNowcart = false; // Activate loader for clicked product

        if (data['code'] == 200) {
          this.addTOcartdata.CART_ID = data.data.CART_ID; // Extract only CART_ID

          // this.apiservice.addItemToCart(ID)
          this.cartService.fetchAndUpdateCartDetails(this.USERID); // ⭐️ Common Cal
          this.message.success('Item added to cart successfully.');
          sessionStorage.setItem(
            'CART_ID_FOR_CART',
            this.addTOcartdata.CART_ID.toString()
          ); // Convert to string before storing

          if (type == 'S') {
            // this.DrawerName = data.BRAND_NAME
            //
            // if (this.offcanvasInstance) {
            //   this.offcanvasInstance.show();
            // }

            const USERID = this.apiservice.getUserId();
            //  this.loadServicefordrawer = true
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
                  // this.loadServicefordrawer = false;
                  this.updateDisplayedInventorydata();
                  this.inventory();
                } else {
                  this.inventorydataForDrawer = [];
                  // this.loadServicefordrawer = false;
                }
              });
          } else {
            this.inventory();
          }
        } else {
          product.loadingBuyNowcart = false; // Activate loader for clicked product

          this.addTOcartdata = [];
        }
      });

    // }
  }
  filteredTotalCount: number = 0;

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

  inventoryMappingdata: any = [];
  UNIT_ID: any;
  UNIT_NAME: any;
  QUANTITY_PER_UNIT: any;
  ID: any;
  unit_id: any;
  quentity_per_unit: any;
  unit_name: any;
  TYPE = 'SH';
  cartdata: any = [];

  InventoryunitMapping(ID: any) {
    if (this.USERID == 0) {
      // this.message.error('Log in to shop and use all features.');
      // return;
      // this.openLoginModal();
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

  loadMore() {
    this.loading = true;
    setTimeout(() => {
      this.showAll = true;
      this.loading = false;
    }, 1000); // Simulating a small delay for smooth UI
  }

  buyNow(product: any) {
    

    if (this.USERID == 0) {
      this.openLoginModal();
      return;
    }
    product.loadingBuyNow = true; // Activate loader for clicked product

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
        this.teritory_id,
        this.ADDRESS_ID,
        this.TYPE,
        this.unit_id,
        this.quentity_per_unit,
        this.unit_name
      )
      .subscribe(
        (data) => {
          product.loadingBuyNow = false; // Disable loader for this product

          if (data['code'] == 200) {
            this.cartdata.CART_ID = data.data.CART_ID;
            sessionStorage.setItem('CART_ID', this.cartdata.CART_ID.toString());
            // sessionStorage.setItem('Home', Home);
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
          product.loadingBuyNow = false; // Disable loader in case of error
          
        }
      );
  }

      handleBuyNow(product: any) {
  this.buyNow(product);
  this.InventoryunitMapping(product.ID);
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
  
}
