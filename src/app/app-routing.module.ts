import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
// import { LoginComponent } from './pages/login/login/login.component';
import { ServiceOrderPageComponent } from './pages/ServiceModule/service-order-page/service-order-page.component';
import { ServiceComponent } from './pages/ServiceModule/service/service.component';
import { TermsAndConditionComponent } from './components/terms-and-condition/terms-and-condition.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { OrderReviewPageComponent } from './pages/ServiceModule/order-review-page/order-review-page.component'
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './pages/login/login.component';
import { ContactpageComponent } from './components/contactpage/contactpage.component';
import { AboutComponent } from './components/about/about.component';
import { FooteraboutpageComponent } from './components/footeraboutpage/footeraboutpage.component';
import { PrivacypolicyWithoutLoginComponent } from './components/privacypolicy-without-login/privacypolicy-without-login.component';
import { TermsAndConditionWithoutLoginComponent } from './components/terms-and-condition-without-login/terms-and-condition-without-login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServiceComponent },
  { path: 'order-details', component: ServiceOrderPageComponent },
  { path: 'shop', component: LoginComponent },

  { path: 'service', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionComponent },
  { path: 'privacy-policy', component: PrivacyComponent },
  { path: 'privacy_policy_page', component: PrivacypolicyWithoutLoginComponent },

  { path: 'contact-us', component: ContactpageComponent },
  { path: 'about-us', component: FooteraboutpageComponent },
  // { path: 'profile', component: HeaderComponent },
 { path: 'terms-conditions', component: TermsAndConditionWithoutLoginComponent },

  { path: 'order-details/:id', component: ServiceOrderPageComponent },
  { path: 'order-review/:id', component: OrderReviewPageComponent },

  // { path: 'shop', loadChildren: () => import('./pages/shop/shop/shop.module').then((m) => m.ShopModule), },

  { path: 'shop', loadChildren: () => import('./pages/shop/shop/shop.module').then((m) => m.ShopModule), },


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }