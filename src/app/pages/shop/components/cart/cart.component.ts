import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CartService } from 'src/app/Service/cart.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})

export class CartComponent {

  constructor(
    private apiservice: ApiServiceService,
    private message: ToastrService,
    private router: Router,
    private cartService: CartService,
    private metaService: Meta,
    private titleService: Title) {
    this.updateSEO();
  }
  customertype: any = this.apiservice.getCustomerType();



  CART_ID: any;
  loadService: boolean = false;
  IMAGEuRL: any;
  CartDetails: any = [];
  DemoCartDetails: any = [];
  CartInfo: any = [];
  updateSEO() {
    // alert('ddd')
    this.titleService.setTitle('Your Shopping Cart - PockIT Web');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Review and manage your shopping cart at PockIT Web. Secure checkout for laptop parts, computer accessories, SSDs, RAM, and more.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'shopping cart, buy laptop parts, computer accessories, checkout, secure payment, order summary, online shopping',
    });

    // Open Graph (For Facebook, LinkedIn)
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Your Shopping Cart - PockIT Web',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Check your cart before checkout at PockIT Web. Buy SSDs, RAM, motherboards, and laptop accessories securely online.',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://my.pockitengineers.com/shop/cart',
    });
    // Twitter Card
    this.metaService.updateTag({
      name: 'twitter:title',
      content: 'Your Shopping Cart - PockIT Web',
    });

    this.metaService.updateTag({
      name: 'twitter:description',
      content:
        'Manage your shopping cart and proceed to checkout. Buy laptop parts and computer accessories securely online at PockIT Web.',
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

  ngOnInit() {
    this.CART_ID = sessionStorage.getItem('CART_ID_FOR_CART');
    // this.details();
    this.getServiceCartDetails();

    
    
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();
    // this.apiservice.clearCart();
    this.Address();
    setTimeout(() => {
      if (document.documentElement.scrollHeight <= window.innerHeight) {
        document.body.style.overflowY = 'auto'; // Force scrollbar if missing
      } else {
        document.body.style.overflowY = ''; // Keep default behavior
      }
    }, 300); // Delay to allow content to load
  }

  handleImageError(event: any) {
    event.target.src = 'assets/img/services/no-image.png'; // Set default image
  }

  userID: any = this.apiservice.getUserId();
  cartItems: any[] = [];
  isLoading: boolean = false; // For loading state
  removeItem1(id: any) {
    // const cartItem = this.cartItems.find(item => item.ID === id);
    // if (!cartItem) return;
    // this.cartItems = this.cartItems.filter((item) => item.ID !== id);
    const formatteddataremove = {
      CUSTOMER_ID: this.userID,
      SERVICE_ID: id.SERVICE_ID,
      CART_ID: id.CART_ID,
      CART_ITEM_ID: id.ID,
      TYPE: 'S',
    };
    //
    this.isLoading = true;
    this.apiservice.RemoveFromCart(formatteddataremove).subscribe(
      (res) => {
        this.isLoading = false;
        if (res.code == 200) {
          this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
          this.getServiceCartDetails();
          this.message.success('Item removed from cart successfully.');
        } else {
          this.message.error('Failed to remove item from cart.');
        }
      },
      (error) => {
        this.isLoading = false;
        
        this.message.error('Error removing item from cart.');
      }
    );
  }
  checkout() {
    if (this.cartItems.length !== 0) {
      // alert('Your cart is empty.');
      // return;
      this.router.navigate(['/order-review', this.cartItems[0]['CART_ID']]);
    }
    // alert('Proceeding to checkout...');
    // Add navigation or API call logic here
  }
  isDrawerVisible: boolean = false;
  drawerData: any = [];
  originalBackdropOpacity: string = '';
  // isDrawerVisible: boolean = false;
  // drawerData: any = [];
  DefaultAddressArray: any = [];
  defaultAddress: any;
  loadepage: boolean = false;
  addresses: any[] = [];
  CartID: any;
  updatedselectedService: any;
  isExpressOn: any;

  openNextDrawer(data: any) {
    this.isDrawerVisible = false; // Hide initially
    this.loadepage = true; // Start loading spinner
    // Set the data first
    this.drawerData = data;
    this.updatedselectedService = data;
    this.CartID = data[0]['CART_ID'];
    // Set express flag
    if (this.drawerData && Array.isArray(this.drawerData)) {
      this.isExpressOn = this.drawerData.some(
        (item: any) => item.IS_EXPRESS === 1
      );
    }

    // Spinner + drawer open delay

    setTimeout(() => {
      this.isDrawerVisible = true; // Show drawer
      this.loadepage = false; // Stop spinner after 5 sec
      const serviceDrawer = document.getElementById('offcanvasRightMultiple');
      if (serviceDrawer) {
        let offcanvasInstance = bootstrap.Offcanvas.getInstance(serviceDrawer);
        if (!offcanvasInstance) {
          offcanvasInstance = new bootstrap.Offcanvas(serviceDrawer);
        }
        offcanvasInstance.show();
      }
    }, 3000); // 5 seconds delay
  }

  drawerClose() {
    this.isDrawerVisible = false;
    setTimeout(() => {
      const serviceDrawer = document.getElementById('offcanvasRightMultiple');
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

  getServiceCartDetails() {
    this.cartItems = [];
    this.DemoCartDetails = [];
    this.isLoading = true;
    this.apiservice.getCartDetails(this.userID).subscribe(
      (cartRes: any) => {
        this.isLoading = false;
        if (cartRes?.code === 200 && cartRes.data.CART_DETAILS.length > 0) {
          // this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
          this.CartDetails = cartRes?.data?.CART_DETAILS;

          

          this.CART_IDI = cartRes?.data?.CART_DETAILS[0].CART_ID;
          this.loadService = false;
          this.CartInfo = cartRes.data.CART_INFO;
          this.DemoCartDetails = cartRes.data.CART_DETAILS[0]['ITEM_TYPE'];

          
          
          this.cartItems = cartRes.data.CART_DETAILS.map((item: any) => ({
            ...item,
            START_TIME: this.formatTime(item.START_TIME),
            END_TIME: this.formatTime(item.END_TIME),
            CREATED_MODIFIED_DATE: new Date(item.CREATED_MODIFIED_DATE),
          }));

        } else {
          this.DemoCartDetails = [];
          this.cartItems = [];
          this.CartDetails = [];
          this.loadService = false;
          // this.message.warning('Cart is empty', 'Warning'); // Toaster notification for empty cart

        }
      },
      (error) => {
        
        this.isLoading = false;
        this.message.error('Failed to fetch cart details', 'Error'); // Error toaster
      }
    );
  }

  // Function to format time (HH:mm:ss → hh:mm a)
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

  CART_IDI: any;
  inventory_id: any

  // loadServiceforinventory:boolean=false;

  details() {
    // this.loadServiceforinventory = true;
    
    this.loadService = true;
    this.apiservice.getCartDetails(this.userID).subscribe((data: any) => {
      if (data['code'] == 200) {
        this.CartDetails = data?.data?.CART_DETAILS;
        // Extract and log all INVENTORY_ID values
        // this.loadServiceforinventory = false;

        this.CartDetails.forEach((item: any) => {
          
          this.inventory_id = item.INVENTORY_ID
          
        });
        
        this.CART_IDI = this.CartDetails[0]?.CART_ID;
        this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
        this.loadService = false;
        this.CartInfo = data.data.CART_INFO;
        
        
      } else {
        this.CartDetails = [];
        // this.loadServiceforinventory = false;
        this.loadService = false;
      }
    });

  }

  quantity: number = 1;
  price: number = 39530;
  totalPrice: number = this.price;
  updateTotal() {
    this.totalPrice = this.quantity * this.price;
  }

  


  // ....................................shop code start........................
  // Address get

  Addressdata: any = []
  STATE_ID: any;
  ADDRESS_ID: any;
  teritory_id: any
  CUSTOMER_ID = this.apiservice.getUserId()
  PincodeFor: any
  Address() {
    this.apiservice.getAddress(0, 0, 'IS_DEFAULT', 'desc', ' AND IS_DEFAULT = 1 AND CUSTOMER_ID =' + this.CUSTOMER_ID).subscribe((data) => {
      if (data['code'] == 200) {
        this.Addressdata = data.data;
        if (this.Addressdata.length > 0) { // Ensure array has at least one entry
          this.STATE_ID = this.Addressdata[0].STATE_ID;
          this.ADDRESS_ID = this.Addressdata[0].ID; // Use "ID" instead of "ADDRESS_ID" as per JSON
          this.teritory_id = this.Addressdata[0].TERRITORY_ID; // Correct key name
          
          this.PincodeFor = this.Addressdata[0].PINCODE_FOR;
        }
      } else {
        this.Addressdata = [];
      }
    });
  }

  removeItemdata: any = [];
  TYPE: any = 'P';
  CART_id: any;
  CART_ITEM_ID: any;
  INVENTORY_ID: any;
  QUANTITY: any;
  customer_id = this.apiservice.getUserId()
    ;
  removeItem(data: any) {
    this.CART_id = data.CART_ID;
    this.CART_ITEM_ID = data.ID;
    this.INVENTORY_ID = data.INVENTORY_ID;
    this.apiservice.Deletecart(
      this.TYPE,
      this.customer_id,
      this.CART_id,
      this.CART_ITEM_ID,
      this.INVENTORY_ID
    ).subscribe((data) => {
      if (data['code'] == 200) {
        this.message.success('Cart Remove successfully.', '');
        this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
        this.getServiceCartDetails();
        this.removeItemdata = data?.data?.CART_DETAILS;
        this.loadService = false;
      } else {
        this.removeItemdata = [];
        this.loadService = false;
      }
    });
  }


  increaseQuantity(data: any) {
    
  
    if (data.CURRENT_STOCK === 0) {
      this.message.warning('Current stock is not available.', '');
      return;
    }
  
    // Check if QUANTITY is less than both CURRENT_STOCK and UNIT_STOCK
    if (data.QUANTITY < data.CURRENT_STOCK && data.QUANTITY < data.UNIT_STOCK) {
      data.QUANTITY++; // Increase the quantity only if within limits
      this.CART_id = data.CART_ID;
      this.CART_ITEM_ID = data.ID;
      this.INVENTORY_ID = data.INVENTORY_ID;
      this.QUANTITY = data.QUANTITY;
  
      // API call to update the cart count
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
            this.message.success('1 Quantity Added Successfully', '');
            this.details();
          } else {
            
          }
        });
    } else {
      this.message.warning('No more stock is available', '');
    }
  }
  

  decreaseQuantity(data: any) {
    if (data.QUANTITY > 1) {
      data.QUANTITY--; // Decrease the quantity only if greater than 1
      this.CART_id = data.CART_ID;
      this.CART_ITEM_ID = data.ID;
      this.INVENTORY_ID = data.INVENTORY_ID;
      this.QUANTITY = data.QUANTITY;
      // API call to update the cart count
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
            this.message.success('1 quantity removed successfully', '');
            this.details();
          } else {
            
          }
        })
    }
  }


  quantityy: number = 1;
  IS_TEMP_CART = 1
  TYPEs = 'P'
  DEMO: any;
  cartdata: any = []
  CartDetailsCartInfoData: any = []
  CartDetailsID: any

  buyNow(product: any) {
    
    
    if (this.QUANTITY == undefined || this.QUANTITY == null) {
      this.QUANTITY = 1;
    }
  
    
  
    this.ID = product.INVENTORY_ID;
    this.unit_id = product.UNIT_ID;
    this.quentity_per_unit = product.QUANTITY_PER_UNIT;
    this.unit_name = product.UNIT_NAME;
    this.QUANTITY = product.QUANTITY;
  
    
    
    
    
  
    let Cart: any = 2;
  
    this.apiservice.CartGet(this.customer_id, this.ID, this.QUANTITY, this.IS_TEMP_CART, this.STATE_ID, this.teritory_id, this.ADDRESS_ID, this.TYPE, this.unit_id, this.quentity_per_unit, this.unit_name).subscribe((data) => {
      if (data['code'] == 200) {
        this.cartdata.CART_ID = data.data.CART_ID;
        
        sessionStorage.setItem("CART_ID", this.cartdata.CART_ID.toString());
        sessionStorage.setItem('Cart', Cart);
        this.DEMO = data.data.CART_ID;
        
        this.router.navigate(['/shop/check-out', this.DEMO, 'C']);
        // this.cartService.fetchAndUpdateCartDetails(this.userID);
      } else {
        this.cartdata = [];
      }
    });
  }
  
  checkoutHandler(data:any) {
    if (this.CartDetails.length === 1) {
      this.buyNowforcommonbutton(data); // Apply this when only one card exists
    } else {
      // this.CartDetails.filter((product : any) => {
      //   if(product.CART_ID == data.CART_ID){
          this.buyNow(data); 
      //   }else{
      //     return
      //   }
      //   // Apply this when multiple cards exist
      // });
    }
  }



  ID: any
  unit_id: any
  quentity_per_unit: any
  unit_name: any
  loadalldata: boolean = false

  buyNowforcommonbutton(data:any) {
    this.loadalldata = true;

        this.CartDetailsID = data.CART_ID;
        this.router.navigate(['/shop/check-out', this.CartDetailsID, 'C']);
        // this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call

   
  }
  buyNowforcommonbutton123(data:any) {
    this.loadalldata = true;
    this.CartDetailsID = data[0].CART_ID;
    this.router.navigate(['/shop/check-out', this.CartDetailsID, 'C']);  
  }
  // buyNowforcommonbutton123() {
  //   this.loadalldata = true;
  //   this.apiservice.getAddressDetails(0, 0, 'id', 'desc', '', this.CART_ID).subscribe((data) => {
  //     if (data['code'] == 200) {
  //       this.CartDetailsCartInfoData = data.data;
  //       this.CartDetailsID = data.data.CART_DETAILS[0].CART_ID;
  //       this.CartInfo = data.data.CART_INFO;
  //       this.router.navigate(['/shop/check-out', this.CartDetailsID, 'C']);
  //       // this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call

  //     } else {
  //       this.CartDetails = [];
  //     }
  //     this.loadalldata = false;
  //   }, () => {
  //     this.loadalldata = false; // Ensure loader stops on error
  //   });
  // }



}

