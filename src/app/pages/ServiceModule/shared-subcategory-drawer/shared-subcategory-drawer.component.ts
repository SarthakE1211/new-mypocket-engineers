import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { format, addDays } from 'date-fns';
import { HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { ModalService } from 'src/app/Service/modal.service';
import { CartService } from 'src/app/Service/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shared-subcategory-drawer',
  templateUrl: './shared-subcategory-drawer.component.html',
  styleUrls: ['./shared-subcategory-drawer.component.scss'],
})
export class SharedSubcategoryDrawerComponent {
  @Input() drawerClose!: Function;
  @Input() isDrawerVisible: boolean = false;
  @Input() data: any = [];
  @Input() imagePreview: any;
  @Input() showModal: boolean = false;
  @Input() fromservice: any;

  @Input() progress: any;
  customertype: any = this.apiservice.getCustomerType();

  selectedSlot: string = ''; // Stores the selected time slot
  // quantity: any;
  userID: any = this.apiservice.getUserId();
  @Input() quantity: number = 1;
  isFocused: string = '';
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

  close() {
    this.drawerClose();

    this.showModal = false;
    this.imagePreview = null;
    this.data.SERVICE_PHOTO_FILE = '';
    this.decreaseProgress();
  }
  decreaseProgress() {
    if (this.progress > 0) {
      this.progress -= 25; // Decrease progress on back
    }
  }

  formatTime(time: string): string {
    let [hours, minutes] = time.split(':').map(Number);
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert '00' or '12-23' to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  loadepage: boolean = false;
  IMAGEuRL: any;
  @Input() DefaultAddressArray: any = [];
  @Input() addresses: any[] = [];

  today = new Date();
  selectedDate: string = format(this.today, 'EEE, MMM d, yyyy'); // Default to today
  dates: { display: string; fullDate: string }[] = [];

  constructor(
    private router: Router,
    private message: ToastrService,
    private datePipe: DatePipe,
    private apiservice: ApiServiceService,
    private modalService: ModalService,
    private cartService: CartService
  ) {
    

    this.generateDates();

  }
  generateDates() {
    this.dates = []; // Clear previous dates to avoid duplicates
    this.IMAGEuRL = this.apiservice.retriveimgUrl2();

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

  // quantity: number = 1;
  manualChange: boolean = false; // Track manual interaction

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data?.ID) {
      this.getCartDetails(); // Call when data input changes
    }

    
   
  }

  cartDetails: any[] = []; // to store CART_DETAILS
  InCart: boolean = false; // to control button visibility
  // isLoading: boolean = false;
  addressSubscription: any = Subscription;

  ngOnInit() {

    this.addressSubscription = this.modalService.addressUpdated$.subscribe(
      () => {
        // Refresh the address list when the event is received
        this.getAddresses1();
      }
    );

    this.getAddresses1();
  }
  ngAfterViewInit(): void {
    // Lock scroll when component is rendered
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Restore scroll when component is destroyed
    document.body.style.overflow = '';
  }
  closemodals()
  {
    
    
    document.body.style.overflow = ' ';

  }
  getCartDetails() {
    this.apiservice.getCartDetails(this.userID).subscribe((res: any) => {
      if (res.code === 200) {
        this.cartDetails = res.data.CART_DETAILS;

        // Check if current service ID exists in cart
        const found = this.cartDetails.some(
          (item: any) => item.SERVICE_ID === this.data.ID
        );

        // Use setTimeout to ensure view updates
        setTimeout(() => {
          this.InCart = found; // Update after microtask
        }, 0);
      } else {
        this.cartDetails = [];
        setTimeout(() => {
          this.InCart = false; // Update after microtask
        }, 0);
      }
    });
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

            // Get default address
            this.defaultAddress =
              this.addresses.find((addr) => addr.IS_DEFAULT === 1) ||
              this.addresses[0];
            if (this.defaultAddress) {
              this.selectedAddress = this.defaultAddress.ID;
            } else {
              this.message.error(
                'Territory not found, Please select other pincode'
              );
            }
            this.DefaultAddressArray = this.defaultAddress;

            if (this.DefaultAddressArray['TERRITORY_ID']) {
              // this.getProjectData();
              // this.getBannerData();
              // this.generateDates(); // Populate the dates array
              // this.geServiceCategories();
              // this.getpincode();
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
  @Input() defaultAddress: any;
  openAddressModal() {
    let modalElement: any = document.getElementById('addressModal1');
    let modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  increaseQty() {
    if (this.quantity < this.data.MAX_QTY) {
      this.quantity++;
    } else {
      this.message.info(
        `Maximum quantity allowed is ${this.data.MAX_QTY}`,
        'Limit Exceeded'
      );
    }
    this.updateDataQuantity();
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
    this.updateDataQuantity();
  }

  changeData(newQty: any) {
    const qty = Number(newQty);
    if (qty < 1) {
      this.quantity = 1;
    } else if (qty > this.data.MAX_QTY) {
      this.quantity = this.data.MAX_QTY;
      this.message.info(
        `Maximum quantity allowed is ${this.data.MAX_QTY}`,
        'Limit Exceeded'
      );
    } else {
      this.quantity = qty;
    }
    this.updateDataQuantity();
  }

  updateDataQuantity() {
    // this.data.QUANTITY = this.quantity;
    this.manualChange = true; // Set flag to avoid resetting in ngOnChanges
  }

  // ---------------------------------------  upload code ----------------------------- //

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

    this.data.SERVICE_PHOTO_FILE = filename; // Store the generated filename
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
              this.IMAGEuRL + 'CartItemPhoto/' + this.data.SERVICE_PHOTO_FILE;
            this.showModal = true;
          } else {
            this.message.error('Failed to upload image.', '');
            this.imagePreview = null;
            this.data.SERVICE_PHOTO_FILE = null;
            this.showModal = false;
          }
        }
      },
      error: () => {
        this.isUploading = false;
        this.message.error('Failed to upload image.', '');
        this.imagePreview = null;
        this.data.SERVICE_PHOTO_FILE = null;
        this.showModal = false;
      },
    });
  }

  removeImage() {
    this.data.SERVICE_PHOTO_FILE = null;
    this.imagePreview = null;
    this.showModal = false;
  }

  openModal() {
    this.imagePreview =
      this.IMAGEuRL + 'CartItemPhoto/' + this.data.SERVICE_PHOTO_FILE;
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  IconDeleteConfirm(data: any) {}
  viewImage(data: any) {}

  // ---------------------------------------  upload code ----------------------------- //

  // ---------------------------------------  Add to cart and next submit  ----------------------------- //

  isLoading = false; // Add this property in your component
  isInCart: boolean = false;

  toggleCart(selectedService: any) {
    if (!selectedService || !this.DefaultAddressArray) {
      this.message.error('Invalid service or address details.');
      return;
    }

    this.isLoading = true; // Start loading
    this.InCart = !this.InCart;

    if (this.InCart) {
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

          if (res.code == 200) {
            this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
          }
          this.apiservice.addItemToCart(selectedService);

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
  cartId: any;

  updateProgress() {
    this.progress += this.fromservice ? 50 : 25; // Increase by 50 if true, else 25

    if (this.progress > 100) {
      this.progress = 100; // Ensure it doesn't exceed 100
    }
  }

  openDrawer2(data: any) {
    this.updatedselectedService = [data];
    this.selectedSlot = '';

    if (!this.data || !this.data.ID) {
      return; // Stop execution if no valid service is selected
    }

    // Copying IS_EXPRESS value
    this.data.IS_EXPRESS1 = this.data.IS_EXPRESS;
    // Show loader before API call
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
            this.updateProgress();
            this.TerritoryData = response.data;

            if (this.TerritoryData && this.TerritoryData.length > 0) {
              if (this.dates && this.dates.length > 0) {
                // this.selectedDate = this.dates[0].fullDate; // Set first available date

                this.getCartSlots(this.TerritoryData);

                // this.updateTimeSlots(this.selectedDate); // Call only after TerritoryData is set
              } else {
              }
            } else {
            }

            // Open the drawer only after API response
          } else {
            this.TerritoryData = []; // Reset the list if no data is found
          }

          // Hide loader after response
          this.loadepage = false;
        },
        (error) => {
          this.loadepage = false; // Hide loader on error
        }
      );

    const formatteddataadd = {
      SERVICE_ID: this.data.ID,
      QUANTITY: this.quantity,
      INVENTORY_ID: 0,
      TYPE: 'S',
      SERVICE_CATALOGUE_ID: this.data.PARENT_ID,
      BRAND_NAME: this.data.BRAND_NAME,
      MODEL_NUMBER: this.data.MODEL_NUMBER,
      SERVICE_PHOTO_FILE: this.data.SERVICE_PHOTO_FILE,
      DESCRIPTION: this.data.DESCRIPTION,
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
          this.cartService.fetchAndUpdateCartDetails(this.userID); // ⭐️ Common Call
        }
        res.code === 200
          ? ''
          : this.message.error('Failed to add item to cart.');
        this.cartId = res.data.CART_ID;

        this.openDrawerUI(this.cartId);
      },
      (error) => {
        this.loadepage = false;

        this.message.error('Error adding item to cart.');
      }
    );
  }
  // Function to call CartslotGet and update time slots
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

          this.selectedDate = this.dates[0].fullDate; // Set first available date

          this.updateTimeSlots(this.selectedDate); // Call update function
        } else {
        }
      },
      (error) => {}
    );
  }

  backaddress() {
    this.InCart = false;
  }
  // ---------------------------------------  Add to cart and next submit  ----------------------------- //

  selectedAddress: string = '';

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

    // Step 2: Update selected address as default
    const updateDefaultData = {
      CUSTOMER_ID: this.userID,
      ID: this.selectedAddress,
    };
    const defaultaddress = this.addresses.filter(
      (data: any) => data.ID == this.selectedAddress
    );

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
                        (error) => {}
                      );
                  },
                  error: (err) => {},
                });
            } else {
              // No cart items, just navigate
              this.navigateToServicePage();
            }
          },
          (error) => {}
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

  editAddress(address: any) {
    address['shop'] = '0';

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
  closeAddressModal() {
    // this.router.navigate(['/service-page']); // Change route as per your need

    let modalElement: any = document.getElementById('addressModal1');
    let modal: any = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
  addNewAddress() {
    this.closeAddressModal();
    this.ConfirmcloseAddressModal();
    this.modalService.openModal();
  }

  // ---------------------------------------  Address Slot ----------------------------- //
  // IS_EXPRESS: any;
  // toggleExpressService() {
  //   this.data.IS_EXPRESS1 = this.data.IS_EXPRESS1 === 1 ? 0 : 1;
  // }

  IS_EXPRESS: number = 0; // 0 = not selected, 1 = selected

  toggleExpressService() {
    this.IS_EXPRESS = this.IS_EXPRESS === 1 ? 0 : 1;
    // this.selectedService.IS_EXPRESS1 = this.IS_EXPRESS;
  }

  selectDate(date: string) {
    this.selectedSlot = ''; // Reset selected time slot when date changes
    this.selectedDate = date;

    // Wait until TerritoryData is available before updating time slots
    if (this.TerritoryData && this.TerritoryData.length > 0) {
      this.updateTimeSlots(date);
    } else {
      // Check periodically until TerritoryData is loaded
      const interval = setInterval(() => {
        if (this.TerritoryData && this.TerritoryData.length > 0) {
          clearInterval(interval);
          this.updateTimeSlots(date);
        }
      }, 100);
    }
  }
  MaxEndValue: any;

  updateTimeSlots(date: any) {
    const territory = this.TerritoryData?.find((t: any) => t.IS_ACTIVE === 1);

    if (!territory) {
      return;
    }

    const selectedDateMoment = moment(date, 'ddd, MMM D, YYYY');

    if (!Array.isArray(this.updatedselectedService)) {
    
      this.updatedselectedService = [];
    }

    if (!this.timeSlots || this.timeSlots.length === 0) {
      return;
    }

    const { serviceStart, serviceEnd } =
      this.getServiceTimeRange(selectedDateMoment);

    if (!serviceStart || !serviceEnd || serviceStart.isAfter(serviceEnd)) {
      this.timeSlots = this.timeSlots.map((period) => ({
        ...period,
        times: { ...period.times, disabled: true },
      }));
      return;
    }

    // Update slots based on valid start/end
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
    const territory = this.TerritoryData?.find((t: any) => t.IS_ACTIVE === 1);
    if (!territory) return { serviceStart: null, serviceEnd: null };

    // Gather start times
    const startTimeArray = [
      ...this.updatedselectedService.map((service: any) =>
        moment(service.START_TIME, 'HH:mm')
      ),
      moment(territory.START_TIME, 'HH:mm:ss'),
    ].filter((time) => time.isValid());

    // Gather end times
    const endTimeArray = [
      ...this.updatedselectedService.map((service: any) =>
        moment(service.END_TIME, 'HH:mm')
      ),
      moment(territory.END_TIME, 'HH:mm:ss'),
    ].filter((time) => time.isValid());

    // Preparation time handling for current day
    if (selectedDate.isSame(moment(), 'day')) {
      const maxPreparationMinutes = this.updatedselectedService.reduce(
        (maxTime: number, service: any) => {
          let totalMinutes = 0;

          if (
            service.T_PREPARATION_HOURS != null ||
            service.T_PREPARATION_MINUTES != null
          ) {
            const hours = parseInt(service.T_PREPARATION_HOURS ?? 0, 10) || 0;
            const minutes =
              parseInt(service.T_PREPARATION_MINUTES ?? 0, 10) || 0;
            totalMinutes = hours * 60 + minutes;
          } else {
            const hours = parseInt(service.PREPARATION_HOURS ?? 0, 10) || 0;
            const minutes = parseInt(service.PREPARATION_MINUTES ?? 0, 10) || 0;
            totalMinutes = hours * 60 + minutes;
          }

          return Math.max(maxTime, totalMinutes);
        },
        0
      );

      if (maxPreparationMinutes > 0) {
        startTimeArray.push(moment().add(maxPreparationMinutes, 'minutes'));
      }
    }

    const serviceStart = moment.max(startTimeArray);
    const serviceEnd = moment.min(endTimeArray);

    this.MaxEndValue = serviceStart.format('hh:mm A'); // Useful for bookNow()

    return { serviceStart, serviceEnd };
  }
  isAllSlotsDisabled(): boolean {
    return this.timeSlots?.every((slot) => slot.times.disabled);
  }

  // Method to select a time slot
  selectSlot(times: any) {
    this.selectedSlot =
      this.formatTime(times.start) + ' - ' + this.formatTime(times.end);
  }

  remark: any;
  AddCartID: any;
  openDrawerUI(data: any) {
    const drawerElement = document.getElementById('addressSlotDrawer22');
    if (drawerElement) {
      // Ensure it appears above other elements
      drawerElement.style.zIndex = '1055'; // Bootstrap modal z-index is 1050, so keep it higher

      this.AddCartID = data;
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(drawerElement);
      offcanvas.show();
    } else {
    }
  }

  bookNow() {
    if (!this.selectedDate) {
      this.message.warning(
        'Please select a date before proceeding with the order.'
      );
      return;
    }

    if (!this.selectedSlot) {
      this.message.warning(
        'Please select a time slot before proceeding with the order.'
      );
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

      // Correct parsing for MaxEndValue → 12-hour format with AM/PM
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

      // Now pure time comparison
      if (maxEndMoment.isBefore(slotStartMoment)) {
        expectedTime = formattedStartTime;
      } else if (
        maxEndMoment.isBetween(slotStartMoment, slotEndMoment, undefined, '[]')
      ) {
        expectedTime = maxEndMoment.format('HH:mm:ss');
      } else {
        expectedTime = formattedEndTime;
      }

      // Round expectedTime to nearest 10 mins
      let roundedTimeMoment = moment(expectedTime, 'HH:mm:ss');
      const minutes = roundedTimeMoment.minutes();
      const remainder = minutes % 10;
      if (remainder !== 0) {
        roundedTimeMoment.add(10 - remainder, 'minutes').seconds(0);
      } else {
        roundedTimeMoment.seconds(0); // Ensure seconds = 0 even if already on 10 min mark
      }
      expectedTime = roundedTimeMoment.format('HH:mm:ss');

      const expectedDateTime = `${formattedDate} ${expectedTime}`;

      const payload = {
        SCHEDULE_DATE: formattedDate,
        SCHEDULE_START_TIME: formattedStartTime,
        SCHEDULE_END_TIME: formattedEndTime,
        EXPECTED_DATE_TIME: expectedDateTime,
        // IS_EXPRESS: this.data?.IS_EXPRESS1 ? 1 : 0,
        IS_EXPRESS: this.IS_EXPRESS ? 1 : 0,

        REMARK: this.remark || '',
        CART_ID: this.AddCartID,
      };

      // API call
      this.apiservice.BookOrder(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.code === 200) {
            // this.message.success('Your order has been successfully scheduled.');

            // Route to order-details with ID from selectedService
            this.router.navigate(['/order-review', this.AddCartID]);
          } else {
            this.message.error(
              ' Something went wrong. Please try again later.'
            );
          }
        },
        error: (error) => {
          this.isLoading = false;

          this.message.error(
            'Something went wrong. Please try again later.'
          );
        },
      });
    } catch (error) {
      this.isLoading = false;

      this.message.error('⚠ Something went wrong. Please try again.');
    }
  }

  FUNCTION_TYPE: any;
  ConfirmopenAddressModal(type: any) {
    this.FUNCTION_TYPE = '';
    this.FUNCTION_TYPE = type;
    this.closeAddressModal();
    let modalElement: any = document.getElementById('confirmtoaddaddress');
    let modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  ConfirmcloseAddressModal() {
    this.FUNCTION_TYPE = '';
    let modalElement: any = document.getElementById('confirmtoaddaddress');
    let modal: any = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
  Procced() {
    if (this.FUNCTION_TYPE == 'select') {
      this.confirmAddress();
    } else if (this.FUNCTION_TYPE == 'add') {
      this.addNewAddress();
    }
  }

  // ---------------------------------------  Address Slot ----------------------------- //
}
