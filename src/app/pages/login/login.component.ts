import {
  Component,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { Gallery } from "ng-gallery";
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Lightbox } from "ng-gallery/lightbox";
import { CookieService } from 'ngx-cookie-service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  Validators,
} from '@angular/forms';
import { interval, takeWhile } from 'rxjs';
import { HostListener } from '@angular/core';
import { ModalService } from 'src/app/Service/modal.service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { LoaderService } from 'src/app/Service/loader.service';

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
  PASSWORD: any;
}

interface AddressForm {
  CUSTOMER_ID: number;
  CUSTOMER_TYPE: number;
  organizationName: string;
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

interface User {
  ID: number;
  EMAIL_ID?: string;
}
declare var google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private cookie: CookieService,
    private modalService1: ModalService,
    private api: ApiServiceService,
    private toastr: ToastrService,
    // public gallery: Gallery,
    // public lightbox: Lightbox,
    private router: Router,
    private fb: FormBuilder,
    private loaderService: LoaderService

  ) {
    const customerType = localStorage.getItem('customerType');
    if (customerType === 'I') {
      this.showMap = false;
      this.showAddressDetailsForm = false;
      localStorage.setItem('skipLocationCheck', 'true');
      localStorage.setItem('locationSet', 'true');
    }
  }
  confirmPassword: string = '';

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '../../../../../assets/images/profile.png';
  }
  emailPattern: RegExp =
    /^(?!.*\.\..*)(?!.*--.*)(?!.*-\.|-\@|\.-|\@-)[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  isUserLoggedIn: boolean = false;
  showLoginModal: boolean = false;
  private modalService: any = inject(NgbModal);
  mobileNumberorEmail: string = '';
  userType: string = '';
  mobileNumberlogin: any;
  PASSWORDLOGIN: any;
  userModal: boolean;
  isAutoVerifying = false;

  @ViewChild('content') content!: TemplateRef<any>;
  openVerticallyCentered(content: TemplateRef<any>) {
    this.mobileNumberorEmail = '';
    // this.modalService.open(content, { centered: true });
    this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
  }
  public commonFunction = new CommonFunctionService();

  // Chat, Call and login model logic
  showCallAndChatButtons(data: any): void {

    if (data.WHO_WILL_SHOW) {
      // If user is logged in, show chat and call buttons
      this.isUserLoggedIn = true;
    } else {
      // If user is not logged in, show the login modal
      this.showLoginModal = true;
      this.openVerticallyCentered(this.content);
    }
  }

  @ViewChild('loginwithpass') loginwithpass!: TemplateRef<any>;
  showloginwithpass(currentModal: any) {
    this.modalService1.closeModal();
    this.PASSWORDLOGIN = '';
    // this.modalService.open(this.loginwithpass, { centered: true })
    this.modalService.open(this.loginwithpass, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
  }
  isLoading: boolean = false;
  issignUpLoading: boolean = false;

  otpSent: boolean = false;
  remainingTime: number = 60;
  timerSubscription: any;
  // Resend OTP action after 30 seconds
  resendOtp() {
    this.otp = ['', '', '', ''];
    this.otp[0] = '';
    this.otp[1] = '';
    this.otp[2] = '';
    this.otp[3] = '';
    if (this.remainingTime > 0) {
      this.toastr.info(
        `Please wait ${this.remainingTime} seconds before resending OTP.`,
        ''
      );
      return; // stop execution if timer is running
    }

    // this.otpSent = false;
    // this.remainingTime = 30; // reset timer
    // this.startTimer();
    if (this.whichOTP == 'login') {
      this.loginotpverification();
    } else if (this.whichOTP == 'register') {
      this.save();
    }
  }

  resendforgotOtp(content: any) {
    this.otpSent = false; // Resend OTP action
    this.remainingTime = 60; // Reset timer
    this.startTimer();
  }

  startTimer(): void {
    if (this.timerSubscription) {
      return;
    }

    const maxDuration = 30; // 30 seconds max
    this.remainingTime = Math.min(this.remainingTime, maxDuration);

    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.remainingTime > 0))
      .subscribe({
        next: () => this.remainingTime--,
        complete: () => (this.timerSubscription = null),
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the timer when the component is destroyed
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  @ViewChild('forgotpass') forgotpass!: TemplateRef<any>;
  showforgotPass(currentModal: any) {
    this.modalService.dismissAll(currentModal);
    // this.modalService.open(this.forgotpass, { centered: true })
    this.modalService.open(this.forgotpass, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
  }
  openRegister: boolean = false;
  @ViewChild('register') register!: TemplateRef<any>;
  showRegisterModal() {
    this.userType = 'home';
    this.registrationSubmitted = false;
    this.isloginSendOTP = false;
    this.issignUpLoading = false;
    this.selectedCountryCode = '+91';
    this.statusCode = '';
    this.modalVisible = false;
    this.openRegister = true;
  }

  showConfirmPasswordError: boolean = false;

  modalVisible: boolean = false;
  form!: FormGroup;
  showPasswordError: boolean = false; // ✅ Declare variable
  // @ViewChild("showlogin") showlogin!: TemplateRef<any>;
  @ViewChild('showlogin', { static: true }) showlogin!: TemplateRef<any>;
  private messaging: any;
  isLocalhost: boolean = false;
  ngOnInit(): void {
    this.setInputTypeByUserType();
    this.isLocalhost = this.api.isLocalhost;
    this.modalService1.modalState$.subscribe((state: any) => {
      this.modalVisible = state;

      // for loading map

      this.data = new registerdata();
      // this.modalService.open(state, { centered: true });
    });
    this.form = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
    });
    this.form.controls['password'].valueChanges.subscribe(() => {
      if (this.form.controls['password'].dirty) {
        this.showPasswordError =
          this.form.controls['password'].invalid &&
          !!this.form.controls['password'].value;
      }
    });
  }

  closeModal() {
    this.modalService1.closeModal();
    this.modalService.dismissAll();
    this.mobileNumberorEmail = '';
  }

  closeregister() {
    this.modalService.dismissAll();
    this.mobileNumberorEmail = '';
    this.mobileNumberlogin = '';
    this.otp = ['', '', '', '', '', ''];
    this.data = new registerdata();
    this.showAddressDetailsForm = false;
  }
  testmobilenumber(number: any) {
    return /^[6-9]\d{9}$/.test(number);
  }

  @ViewChild('loginotpverficationModal')
  loginotpverficationModal!: TemplateRef<any>;
  isloginSendOTP: boolean = false;
  showOtpModal: boolean = false;
  type: any;
  USER_ID: any;
  USER_NAME: any;
  loginSubmitted: boolean = false;
  openVerify: boolean = false;
  conflictdata: any = []
  isloadingconflict: boolean = false;
  // loginotpverification(form?: NgForm): void {
  //   this.loginSubmitted = true;

  //   if (form && form.invalid) {
  //     return;
  //   }

  //   // Determine type based on input value
  //   this.type = this.isEmail(this.mobileNumberorEmail) ? 'E' : 'M';
  //   this.isloginSendOTP = true;
  //   this.statusCode = '';
  //   this.modalVisible = false;
  //   this.whichOTP = 'login';
  //   this.loadData();
  //   this.api
  //     .sendOTP(this.selectedCountryCode, this.mobileNumberorEmail, this.type)
  //     .subscribe({
  //       next: (successCode: any) => {
  //         if (successCode.code == '200') {
  //           if (successCode.CUSTOMER_TYPE) {
  //             sessionStorage.setItem(
  //               'customertype',
  //               this.commonFunction.encryptdata(successCode.CUSTOMER_TYPE)
  //             );
  //             localStorage.setItem(
  //               'customertype',
  //               this.commonFunction.encryptdata(successCode.CUSTOMER_TYPE)
  //             );
  //           } else {
  //             sessionStorage.setItem(
  //               'customertype',
  //               this.commonFunction.encryptdata('I')
  //             );
  //             localStorage.setItem(
  //               'customertype',
  //               this.commonFunction.encryptdata('I')
  //             );
  //           }

  //           this.isloginSendOTP = false;
  //           this.modalService1.closeModal();
  //           this.otpSent = true;
  //           this.showOtpModal = true;
  //           this.USER_ID = successCode.USER_ID;
  //           this.USER_NAME = successCode.USER_NAME;
  //           this.modalVisible = true;
  //           this.remainingTime = 60;
  //           this.startTimer();
  //           this.toastr.success('OTP Sent Successfully...', '');
  //           this.modalVisible = false;
  //           this.openRegister = false;
  //           this.openVerify = true;
  //           this.stopLoader();
  //         } else if (successCode.code == '400') {
  //           this.modalVisible = true;
  //           this.isloginSendOTP = false;
  //           this.statusCode =
  //             'The user is not registered or has been deactivated';
  //           this.stopLoader();
  //         } else {
  //           this.modalVisible = true;
  //           this.isloginSendOTP = false;
  //           this.toastr.error('OTP Validation Failed...', '');
  //           this.stopLoader();
  //         }
  //       },
  //       error: (error) => {
  //         this.modalVisible = true;
  //         // Handle error if login fails
  //         if (error.status === 400) {
  //           this.statusCode =
  //             'The user is not registered or has been deactivated';
  //           this.toastr.info(
  //             'The user is not registered or has been deactivated',
  //             ''
  //           );
  //         } else {
  //           this.modalVisible = true;
  //           this.toastr.error('Error sending OTP', '');
  //         }
  //         this.isloginSendOTP = false;
  //         this.modalVisible = true;
  //         this.stopLoader();
  //       },
  //     });
  // }
  loginotpverification(form?: NgForm): void {
    this.statusCode = '';
    this.isloadingconflict = true;
    if (form && form.invalid) {
      return;
    }
    // Call API with CUSTOMER_TYPE
    this.api.checkconflictsMob(this.mobileNumberorEmail).subscribe({
      next: (successCode: any) => {
        if (successCode.code == '200') {
          if (successCode.data.length == 1) {
            this.isloadingconflict = false;
            this.loginSubmitted = true;
            // Determine type based on input value
            this.type = this.isEmail(this.mobileNumberorEmail) ? 'E' : 'M';

            // Determine if showing dropdown (for mobile input)
            const showDropdown = this.type === 'M'; // true if mobile, false if email

            // Get customer type from user selection or session
            // let customerType = this.userType === 'business' ? 'B' : 'I';
            let customerType = '';

            // Or if you're getting it from session/local storage:
            // const storedCustomerType = sessionStorage.getItem('customertype');
            // let customerType = storedCustomerType ? this.commonFunction.decryptdata(storedCustomerType) : 'I';

            this.isloginSendOTP = true;
            this.statusCode = '';
            this.modalVisible = false;
            this.whichOTP = 'login';
            this.loadData();
            customerType = successCode.data[0].CUSTOMER_TYPE;
            this.api
              .sendOTP(
                this.selectedCountryCode,  // COUNTRY_CODE: selectedCountry.value
                this.mobileNumberorEmail,   // TYPE_VALUE: mobile.value
                this.type,                  // TYPE: showDropdown ? 'M' : 'E'
                customerType                // CUSTOMER_TYPE: type
              )
              .subscribe({
                next: (successCode: any) => {
                  if (successCode.code == '200') {
                    if (successCode.CUSTOMER_TYPE) {
                      sessionStorage.setItem(
                        'customertype',
                        this.commonFunction.encryptdata(successCode.CUSTOMER_TYPE)
                      );
                      localStorage.setItem(
                        'customertype',
                        this.commonFunction.encryptdata(successCode.CUSTOMER_TYPE)
                      );
                    } else {
                      sessionStorage.setItem(
                        'customertype',
                        this.commonFunction.encryptdata('I')
                      );
                      localStorage.setItem(
                        'customertype',
                        this.commonFunction.encryptdata('I')
                      );
                    }

                    this.isloginSendOTP = false;
                    this.modalService1.closeModal();
                    this.otpSent = true;
                    this.showOtpModal = true;
                    this.USER_ID = successCode.USER_ID;
                    this.USER_NAME = successCode.USER_NAME;
                    this.modalVisible = true;
                    this.remainingTime = 60;
                    this.startTimer();
                    this.toastr.success('OTP Sent Successfully...', '');
                    this.modalVisible = false;
                    this.openRegister = false;
                    this.openVerify = true;
                    this.stopLoader();
                  } else if (successCode.code == '400') {
                    this.modalVisible = true;
                    this.isloginSendOTP = false;
                    this.statusCode =
                      'The user is not registered or has been deactivated';
                    this.stopLoader();
                  } else {
                    this.modalVisible = true;
                    this.isloginSendOTP = false;
                    this.toastr.error('OTP Validation Failed...', '');
                    this.stopLoader();
                  }
                },
                error: (error) => {
                  this.modalVisible = true;
                  // Handle error if login fails
                  if (error.status === 400) {
                    this.statusCode =
                      'The user is not registered or has been deactivated';
                    this.toastr.info(
                      'The user is not registered or has been deactivated',
                      ''
                    );
                  } else {
                    this.modalVisible = true;
                    this.toastr.error('Error sending OTP', '');
                  }
                  this.isloginSendOTP = false;
                  this.modalVisible = true;
                  this.stopLoader();
                },
              });
          } else if (successCode.data.length > 1) {
            this.isloadingconflict = false;
            this.userModal = true;
            this.isloginSendOTP = false;
            this.conflictdata = successCode.data;
            this.stopLoader();

          }
        }
        else if (successCode.code == '400') {
          this.isloadingconflict = false;
          this.modalVisible = true;
          this.isloginSendOTP = false;
          this.statusCode =
            'The user is not registered or has been deactivated';
          this.stopLoader();
        } else {
          this.isloadingconflict = false;
          this.modalVisible = true;
          this.isloginSendOTP = false;
          this.toastr.error('OTP Validation Failed...', '');
          this.stopLoader();
        }
      }
      ,
      error: (error) => {
        this.isloadingconflict = false;
        this.modalVisible = true;
        // Handle error if login fails
        if (error.status === 400) {
          this.statusCode =
            'The user is not registered or has been deactivated';
          this.messaging.info(
            'The user is not registered or has been deactivated',
            '');
        } else {
          this.modalVisible = true;
          this.toastr.error('Error sending OTP', '');
        }
        this.isloginSendOTP = false;
        this.modalVisible = true;
        this.stopLoader();
      },
    })


  }

  whichOTP = '';
  registrationSubmitted = false;
  // save(form?: NgForm) {

  //     if (this.issignUpLoading) {
  //   return; // Prevent repeated calls while loading
  // }

  //   this.data.COUNTRY_CODE = this.selectedCountryCode;
  //   this.registrationSubmitted = true;

  //   if (form && form.invalid) {
  //     return;
  //   }
  //   // if (this.isOk) {
  //   this.issignUpLoading = true;
  //   // this.data.STATUS = 1;
  //   this.data.TYPE = 'M';
  //   // this.data.COUNTRY_CODE = this.searchQuery;
  //   this.data.CUSTOMER_CATEGORY_ID = 1;
  //   this.data.EMAIL_ID = this.data.EMAIL_ID;
  //   this.data.MOBILE_NO = this.data.CUSTOMER_MOBILE_NO;
  //   this.data.CUSTOMER_TYPE = 'I';
  //   this.data.TYPE_VALUE = this.data.CUSTOMER_MOBILE_NO;
  //   this.whichOTP = 'register';

  //   const registerData = this.data;
  //   this.loadData();
  //   this.api.userRegistrationOTP(this.data).subscribe(
  //     (successCode: any) => {
  //       if (successCode.body.code === 200) {
  //         this.issignUpLoading = false;
  //         this.isOk = false;
  //         this.toastr.success('OTP has been sent successfully.', '');
  //         // this.modalService.dismissAll();

  //         // sessionStorage.setItem("token", successCode.body.token);
  //         // this.cookie.set("token", successCode.body.token, 365, "", "", false, "Strict");

  //         // const user = successCode.body.UserData[0]; // This is the user object
  //         //
  //         //
  //         //
  //         // sessionStorage.setItem('userId', this.commonFunction.encryptdata(user.USER_ID));
  //         // sessionStorage.setItem('userName', this.commonFunction.encryptdata(user.USER_NAME));
  //         // sessionStorage.setItem('mobileNumber', this.commonFunction.encryptdata(user.MOBILE_NUMBER));
  //         this.isloginSendOTP = false;
  //         this.modalService1.closeModal();
  //         this.otpSent = true;
  //         this.showOtpModal = true;
  //         this.USER_ID = successCode.USER_ID;
  //         this.USER_NAME = successCode.USER_NAME;

  //         this.remainingTime = 60;
  //         this.startTimer();
  //         // this.toastr.success("OTP Sent Successfully...", "");
  //         this.modalVisible = false;
  //         this.openRegister = false;
  //         this.openVerify = true;
  //         // this.modalService.dismissAll();
  //         // this.modalService.open(this.loginotpverficationModal, {
  //         //   backdrop: "static",
  //         //   keyboard: false,
  //         //   centered: true,
  //         // });
  //         // this.isverifyOTP = false;
  //         this.statusCode = '';
  //         this.data = registerData;

  //         this.stopLoader();
  //       } else if (successCode.body.code === 300) {
  //         //
  //         this.stopLoader();
  //         this.issignUpLoading = false;
  //         this.statusCode = 'Email ID or mobile number already exists.';
  //       } else if (successCode.body.code === 301) {
  //         //
  //         this.stopLoader();
  //         this.issignUpLoading = false;
  //         this.statusCode =
  //           'Oops! It looks like your account is currently deactivated. Please contact to support itsupport@pockitengineers.com';
  //       }
  //       // else if (
  //       //   successCode.body.code === 300 &&
  //       //   successCode.body.message === 'email ID already exists.'
  //       // ) {
  //       //
  //       //   this.stopLoader();
  //       //   this.issignUpLoading = false;
  //       //   this.statusCode = 'email ID already exists.';
  //       // }

  //       this.mobileNumberorEmail = this.data.CUSTOMER_MOBILE_NO;
  //     },
  //     (error) => {
  //       this.issignUpLoading = false;
  //       // Handle error if login fails
  //       if (error.status === 300) {
  //         this.issignUpLoading = false;
  //         // Handle specific HTTP error (e.g., invalid credentials)
  //         this.toastr.error('Email-ID is already exists', '');
  //       } else if (error.status === 500) {
  //         // Handle server-side error
  //         this.toastr.error(
  //           'An unexpected error occurred. Please try again later.',
  //           ''
  //         );
  //       } else {
  //         this.issignUpLoading = false;
  //         // Generic error handling
  //         this.toastr.error(
  //           'An unknown error occurred. Please try again later.',
  //           ''
  //         );
  //       }
  //       this.stopLoader();
  //     }
  //   );
  //   // }
  // }
  save(form?: NgForm) {
    // Prevent repeated calls while loading
    if (this.issignUpLoading) {
      return;
    }

    // Set country code
    this.data.COUNTRY_CODE = this.selectedCountryCode;
    this.registrationSubmitted = true;

    // Validate form
    if (form && form.invalid) {
      return;
    }

    // Check if user agreed to terms and conditions
    if (!this.agreeConsent) {
      this.toastr.error('Please agree to the Terms and Conditions', '');
      return;
    }

    this.issignUpLoading = true;

    // Set common fields
    this.data.TYPE = 'M';
    this.data.CUSTOMER_CATEGORY_ID = 1;
    this.data.EMAIL_ID = this.data.EMAIL_ID;
    this.data.MOBILE_NO = this.data.CUSTOMER_MOBILE_NO;
    this.data.TYPE_VALUE = this.data.CUSTOMER_MOBILE_NO;
    this.whichOTP = 'register';

    // Set user-type specific fields
    if (this.userType === 'business') {
      // Business User
      this.data.CUSTOMER_TYPE = 'B'; // B for Business
      // For business user, use contact person name as customer name
      this.data.CUSTOMER_NAME = this.data.CUSTOMER_NAME;
      this.data.TYPE = "E"
      // Ensure business-specific fields are included
      // SHORT_CODE, PAN_NUMBER, GST_NUMBER are already in this.data
      this.data.SHORT_CODE = this.generateShortCodeFromName(this.data.CUSTOMER_NAME);
      this.data.TYPE_VALUE = this.data.EMAIL_ID;

    } else {
      // Home User
      this.data.CUSTOMER_TYPE = 'I'; // I for Individual/Home User
      // CUSTOMER_NAME is already set from the form

      // Clear business-specific fields for home user to avoid sending them
      this.data.SHORT_CODE = null;
      this.data.PAN_NUMBER = null;
      this.data.GST_NUMBER = null;
      this.data.CONTACT_PERSON_NAME = null;
    }

    const registerData = this.data;
    this.loadData();

    // Call API
    this.api.userRegistrationOTP(this.data).subscribe(
      (successCode: any) => {
        if (successCode.body.code === 200) {
          this.issignUpLoading = false;
          this.isOk = false;
          this.toastr.success('OTP has been sent successfully.', '');

          this.isloginSendOTP = false;
          this.modalService1.closeModal();
          this.otpSent = true;
          this.showOtpModal = true;
          this.USER_ID = successCode.USER_ID;
          this.USER_NAME = successCode.USER_NAME;

          this.remainingTime = 60;
          this.startTimer();
          this.modalVisible = false;
          this.openRegister = false;
          this.openVerify = true;

          this.statusCode = '';
          this.data = registerData;

          this.stopLoader();
        } else if (successCode.body.code === 300) {
          this.stopLoader();
          this.issignUpLoading = false;
          this.statusCode = 'Email ID or mobile number already exists.';
        } else if (successCode.body.code === 301) {
          this.stopLoader();
          this.issignUpLoading = false;
          this.statusCode =
            'Oops! It looks like your account is currently deactivated. Please contact to support itsupport@pockitengineers.com';
        } else if (successCode.body.code === 302) {
          this.stopLoader();
          this.issignUpLoading = false;
          this.statusCode = 'Parent domain not found';

        }

        this.mobileNumberorEmail = this.userType === 'business' ? this.data.EMAIL_ID : this.data.CUSTOMER_MOBILE_NO;
      },
      (error) => {
        this.issignUpLoading = false;
        // Handle error if registration fails
        if (error.status === 300) {
          this.issignUpLoading = false;
          this.toastr.error('Email-ID is already exists', '');
        } else if (error.status === 500) {
          this.toastr.error(
            'An unexpected error occurred. Please try again later.',
            ''
          );
        } else {
          this.issignUpLoading = false;
          this.toastr.error(
            'An unknown error occurred. Please try again later.',
            ''
          );
        }
        this.stopLoader();
      }
    );
  }
  generateShortCodeFromName = (orgName) => {
    const cleanName = orgName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    let shortCode = cleanName.substring(0, 4);

    while (shortCode.length < 4) {
      shortCode += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
        Math.floor(Math.random() * 36)
      );
    }

    for (let i = 0; i < 4; i++) {
      shortCode += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
        Math.floor(Math.random() * 36)
      );
    }

    return shortCode
  };
  statusCode: any = '';
  showMap: boolean = false;
  VerifyOTP() {
    if (this.isverifyOTP) {
      return; // Block if already in progress
    }
    if (this.otp.join('').length < 4) {
      this.toastr.error('Please Enter OTP...', '');
      return;
    }
    this.isverifyOTP = true; // Set true before API call
    const otp1 = this.otp.join('');
    // this.isverifyOTP = true; // Set true before API call
    this.loadData();
    if (this.whichOTP == 'login') {
      let CLOUD_ID = this.cookie.get('CLOUD_ID');

      this.api
        .verifyOTP(
          this.type,
          this.mobileNumberorEmail,
          otp1,
          this.USER_ID,
          this.USER_NAME,
          1,
          CLOUD_ID,
          this.data.CUSTOMER_TYPE,
          this.data.COMPANY_NAME
        )
        .subscribe({
          next: (successCode: any) => {
            if (successCode.body.message === 'Logged in successfully.') {
              this.toastr.success('OTP verified successfully...', '');
              this.confirmLocation();
              this.showMap = false;
              this.modalVisible = false;
              this.modalService.dismissAll();
              this.isOk = false;
              this.cookie.set(
                'token',
                successCode.body.token,
                365,
                '/',
                '',
                true,
                'None'
              );

              sessionStorage.setItem('token', successCode.body.token);

              const token = successCode.body.token;
              sessionStorage.setItem('token', token);
              localStorage.setItem('token', token);

              const user = successCode.body.UserData[0]; // This is the user object

              sessionStorage.setItem(
                'userId',
                this.commonFunction.encryptdata(user.USER_ID)
              );
              sessionStorage.setItem(
                'userName',
                this.commonFunction.encryptdata(user.USER_NAME)
              );
              sessionStorage.setItem(
                'mobileNumber',
                this.commonFunction.encryptdata(user.MOBILE_NUMBER)
              );
              sessionStorage.setItem(
                'emailId',
                this.commonFunction.encryptdata(user.EMAIL_ID)
              );

              localStorage.setItem('token', successCode.body.token);
              // this.cookie.set(
              //   'token',
              //   successCode.body.token,
              //   365,
              //   '/',
              //   '',
              //   false,
              //   'Strict'
              // );

              // let user: any = successCode.body.UserData[0]; // This is the user object

              localStorage.setItem(
                'userId',
                this.commonFunction.encryptdata(user.USER_ID)
              );
              localStorage.setItem(
                'userName',
                this.commonFunction.encryptdata(user.USER_NAME)
              );
              localStorage.setItem(
                'mobileNumber',
                this.commonFunction.encryptdata(user.MOBILE_NUMBER)
              );

              // localStorage.setItem(
              //   'subscribedChannels',
              //   this.commonFunction.encryptdata(
              //     JSON.stringify(successCode.body.SUBSCRIBED_CHANNELS)
              //   )
              // );

              // var channelNames = successCode.body.SUBSCRIBED_CHANNELS.map(
              //   (channel: any) => channel.CHANNEL_NAME
              // );
              // if (successCode.body.SUBSCRIBED_CHANNELS.length > 0) {
              //   this.api
              //     .subscribeToMultipleTopics(channelNames)
              //     .subscribe((data) => {
              //       if (data['code'] == '200') {
              //       }
              //     });
              // }
              // const channels = successCode.body?.SUBSCRIBED_CHANNELS ?? [];

              // if (channels.length > 0) {
              //   const encrypted = this.commonFunction.encryptdata(JSON.stringify(channels));
              //   localStorage.setItem('subscribedChannels', encrypted);

              //   const channelNames = channels.map((c: any) => c.CHANNEL_NAME);

              //   this.api.subscribeToMultipleTopics(channelNames).subscribe((data) => {
              //     if (data?.code === '200') {
              //       // Maybe show success message or silently continue
              //     }
              //   });
              // }

              localStorage.setItem(
                'subscribedChannels',
                this.commonFunction.encryptdata(
                  JSON.stringify(user.SUBSCRIBED_CHANNELS)
                )
              );

              var channelNames = user.SUBSCRIBED_CHANNELS.map(
                (channel: any) => channel.CHANNEL_NAME
              );
              if (user.SUBSCRIBED_CHANNELS.length > 0) {
                this.api
                  .subscribeToMultipleTopics(channelNames)
                  .subscribe((data) => {
                    if (data['code'] == '200') {
                    }
                  });
              }

              // Store login status
              localStorage.setItem('isLogged', 'true');

              this.otp = ['', '', '', ''];

              // Set user type in localStorage

              localStorage.setItem('customerType', this.data.CUSTOMER_TYPE);

              // Handle user type specific flow
              if (user.CUSTOMER_TYPE == 'I' || !user.CUSTOMER_TYPE) {
                // Home user: set flags and default address, then redirect to service
                localStorage.setItem('customerType', 'I');
                localStorage.setItem('skipLocationCheck', 'true');
                localStorage.setItem('locationSet', 'true');
                this.confirmLocation();
                this.showMap = false;
                this.modalVisible = false;

                this.api.setDefaultPincodeForHomeUser().subscribe({
                  next: () => {
                    // Force close all modals and forms
                    this.modalService.dismissAll();
                    this.isverifyOTP = false;
                    this.isAutoVerifying = false;
                    this.showMap = false;
                    this.modalVisible = false;
                    this.openVerify = false;
                    this.showAddressDetailsForm = false;
                    window.location.href = '/service';
                  },
                  error: () => {
                    // Even if setting address fails, still redirect to service
                    this.modalService.dismissAll();
                    this.isverifyOTP = false;
                    this.isAutoVerifying = false;
                    this.showMap = false;
                    this.modalVisible = false;
                    this.openVerify = false;
                    this.showAddressDetailsForm = false;
                    window.location.href = '/service';
                  }
                });
              } else {
                // For Business Users, load territories directly (don't open map)
                this.isverifyOTP = false;
                this.isAutoVerifying = false;
                this.modalVisible = false;
                this.openVerify = false;
                this.showMap = false; // ensure map UI hidden

                // Determine pincode to fetch territories for
                const userPincode = localStorage.getItem('userPincode') || (this.addressForm && this.addressForm.PINCODE) || '110001';

                this.api.getTerritoriesByPincode(userPincode).subscribe({
                  next: (resp: any) => {
                    const territories = resp?.body?.data || resp?.body || [];
                    this.terrotaryData = territories;
                    if (territories && territories.length > 0) {
                      const t = territories[0];
                      this.addressForm.TERRITORY_ID = t.TERRITORY_ID || t.id || t.TERRITORY_ID;
                      localStorage.setItem('selectedTerritory', String(this.addressForm.TERRITORY_ID));
                    }
                    // Hide address/map and continue to service page
                    this.showAddressDetailsForm = false;
                    setTimeout(() => (window.location.href = '/service'), 200);
                  },
                  error: (err: any) => {
                    // On error, fallback to service page without showing map
                    console.error('Failed to load territories:', err);
                    this.showAddressDetailsForm = false;
                    setTimeout(() => (window.location.href = '/service'), 200);
                  }
                });
              }

              this.statusCode = '';
            }

            // this.stopLoader();
          },
          error: (errorResponse) => {

            if (errorResponse.error.code === 300) {
              this.toastr.error(
                'Invalid request. Please check the entered details.'
              );
              //
              this.statusCode = 'Invalid OTP';
              this.stopLoader();
            } else if (errorResponse.error.code === 301) {
              this.toastr.info('No Address Found');
              //
              // this.statusCode =
              // "You don't have a default address. Please contact the admin to set up your delivery address";
              this.stopLoader();
            } else {
              //
              this.toastr.error('Something went wrong. Please try again.');
              this.statusCode = '';
              this.stopLoader();
            }
            //

            this.isverifyOTP = false;
            this.isAutoVerifying = false;
            this.stopLoader();
          },
        });
    } else if (this.whichOTP == 'register') {
      let CLOUD_ID = this.cookie.get('CLOUD_ID');
      this.data.TYPE = this.userType === 'business' ? 'E' : 'M';
      this.data.COUNTRY_CODE = this.selectedCountryCode;
      this.data.CUSTOMER_CATEGORY_ID = 1;
      this.data.CUSTOMER_EMAIL_ID = this.data.EMAIL_ID;
      this.data.OTP = otp1;
      this.data.IS_NEW_CUSTOMER = 1;
      this.data.CUSTOMER_NAME = this.data.CUSTOMER_NAME;
      this.data.IS_SPECIAL_CATALOGUE = false;
      this.data.ACCOUNT_STATUS = true;

      this.data.CUSTOMER_MOBILE_NO = this.data.CUSTOMER_MOBILE_NO;
      this.data.CUSTOMER_TYPE = this.userType === 'business' ? 'B' : 'I';
      this.data.TYPE_VALUE = this.userType === 'business' ? this.data.EMAIL_ID : this.data.CUSTOMER_MOBILE_NO;;
      this.data.CLOUD_ID = CLOUD_ID;
      const registerData = this.data;

      const COMPANY_NAME = this.data.COMPANY_NAME;
      this.loadData();
      this.api.userRegistration(this.data).subscribe({
        next: (successCode: any) => {
          if (successCode.body.message === 'Logged in successfully.') {
            this.toastr.success('OTP verified successfully...', '');
            this.showMap = false;
            this.modalVisible = false;

            this.confirmLocation();

            this.modalService.dismissAll();
            this.isOk = false;
            this.data = registerData;
            //
            sessionStorage.setItem('token', successCode.body.token);
            localStorage.setItem('token', successCode.body.token);

            this.cookie.set(
              'token',
              successCode.body.token,
              365,
              '',
              '',
              false,
              'Strict'
            );

            this.confirmLocation();



            const user = successCode.body.UserData[0]; // This is the user object
            this.USER_ID = user.USER_ID;
            //
            //

            var custype = this.userType == "business" ? "B" : "I";
            sessionStorage.setItem(
              'customertype',
              this.commonFunction.encryptdata(custype)
            );

            localStorage.setItem(
              'customertype',
              this.commonFunction.encryptdata(custype)
            );
            //
            sessionStorage.setItem(
              'userId',
              this.commonFunction.encryptdata(user.USER_ID)
            );
            sessionStorage.setItem(
              'userName',
              this.commonFunction.encryptdata(user.USER_NAME)
            );
            sessionStorage.setItem(
              'mobileNumber',
              this.commonFunction.encryptdata(user.MOBILE_NUMBER)
            );
            sessionStorage.setItem(
              'userAddress',
              this.commonFunction.encryptdata(this.addressForm.ADDRESS_LINE_2)
            );
            localStorage.setItem(
              'userId',
              this.commonFunction.encryptdata(user.USER_ID)
            );
            if (user.organizationName) {
              localStorage.setItem('organizationName', user.organizationName);
            };

            localStorage.setItem(
              'userName',
              this.commonFunction.encryptdata(user.USER_NAME)
            );
            localStorage.setItem(
              'mobileNumber',
              this.commonFunction.encryptdata(user.MOBILE_NUMBER)
            );
            localStorage.setItem(
              'userAddress',
              this.commonFunction.encryptdata(this.addressForm.ADDRESS_LINE_2)
            );
            localStorage.setItem(
              'subscribedChannels',
              this.commonFunction.encryptdata(
                JSON.stringify(user.SUBSCRIBED_CHANNELS)
              )
            );

            var channelNames = user.SUBSCRIBED_CHANNELS.map(
              (channel: any) => channel.CHANNEL_NAME
            );
            if (user.SUBSCRIBED_CHANNELS.length > 0) {
              this.api
                .subscribeToMultipleTopics(channelNames)
                .subscribe((data) => {
                  if (data['code'] == '200') {
                  }
                });
            }

            localStorage.setItem('isLogged', 'true');
            this.otp = ['', '', '', ''];
            this.isverifyOTP = false;
            this.isAutoVerifying = false;
            this.statusCode = '';

            if (this.userType === 'business') {
              // For Business Users, load territories directly (don't open map)
              this.openVerify = false;
              this.stopLoader();
              this.showMap = false;

              const userPincode = localStorage.getItem('userPincode') || (this.addressForm && this.addressForm.PINCODE) || '110001';
              this.api.getTerritoriesByPincode(userPincode).subscribe({
                next: (resp: any) => {
                  const territories = resp?.body?.data || resp?.body || [];
                  this.terrotaryData = territories;
                  if (territories && territories.length > 0) {
                    const t = territories[0];
                    this.addressForm.TERRITORY_ID = t.TERRITORY_ID || t.id || t.TERRITORY_ID;
                    localStorage.setItem('selectedTerritory', String(this.addressForm.TERRITORY_ID));
                  }
                  this.showAddressDetailsForm = false;
                  setTimeout(() => (window.location.href = '/service'), 200);
                },
                error: (err: any) => {
                  console.error('Failed to load territories (register):', err);
                  setTimeout(() => (window.location.href = '/service'), 200);
                }
              });
            } else {
              // For Home Users, set default address and redirect
              this.api.setDefaultPincodeForHomeUser().subscribe({
                next: () => {
                  this.isverifyOTP = false;
                  this.isAutoVerifying = false;
                  this.showMap = false;
                  this.modalVisible = false;
                  this.openVerify = false;
                  this.showAddressDetailsForm = false;
                  this.stopLoader();
                  window.location.href = '/service';
                },
                error: () => {
                  // Even if setting address fails, redirect to service
                  this.isverifyOTP = false;
                  this.isAutoVerifying = false;
                  this.showMap = false;
                  this.modalVisible = false;
                  this.openVerify = false;
                  this.showAddressDetailsForm = false;
                  this.stopLoader();
                  window.location.href = '/service';
                }
              });
            }
          }

          this.stopLoader();
        },
        error: (errorResponse) => {

          if (errorResponse.error.code === 300) {
            this.toastr.error(
              'Invalid request. Please check the entered details.'
            );

            this.statusCode = 'Invalid OTP';
          } else {
            this.toastr.error('Something went wrong. Please try again.');
            this.statusCode = '';
          }

          this.stopLoader();
          this.isverifyOTP = false;
          this.isAutoVerifying = false;
        },
      });
    }

    // this.isverifyOTP = false;


    // this.confirmLocation();



  }
  @ViewChild('openMap') openMap!: TemplateRef<any>;
  // @ViewChild('openMap', { static: true }) openMap!: TemplateRef<any>;
  @ViewChild('loginforgotModal') loginforgotModal!: TemplateRef<any>;

  isSendOpt: boolean = false;
  loginforgot(currentModal: any) {
    this.otpSent = true;
    this.otp = ['', '', '', '', '', ''];
    this.startTimer();
    if (this.mobileNumberorEmail.length === 10) {
      this.isSendOpt = true;
    } else {
      this.toastr.error('Please enter a valid 10-digit mobile number.');
    }
  }
  // Default OTP for validation
  forgotdefaultOTP = '654321';
  otp: string[] = ['', '', '', '', '', '']; // Array to store OTP input
  showError = false; // Flag to control error message visibility

  @ViewChild('otpInputs') otpInputs: ElementRef | undefined;

  // Method to move to the next input field
  // Method to move to the next input field
  //   @ViewChild('otpInputs') otpInputs: ElementRef | undefined;
  // otp: string[] = ['', '', '', '', '', ''];  // OTP Array to store individual digits

  // Method to move to the next input field
  moveToNext_original(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      // If backspace is pressed on empty input, move to previous input
      const prevInput = document.getElementsByClassName('otp-input')[
        index - 1
      ] as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  moveToNext(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
    const prevInput = document.getElementsByClassName('otp-input')[
      index - 1
    ] as HTMLInputElement;
    prevInput?.focus();
  }
}

  onChange_original(value: string, index: number) {
    // Ensure the input is a number
    if (/^\d*$/.test(value)) {
      // If a value is entered and there's a next input, move to it
      if (value && index < 3) {
        const nextInput = document.getElementsByClassName('otp-input')[
          index + 1
        ] as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else {
      // If not a number, clear the input
      this.otp[index] = '';
    }
  }
  onChange(value: string, index: number) {
    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      this.otp[index] = '';
      return;
    }

    this.otp[index] = value;

    // Move focus to next input
    if (value && index < 3) {
      const nextInput = document.getElementsByClassName('otp-input')[
        index + 1
      ] as HTMLInputElement;
      nextInput?.focus();
    }

    // 🔥 AUTO VERIFY when all 4 digits entered
    const otpValue = this.otp.join('');
    if (otpValue.length === 4 && !this.isAutoVerifying) {
      this.isAutoVerifying = true;
      this.VerifyOTP();
    }
  }

  // Handle focus event to select the input value when clicked
  onFocus(index: number) {
    const input = this.otpInputs?.nativeElement.querySelectorAll('input')[
      index
    ] as HTMLInputElement;
    input?.select(); // Select the value when clicked for easier editing
  }

  // Method to clear OTP fields
  forgotclearOTPFields() {
    this.otp = ['', '', '', '', '', ''];
  }
  handleEnterKey(content: any) {
    if (this.isSendOpt) {
    } else {
      // Otherwise, call the existing function for the second button
      this.loginforgot(content);
    }
  }
  handleLoginEnterKey(content: any) {
    if (this.isloginSendOTP) {
    } else {
      // Otherwise, call the existing function for the second button
      this.loginotpverification(content);
    }
  }
  // Method to handle OTP verification
  isverifyOTP: boolean = false;

  @ViewChild('loginforgetwithpass') loginforgetwithpass!: TemplateRef<any>;
  isverifyForgotOTP: boolean = false;
  VerifyforgotOTP(content: any) {
    const otp1 = this.otp.join('');
    const FIREBASE_REG_TOKEN = 'bacdefghi';
    this.isverifyForgotOTP = true;
  }

  passwordVisible: boolean = false; // Initially password is hidden
  passwordFieldType: string = 'password'; // Set default input type to 'password'

  confpasswordVisible: boolean = false; // Initially password is hidden
  passconfwordFieldType: string = 'password'; // Set default input type to 'password'

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password'; // Toggle input type
  }
  toggleconfPasswordVisibility() {
    this.confpasswordVisible = !this.confpasswordVisible;
    this.passconfwordFieldType = this.confpasswordVisible ? 'text' : 'password'; // Toggle input type
  }

  data: registerdata = new registerdata();
  isOk = true;

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  handlePaste_orginal(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    if (pastedData && /^\d{4}$/.test(pastedData)) {
      // If pasted data is 4 digits, distribute across inputs
      for (let i = 0; i < 4; i++) {
        this.otp[i] = pastedData[i];
      }
    }
  }
  handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text');

  if (pastedData && /^\d{4}$/.test(pastedData)) {
    for (let i = 0; i < 4; i++) {
      this.otp[i] = pastedData[i];
    }

    // 🔥 AUTO VERIFY AFTER PASTE
    if (!this.isAutoVerifying) {
      this.isAutoVerifying = true;
      this.VerifyOTP();
    }
  }
}

  openmodal123(currentModal: any) {
    this.modalService.dismissAll(currentModal);
    this.modalService1.openModal();
    this.forgotclearOTPFields();
    // this.mobileNumberorEmail = "";
    this.loginSubmitted = false;
    this.statusCode = '';
  }

  private isEmail(value: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value);
  }

  inputType: 'initial' | 'mobile' | 'email' = 'initial';
  selectedCountryCode: string = '+91';
  countryCodeVisible: boolean = false;

  onIdentifierInput(event: any) {
    const value = event.target.value;
    this.statusCode = '';
    if (!value || value.length < 6) {
      this.inputType = 'initial';
      return;
    }

    // Check if input contains letters
    if (/[a-zA-Z]/.test(value)) {
      this.inputType = 'email';
    } else {
      this.inputType = 'mobile';
    }
  }

  validateMobileNumber(number: string): boolean {
    return /^[6-9]\d{9}$/.test(number);
  }

  validateEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  countryCodes = [
    { label: '+91 (India)', value: '+91' },
    { label: '+92 (Pakistan)', value: '+92' },
    { label: '+93 (Afghanistan)', value: '+93' },
    { label: '+94 (Sri Lanka)', value: '+94' },
    { label: '+95 (Myanmar)', value: '+95' },
    { label: '+1 (United States)', value: '+1' },
    { label: '+1-242 (Bahamas)', value: '+1-242' },
    { label: '+1-246 (Barbados)', value: '+1-246' },
    { label: '+1-264 (Anguilla)', value: '+1-264' },
    { label: '+1-268 (Antigua and Barbuda)', value: '+1-268' },
    { label: '+1-284 (British Virgin Islands)', value: '+1-284' },
    { label: '+1-340 (U.S. Virgin Islands)', value: '+1-340' },
    { label: '+1-345 (Cayman Islands)', value: '+1-345' },
    { label: '+1-441 (Bermuda)', value: '+1-441' },
    { label: '+1-473 (Grenada)', value: '+1-473' },
    { label: '+1-649 (Turks and Caicos Islands)', value: '+1-649' },
    { label: '+1-664 (Montserrat)', value: '+1-664' },
    { label: '+1-670 (Northern Mariana Islands)', value: '+1-670' },
    { label: '+1-671 (Guam)', value: '+1-671' },
    { label: '+1-684 (American Samoa)', value: '+1-684' },
    { label: '+1-721 (Sint Maarten)', value: '+1-721' },
    { label: '+1-758 (Saint Lucia)', value: '+1-758' },
    { label: '+1-767 (Dominica)', value: '+1-767' },
    { label: '+1-784 (Saint Vincent and the Grenadines)', value: '+1-784' },
    { label: '+1-787 (Puerto Rico)', value: '+1-787' },
    { label: '+1-809 (Dominican Republic)', value: '+1-809' },
    { label: '+1-829 (Dominican Republic)', value: '+1-829' },
    { label: '+1-849 (Dominican Republic)', value: '+1-849' },
    { label: '+1-868 (Trinidad and Tobago)', value: '+1-868' },
    { label: '+1-869 (Saint Kitts and Nevis)', value: '+1-869' },
    { label: '+1-876 (Jamaica)', value: '+1-876' },
    { label: '+1-939 (Puerto Rico)', value: '+1-939' },
    { label: '+20 (Egypt)', value: '+20' },
    { label: '+211 (South Sudan)', value: '+211' },
    { label: '+212 (Morocco)', value: '+212' },
    { label: '+213 (Algeria)', value: '+213' },
    { label: '+216 (Tunisia)', value: '+216' },
    { label: '+218 (Libya)', value: '+218' },
    { label: '+220 (Gambia)', value: '+220' },
    { label: '+221 (Senegal)', value: '+221' },
    { label: '+222 (Mauritania)', value: '+222' },
    { label: '+223 (Mali)', value: '+223' },
    { label: '+224 (Guinea)', value: '+224' },
    { label: '+225 (Ivory Coast)', value: '+225' },
    { label: '+226 (Burkina Faso)', value: '+226' },
    { label: '+227 (Niger)', value: '+227' },
    { label: '+228 (Togo)', value: '+228' },
    { label: '+229 (Benin)', value: '+229' },
    { label: '+230 (Mauritius)', value: '+230' },
    { label: '+231 (Liberia)', value: '+231' },
    { label: '+232 (Sierra Leone)', value: '+232' },
    { label: '+233 (Ghana)', value: '+233' },
    { label: '+234 (Nigeria)', value: '+234' },
    { label: '+235 (Chad)', value: '+235' },
    { label: '+236 (Central African Republic)', value: '+236' },
    { label: '+237 (Cameroon)', value: '+237' },
    { label: '+238 (Cape Verde)', value: '+238' },
    { label: '+239 (Sao Tome and Principe)', value: '+239' },
    { label: '+240 (Equatorial Guinea)', value: '+240' },
    { label: '+241 (Gabon)', value: '+241' },
    { label: '+242 (Republic of the Congo)', value: '+242' },
    { label: '+243 (Democratic Republic of the Congo)', value: '+243' },
    { label: '+244 (Angola)', value: '+244' },
    { label: '+245 (Guinea-Bissau)', value: '+245' },
    { label: '+246 (British Indian Ocean Territory)', value: '+246' },
    { label: '+248 (Seychelles)', value: '+248' },
    { label: '+249 (Sudan)', value: '+249' },
    { label: '+250 (Rwanda)', value: '+250' },
    { label: '+251 (Ethiopia)', value: '+251' },
    { label: '+252 (Somalia)', value: '+252' },
    { label: '+253 (Djibouti)', value: '+253' },
    { label: '+254 (Kenya)', value: '+254' },
    { label: '+255 (Tanzania)', value: '+255' },
    { label: '+256 (Uganda)', value: '+256' },
    { label: '+257 (Burundi)', value: '+257' },
    { label: '+258 (Mozambique)', value: '+258' },
    { label: '+260 (Zambia)', value: '+260' },
    { label: '+261 (Madagascar)', value: '+261' },
    { label: '+262 (Reunion)', value: '+262' },
    { label: '+263 (Zimbabwe)', value: '+263' },
    { label: '+264 (Namibia)', value: '+264' },
    { label: '+265 (Malawi)', value: '+265' },
    { label: '+266 (Lesotho)', value: '+266' },
    { label: '+267 (Botswana)', value: '+267' },
    { label: '+268 (Eswatini)', value: '+268' },
    { label: '+269 (Comoros)', value: '+269' },
    { label: '+27 (South Africa)', value: '+27' },
    { label: '+290 (Saint Helena)', value: '+290' },
    { label: '+291 (Eritrea)', value: '+291' },
    { label: '+297 (Aruba)', value: '+297' },
    { label: '+298 (Faroe Islands)', value: '+298' },
    { label: '+299 (Greenland)', value: '+299' },
    { label: '+30 (Greece)', value: '+30' },
    { label: '+31 (Netherlands)', value: '+31' },
    { label: '+32 (Belgium)', value: '+32' },
    { label: '+33 (France)', value: '+33' },
    { label: '+34 (Spain)', value: '+34' },
    { label: '+350 (Gibraltar)', value: '+350' },
    { label: '+351 (Portugal)', value: '+351' },
    { label: '+352 (Luxembourg)', value: '+352' },
    { label: '+353 (Ireland)', value: '+353' },
    { label: '+354 (Iceland)', value: '+354' },
    { label: '+355 (Albania)', value: '+355' },
    { label: '+356 (Malta)', value: '+356' },
    { label: '+357 (Cyprus)', value: '+357' },
    { label: '+358 (Finland)', value: '+358' },
    { label: '+359 (Bulgaria)', value: '+359' },
    { label: '+36 (Hungary)', value: '+36' },
    { label: '+370 (Lithuania)', value: '+370' },
    { label: '+371 (Latvia)', value: '+371' },
    { label: '+372 (Estonia)', value: '+372' },
    { label: '+373 (Moldova)', value: '+373' },
    { label: '+374 (Armenia)', value: '+374' },
    { label: '+375 (Belarus)', value: '+375' },
    { label: '+376 (Andorra)', value: '+376' },
    { label: '+377 (Monaco)', value: '+377' },
    { label: '+378 (San Marino)', value: '+378' },
    { label: '+379 (Vatican City)', value: '+379' },
    { label: '+380 (Ukraine)', value: '+380' },
    { label: '+381 (Serbia)', value: '+381' },
    { label: '+382 (Montenegro)', value: '+382' },
    { label: '+383 (Kosovo)', value: '+383' },
    { label: '+385 (Croatia)', value: '+385' },
    { label: '+386 (Slovenia)', value: '+386' },
    { label: '+387 (Bosnia and Herzegovina)', value: '+387' },
    { label: '+389 (North Macedonia)', value: '+389' },
    { label: '+39 (Italy)', value: '+39' },
    { label: '+40 (Romania)', value: '+40' },
    { label: '+41 (Switzerland)', value: '+41' },
    { label: '+420 (Czech Republic)', value: '+420' },
    { label: '+421 (Slovakia)', value: '+421' },
    { label: '+423 (Liechtenstein)', value: '+423' },
    { label: '+43 (Austria)', value: '+43' },
    { label: '+44 (United Kingdom)', value: '+44' },
    { label: '+44-1481 (Guernsey)', value: '+44-1481' },
    { label: '+44-1534 (Jersey)', value: '+44-1534' },
    { label: '+44-1624 (Isle of Man)', value: '+44-1624' },
    { label: '+45 (Denmark)', value: '+45' },
    { label: '+46 (Sweden)', value: '+46' },
    { label: '+47 (Norway)', value: '+47' },
    { label: '+48 (Poland)', value: '+48' },
    { label: '+49 (Germany)', value: '+49' },
    { label: '+500 (Falkland Islands)', value: '+500' },
    { label: '+501 (Belize)', value: '+501' },
    { label: '+502 (Guatemala)', value: '+502' },
    { label: '+503 (El Salvador)', value: '+503' },
    { label: '+504 (Honduras)', value: '+504' },
    { label: '+505 (Nicaragua)', value: '+505' },
    { label: '+506 (Costa Rica)', value: '+506' },
    { label: '+507 (Panama)', value: '+507' },
    { label: '+508 (Saint Pierre and Miquelon)', value: '+508' },
    { label: '+509 (Haiti)', value: '+509' },
    { label: '+51 (Peru)', value: '+51' },
    { label: '+52 (Mexico)', value: '+52' },
    { label: '+53 (Cuba)', value: '+53' },
    { label: '+54 (Argentina)', value: '+54' },
    { label: '+55 (Brazil)', value: '+55' },
    { label: '+56 (Chile)', value: '+56' },
    { label: '+57 (Colombia)', value: '+57' },
    { label: '+58 (Venezuela)', value: '+58' },
    { label: '+590 (Guadeloupe)', value: '+590' },
    { label: '+591 (Bolivia)', value: '+591' },
    { label: '+592 (Guyana)', value: '+592' },
    { label: '+593 (Ecuador)', value: '+593' },
    { label: '+594 (French Guiana)', value: '+594' },
    { label: '+595 (Paraguay)', value: '+595' },
    { label: '+596 (Martinique)', value: '+596' },
    { label: '+597 (Suriname)', value: '+597' },
    { label: '+598 (Uruguay)', value: '+598' },
    { label: '+599 (Netherlands Antilles)', value: '+599' },
    { label: '+60 (Malaysia)', value: '+60' },
    { label: '+61 (Australia)', value: '+61' },
    { label: '+62 (Indonesia)', value: '+62' },
    { label: '+63 (Philippines)', value: '+63' },
    { label: '+64 (New Zealand)', value: '+64' },
    { label: '+65 (Singapore)', value: '+65' },
    { label: 'Thailand (+66)', value: '+66' },
    { label: 'Timor-Leste (+670)', value: '+670' },
    { label: 'Australian External Territories (+672)', value: '+672' },
    { label: 'Brunei (+673)', value: '+673' },
    { label: 'Nauru (+674)', value: '+674' },
    { label: 'Papua New Guinea (+675)', value: '+675' },
    { label: 'Tonga (+676)', value: '+676' },
    { label: 'Solomon Islands (+677)', value: '+677' },
    { label: 'Vanuatu (+678)', value: '+678' },
    { label: 'Fiji (+679)', value: '+679' },
    { label: 'Palau (+680)', value: '+680' },
    { label: 'Wallis and Futuna (+681)', value: '+681' },
    { label: 'Cook Islands (+682)', value: '+682' },
    { label: 'Niue (+683)', value: '+683' },
    { label: 'Samoa (+685)', value: '+685' },
    { label: 'Kiribati (+686)', value: '+686' },
    { label: 'New Caledonia (+687)', value: '+687' },
    { label: 'Tuvalu (+688)', value: '+688' },
    { label: 'French Polynesia (+689)', value: '+689' },
    { label: 'Tokelau (+690)', value: '+690' },
    { label: 'Micronesia (+691)', value: '+691' },
    { label: 'Marshall Islands (+692)', value: '+692' },
    { label: 'Russia (+7)', value: '+7' },
    { label: 'Kazakhstan (+7)', value: '+7' },
    { label: 'Japan (+81)', value: '+81' },
    { label: 'South Korea (+82)', value: '+82' },
    { label: 'Vietnam (+84)', value: '+84' },
    { label: 'North Korea (+850)', value: '+850' },
    { label: 'Hong Kong (+852)', value: '+852' },
    { label: 'Macau (+853)', value: '+853' },
    { label: 'Cambodia (+855)', value: '+855' },
    { label: 'Laos (+856)', value: '+856' },
    { label: 'China (+86)', value: '+86' },
    { label: 'Bangladesh (+880)', value: '+880' },
    { label: 'Taiwan (+886)', value: '+886' },
    { label: 'Turkey (+90)', value: '+90' },
    { label: 'Maldives (+960)', value: '+960' },
    { label: 'Lebanon (+961)', value: '+961' },
    { label: 'Jordan (+962)', value: '+962' },
    { label: 'Syria (+963)', value: '+963' },
    { label: 'Iraq (+964)', value: '+964' },
    { label: 'Kuwait (+965)', value: '+965' },
    { label: 'Saudi Arabia (+966)', value: '+966' },
    { label: 'Yemen (+967)', value: '+967' },
    { label: 'Oman (+968)', value: '+968' },
    { label: 'Palestine (+970)', value: '+970' },
    { label: 'United Arab Emirates (+971)', value: '+971' },
    { label: 'Israel (+972)', value: '+972' },
    { label: 'Bahrain (+973)', value: '+973' },
    { label: 'Qatar (+974)', value: '+974' },
    { label: 'Bhutan (+975)', value: '+975' },
    { label: 'Mongolia (+976)', value: '+976' },
    { label: 'Nepal (+977)', value: '+977' },
    { label: 'Iran (+98)', value: '+98' },
    { label: 'Tajikistan (+992)', value: '+992' },
    { label: 'Turkmenistan (+993)', value: '+993' },
    { label: 'Azerbaijan (+994)', value: '+994' },
    { label: 'Georgia (+995)', value: '+995' },
    { label: 'Kyrgyzstan (+996)', value: '+996' },
    { label: 'Uzbekistan (+998)', value: '+998' },
  ];

  showCountryDropdown: boolean = false;
  searchQuery: string = '';
  filteredCountryCodes: any[] = [];

  toggleCountryDropdown() {
    this.showCountryDropdown = !this.showCountryDropdown;

    if (this.showCountryDropdown) {
      this.filteredCountryCodes = [...this.countryCodes]; // Create a new array copy
      this.searchQuery = '';
    }
  }

  selectCountry(country: any) {
    this.selectedCountryCode = country.value;
    this.data.COUNTRY_CODE = this.selectedCountryCode;
    this.showCountryDropdown = false;
    this.searchQuery = '';
  }

  filterCountries(event: any) {
    const query = event.target.value.toLowerCase().trim();
    this.searchQuery = query;
    this.filteredCountryCodes = this.countryCodes.filter(
      (country) =>
        country.label.toLowerCase().includes(query) ||
        country.value.toLowerCase().includes(query)
    );
  }
  showPincodeDropdown: boolean = false;
  searchPincode: string = '';
  filteredPincodes: any[] = [];
  selectedPincode: string = '';

  togglePincodeDropdown() {
    this.showPincodeDropdown = !this.showPincodeDropdown;
    if (this.showPincodeDropdown) {
      this.filteredPincodes = this.pincodeData;
    }
  }

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

  terrotaryData: any = [];
  getTerritory() {
    this.api
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
          this.addressForm.TERRITORY_ID = territory.TERRITORY_ID;

          // this.getStateData();

          this.pincodeloading = false; // Hide loading state
        },
        error: (error: any) => {

          this.terrotaryData = []; // Clear data on error
          this.pincodeloading = false; // Hide loading state
        },
      });
  }

  filterPincodes(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredPincodes = this.pincodeData.filter(
      (item: any) =>
        item.PINCODE.toLowerCase().includes(query) ||
        item.PINCODE_NUMBER.toLowerCase().includes(query)
    );
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    const dropdown = document.querySelector('.country-dropdown');
    const selector = document.querySelector('.country-code-selector');
    if (dropdown && selector) {
      if (
        !dropdown.contains(event.target) &&
        !selector.contains(event.target)
      ) {
        this.showCountryDropdown = false;
        this.searchQuery = '';
      }
    }
  }

  openLoginModal() {
    // Close the register modal (assuming `this.register` is the reference to the register modal)
    this.modalService1.closeModal(); // This closes the register modal
    this.userType = '';
    this.otp = ['', '', '', ''];
    this.otp[0] = '';
    this.otp[1] = '';
    this.otp[2] = '';
    this.otp[3] = '';
    this.mobileNumberorEmail = '';
    this.registrationSubmitted = false;
    this.statusCode = '';
    this.issignUpLoading = false;
    this.selectedCountryCode = '+91';
    this.inputType = 'initial';
    this.openRegister = false;
    this.statusCode = '';
    this.initializeMapWithLocation;
    this.modalVisible = true;
    // if (this.modalVisible) {
    //   this.modalService.dismissAll();
    //   this.modalService.open(this.showlogin, {
    //     backdrop: "static",
    //     keyboard: false,
    //     centered: true,
    //   });
    // }
  }

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

  locationCode: string = '';
  locationAddress: string = '';
  pincodeData: any = [];
  pincodeloading: boolean = false;
  selectedLocation: any;
  currentMarker: any;

  // ngAfterViewInit() {
  //   this.initializeMapWithLocation();
  // }

  // 1. Initialize Map with Current Location or Default Location
  initializeMapWithLocation() {
    const customerType = localStorage.getItem('customerType');
    if (customerType === 'I' || localStorage.getItem('skipLocationCheck') === 'true') {
      this.showMap = false;
      this.showAddressDetailsForm = false;
      window.location.href = '/service';
      return;
    }
    const userType = this.userType || localStorage.getItem('customertype');

    // For Home Users and Guests, use default territories
    if (userType === 'home' || this.asGuest) {
      // Call API to get default territories
      this.api.getDefaultTerritories().subscribe(
        (response: any) => {
          if (response && response.body && response.body.defaultLocation) {
            const { latitude, longitude } = response.body.defaultLocation;
            this.loadMap(latitude, longitude);
          } else {
            // Fallback to Delhi if no default territory
            this.loadMap(28.6139, 77.209);
          }
        },
        (error) => {
          console.error('Error fetching default territories:', error);
          this.loadMap(28.6139, 77.209); // Fallback to Delhi
        }
      );
    } else {
      // For Business Users, use current location
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
  }

  // 2. Load Map and Place Marker
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
  // 3. Setup Search Box for Address Search
  // setupSearchBox(geocoder: any) {
  //   setTimeout(() => {
  //     const searchInput = document.getElementById(
  //       'searchBox'
  //     ) as HTMLInputElement;
  //     if (!searchInput) return;

  //     const searchBox = new google.maps.places.SearchBox(searchInput);

  //     searchBox.addListener('places_changed', () => {
  //       const places = searchBox.getPlaces();
  //       if (!places || places.length === 0) return;

  //       const place = places[0];
  //       if (!place.geometry) return;

  //       const location = place.geometry.location;
  //       this.latitude = location.lat();
  //       this.longitude = location.lng();

  //       this.map2.setCenter(location);
  //       this.currentMarker.setPosition(location);

  //       this.fetchAddressFromCoords(this.latitude, this.longitude, geocoder);
  //     });
  //   }, 500);
  // }

  // 4. Fetch Address and Pincode from Coordinates (Reverse Geocode)
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
      this.api
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
    this.api
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
  showAddressDetailsForm = false;
  user: User | null = null;
  confirmLocation(): void {
    const customerType = localStorage.getItem('customerType');

    if (customerType == 'I') {

      this.showMap = false;
      this.showAddressDetailsForm = false;
      window.location.href = '/service';
      return;
    }
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
    this.showMap = false;
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
    organizationName: '',
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
      this.api.RegistrationCustomerAddress(this.addressForm).subscribe(
        (successCode: any) => {
          if (successCode.body.code === 200) {
            this.stopLoader();
            this.isAddrssSaving = false;
            this.isOk = false;
            this.toastr.success('Address has been saved successfully.', '');

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

              this.api.subscribeToMultipleTopics(channelNames).subscribe(
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
            this.toastr.error('Email-ID is already exists', '');
          } else if (error.status === 500) {
            // Handle server-side error
            this.toastr.error(
              'An unexpected error occurred. Please try again later.',
              ''
            );
          } else {
            this.isAddrssSaving = false;
            // Generic error handling
            this.toastr.error(
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
      organizationName: '',
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
  asGuest: boolean = false;
  onshowMap() {
    this.asGuest = true;
    localStorage.setItem('isLogged', 'true');

    // Set default address for guest users
    this.api.setDefaultPincodeForHomeUser().subscribe({
      next: () => {
        this.showMap = false;
        this.modalVisible = false;
        this.openVerify = false;
        this.showAddressDetailsForm = false;
        window.location.href = '/service';
      },
      error: () => {
        // Even if setting address fails, redirect to service
        this.showMap = false;
        this.modalVisible = false;
        this.openVerify = false;
        this.showAddressDetailsForm = false;
        window.location.href = '/service';
      }
    });
  }

  showStateDropdown: boolean = false;
  searchState: string = '';
  filteredStates: any[] = [];
  selectedState: any = '';
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
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.showStateDropdown = false;
    this.showPincodeDropdown = false;
    this.showCountryDropdown = false;
  }

  loadData() {
    this.loaderService.showLoader();
  }
  dataLoaded = false;
  stopLoader() {
    this.dataLoaded = true;
    this.loaderService.hideLoader();
  }

  getPlaceholder() {
    return this.inputType === 'email'
      ? 'Enter email address'
      : this.inputType === 'mobile'
        ? 'Enter mobile number'
        : 'Enter email ID / mobile number';
  }

  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  backtologin() {
    // Close the register modal (assuming `this.register` is the reference to the register modal)
    this.modalService1.closeModal(); // This closes the register modal
    this.mobileNumberorEmail = '';
    this.registrationSubmitted = false;
    this.statusCode = '';
    this.issignUpLoading = false;
    this.selectedCountryCode = '+91';
    this.inputType = 'initial';
    this.openRegister = false;
    this.statusCode = '';
    this.initializeMapWithLocation;
    this.modalVisible = true;
    this.asGuest = false;
    this.showMap = false;
    sessionStorage.clear();
    localStorage.clear();
    this.cookie.deleteAll();
    window.location.reload();
    // if (this.modalVisible) {
    //   this.modalService.dismissAll();
    //   this.modalService.open(this.showlogin, {
    //     backdrop: "static",
    //     keyboard: false,
    //     centered: true,
    //   });
    // }
  }

  agreeConsent: boolean = false;

  openTerms() {
    window.open(this.api.weburl + 'terms-conditions', '_blank');
  }
  openPPolicy() {
    window.open(this.api.weburl + 'privacy_policy_page', '_blank');
  }
  onUserTypeChange() {
    this.setInputTypeByUserType();
    this.statusCode = '';
    // Clear business-specific fields when switching to home user
    if (this.userType === 'home') {
      // this.data.ORGANIZATION_NAME = '';
      // this.data.SHORT_CODE = '';
      // this.data.CONTACT_PERSON_NAME = '';
      // this.data.PAN_NUMBER = '';
      // this.data.GST_NUMBER = '';
    } else if (this.userType === 'business') {
      // Clear personal name when switching to business user
      this.data.CUSTOMER_NAME = '';
    }
  }
  onPanInput(event: any) {
    event.target.value = event.target.value.toUpperCase();
    this.data.PAN_NUMBER = event.target.value;
  }

  // Method to format GST input to uppercase
  onGstInput(event: any) {
    event.target.value = event.target.value.toUpperCase();
    this.data.GST_NUMBER = event.target.value;
  }


  setInputTypeByUserType() {
    // if (this.userType === 'business') {
    //   this.inputType = 'email';
    //   this.mobileNumberorEmail = '';
    // } else {
    this.inputType = 'initial';
    this.mobileNumberorEmail = '';
    // }
  }
  PUBLIC_EMAIL_DOMAINS = [
    "gmail.com", "googlemail.com", "yahoo.com", "ymail.com", "rocketmail.com",
    "hotmail.com", "outlook.com", "live.com", "msn.com", "hotmail.co.uk",
    "live.co.uk", "outlook.co.uk", "icloud.com", "me.com", "mac.com",
    "aol.com", "protonmail.com", "proton.me", "zoho.com", "yandex.com",
    "yandex.ru", "mail.com", "gmx.com", "gmx.net", "rediff.com", "rediffmail.com",
    "hotmail.in", "outlook.in", "rambler.ru", "bk.ru", "inbox.ru", "list.ru",
    "mail.ru", "web.de", "gmx.de", "t-online.de", "orange.fr", "qq.com",
    "163.com", "126.com", "sina.com", "sina.cn", "fastmail.com",
    "hushmail.com", "tutanota.com", "tuta.io", "mailfence.com",
    "inbox.lv", "inbox.lt", "lycos.com", "usa.com", "europe.com",
    "asia.com", "india.com", "email.com", "consultant.com", "post.com",
    "dr.com", "techie.com", "engineer.com"
  ];


  isPublicBusinessEmail(email: string): boolean {
    if (!email || this.userType !== 'business') return false;

    let domain = email.split('@')[1]?.toLowerCase();
    return this.PUBLIC_EMAIL_DOMAINS.includes(domain);
  }

  selectedconflicttype(customerTypeFromUI: 'B' | 'I') {
    this.userType = customerTypeFromUI;
    this.isloadingconflict = false;
    this.loginSubmitted = true;


    // Determine type based on input value
    this.type = this.isEmail(this.mobileNumberorEmail) ? 'E' : 'M';

    // Determine if showing dropdown (for mobile input)
    const showDropdown = this.type === 'M'; // true if mobile, false if email

    // Get customer type from user selection or session
    // let customerType = this.userType === 'business' ? 'B' : 'I';
    let customerType = '';

    // Or if you're getting it from session/local storage:
    // const storedCustomerType = sessionStorage.getItem('customertype');
    // let customerType = storedCustomerType ? this.commonFunction.decryptdata(storedCustomerType) : 'I';

    this.isloginSendOTP = true;
    this.statusCode = '';
    this.modalVisible = false;
    this.whichOTP = 'login';
    this.loadData();
    customerType = customerTypeFromUI;
    this.api
      .sendOTP(
        this.selectedCountryCode,  // COUNTRY_CODE: selectedCountry.value
        this.mobileNumberorEmail,   // TYPE_VALUE: mobile.value
        this.type,                  // TYPE: showDropdown ? 'M' : 'E'
        customerType                // CUSTOMER_TYPE: type
      )
      .subscribe({
        next: (successCode: any) => {
          if (successCode.code == '200') {
            if (successCode.CUSTOMER_TYPE) {
              sessionStorage.setItem(
                'customertype',
                this.commonFunction.encryptdata(successCode.CUSTOMER_TYPE)
              );
              localStorage.setItem(
                'customertype',
                this.commonFunction.encryptdata(successCode.CUSTOMER_TYPE)
              );
            } else {
              sessionStorage.setItem(
                'customertype',
                this.commonFunction.encryptdata('I')
              );
              localStorage.setItem(
                'customertype',
                this.commonFunction.encryptdata('I')
              );
            }

            this.isloginSendOTP = false;
            this.modalService1.closeModal();
            this.otpSent = true;
            this.showOtpModal = true;
            this.USER_ID = successCode.USER_ID;
            this.USER_NAME = successCode.USER_NAME;
            this.modalVisible = true;
            this.remainingTime = 60;
            this.startTimer();
            this.toastr.success('OTP Sent Successfully...', '');
            this.modalVisible = false;
            this.openRegister = false;
            this.openVerify = true;
            this.stopLoader();
          } else if (successCode.code == '400') {
            this.modalVisible = true;
            this.isloginSendOTP = false;
            this.statusCode =
              'The user is not registered or has been deactivated';
            this.stopLoader();
          } else {
            this.modalVisible = true;
            this.isloginSendOTP = false;
            this.toastr.error('OTP Validation Failed...', '');
            this.stopLoader();
          }
        },
        error: (error) => {
          this.modalVisible = true;
          // Handle error if login fails
          if (error.status === 400) {
            this.statusCode =
              'The user is not registered or has been deactivated';
            this.toastr.info(
              'The user is not registered or has been deactivated',
              ''
            );
          } else {
            this.modalVisible = true;
            this.toastr.error('Error sending OTP', '');
          }
          this.isloginSendOTP = false;
          this.modalVisible = true;
          this.stopLoader();
        },
      });
  }

}
