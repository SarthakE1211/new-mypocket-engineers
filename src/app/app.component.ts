import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ModalService } from 'src/app/Service/modal.service';
import { ApiServiceService } from './Service/api-service.service';
import { LoaderService } from './Service/loader.service';

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Pockit-website';
  routePath: string = '';
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private activatedRoute: ActivatedRoute,
    private cookie: CookieService,
    private modalservice: ModalService,
    public apiservice: ApiServiceService,
    private loaderService: LoaderService,
    private message: ToastrService,
    private datePipe: DatePipe
  ) {
    this.loaderService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
       this.routePath = window.location.href.split('/')[3]
  }
  needLogeIn: boolean = false;
  isLoading = false; // Loader starts by default
  flashscreen: boolean = true;
 cookiesAccepted:boolean = false;
  isPrivacyPolicyPage:boolean = false;
  ngOnInit() {

    let isLogged: any = localStorage.getItem('isLogged');
    const userId = localStorage.getItem('userId');
    // if (isLogged !== 'true') {
    // } else if (userId === '0') {
    // } else {
    //   if (
    //     this.cookie.get('token') == null ||
    //     (this.cookie.get('token') == undefined ||
    //       this.cookie.get('token') == '')
    //   ) {
    //     this.cookie.set(
    //       'token',
    //       localStorage.getItem('token')|| '',
    //       365,
    //       '/',
    //       '',
    //       true,
    //       'None'
    //     );
    //     window.location.reload();
    //   }
    // }
    // this.cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
    // // this.cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';

    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe((event: NavigationEnd) => {
    //     this.isPrivacyPolicyPage = event.url.includes('/privacy_policy_page');
    //   });
    this.chatshow = false
    sessionStorage.setItem('chatreciveee', 'no');
    sessionStorage.setItem('chatopen', 'false');
    const firebaseApp = initializeApp(environment.firebase);
    this.messaging = getMessaging(firebaseApp);

    this.requestPermission();
    setTimeout(() => {
      this.flashscreen = false;
    }, 3000);
    // fairebase changes

    this.loaderService.isLoading$.subscribe((status) => {
      this.isLoading = status;
    });

    // let isLogged: any = localStorage.getItem('isLogged');
    // const userId = localStorage.getItem('userId');

    //
    this.loaderService.isLoading$.subscribe((status) => {
      this.isLoading = status;
    });

    // const userId = localStorage.getItem('userId');
    // const isLogged = localStorage.getItem('isLogged');

    if (isLogged !== 'true') {
      if(this.routePath!=='privacy_policy_page' && this.routePath!=='terms-conditions' ){
       
 this.needLogeIn = true;
      this.openModal();
      }
     
    } else if (userId === '0') {
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem(
        'userAddress',
        localStorage.getItem('userAddress') || ''
      );
      sessionStorage.setItem(
        'customertype',
        localStorage.getItem('customertype') || ''
      );
    } else {
      sessionStorage.setItem(
        'token',
        this.cookie.get('token') || localStorage.getItem('token') || ''
      );
      sessionStorage.setItem('userId', userId || '');
      sessionStorage.setItem(
        'userName',
        localStorage.getItem('userName') || ''
      );
      sessionStorage.setItem(
        'mobileNumber',
        localStorage.getItem('mobileNumber') || ''
      );
      sessionStorage.setItem(
        'customertype',
        localStorage.getItem('customertype') || 'I'
      );

      // Service Worker Message Listener
      // navigator.serviceWorker.addEventListener('message', (event) => {
      //   sessionStorage.setItem('megrecived', 'yes');
      // my old code
      // });
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          sessionStorage.setItem('megrecived', 'yes');
        });


      }

      const messaging = getMessaging();
      onMessage(messaging, (payload: any) => {
        sessionStorage.setItem('msgdata', JSON.stringify(payload));
        sessionStorage.setItem('msgget', 'yes');
        sessionStorage.setItem('megrecived', 'yes');

        // Show push notification manually
        if (payload.notification) {
          const notification = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: './assets/img/Logo111.png',
          });

          notification.onclick = () => {
            window.focus();
            if (
              payload.data['data3'] === 'C' &&
              sessionStorage.getItem('chatopen') == 'false'
            ) {
              // var event :any = JSON.parse( sessionStorage.getItem('msgdata') || '');
              //
              var obj = JSON.parse(payload.data['data4']);
              delete obj.authData;
              this.jobdataaaaa = obj;
              this.btnclickkkkformsg.nativeElement.click();
            }

            // this.router.navigate(['/privacy-policy']);
          };
        }
      });
    }

    // Listen for route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd) // <-- Using filter here
      )
      .subscribe((event) => {
        // Get the fragment from the route
        const fragment = this.activatedRoute.snapshot.fragment;

        // If fragment is present, scroll to the element with that ID
        if (fragment) {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          // No fragment, scroll to the top
          window.scrollTo(0, 0);
        }
      });
  }

 acceptCookies(): void {
    localStorage.setItem('cookiesAccepted', 'true');
    this.cookiesAccepted = true;
  }
  handleNotificationClick(data: any) {
    window.focus();

    if (data['data3'] === 'C' && sessionStorage.getItem('chatopen') === 'false') {
      const obj = JSON.parse(data['data4']);
      delete obj.authData;
      this.jobdataaaaa = obj;
      this.btnclickkkkformsg.nativeElement.click();
    }


    // this.router.navigate(['/privacy-policy']);
  }


  // handleNotificationClick(payload: any) {
  //   if (
  //     payload.data?.['data3'] === 'C' &&
  //     sessionStorage.getItem('chatopen') == 'false'
  //   ) {
  //     const obj = JSON.parse(payload.data['data4']);
  //     delete obj.authData;

  //     this.jobdataaaaa = obj;
  //     this.btnclickkkkformsg.nativeElement.click();
  //   }
  // }

  openModal() {
    this.modalservice.openModal();
  }

  callAfterMessageReceived(payload: any) {
    //
    //

    sessionStorage.setItem('megrecived', 'yes');
  }
  // fairebase changess
  private messaging: any;

  currentMessage = new BehaviorSubject<any>(null);
  requestPermission() {
    const messaging = getMessaging();

    getToken(messaging, { vapidKey: environment.firebase.vapid })
      .then((currentToken) => {
        if (currentToken) {
          this.cookie.set('CLOUD_ID', currentToken, 365, '', '', true, 'None');
        }
      })
      .catch((err) => {
        Notification.requestPermission().then(function (getperm) { });
      });
  }
  receiveMessages() {
    onMessage(this.messaging, (payload) => {
      // Store message in LocalStorage

      let storedMessages = JSON.parse(
        localStorage.getItem('NOTIFICATIONS') || '[]'
      );
      storedMessages.push(payload.notification);
      localStorage.setItem('NOTIFICATIONS', JSON.stringify(storedMessages));

      this.currentMessage.next(payload.notification);
    });
  }
  zoomLevel = 1;
  zoomIn() {
    if (this.zoomLevel < 3) this.zoomLevel += 0.2;
  }

  zoomOut() {
    if (this.zoomLevel > 0.5) this.zoomLevel -= 0.2;
  }

  onScroll(event: WheelEvent) {
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  // Keyboard Support (+ and - keys)
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === '+') {
      this.zoomIn();
    } else if (event.key === '-') {
      this.zoomOut();
    }
  }
  rotationAngle: number = 0;
  rotateImage() {
    this.rotationAngle += 90; // Rotate 90 degrees on each click
  }

  // shubham code for chat recvie and open chat drawer
  @ViewChild('btnclickkkkformsg') btnclickkkkformsg!: ElementRef;

  chatwith: any = '';

  jobdataaaaa: any;
  chatshow: boolean = false;
  chatwithcustomer(job: any = this.jobdataaaaa) {
    sessionStorage.setItem('msgget', 'no');
    sessionStorage.setItem('chatopen', 'true');
    this.jobdataaaaa = job;
    this.chatshow = true;
    this.BODY_TEXT = null;
    this.ICON = null;
    this.chatwith = this.jobdataaaaa.TECHNICIAN_NAME;
    this.getmsgs();
  }

  isSpinning: boolean = false;
  showimagebox: boolean = false;
  progressBarImageOne: any;
  msgspin: boolean = false;
  BODY_TEXT: any;
  groupeddata: any;
  allchatmsg: any;
  @ViewChild('scrollableDivvvvv')
  scrollableDivvvvv!: ElementRef<HTMLDivElement>;
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  getmsgs() {
    // var filter = `{ $and:[ {TECHNICIAN_ID: ${this.chatdata.TECHNICIAN_ID}},{jobcardid:${this.chatdata.ID}}]}`;
    // var filter = { $and:[ {TECHNICIAN_ID: ${this.chatdata.TECHNICIAN_ID}},{jobcardid:${this.chatdata.ID}}]};
    this.msgspin = true;
    var filter = {
      $and: [
        { CUSTOMER_ID: this.jobdataaaaa.CUSTOMER_ID },
        { JOB_CARD_ID: this.jobdataaaaa.JOB_CARD_ID },
      ],
    };

    this.apiservice.getchat(0, 0, '_id', 'asc', filter).subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          this.allchatmsg = data['data'];
          sessionStorage.setItem('newmsg', 'false');
          this.groupeddata = this.groupDataBySendDate(this.allchatmsg);

          this.msgspin = false;
          setTimeout(() => {
            const div = this.scrollableDivvvvv.nativeElement;
            div.scrollTop = div.scrollHeight;
          }, 500);
        }
        this.msgspin = false;
      }
    });
  }

  getmsgssssss() {
    if (sessionStorage.getItem('msgget') == 'yes' && this.chatshow == true) {
      sessionStorage.setItem('msgget', 'no');
      this.messageListener();
    } else {
    }
  }

  closechat() {
    sessionStorage.setItem('msgget', 'no');
    sessionStorage.setItem('chatopen', 'false');
    window.scrollTo(0, 0);
    this.BODY_TEXT = '';
    this.ICON = null;
    this.showimagebox = false;
    this.jobdataaaaa = null;
    this.chatshow = false;
  }

  urllll = this.apiservice.retriveimgUrl;
  groupDataBySendDate(data: any[]): { [key: string]: any[] } {
    return data.reduce((groupedData, item) => {
      // Extract only the date part (YYYY-MM-DD) from SEND_DATE
      const sendDate = new Date(item.SEND_DATE).toISOString().split('T')[0];

      if (!groupedData[sendDate]) {
        groupedData[sendDate] = [];
      }
      groupedData[sendDate].push(item);
      return groupedData;
    }, {});
  }

  getMediaType(url: string): string {
    if (!url) return ''; // Return empty if no attachment
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];

    const extension = url.split('.').pop()?.toLowerCase(); // Extract file extension

    if (extension && imageExtensions.includes(extension)) {
      return 'I'; // Image
    } else if (extension && videoExtensions.includes(extension)) {
      return 'V'; // Video
    }
    return ''; // Default if not recognized
  }
  sendmessage() {
    this.isSpinning = true;
    if (
      (this.BODY_TEXT === '' ||
        this.BODY_TEXT === undefined ||
        this.BODY_TEXT === null) &&
      (this.ICON == '' || this.ICON == undefined || this.ICON == null)
    ) {
      this.message.error('Please enter message');
      this.isSpinning = false;
      return;
    } else {
      if (
        this.BODY_TEXT === '' ||
        this.BODY_TEXT === undefined ||
        this.BODY_TEXT === null
      ) {
      } else {
        const boldPattern = /\*(.*?)\*/g; // Matches text wrapped in a single pair of '*'
        this.BODY_TEXT = this.BODY_TEXT.replace(boldPattern, '<b>$1</b>');
      }
    }
    const mediaType = this.getMediaType(this.ICON);
    var dataaa = {
      ORDER_ID: this.jobdataaaaa.ORDER_ID,
      ORDER_NUMBER: this.jobdataaaaa.ORDER_NO,
      JOB_CARD_ID: this.jobdataaaaa.JOB_CARD_ID,
      CUSTOMER_ID: this.jobdataaaaa.CUSTOMER_ID,
      TECHNICIAN_ID: this.jobdataaaaa.TECHNICIAN_ID,
      MESSAGE: this.BODY_TEXT,
      SENDER_USER_ID: this.jobdataaaaa.CUSTOMER_ID,
      RECIPIENT_USER_ID: this.jobdataaaaa.TECHNICIAN_ID,
      CLIENT_ID: 1,
      JOB_CARD_NUMBER: this.jobdataaaaa.JOB_CARD_NO,
      CUSTOMER_NAME: this.jobdataaaaa.CUSTOMER_NAME,
      TECHNICIAN_NAME: this.jobdataaaaa.TECHNICIAN_NAME,
      CREATED_DATETIME: this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
      STATUS: 'D',
      BY_CUSTOMER: true,
      SENDER_USER_ID_USER: this.jobdataaaaa.CUSTOMER_NAME,
      RECIPIENT_USER_NAME: this.jobdataaaaa.TECHNICIAN_NAME,
      SEND_DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      RECEIVED_DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      ATTACHMENT_URL: this.ICON ? this.ICON : '',
      IS_DELIVERED: true,
      MEDIA_TYPE: mediaType,
    };

    this.apiservice.createchat(dataaa).subscribe(
      (successCode: any) => {
        if (successCode.code == '200') {
          // this.message.success('Message Sent Successfully', '');
          this.BODY_TEXT = '';
          this.ICON = null;
          this.showimagebox = false;
          // this.showEmojiPicker = false;
          this.getmsgs();
          this.isSpinning = false;
        } else {
          // this.message.error('Message Failed to sent', '');
          this.isSpinning = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.isSpinning = false;
        if (err.status === 0) {
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            ''
          );
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br/>');
  }
  ICON: any = '';
  imageshow: any;
  UrlImageOne: any;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;
    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'video/mp4'
    ) {
      this.fileURL = <File>event.target.files[0];
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.UrlImageOne = url;
        if (this.ICON != undefined && this.ICON.trim() != '') {
          var arr = this.ICON.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarImageOne = true;
      this.urlImageOneShow = true;
      this.isSpinning = true;
      this.timer = this.apiservice
        .onUpload('OrderChat', this.fileURL, this.UrlImageOne)
        .subscribe((res) => {
          this.ICON = this.UrlImageOne;

          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentImageOne = percentDone;
            if (this.percentImageOne == 100) {
              this.isSpinning = false;
              setTimeout(() => {
                this.progressBarImageOne = false;
              }, 2000);
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            // this.isimgupload = false;
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.ICON = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              // this.isimgupload = true;
              this.isSpinning = false;
              this.ICON = this.UrlImageOne;
              this.showimagebox = true;
            } else {
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.ICON = null;
              // this.isimgupload = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only Image File', '');
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.ICON = null;
    }
  }

  Date: any;
  BODY_VALUES: any;
  inputBody: any;
  // check1() {
  //   const pattern = /{{\d+}/g;
  //   const matches = this.BODY_TEXT.match(pattern);

  //   if (matches && this.BODY_VALUES != undefined) {
  //     for (let i = 0; i < matches.length; i++) {
  //       this.inputBody = this.inputBody.replace(
  //         matches[i].toString() ? matches[i].toString() : this.inputBody,
  //         this.BODY_VALUES[i] ? this.BODY_VALUES[i] : matches[i].toString()
  //       );
  //       this.inputBody = this.inputBody.replace(
  //         this.BODY_VALUES[i] + '}',
  //         this.BODY_VALUES[i] + ' '
  //       );
  //     }
  //   } else {
  //     this.inputBody = this.BODY_TEXT;
  //   }
  // }

  handleEnter(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'b') {
      this.makeBold();
    }
    if (event.key === 'Enter') {
      event.preventDefault();

      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      this.BODY_TEXT =
        this.BODY_TEXT.slice(0, start) + '\n' + this.BODY_TEXT.slice(end);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      });
    }
  }

  makeBold(): void {
    const textarea = document.getElementById(
      'messages2'
    ) as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      // Wrap selected text in <b> tags
      const selectedText = this.BODY_TEXT.substring(start, end);
      const boldText = `*${selectedText}*`;
      this.BODY_TEXT =
        this.BODY_TEXT.slice(0, start) + boldText + this.BODY_TEXT.slice(end);

      // Update textarea and cursor position
      textarea.value = this.BODY_TEXT;
      textarea.selectionStart = textarea.selectionEnd = end + 7; // Adjust for <b></b>
      // this.updateFormattedText();
    }
  }

  messageListener() {
    if (
      sessionStorage.getItem('msgdata') != null &&
      sessionStorage.getItem('msgdata') != undefined &&
      sessionStorage.getItem('msgdata') != ''
    ) {
      // ,'eventtttttttttttt222222222222')
      sessionStorage.setItem('msgget', 'no');
      var event: any = JSON.parse(sessionStorage.getItem('msgdata') || '');
      //
      var obj = JSON.parse(event.data.data4);
      delete obj.authData;
      this.allchatmsg = [...this?.allchatmsg, ...[obj]];
      this.groupeddata = this.groupDataBySendDate(this.allchatmsg);
      this.msgspin = false;
      setTimeout(() => {
        const div = this.scrollableDivvvvv.nativeElement;
        div.scrollTop = div.scrollHeight;
      }, 500);
    } else {
      sessionStorage.setItem('msgget', 'no');
    }

    // if (event?.data?.firebaseMessaging) {
    //   // this.messages.push(event.data.firebaseMessaging.notification);
    // }
  }
}