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
  selector: 'app-tickit-chat',
  templateUrl: './tickit-chat.component.html',
  styleUrls: ['./tickit-chat.component.scss'],
})
export class TickitChatComponent {
  @Input() drawerClose!: Function;
  @Input() isDrawerVisible: boolean = false;
  @Input() drawerData: any;
  close() {
    this.drawerClose();
  }
  FormData: FormData = {
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
    private loaderService: LoaderService 
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['drawerData']) {
      this.fetchChatData();
    }
  }
  showcloseticket: boolean = false;
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
    this.scrollToBottom(); 
  }
  onScroll() {
    if (this.chatMessages && this.chatMessages.nativeElement) {
      const chatContainer = this.chatMessages.nativeElement;
      const nearBottom =
        chatContainer.scrollTop + chatContainer.clientHeight >=
        chatContainer.scrollHeight - 10;
      this.isUserAtBottom = nearBottom; 
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
      const maxFileSize = 1 * 1024 * 1024; 
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
        if (event?.data?.data4) {
          var obj = JSON.parse(event.data.data4);
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
  folderName = 'ticket';
  isSpinning: boolean = false;
  sendMessage() {
    var d = this.getFormatedDate();
    var random = Math.floor(Math.random() * 10000) + 1;
    var LOGO_URL = '';
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
                    if (this.drawerData) {
                      const ticketNo = this.drawerData.TICKET_NO;
                      const takenByUserId = this.drawerData.TAKEN_BY_USER_ID;
                      const query = ` AND USER_ID='${this.userID}' AND ORDER_ID IS NULL AND SHOP_ORDER_ID IS NULL AND TICKET_NO = ${ticketNo}`;
                      this.apiservice.getAllTickets(0, 0, '', '', query).subscribe({
                        next: (data: any) => {
                          const ticketList = data.body.data;
                          if (ticketList && ticketList.length > 0) {
                            const ticket = ticketList[0];
                            if (takenByUserId == 0) {
                              this.drawerData.TAKEN_BY_USER_ID = ticket.TAKEN_BY_USER_ID;
                            }
                            ticket.STATUS = 'O';
                            this.apiservice.updateTicket(ticket).subscribe({
                              next: (updateResponse: any) => {
                                if (updateResponse?.success) {
                                } else {
                                }
                              },
                              error: (err) => {
                              },
                            });
                          }
                        },
                        error: (err) => {
                        },
                      });
                    }
                  }
                    this.isSpinning = false;
                    this.FormData.URL = '';
                    this.fileDataLOGO_URL = null;
                    this.FormData.DESCRIPTION = '';
                    this.selectedFile = null;
                    this.imagePreview = null;
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
        this.apiservice.AddChat(this.FormData).subscribe((successCode) => {
          if (
            successCode['message'] ==
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
            if (this.chatData[0]['STATUS'] == 'R') {
            if (this.drawerData) {
              const ticketNo = this.drawerData.TICKET_NO;
              const takenByUserId = this.drawerData.TAKEN_BY_USER_ID;
              const query = ` AND USER_ID='${this.userID}' AND ORDER_ID IS NULL AND SHOP_ORDER_ID IS NULL AND TICKET_NO = ${ticketNo}`;
              this.apiservice.getAllTickets(0, 0, '', '', query).subscribe({
                next: (data: any) => {
                  const ticketList = data.body.data;
                  if (ticketList && ticketList.length > 0) {
                    const ticket = ticketList[0];
                    if (takenByUserId == 0) {
                      this.drawerData.TAKEN_BY_USER_ID = ticket.TAKEN_BY_USER_ID;
                    }
                    ticket.STATUS = 'O';
                    this.apiservice.updateTicket(ticket).subscribe({
                      next: (updateResponse: any) => {
                        if (updateResponse?.success) {
                        } else {
                        }
                      },
                      error: (err) => {
                      },
                    });
                  }
                },
                error: (err) => {
                },
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
