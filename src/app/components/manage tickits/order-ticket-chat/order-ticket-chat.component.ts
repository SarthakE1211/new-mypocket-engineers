import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LoaderService } from 'src/app/Service/loader.service';
import { ModalService } from 'src/app/Service/modal.service';
interface FormData {
  TICKET_MASTER_ID: number;
  SENDER: any;
  SENDER_ID: any;
  DESCRIPTION: string;
  URL: string;
  CLIENT_ID: string;
  TICKET_NO: string;
}
@Component({
  selector: 'app-order-ticket-chat',
  templateUrl: './order-ticket-chat.component.html',
  styleUrls: ['./order-ticket-chat.component.scss'],
})
export class OrderTicketChatComponent {
  @Input() drawerClose!: Function;
  @Input() isDrawerVisible: boolean = false;
  @Input() drawerData: any;
  @Input() orderdata: any;

  close() {
    this.drawerClose();
  }

  FormData: any = {
    TICKET_MASTER_ID: 0,
    SENDER: '',
    SENDER_ID: '',
    DESCRIPTION: '',
    URL: '',
    CLIENT_ID: '',
    TICKET_NO: '',
  };
  constructor(
    private cookie: CookieService,
    private modalservice: ModalService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private message: ToastrService,
    private apiservice: ApiServiceService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService // private toastr: ToastrService
  ) {}
  customertype: any = this.apiservice.getCustomerType();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['drawerData']) {
      this.fetchChatData();
    }

    if (changes['drawerData']) {
      
    }
  }

  retriveimgUrl: any;
  ngOnInit(): void {
    if (this.drawerData.IS_TAKEN_STATUS === 'Yes') {
      this.showcloseticket = true;
    }

    this.retriveimgUrl = this.apiservice.retriveimgUrl;
    this.userID = this.apiservice.getUserId();
    this.userNAME = this.apiservice.getUserName();
    this.userAddress = this.apiservice.getUserAddress();
    this.userMobile = this.apiservice.getUsermobileNumber();
    this.userEMAIL = this.apiservice.getEmail();
  }

  userID: any = this.apiservice.getUserId();
  userNAME: any = this.apiservice.getUserName();
  userAddress: any = this.apiservice.getUserAddress();
  userMobile: any = this.apiservice.getUsermobileNumber();
  userEMAIL: any = this.apiservice.getEmail();
  isLoading: boolean = false;
  chatData: any = [];
  decrepteduserID = this.userID;
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  isUserAtBottom: boolean = true;
  showcloseticket: boolean = false;
  fetchChatData() {
    this.isLoading = true;
    this.apiservice
      .getAllticketDetails(
        0,
        0,
        'ID',
        'asc',
        ` AND USER_ID='${this.userID}' AND TICKET_NO=${this.drawerData.TICKET_NO}`
      )
      .subscribe({
        next: (data: any) => {
          const isInitialLoad = this.chatData.length === 0;

          this.chatData = data.body.data;
          if (this.chatData.IS_TAKEN_STATUS == 'Yes') {
            this.showcloseticket = true;
          }
          this.isLoading = false;

          this.cdr.detectChanges();

          setTimeout(() => {
            this.scrollToBottom(true);
          }, 300);
        },
        error: (error: any) => {
          
          this.chatData = [];
          this.isLoading = false;
        },
      });
  }

  scrollToBottom(forceScroll: boolean = false) {
    if (this.chatMessages?.nativeElement) {
      const chatContainer = this.chatMessages.nativeElement;

      if (forceScroll || this.isUserAtBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom(); // Will only scroll if user is at the bottom
  }

  onScroll() {
    if (this.chatMessages && this.chatMessages.nativeElement) {
      const chatContainer = this.chatMessages.nativeElement;
      const nearBottom =
        chatContainer.scrollTop + chatContainer.clientHeight >=
        chatContainer.scrollHeight - 10;

      this.isUserAtBottom = nearBottom; // Update scrolling state
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  }
  isChatBoxVisible: boolean = false;
  toggleChatBox(): void {
    this.isChatBoxVisible = !this.isChatBoxVisible;
  }

  getSenderEmpName(senderEmpID: any): any {
    let empName = '';
    this.chatData.filter((obj: any) => {
      if (obj.ID == senderEmpID) {
        empName = obj['CREATER_NAME'];
      }
    });
    return empName;
  }
  fileDataLOGO_URL: any;
  clearImg() {
    this.fileDataLOGO_URL = null;
  }

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const maxFileSize = 1 * 1024 * 1024; // 1 MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        this.message.error('Please select a valid image (PNG, JPG, JPEG).', '');
        return;
      }

      if (file.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }

      this.fileDataLOGO_URL = file;
    }

    if (file && file.type.startsWith('image/')) {
      this.fileDataLOGO_URL = file;
      this.selectedFile = file;

      // Show image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  getFormatedDate() {
    var date_ob = new Date();
    let date = ('0' + date_ob.getDate()).slice(-2);
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ('0' + date_ob.getHours()).slice(-2);
    let minutes = ('0' + date_ob.getMinutes()).slice(-2);
    let seconds = ('0' + date_ob.getSeconds()).slice(-2);

    return (
      year.toString().slice(2, 4) + month + date + hours + minutes + seconds
    );
  }
  folderName = 'ticket';
  isSpinning: boolean = false;

  getmsgssssss() {
    if (sessionStorage.getItem('msgget') === 'yes') {
      sessionStorage.setItem('msgget', 'no');
      this.messageListener();
    }
  }

  messageListener() {
    const msgData = sessionStorage.getItem('msgdata');

    

    if (msgData) {
      try {
        const event: any = JSON.parse(msgData);

        // 

        if (event?.data?.data4) {
          var obj = JSON.parse(event.data.data4);

          // this.fetchChatData()

          this.apiservice
            .getAllticketDetails(
              0,
              0,
              'ID',
              'asc',
              ` AND USER_ID='${this.userID}' AND TICKET_NO=${this.drawerData.TICKET_NO}`
            )
            .subscribe({
              next: (data: any) => {
                this.chatData = data.body.data;
                if (this.chatData.IS_TAKEN_STATUS == 'Yes') {
                  this.showcloseticket = true;
                }
              },
            });

          if (this.drawerData?.TICKET_NO === obj.TICKET_NO) {
            if (
              !this.drawerData?.TAKEN_BY_USER_ID ||
              this.drawerData.TAKEN_BY_USER_ID === 0
            ) {
              this.drawerData.TAKEN_BY_USER_ID = obj.TAKEN_BY_USER_ID;
            }
          }

          

          delete obj.authData;
        }
      } catch (error) {
        
      }
    }

    sessionStorage.setItem('msgget', 'no');
  }

  sendMessage() {
    var d = this.getFormatedDate();
    var random = Math.floor(Math.random() * 10000) + 1;
    var LOGO_URL = '';

    const msgdata = sessionStorage.getItem('msgdata');
    const parsedData = msgdata ? JSON.parse(msgdata) : null;

    const ticketno = parsedData?.data?.data4
      ? JSON.parse(parsedData.data.data4).TAKEN_BY_USER_ID
      : this.drawerData.TAKEN_BY_USER_ID;

    if (
      this.FormData.DESCRIPTION != undefined &&
      this.FormData.DESCRIPTION.trim() != ''
    ) {
      this.isSpinning = true;
      this.FormData.SENDER_ID = this.userID;
      this.FormData.TICKET_MASTER_ID = this.drawerData.ID;
      this.FormData.TICKET_NO = this.drawerData.TICKET_NO;
      this.FormData.SENDER = 'U';
      if (this.fileDataLOGO_URL) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
        var Dates = new Date();
        var formatedDate: any = this.datePipe.transform(
          Dates,
          'yyyyMMddHHmmss'
        );
        var url = formatedDate + number + '.' + fileExt;

        this.apiservice
          .onUpload2(this.folderName, this.fileDataLOGO_URL, url)
          .subscribe((successCode: any) => {
            if (successCode['code'] == '200') {
              LOGO_URL = url;
              this.fileDataLOGO_URL = null;
              this.message.success('Image uploaded successfully.', '');
              let USERTYPE: string = '';

              this.FormData.URL = LOGO_URL;

              this.apiservice
                .AddChat(this.FormData)
                .subscribe((response: any) => {
                  const statusCode = response.status;
                  const responseBody = response.body;

                  if (
                    response['message'] ==
                    'TicketDetail information saved successfully...'
                  ) {
                    this.message.success(
                      'TicketDetail information saved successfully...',
                      ''
                    );

                    
                    this.fetchChatData();


                    if (this.chatData[0]['STATUS'] == 'R') {
                      if (
                        this.drawerData.ORDER_ID !== null &&
                        this.drawerData.ORDER_ID !== undefined &&
                        this.drawerData.ORDER_ID >= 0
                      ) {
                        const updateTicketData = {
                          ID: this.chatData[0].TICKET_MASTER_ID,
                          TICKET_GROUP_ID: this.chatData[0].TICKET_GROUP_ID,
                          TICKET_NO: this.chatData[0].TICKET_NO,
                          USER_ID: this.drawerData.USER_ID,
                          MOBILE_NO: this.chatData[0].MOBILE_NO,
                          EMAIL_ID: this.chatData[0].EMAIL_ID,
                          QUESTION: this.drawerData.QUESTION,
                          CLOUD_ID: this.drawerData.CLOUD_ID,
                          STATUS: 'O',
                          PRIORITY: this.drawerData.PRIORITY,
                          IS_TAKEN: this.drawerData.IS_TAKEN,
                          IS_TAKEN_STATUS: this.drawerData.IS_TAKEN_STATUS,
                          TAKEN_BY_USER_ID: ticketno,
                          LAST_RESPONDED: this.drawerData.LAST_RESPONDED,
                          CREATED_MODIFIED_DATE: this.drawerData.CREATED_MODIFIED_DATE,
                          READ_ONLY: this.chatData[0].READ_ONLY,
                          ARCHIVE_FLAG: this.drawerData.ARCHIVE_FLAG,
                          CLIENT_ID: this.drawerData.CLIENT_ID,
                          ON_HOLD: this.chatData.ON_HOLD,
                          DATE: this.chatData[0].DATE,
                          SUBJECT: this.drawerData.SUBJECT,
                          FIRST_RESOLVED_TIME: this.drawerData.FIRST_RESOLVED_TIME,
                          DEPARTMENT_ID: this.drawerData.DEPARTMENT_ID,
                          ORG_ID: this.drawerData.ORG_ID,
                          TICKET_GROUP_TYPE: this.drawerData.TICKET_GROUP_TYPE,
                          TICKET_GROUP_VALUE: this.drawerData.TICKET_GROUP_VALUE,
                          TICKET_GROUP_PARENT_VALUE:
                            this.drawerData.TICKET_GROUP_PARENT_VALUE,
                          IS_LAST: this.drawerData.IS_LAST,
                          DEPARTMENT_NAME: this.chatData[0].DEPARTMENT_NAME,
                          IS_TAKEN_USER_NAME: this.chatData[0].IS_TAKEN_USER_NAME,
                          TICKET_TAKEN_EMPLOYEE: this.chatData[0].TICKET_TAKEN_EMPLOYEE,
                          RECIVER_AGENT: this.chatData[0].RECIVER_AGENT,
                          ANSWER_AGENT: this.drawerData.ANSWER_AGENT,
                          SUPPORT_AGENT_NAME: this.drawerData.SUPPORT_AGENT_NAME,
                          ORGANISATION_NAME: this.drawerData.ORGANISATION_NAME,
                          RECIVER_ID: this.drawerData.RECIVER_ID,
                          USER_TYPE: this.drawerData.USER_TYPE,
                          TICKET_TAKEN_DEPARTMENT_ID:
                            this.drawerData.TICKET_TAKEN_DEPARTMENT_ID,
                          TICKET_TAKEN_DEPARTMENT_NAME:
                            this.drawerData.TICKET_TAKEN_DEPARTMENT_NAME,
                          TICKET_TAKEN_DEPARTMENT:
                            this.drawerData.TICKET_TAKEN_DEPARTMENT,
                          ORDER_ID: this.orderdata?.ORDER_ID
                            ? this?.orderdata?.ORDER_ID
                            : null,
                          SHOP_ORDER_ID: this.orderdata?.SHOP_ORDER_ID
                            ? this?.orderdata?.SHOP_ORDER_ID
                            : null,
                          JOB_CARD_ID: this?.orderdata?.JOB_CARD_ID,
                          WARRANTY_ALLOWED: this?.orderdata?.WARRANTY_ALLOWED,
                          GUARANTEE_ALLOWED: this?.orderdata?.GUARANTEE_ALLOWED,
                          WARRANTY_PERIOD: this?.orderdata?.WARRANTY_PERIOD,
                          GUARANTEE_PERIOD: this?.orderdata?.GUARANTEE_PERIOD,
                          RECIVER_NAME: this.drawerData.RECIVER_NAME,
                          // CREATER_NAME: this.chatData[0].CREATER_NAME,
                          CREATER_ID: this?.orderdata?.CREATER_ID,
                          CREATOR_EMPLOYEE_ID: this?.orderdata?.CREATOR_EMPLOYEE_ID,
                          CREATOR_EMPLOYEE_NAME: this?.orderdata?.CREATOR_EMPLOYEE_NAME,
                          ORDER_NO: this?.orderdata?.ORDER_NO,
                          JOB_CARD_NO: this?.orderdata?.JOB_CARD_NO,
                          ORDER_NUMBER: this?.orderdata?.ORDER_NUMBER,
                          KEY: 'SUPPORT_USER',
                          ACTION: '',
                        };
        
                        this.apiservice
                          .updateTicket(updateTicketData)
                          .subscribe((updateResponse) => {
                            if (updateResponse['success']) {
                              // this.message.success('Ticket updated successfully', '');
                            } else {
                              // this.message.error('Failed to update ticket', '');
                            }
                          });
                      } else {
                        this.drawerData.STATUS = 'O';
        
                        
        
                        this.apiservice
                          .updateTicket(this.drawerData)
                          .subscribe((updateResponse) => {
                            if (updateResponse['success']) {
                              // this.message.success('Ticket updated successfully', '');
                            } else {
                              // this.message.error('Failed to update ticket', '');
                            }
                          });
                      }
                    }
                    // this.drawerClose();
                    this.isSpinning = false;
                    this.FormData.URL = '';
                    this.fileDataLOGO_URL = null;
                    this.FormData.DESCRIPTION = '';
                    this.selectedFile = null;
                    this.imagePreview = null;
                    // this.message.success('successfully', '');

                    this.isSpinning = false;
                  } else {
                    this.message.error('Something went wrong...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.isSpinning = false;
              this.message.error('Failed to upload file', '');
            }
          });
      } else {
        

        const filter = this.chatData.sort((a: any, b: any) => b.ID - a.ID);

        

        // if(filter[0].STATUS == 'R')
        // {
        //   this.FormData['STATUS'] =  'O'
        // }

       

        

        this.apiservice.AddChat(this.FormData).subscribe((successCode) => {
          if (
            successCode['message'] ===
            'TicketDetail information saved successfully...'
          ) {
            this.fetchChatData();
            this.isSpinning = false;

            this.fileDataLOGO_URL = null;
            this.FormData.DESCRIPTION = '';
            this.selectedFile = null;
            this.imagePreview = null;
            this.message.success(
              'TicketDetail information saved successfully...',
              ''
            );

            // 

            

            if (this.chatData[0]['STATUS'] == 'R') {
              if (
                this.drawerData.ORDER_ID !== null &&
                this.drawerData.ORDER_ID !== undefined &&
                this.drawerData.ORDER_ID >= 0
              ) {
                const updateTicketData = {
                  ID: this.chatData[0].TICKET_MASTER_ID,
                  TICKET_GROUP_ID: this.chatData[0].TICKET_GROUP_ID,
                  TICKET_NO: this.chatData[0].TICKET_NO,
                  USER_ID: this.drawerData.USER_ID,
                  MOBILE_NO: this.chatData[0].MOBILE_NO,
                  EMAIL_ID: this.chatData[0].EMAIL_ID,
                  QUESTION: this.drawerData.QUESTION,
                  CLOUD_ID: this.drawerData.CLOUD_ID,
                  STATUS: 'O',
                  PRIORITY: this.drawerData.PRIORITY,
                  IS_TAKEN: this.drawerData.IS_TAKEN,
                  IS_TAKEN_STATUS: this.drawerData.IS_TAKEN_STATUS,
                  TAKEN_BY_USER_ID: ticketno,
                  LAST_RESPONDED: this.drawerData.LAST_RESPONDED,
                  CREATED_MODIFIED_DATE: this.drawerData.CREATED_MODIFIED_DATE,
                  READ_ONLY: this.chatData[0].READ_ONLY,
                  ARCHIVE_FLAG: this.drawerData.ARCHIVE_FLAG,
                  CLIENT_ID: this.drawerData.CLIENT_ID,
                  ON_HOLD: this.chatData.ON_HOLD,
                  DATE: this.chatData[0].DATE,
                  SUBJECT: this.drawerData.SUBJECT,
                  FIRST_RESOLVED_TIME: this.drawerData.FIRST_RESOLVED_TIME,
                  DEPARTMENT_ID: this.drawerData.DEPARTMENT_ID,
                  ORG_ID: this.drawerData.ORG_ID,
                  TICKET_GROUP_TYPE: this.drawerData.TICKET_GROUP_TYPE,
                  TICKET_GROUP_VALUE: this.drawerData.TICKET_GROUP_VALUE,
                  TICKET_GROUP_PARENT_VALUE:
                    this.drawerData.TICKET_GROUP_PARENT_VALUE,
                  IS_LAST: this.drawerData.IS_LAST,
                  DEPARTMENT_NAME: this.chatData[0].DEPARTMENT_NAME,
                  IS_TAKEN_USER_NAME: this.chatData[0].IS_TAKEN_USER_NAME,
                  TICKET_TAKEN_EMPLOYEE: this.chatData[0].TICKET_TAKEN_EMPLOYEE,
                  RECIVER_AGENT: this.chatData[0].RECIVER_AGENT,
                  ANSWER_AGENT: this.drawerData.ANSWER_AGENT,
                  SUPPORT_AGENT_NAME: this.drawerData.SUPPORT_AGENT_NAME,
                  ORGANISATION_NAME: this.drawerData.ORGANISATION_NAME,
                  RECIVER_ID: this.drawerData.RECIVER_ID,
                  USER_TYPE: this.drawerData.USER_TYPE,
                  TICKET_TAKEN_DEPARTMENT_ID:
                    this.drawerData.TICKET_TAKEN_DEPARTMENT_ID,
                  TICKET_TAKEN_DEPARTMENT_NAME:
                    this.drawerData.TICKET_TAKEN_DEPARTMENT_NAME,
                  TICKET_TAKEN_DEPARTMENT:
                    this.drawerData.TICKET_TAKEN_DEPARTMENT,
                  ORDER_ID: this.orderdata?.ORDER_ID
                    ? this?.orderdata?.ORDER_ID
                    : null,
                  SHOP_ORDER_ID: this.orderdata?.SHOP_ORDER_ID
                    ? this?.orderdata?.SHOP_ORDER_ID
                    : null,
                  JOB_CARD_ID: this?.orderdata?.JOB_CARD_ID,
                  WARRANTY_ALLOWED: this?.orderdata?.WARRANTY_ALLOWED,
                  GUARANTEE_ALLOWED: this?.orderdata?.GUARANTEE_ALLOWED,
                  WARRANTY_PERIOD: this?.orderdata?.WARRANTY_PERIOD,
                  GUARANTEE_PERIOD: this?.orderdata?.GUARANTEE_PERIOD,
                  RECIVER_NAME: this.drawerData.RECIVER_NAME,
                  // CREATER_NAME: this.chatData[0].CREATER_NAME,
                  CREATER_ID: this?.orderdata?.CREATER_ID,
                  CREATOR_EMPLOYEE_ID: this?.orderdata?.CREATOR_EMPLOYEE_ID,
                  CREATOR_EMPLOYEE_NAME: this?.orderdata?.CREATOR_EMPLOYEE_NAME,
                  ORDER_NO: this?.orderdata?.ORDER_NO,
                  JOB_CARD_NO: this?.orderdata?.JOB_CARD_NO,
                  ORDER_NUMBER: this?.orderdata?.ORDER_NUMBER,
                  KEY: 'SUPPORT_USER',
                  ACTION: '',
                };

                this.apiservice
                  .updateTicket(updateTicketData)
                  .subscribe((updateResponse) => {
                    if (updateResponse['success']) {
                      // this.message.success('Ticket updated successfully', '');
                    } else {
                      // this.message.error('Failed to update ticket', '');
                    }
                  });
              } else {
                this.drawerData.STATUS = 'O';

                

                this.apiservice
                  .updateTicket(this.drawerData)
                  .subscribe((updateResponse) => {
                    if (updateResponse['success']) {
                      // this.message.success('Ticket updated successfully', '');
                    } else {
                      // this.message.error('Failed to update ticket', '');
                    }
                  });
              }
            }
          } else {
            this.isSpinning = false;
            this.message.error('Something went wrong', '');
          }
        });
      }
    } else {
      this.message.error('Please type your message', '');
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  closeticket() {
    this.isSpinning = true;

    this.drawerData.STATUS = 'C';

    this.apiservice
      .updateticket(this.drawerData)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          // this.message.success('Information Saved Successfully', '');
          this.close();

          this.isSpinning = false;

          this.message.success('Ticket closed successfully', '');

          this.isSpinning = false;
        } else {
          this.message.error('Information Not Saved...', '');
          this.isSpinning = false;
        }
      });
  }
}
