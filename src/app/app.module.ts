import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiServiceService } from './Service/api-service.service';
import { ServiceOrderPageComponent } from './pages/ServiceModule/service-order-page/service-order-page.component';
import { ServiceComponent } from './pages/ServiceModule/service/service.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AllBrandsComponent } from './pages/shop/components/all-brands/all-brands.component';
import { CartComponent } from './pages/shop/components/cart/cart.component';
import { CheckOutComponent } from './pages/shop/components/check-out/check-out.component';
import { ShopBuyNowPageComponent } from './pages/shop/components/shop-buy-now-page/shop-buy-now-page.component';
import { ShopHomeComponent } from './pages/shop/components/shop-home/shop-home.component';
import { TermsAndConditionComponent } from './components/terms-and-condition/terms-and-condition.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { OrderReviewPageComponent } from './pages/ServiceModule/order-review-page/order-review-page.component';
import { SafeUrlPipe } from './Service/safe-url.pipe';
import { CommonLoaderComponent } from './pages/common-loader/common-loader.component';
import { ShoporderDetailsComponent } from './pages/shop/components/shoporder-details/shoporder-details.component';
import { ManageTickitsComponent } from './components/manage tickits/manage-tickits/manage-tickits.component';
import { ShowTicketsComponent } from './components/manage tickits/show-tickets/show-tickets.component';
import { SharedSubcategoryDrawerComponent } from './pages/ServiceModule/shared-subcategory-drawer/shared-subcategory-drawer.component';
import { environment } from 'src/environments/environment.prod';
import { initializeApp } from 'firebase/app';
import en from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { TickitChatComponent } from './components/manage tickits/tickit-chat/tickit-chat.component';
import { MultipleCheckoutOrderDrawerComponent } from './pages/ServiceModule/multiple-checkout-order-drawer/multiple-checkout-order-drawer.component';
import { AddAddressComponent } from './pages/commonComponent/add-address/add-address.component';
import { ManageFaqsComponent } from './components/manage tickits/manage-faqs/manage-faqs.component';
import { AppLanguageComponent } from './components/manage language translation/app-language/app-language.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AboutComponent } from './components/about/about.component';
import { CartService } from './Service/cart.service';
import { FlastscreenComponent } from './pages/flastscreen/flastscreen.component';
import { RescheduleTimeSlotDrawerComponent } from './pages/ServiceModule/reschedule-time-slot-drawer/reschedule-time-slot-drawer.component';
import { LoginComponent } from './pages/login/login.component';
import { OrderShowTicketsComponent } from './components/manage tickits/order-show-tickets/order-show-tickets.component';
import { OrderManageTicketsComponent } from './components/manage tickits/order-manage-tickets/order-manage-tickets.component';
import { OrderTicketChatComponent } from './components/manage tickits/order-ticket-chat/order-ticket-chat.component';
import { ContactpageComponent } from './components/contactpage/contactpage.component';
import { FooteraboutpageComponent } from './components/footeraboutpage/footeraboutpage.component';
import { PrivacypolicyWithoutLoginComponent } from './components/privacypolicy-without-login/privacypolicy-without-login.component';
import { AllRefurbishedProductsComponent } from './pages/shop/components/all-refurbished-products/all-refurbished-products.component';
import { TermsAndConditionWithoutLoginComponent } from './components/terms-and-condition-without-login/terms-and-condition-without-login.component';
import { CommonmapComponent } from './commonmap/commonmap.component';
registerLocaleData(en);
initializeApp(environment.firebase);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ServiceComponent,
    ServiceOrderPageComponent,
    LoginComponent,
    TermsAndConditionWithoutLoginComponent,
    SharedSubcategoryDrawerComponent,
    AllBrandsComponent,
    CartComponent,
    CheckOutComponent,
    ShopBuyNowPageComponent,
    ShopHomeComponent,
    TermsAndConditionComponent,
    PrivacyComponent,
    OrderReviewPageComponent,
    SafeUrlPipe,
    CommonLoaderComponent,
    ShoporderDetailsComponent,
    ManageTickitsComponent,
    ShowTicketsComponent,
    TickitChatComponent,
    MultipleCheckoutOrderDrawerComponent,
    AddAddressComponent,
    ManageFaqsComponent,
    AppLanguageComponent,
    AboutComponent,
    FlastscreenComponent,
    RescheduleTimeSlotDrawerComponent,
    OrderManageTicketsComponent,
    OrderShowTicketsComponent,
    OrderTicketChatComponent,
    ContactpageComponent,
    FooteraboutpageComponent,
    PrivacypolicyWithoutLoginComponent,
    AllRefurbishedProductsComponent,
    CommonmapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    HttpClientModule,
    NgbDropdownModule,
    FormsModule,
    RouterModule,
    CommonModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [ApiServiceService, DatePipe, CartService, Title, Meta],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class AppModule { }
