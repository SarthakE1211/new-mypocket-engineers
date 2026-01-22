import { DatePipe } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LoaderService } from 'src/app/Service/loader.service';
import { ModalService } from 'src/app/Service/modal.service';
class Ticketgroup {
  ID?: number;
  CLIENT_ID?: number;
  PARENT_ID?: number;
  TYPE?: string;
  VALUE?: string;
  URL?: string;
  SEQ_NO: number = 0;
  IS_LAST: any = false;
  ALERT_MSG?: string;
  STATUS?: boolean;
  PRIORITY: string = 'M';
  DEPARTMENT_ID?: number;
}
@Component({
  selector: 'app-manage-tickits',
  templateUrl: './manage-tickits.component.html',
  styleUrls: ['./manage-tickits.component.scss'],
})
export class ManageTickitsComponent {
  @Input() drawerClose!: Function;
  @Input() DrawerVisible: boolean = false;
  gotoHelpSupport() {
  }
  manageTickets() {
    this.getTickitDAta();
  }
  isSpinning: boolean = false;
  ticketGroups: Ticketgroup[] = [];
  index = 0;
  ticketQuestion: any = {};
  getTickitDAta() {
    this.isSpinning = true;
    this.index = 0;
    var filterQuery = " AND PARENT_ID=0 AND TYPE='Q'";
    this.apiservice
      .getAllTicketGroups(0, 0, 'id', 'ASC', filterQuery)
      .subscribe(
        (response: HttpResponse<any>) => {
          const ticketGroups = response.status;
          this.isSpinning = true;
          if (response.status == 200) {
            if (response.body.data[0]?.length == 0) {
              this.ticketQuestion = {};
              this.ticketGroups = [];
              this.isSpinning = false;
            } else {
              this.ticketQuestion = response.body.data[0];
              this.isSpinning = false;
              var filterQuery2 =
                ' AND PARENT_ID=' +
                response.body.data[0]['ID'] +
                " AND TYPE='O' AND TICKET_TYPE = 'C'";
              this.apiservice
                .getAllTicketGroups(
                  0,
                  0,
                  'SEQ_NO',
                  'ASC',
                  filterQuery2 + ' AND STATUS=1 '
                )
                .subscribe((ticketGroups) => {
                  this.ticketGroups = ticketGroups.body.data;
                  this.isSpinning = false;
                });
            }
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        }
      );
  }
  parentId: any = 0;
  item: any = {};
  isLast = false;
  backPressed = false;
  isAddTicket = false;
  filterQuery = '';
  nodata = false;
  nextData(item: any) {
    this.item = item;
    if (item.IS_LAST == 0) {
      this.index++;
      this.parentId = item.ID;
      this.backPressed = false;
      this.isAddTicket = false;
      this.isLast = false;
      this.filterQuery = ' AND PARENT_ID=' + item.ID + " AND TYPE='Q'";
      this.nodata = true;
      this.getQuestions();
    } else {
      this.isAddTicket = true;
      this.isLast = true;
      this.getMappedFaq();
    }
  }
  myTicketCount: number = 0;
  myTicketLoading: boolean = false;
  loadingRecordsFaqs = false;
  getMappedFaq() {
    this.loadingRecordsFaqs = true;
    this.myTicketCount = 0;
    this.myTicketLoading = true;
    this.ticketGroups = [];
    this.apiservice
      .getAllTickets(
        0,
        0,
        'ID',
        'ASC',
        " AND STATUS!='C' AND CREATOR_EMPLOYEE_ID=" +
          this.userID +
          ' AND TICKET_GROUP_ID=' +
          this.item['ID']
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.myTicketLoading = false;
            this.myTicketCount = data['count'];
          } else {
            this.myTicketLoading = false;
          }
        },
        (err) => {
          this.myTicketLoading = false;
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );
    this.apiservice.getMappingFaqs2(this.item['ID']).subscribe(
      (data) => {
        if (data['status'] == '200') {
          this.faqs = data['body']['data'];
          this.isLast = true;
        } else {
          this.loadingRecordsFaqs = false;
        }
      },
      (err) => {
        this.loadingRecordsFaqs = false;
      }
    );
  }
  faqs: any = [];
  getQuestions() {
    this.isSpinning = true;
    this.ticketGroups = [];
    this.apiservice
      .getAllTicketGroups(
        0,
        0,
        'SEQ_NO',
        'ASC',
        this.filterQuery + ' and STATUS=1'
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const ticketGroups = response.status;
          if (response.status == 200) {
            if (response.body.data.length == 0) {
              this.ticketQuestion = {};
              this.isSpinning = false;
            } else {
              this.ticketQuestion = response.body.data[0];
              if (this.backPressed)
                this.parentId = response.body.data[0].PARENT_ID;
              this.getGroups(response.body.data[0].ID);
              this.isSpinning = false;
            }
          } else {
            this.isSpinning = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
          }
        }
      );
  }
  activePanelIndex: number | null = null;
  togglePanel(index: number): void {
    this.activePanelIndex = this.activePanelIndex === index ? null : index;
  }
  prevData() {
    this.isAddTicket = false;
    this.backPressed = true;
    this.index--;
    this.nodata = false;
    this.isLast = false;
    this.getQuestions1();
  }
  getQuestions1() {
    this.isSpinning = true;
    this.ticketGroups = [];
    this.apiservice
      .getAllTicketGroupsprevious(0, 0, 'SEQ_NO', 'ASC', '', 3)
      .subscribe(
        (response: HttpResponse<any>) => {
          const ticketGroups = response.status;
          if (response.status == 200) {
            if (response.body.data.length == 0) {
              this.ticketQuestion = {};
              this.isSpinning = false;
            } else {
              this.ticketQuestion = response.body.data[0];
              if (this.backPressed)
                this.parentId = response.body.data[0].PARENT_ID;
              this.getGroups(response.body.data[0].ID);
            }
          } else {
            this.isSpinning = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
          }
        }
      );
  }
  getGroups(id: any) {
    this.filterQuery = ' AND PARENT_ID=' + id + "  AND TYPE='O' AND TICKET_TYPE = 'C'";
    this.apiservice
      .getAllTicketGroups(
        0,
        0,
        'SEQ_NO',
        'ASC',
        this.filterQuery + ' AND STATUS = 1'
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const ticketGroups = response.status;
          if (response.status == 200) {
            this.ticketGroups = response.body.data;
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
          }
        }
      );
  }
  loadingRecords: boolean = false;
  backToPrevious() {
    this.isAddTicket = false;
    this.isLast = false;
    var filterQuery = " AND PARENT_ID=0 AND TYPE='Q'";
    this.apiservice
      .getAllTicketGroups(0, 0, 'id', 'ASC', filterQuery)
      .subscribe(
        (response: HttpResponse<any>) => {
          const ticketGroups = response.status;
          if (response.status == 200) {
            if (response.body.data[0]?.length == 0) {
              this.ticketQuestion = {};
              this.ticketGroups = [];
            } else {
              this.ticketQuestion = response.body.data[0];
              var filterQuery2 =
                ' AND PARENT_ID=' +
                response.body.data[0]['ID'] +
                " AND TYPE='O' AND TICKET_TYPE = 'C'";
              this.apiservice
                .getAllTicketGroups(
                  0,
                  0,
                  'SEQ_NO',
                  'ASC',
                  filterQuery2 + ' AND STATUS=1 '
                )
                .subscribe((ticketGroups) => {
                  this.ticketGroups = ticketGroups.body.data;
                });
            }
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
          }
        }
      );
  }
  openTicketWindow() {
    this.isAddTicket = false;
  }
  DESCRIPTION: any;
  fileDataLOGO_URL: File | null = null;
  viewFile() {
    if (this.fileDataLOGO_URL) {
      const fileURL = URL.createObjectURL(this.fileDataLOGO_URL);
      window.open(fileURL, '_blank');
    }
  }
  clearImg() {
    this.fileDataLOGO_URL = null;
  }
  onFileSelectedLOGO_URL(event: any) {
    const file = event.target.files[0];
    if (file) {
      const maxFileSize = 1 * 1024 * 1024; 
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.message.error(
          'Please select a valid image (PNG, JPG, JPEG).',
          ''
        );
        return;
      }
      if (file.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }
      this.fileDataLOGO_URL = file;
    }
  }
  cancel() {
    this.drawerClose();
    this.isAddTicket = false;
    this.isLast = false;
    this.index = 0;
  }
  decreptedroleId: any;
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
  addressData:any=[];
  territoryid:any;
  send(){
    this.apiservice.getAddresses1data(
      0,
      0,
     'IS_DEFAULT',
        'desc',
      ' AND CUSTOMER_ID=' + this.userID + ' AND STATUS = 1'
    ).subscribe({
      next: (data1: any) => {
        this.addressData = data1.data;
        const defaultAddress = this.addressData.find(
          (addr: any) => addr.IS_DEFAULT === 1
        );
        var NEW_TERRITORY_ID = defaultAddress?.TERRITORY_ID;
        this.territoryid = defaultAddress?.TERRITORY_ID; 
        if(this.territoryid){
this.send1();
        }
      },
      error: (err) => {
      }
    });
  }
  send1() {
    var d = this.getFormatedDate();
    var random = Math.floor(Math.random() * 10000) + 1;
    var LOGO_URL = '';
    if (this.DESCRIPTION != undefined && this.DESCRIPTION.trim() != '') {
      this.isSpinning = true;
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
              if (this.decreptedroleId == 9) {
                USERTYPE = 'V';
              } else if (
                this.decreptedroleId != 6 &&
                this.decreptedroleId != 7 &&
                this.decreptedroleId != 8 &&
                this.decreptedroleId != 9
              ) {
                USERTYPE = 'C';
              } else {
                USERTYPE = 'U';
              }
              var data = {
                URL: LOGO_URL,
                TICKET_GROUP_ID: this.item['ID'],
                TICKET_NO: d + '' + random,
                USER_ID: this.userID,
                SUBJECT: this.ticketQuestion['VALUE'],
                MOBILE_NO: this.userMobile,
                EMAIL_ID: this.userEMAIL,
                CLOUD_ID: 1,
                QUESTION: this.DESCRIPTION,
                STATUS: 'P',
                CLIENT_ID: 1,
                DEPARTMENT_ID: this.item['DEPARTMENT_ID'],
                DEPARTMENT_NAME: this.item['DEPARTMENT_NAME'],
                USER_TYPE: USERTYPE,
                CREATER_NAME: this.userNAME,
                TERRITORY_ID :this.territoryid
              };
              this.apiservice
                .createTicket(data)
                .subscribe((response: HttpResponse<any>) => {
                  const statusCode = response.status;
                  const responseBody = response.body;
                  if (statusCode === 200) {
                    this.drawerClose();
                    this.isSpinning = false;
                    this.isAddTicket = false;
                    this.isLast = false;
                    this.index = 0;
                    this.fileDataLOGO_URL = null;
                    this.DESCRIPTION = '';
                    this.message.success('Support ticket created successfully', '');
                    this.isSpinning = false;
                  } else {
                    this.message.error('Information Not Saved...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.isSpinning = false;
              this.message.error('Failed to upload file', '');
            }
          });
      } else {
        let USERTYPE: string = '';
        if (this.decreptedroleId == 9) {
          USERTYPE = 'V';
        } else if (
          this.decreptedroleId != 6 &&
          this.decreptedroleId != 7 &&
          this.decreptedroleId != 8 &&
          this.decreptedroleId != 9
        ) {
          USERTYPE = 'C';
        } else {
          USERTYPE = 'U';
        }
        var data = {
          URL: '',
          TICKET_GROUP_ID: this.item['ID'],
          TICKET_NO: d + '' + random,
          USER_ID: this.userID,
          SUBJECT: this.ticketQuestion['VALUE'],
          MOBILE_NO: this.userMobile,
          EMAIL_ID: this.userEMAIL,
          CLOUD_ID: 1,
          QUESTION: this.DESCRIPTION,
          STATUS: 'P',
          CLIENT_ID: 1,
          DEPARTMENT_ID: this.item['DEPARTMENT_ID'],
          DEPARTMENT_NAME: this.item['DEPARTMENT_NAME'],
          USER_TYPE: USERTYPE,
          CREATER_NAME: this.userNAME,
          TERRITORY_ID:this.territoryid
        };
        this.apiservice.createTicket(data).subscribe((successCode) => {
          if (successCode['status'] == '200') {
            this.drawerClose();
            this.isSpinning = false;
            this.isAddTicket = false;
            this.isLast = false;
            this.index = 0;
            this.fileDataLOGO_URL = null;
            this.DESCRIPTION = '';
            this.message.success('Support ticket created successfully', '');
          } else {
            this.isSpinning = false;
            this.message.error('Failed to create support ticket', '');
          }
        });
      }
    } else {
      this.message.error('Please mention your problem', '');
    }
  }
  constructor(
    private cookie: CookieService,
    private modalservice: ModalService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private message: ToastrService,
    private apiservice: ApiServiceService,
    private toastr: ToastrService,
    private loaderService: LoaderService 
  ) {}
  userID: any = this.apiservice.getUserId();
  userNAME: any = this.apiservice.getUserName();
  userAddress: any = this.apiservice.getUserAddress();
  userMobile: any = this.apiservice.getUsermobileNumber();
  userEMAIL: any = this.apiservice.getEmail();
  ngOnInit(): void {
    this.getTickitDAta();
    this.userID = this.apiservice.getUserId();
    this.userNAME = this.apiservice.getUserName();
    this.userAddress = this.apiservice.getUserAddress();
    this.userMobile = this.apiservice.getUsermobileNumber();
    this.userEMAIL = this.apiservice.getEmail();
  }
  close() {
    this.drawerClose();
    this.getTickitDAta();
  }
  showDrawer() {
    this.DrawerVisible = true;
  }
}
