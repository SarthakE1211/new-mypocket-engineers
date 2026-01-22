import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LoaderService } from 'src/app/Service/loader.service';
import { ModalService } from 'src/app/Service/modal.service';
@Component({
  selector: 'app-app-language',
  templateUrl: './app-language.component.html',
  styleUrls: ['./app-language.component.scss'],
})
export class AppLanguageComponent {
  @Input() drawerClose!: Function;
  @Input() isDrawerVisible: boolean = false;
  close() {
    this.drawerClose();
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
    private loaderService: LoaderService,
    private translate: TranslateService
  ) 
  {}
  ngOnInit(): void {
    this.getLanguageData();
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
  gotoSettings() {
  }
  appLanguageLoading: boolean = false;
  selectedLanguage: any;
  appLanguageData: any = [];
  getLanguageData() {
    this.appLanguageLoading = true;
    this.apiservice
      .getAppLanguageData(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE =1 ')
      .subscribe({
        next: (data: any) => {
          if (data.data.length > 0) {
            this.appLanguageData = data.data;
            const englishLanguage = this.appLanguageData.find(
              (lang: any) => lang.NAME.toLowerCase() === 'english'
            );
            if (englishLanguage) {
              this.selectedLanguage = englishLanguage.ID;
            }
          } else {
            this.appLanguageData = [
              {
                ID: '1',
                NAME: 'English',
              },
            ];
            this.selectedLanguage = '1';
          }
          this.appLanguageLoading = false; 
        },
        error: (error: any) => {
          this.appLanguageData = []; 
          this.appLanguageLoading = false; 
        },
      });
  }
  onLanguageChange(data: any) {
    this.selectedLanguage = data.ID;
    this.getJsondata(data);
    localStorage.setItem('selectedLanguage', data);
  }
  datalist: any = [];
  translationData: any = [];
  datalist2: any = [];
  getJsondata(data: any) {
    if (data && data.ID) {
      this.apiservice.getAppLanguageDataFilterwise(data.ID).subscribe(
        (data) => {
          if (data['status'] === 200) {
            this.translationData = data.body['DRAFT_JSON'];
            var defaultJson = data.body['DRAFT_JSON'];
            data.NAME =
              data.body.data.length > 0 ? data.body.data[0].NAME : 'English';
            this.datalist = Object.keys(defaultJson).map((key, value) => ({
              KEY: key,
              ENGLISH: defaultJson[value], 
              TRANSLATION: defaultJson[value], 
            }));
            const draftJson2 = data.body['DEAFULT_JSON'] || [];
            this.datalist2 = Object.keys(draftJson2).map((key) => ({
              TRANSLATION: draftJson2[key] || '',
            }));
          } else {
            this.datalist = [];
            this.message.error('Failed To Load Json Data...', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong...', '');
        }
      );
    }
  }
}