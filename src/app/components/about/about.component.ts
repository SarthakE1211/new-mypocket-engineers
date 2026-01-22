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
import { Location } from '@angular/common';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
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
    private translate: TranslateService,
    private location: Location
  ) { }
  items = [
    { title: 'Terms of Service', content: '' },
    { title: 'Privacy Policy', content: '' },
    { title: 'Licenses', content: 'Lorem ipsum dolor sit amet consectetur. A diam sed urna sed augue mi pellentesque eget...' }
  ];
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
          this.appLanguageData = data.data;
          const englishLanguage = this.appLanguageData.find(
            (lang: any) => lang.NAME.toLowerCase() === 'english'
          );
          if (englishLanguage) {
            this.selectedLanguage = englishLanguage.ID;
          }
          this.appLanguageLoading = false; 
        },
        error: (error: any) => {
          this.appLanguageData = []; 
          this.appLanguageLoading = false; 
        },
      });
  }
  goBack() {
    this.location.back();
  }
  activeIndex: number | null = null; 
  toggleAccordion(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index; 
  }
}
