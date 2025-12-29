import { DatePipe } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CartService } from 'src/app/Service/cart.service';
import { ModalService } from 'src/app/Service/modal.service';
interface AddressForm {
  CUSTOMER_ID: number;
  IS_MAPPED_TO_TERRITORY: boolean;
  TERRITORY_ID: number;
  CUSTOMER_TYPE: number;
  CONTACT_PERSON_NAME: string;
  MOBILE_NO: string;
  EMAIL_ID: string;
  ADDRESS_LINE_1: string;
  ADDRESS_LINE_2: string;
  COUNTRY_ID: number;
  STATE_ID: number;
  LANDMARK: any;
  ID: any;
  CITY_ID: any;
  CITY_NAME: string;
  PINCODE_ID: number;
  PINCODE: string;
  DISTRICT_ID: number;
  GEO_LOCATION: string;
  TYPE: string;
  IS_DEFAULT: boolean;
  CLIENT_ID: number;
  STATUS: boolean;
  PINCODE_FOR: any;
}
declare var google: any;

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent {
  constructor(
    private modalService: ModalService,
    private toastr: ToastrService,
    private apiservice: ApiServiceService,
    private cartService: CartService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  Ecommtype: any = '';

  modalVisible: boolean = false;
  isLoading: boolean = false;
  userID: any = this.apiservice.getUserId();
  userNAME: any = this.apiservice.getUserName();
  userAddress: any = this.apiservice.getUserAddress();
  userMobile: any = this.apiservice.getUsermobileNumber();
  userEMAIL: any = this.apiservice.getEmail();
  toggleSubscription: any = Subscription;
  drawerSubscription: any = Subscription;
  VisibleIsDefault: any = true;
  filter: any;
  ngOnInit() {
    // this.modalVisible = true;


    this.modalService.modalState$.subscribe((state: any) => {
      this.initializemap();

      // this.modalVisible = state;
    });

    this.toggleSubscription = this.modalService.toggleState$.subscribe(
      (state) => {
        setTimeout(() => this.initializeMapWithLocation(), 100);
        // this.getAddressList();
        // this.getStateData();
        this.isMobileMenuOpen = state;
        // this.getpincode();
        this.showContent = 'addressForm';
        this.handleModalState(state); // You can trigger UI changes based on the state
      }
    );

    this.drawerSubscription = this.modalService.drawerState$.subscribe(
      (drawerData) => {
        // drawerData is an object containing { isOpen: boolean, payload: any }
        this.isMobileMenuOpen = drawerData.isOpen; // Handle the drawer state
        this.addressForm = drawerData.payload; // Handle the data sent
        this.showContent = 'addressForm'; // Change view content
        this.handleModalState(drawerData.isOpen); // Handle state change logic
        this.getpincode(drawerData?.payload?.PINCODE);
        this.selectedState = drawerData?.payload?.STATE_NAME;
        this.selectedPincode = drawerData?.payload?.PINCODE;
        this.Ecommtype = drawerData?.payload?.shop;

        if (drawerData?.payload?.shop == 1) {
          this.filter = " AND PINCODE_FOR IN ('B', 'I')";
        } else {
          this.filter = " AND PINCODE_FOR IN ('B', 'S')";
        }

        if (drawerData?.payload?.IS_DEFAULT == 1) {
          this.VisibleIsDefault = false;
        } else {
          this.VisibleIsDefault = true;
        }
      }
    );
    this.addressForm = {
      CUSTOMER_ID: 0,
      IS_MAPPED_TO_TERRITORY: false,
      TERRITORY_ID: 0,
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
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    event.stopPropagation(); // Prevent escape key from closing modal
  }

  handleModalState(state: boolean) {
    if (state) {
      // Open modal actions, e.g., show modal
    } else {
      // Close modal actions, e.g., hide modal
    }
  }
  initializemap() {
    setTimeout(() => this.initializeMapWithLocation(), 100);
  }

  showContent: any = 'normal';

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
  confirmLocation(): void {
    // this.toggleMobileMenu()

    // Define a default static location (e.g., New Delhi)
    const defaultLatitude = 28.6139; // Example: New Delhi latitude
    const defaultLongitude = 77.209; // Example: New Delhi longitude

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
    // Fetch address based on coordinates

    this.getAddress(this.latitude, this.longitude);

    // Hide the map
    this.modalService.closeModal();
    // this.modalService.toggle();
    this.isMobileMenuOpen = true;

    // Show the address form and initialize with location data
    this.showContent = 'addressForm';
    this.addressForm.GEO_LOCATION = `${this.latitude},${this.longitude}`;
    // Pre-fill user data if available
    if (this.userID) {
      this.addressForm.CUSTOMER_ID = this.userID;
      // if (this.user.EMAIL_ID) {
      this.addressForm.EMAIL_ID = this.userEMAIL;

      // }
    }
  }

  getAddress(latitude: number, longitude: number): void {
    const geocoder = new google.maps.Geocoder();

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
          const postalCode = addressComponents.find((comp: any) =>
            comp.types.includes('postal_code')
          )?.long_name; // Fallback Pincode if not found

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

  closeMap() {
    this.modalService.closeModal();
  }
  initializeMapWithLocation() {
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
      // Inject z-index fix for .pac-container
      const style = document.createElement('style');
      style.innerHTML = `
        .pac-container {
          z-index: 999999 !important;
          position: absolute !important;
        }
      `;
      document.head.appendChild(style);

      // Check if the search box already exists to prevent duplication
      let searchInput = document.getElementById(
        'searchBox'
      ) as HTMLInputElement;
      if (!searchInput) {
        // Create container div
        const searchBoxContainer = document.createElement('div');
        searchBoxContainer.style.cssText = `
          position: absolute;
          top: 10px;
          left: 10%;
          z-index: 5;
        `;

        // Create input
        searchInput = document.createElement('input');
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
          z-index: 99999;
          position: relative;
        `;

        // Append input to container and container to map controls
        searchBoxContainer.appendChild(searchInput);
        this.map2.controls[google.maps.ControlPosition.LEFT].push(
          searchBoxContainer
        );
      }

      // Initialize SearchBox
      const searchBox = new google.maps.places.SearchBox(searchInput);

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;

        const place = places[0];
        if (!place.geometry) return;

        const location = place.geometry.location;
        this.latitude = location.lat();
        this.longitude = location.lng();

        // Center map and update marker
        this.map2.setCenter(location);
        this.currentMarker.setPosition(location);

        // Fetch address
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

        // After getting Pincode, you can trigger further logic if needed.
        // this.getpincode(postalCode);
      } else {
        // this.getpincode('');
      }
    });
  }

  getAddressComponent(components: any[], type: string): string {
    const component = components.find((comp) => comp.types.includes(type));
    return component ? component.long_name : '';
  }

  fetchPincodeData(pincode: string) {
    this.isLoading = true;
    if (pincode) {
      this.apiservice
        .getPincodeData(
          0,
          0,
          'SEQ_NO',
          'asc',
          " AND IS_ACTIVE =1 AND PINCODE = '" + pincode + "'" + this.filter
        )
        .subscribe({
          next: (data: any) => {
            this.pincodeData = data.data;
            // this.searchPincode = pincode;

            if (this.pincodeData.length > 0) {
              this.selectPincode(this.pincodeData[0]);

              this.addressForm.COUNTRY_ID = this.pincodeData[0].COUNTRY_ID;
              this.addressForm.STATE_ID = this.pincodeData[0].STATE;
              this.addressForm.PINCODE_ID = this.pincodeData[0].ID;
              this.selectedPincode = this.pincodeData[0].PINCODE_NUMBER;

              this.filteredPincodes = this.pincodeData;
              this.isLoading = false;
              this.getStateData();
            }
            this.isLoading = false;
            this.pincodeloading = false; // Hide loading state
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
  addressForm: AddressForm = {
    IS_MAPPED_TO_TERRITORY: false,
    CUSTOMER_ID: 0,
    TERRITORY_ID: 0,
    CUSTOMER_TYPE: 1,
    CONTACT_PERSON_NAME: '',
    MOBILE_NO: '',
    EMAIL_ID: '',
    ADDRESS_LINE_1: '',
    ADDRESS_LINE_2: '',
    STATUS: true,
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
    PINCODE_FOR: '',
  };
  getpincode(pincodeeeee: any) {
    // let pincode: string = this.addressForm.PINCODE || ''; // Use existing PINCODE if available

    let rawPincode: string = this.addressForm?.PINCODE
      ? this.addressForm?.PINCODE
      : '';
    let pincodeMatch = rawPincode.match(/^\d+/); // Matches starting digits
    let pincode: string = pincodeMatch ? pincodeMatch[0] : '';

    //

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
  selectedState: string = '';

  openAddressForm() {
    this.showContent = 'addressForm';
  }

  isMobileMenuOpen: boolean = false;
  toggleMobileMenu(isOpen: boolean) {
    this.showContent = 'addressTab';
    this.isMobileMenuOpen = isOpen;
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  closeMobileMenu() {
    this.modalService.toggle();
    this.toggleMobileMenu(false);
  }

  editAddress(data: any) {
    this.showContent = 'addressForm';

    this.getpincode(data.PINCODE);
    // this.getStateData()
    this.addressForm = data;
    this.selectedState = data.STATE_NAME;
    this.selectedPincode = data.PINCODE;
  }
  addNewAddress() {
    setTimeout(() => this.initializeMapWithLocation(), 100);
    this.modalVisible = true;
    this.addressForm = {
      CUSTOMER_ID: 0,
      IS_MAPPED_TO_TERRITORY: false,
      TERRITORY_ID: 0,
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
  }
  isConfirmLoading: boolean = false;
  addressSubmitted: boolean = false;
  isAddrssSaving: boolean = false;


  saveAddress(form: NgForm): void {
    this.addressSubmitted = true;
    if (form.invalid) {
      return;
    }

    if (!this.gettruecondition()) {
      this.addressForm.IS_DEFAULT = true;
    }
    sessionStorage.setItem('closemodalfalse', '');
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

    // this.addressForm.IS_DEFAULT = true;
    this.addressForm.STATUS = true;
    if (this.addressForm.TYPE == 'Home') {
      this.addressForm.TYPE = 'H';
    } else if (this.addressForm.TYPE == 'Work') {
      this.addressForm.TYPE = 'F';
    } else if (this.addressForm.TYPE == 'Other') {
      this.addressForm.TYPE = 'O';
    }

    if (this.addressForm.TERRITORY_ID == null) {

      this.toastr.info(
        'Service is currently unavailable in this area. Please select a different location',
        ''
      );
      this.isConfirmLoading = false;
    } else {
      if (this.addressForm.ID) {
        this.isConfirmLoading = true;
        this.apiservice.updateCustomerAddress(this.addressForm).subscribe(
          (successCode: any) => {
            if (successCode.body.code === 200) {
              this.isConfirmLoading = false;
              this.toastr.success(
                'Address has been updated successfully.....',
                ''
              );

              this.showAddressDetailsForm = false;
              if (successCode.body?.SUBSCRIBED_CHANNELS?.length > 0) {
                const channelNames = successCode.body.SUBSCRIBED_CHANNELS.map(
                  (channel: any) => channel.CHANNEL_NAME
                );

                this.apiservice
                  .subscribeToMultipleTopics(channelNames)
                  .subscribe(
                    (successCode: any) => { },
                    (error) => {
                      if (error.status === 300) {
                      } else if (error.status === 500) {
                        // Handle server-side error
                        this.toastr.error(
                          'An unexpected error occurred. Please try again later.',
                          ''
                        );
                      } else {
                        this.isConfirmLoading = false;
                        // Generic error handling
                        this.toastr.error(
                          'An unknown error occurred. Please try again later.',
                          ''
                        );
                      }
                    }
                  );
              }
              // clear cart
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
                          // Handle your subscription data here

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
                            NEW_TERRITORY_ID: defaultAddress?.TERRITORY_ID,
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
                                  setTimeout(() => {
                                    this.router
                                      .navigate(['/service'])
                                      .then(() => {
                                        window.location.reload();
                                      });

                                  }, 200);
                                  // this.getAddressList();
                                } else if (successCode.body.code === 300) {
                                }
                              },
                              (error) => {
                                this.isConfirmLoading = false;
                                this.isConfirmLoading = false;
                                // Handle error if login fails
                                if (error.status === 300) {
                                  this.isConfirmLoading = false;
                                } else if (error.status === 500) {
                                  // Handle server-side error
                                  this.toastr.error(
                                    'An unexpected error occurred. Please try again later.',
                                    ''
                                  );
                                } else {
                                  this.isConfirmLoading = false;
                                  // Generic error handling
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
                    this.router.navigate(['/service']).then(() => {
                      window.location.reload();
                    });
                  }
                },
                (error) => { }
              );
              // End clear cart
              this.modalService.notifyAddressUpdated();
              this.modalService.toggleDrawer();
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
            // Handle error if login fails
            if (error.status === 300) {
              this.isConfirmLoading = false;
            } else if (error.status === 500) {
              // Handle server-side error
              this.toastr.error(
                'An unexpected error occurred. Please try again later.',
                ''
              );
            } else {
              this.isConfirmLoading = false;
              // Generic error handling
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

                this.apiservice
                  .subscribeToMultipleTopics(channelNames)
                  .subscribe(
                    (successCode: any) => { },
                    (error) => {
                      if (error.status === 300) {
                      } else if (error.status === 500) {
                        // Handle server-side error
                        this.toastr.error(
                          'An unexpected error occurred. Please try again later.',
                          ''
                        );
                      } else {
                        this.isConfirmLoading = false;
                        // Generic error handling
                        this.toastr.error(
                          'An unknown error occurred. Please try again later.',
                          ''
                        );
                      }
                    }
                  );
              }

              // clear cart
              this.apiservice.getCartDetails(this.userID).subscribe(
                (cartRes: any) => {
                  if (cartRes.data?.CART_DETAILS.length > 0) {
                    this.apiservice
                      .getAddresses1data(
                        0,
                        0,
                        'IS_DEFAULT',
                        'desc',
                        ' AND CUSTOMER_ID=' + this.userID
                      )
                      .subscribe({
                        next: (data1: any) => {
                          // Handle your subscription data here

                          this.addressData = data1.data;
                          const defaultAddress = this.addressData.find(
                            (addr: any) => addr.IS_DEFAULT === 1
                          );

                          // const address = data['data'][0];

                          //

                          // Save PINCODE_FOR in localStorage instead of behavior service
                          localStorage.setItem(
                            'pincodeFor',
                            defaultAddress?.PINCODE_FOR
                          );

                          // Use the stored value from localStorage
                          const pincodeFor = localStorage.getItem('pincodeFor');

                          const data = {
                            CART_ID: cartRes.data?.CART_DETAILS[0].CART_ID,
                            ADDRESS_ID: cartRes.data?.CART_INFO[0].ADDRESS_ID,
                            TYPE: cartRes.data?.CART_INFO[0].TYPE,
                            OLD_TERRITORY_ID:
                              sessionStorage.getItem('CurrentTerritory'),
                            NEW_TERRITORY_ID: defaultAddress?.TERRITORY_ID,
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
                                  this.router
                                    .navigate(['/service'])
                                    .then(() => {
                                      window.location.reload();
                                    });
                                  // this.getAddressList();
                                } else if (successCode.body.code === 300) {
                                }
                              },
                              (error) => {
                                this.isConfirmLoading = false;
                                this.isConfirmLoading = false;
                                // Handle error if login fails
                                if (error.status === 300) {
                                  this.isConfirmLoading = false;
                                } else if (error.status === 500) {
                                  // Handle server-side error
                                  this.toastr.error(
                                    'An unexpected error occurred. Please try again later.',
                                    ''
                                  );
                                } else {
                                  this.isConfirmLoading = false;
                                  // Generic error handling
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
                    this.router.navigate(['/service']).then(() => {
                      window.location.reload();
                    });
                  }
                },
                (error) => { }
              );
              // End clear cart
              this.modalService.notifyAddressUpdated();
              // this.modalService.toggle();
              this.getAddressList();
            } else if (successCode.body.code === 300) {
              this.isConfirmLoading = false;
            }

            this.isConfirmLoading = false;
          },
          (error) => {
            this.isConfirmLoading = false;
            this.isConfirmLoading = false;
            // Handle error if login fails
            if (error.status === 300) {
              this.isConfirmLoading = false;
            } else if (error.status === 500) {
              // Handle server-side error
              this.toastr.error(
                'An unexpected error occurred. Please try again later.',
                ''
              );
            } else {
              this.isConfirmLoading = false;
              // Generic error handling
              this.toastr.error(
                'An unknown error occurred. Please try again later.',
                ''
              );
            }
          }
        );
      }
    }

    // Call your API to save the address
    // Reset form and hide after successful save
  }
  logpincode(event: any) {
    if (event.length >= 6) this.getpincode(event);
  }
  addressData: any = [];
  loadAddresses: boolean = false;
  getAddressList() {
    const filter = ''; // Add your actual filter logic if needed
    const likeQuery = ''; // Add your actual like query if needed
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
          // Handle your subscription data here

          this.addressData = data1.data;
          const defaultAddress = this.addressData.find(
            (addr: any) => addr.IS_DEFAULT === 1
          );

          sessionStorage.setItem(
            'CurrentTerritory',
            defaultAddress?.TERRITORY_ID?.toString()
          );
          this.loadAddresses = false;
        },
        error: (err) => {
          this.loadAddresses = false;
        },
      });
  }
  showStateDropdown: boolean = false;

  selectState(state: any) {
    this.selectedState = state.NAME;
    this.addressForm.STATE_ID = state.ID;

    this.showStateDropdown = false;
  }
  showMap: boolean = false;

  showAddressDetailsForm = false;
  searchState: string = '';
  filteredStates: any[] = [];

  filterStates(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredStates = this.stateData.filter((state: any) =>
      state.NAME.toLowerCase().includes(query)
    );
  }

  toggleStatesDropdown() {
    this.showStateDropdown = !this.showStateDropdown;
    if (this.showStateDropdown) {
      this.filteredStates = [...this.stateData];
    }
  }
  onshowMap() {
    setTimeout(() => this.initializeMapWithLocation(), 100);

    this.modalVisible = true;
  }

  togglePincodeDropdown(pincode: string) {
    this.showPincodeDropdown = !this.showPincodeDropdown;
    this.filteredPincodes = this.pincodeData;
  }

  selectPincode(pincode: any) {

    if (pincode.IS_MAPPED_TO_TERRITORY == 1) {

      this.apiservice
        .getTerretoryData(
          0,
          0,
          '',
          '',
          ` AND IS_ACTIVE =1 AND PINCODE_ID='${pincode.ID}'`
        )
        .subscribe({
          next: (data: any) => {
            this.addressForm.TERRITORY_ID = data?.data?.[0]?.TERRITORY_ID;
            const currentTerritory = sessionStorage.getItem('CurrentTerritory') || '';
            const matchedTerritory =
              this.addressForm.TERRITORY_ID?.toString() === currentTerritory;
            if (matchedTerritory) {
              this.selectedPincode = pincode.PINCODE_NUMBER;
              this.addressForm.PINCODE = pincode.PINCODE;
              this.addressForm.IS_MAPPED_TO_TERRITORY = true;
              this.addressForm.STATE_ID = pincode.STATE;
              this.selectedState = pincode.STATE_NAME;
              this.addressForm.COUNTRY_ID = pincode.COUNTRY_ID;
              this.addressForm.PINCODE_ID = pincode.ID;
              this.addressForm.DISTRICT_ID = pincode.DISTRICT;
              this.addressForm.PINCODE_FOR = pincode.PINCODE_FOR;

              this.getStateData();
              this.showPincodeDropdown = false;
              this.getTerritory();
            } else {
              this.selectedPincode = pincode.PINCODE_NUMBER;
              this.addressForm.PINCODE = pincode.PINCODE;
              this.addressForm.IS_MAPPED_TO_TERRITORY = true;
              this.addressForm.STATE_ID = pincode.STATE;
              this.selectedState = pincode.STATE_NAME;
              this.addressForm.COUNTRY_ID = pincode.COUNTRY_ID;
              this.addressForm.PINCODE_ID = pincode.ID;
              this.addressForm.DISTRICT_ID = pincode.DISTRICT;
              this.addressForm.PINCODE_FOR = pincode.PINCODE_FOR;

              this.getStateData();
              this.showPincodeDropdown = false;
              // this.toastr.info(
              //   'You have selected a pincode outside of your mapped territory. Please choose a valid pincode.',
              //   'Territory Mismatch'
              // );
            }

            this.pincodeloading = false;
          },
          error: (error: any) => {
            this.pincodeloading = false;
          },
        });
    } else {
      // this.toastr.info(
      //   'Service is currently unavailable in this area. Please select a different location 1',
      //   ''
      // );
    }
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
          // this.terrotaryData = data.data;
          this.addressForm.TERRITORY_ID = data['data'][0].TERRITORY_ID;

          this.pincodeloading = false; // Hide loading state
        },
        error: (error: any) => {
          this.pincodeloading = false; // Hide loading state
        },
      });
  }

  onKeyDown(event: KeyboardEvent): void {
    // Check if the pressed key is Enter (key code 13)
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
    }
  }

  togglePincodeDropdown123(pincode: string) {
    this.filteredPincodes = this.pincodeData.filter(
      (p: any) => p.PINCODE === pincode
    );
  }
  filterPincodes(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredPincodes = this.pincodeData.filter(
      (item: any) =>
        item.PINCODE.toLowerCase().includes(query) ||
        item.PINCODE_NUMBER.toLowerCase().includes(query)
    );
  }
  gettruecondition() {
    if (sessionStorage.getItem('closemodalfalse') == 'false') {
      return false;
    } else {
      return true;
    }
  }
}
