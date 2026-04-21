import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
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
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { MyCartComponent } from './pages/my-cart/my-cart.component';
import { AuthGuard } from './core/guards/auth.guard';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServiceComponent },
  { path: 'order-details', component: ServiceOrderPageComponent, canActivate: [AuthGuard] },
  { path: 'service', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionComponent },
  { path: 'privacy-policy', component: PrivacyComponent },
  { path: 'privacy_policy_page', component: PrivacypolicyWithoutLoginComponent },
  { path: 'contact-us', component: ContactpageComponent },
  { path: 'about-us', component: FooteraboutpageComponent },
  { path: 'terms-conditions', component: TermsAndConditionWithoutLoginComponent },
  { path: 'order-details/:id', component: ServiceOrderPageComponent, canActivate: [AuthGuard] },
  { path: 'order-review/:id', component: OrderReviewPageComponent, canActivate: [AuthGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
  { path: 'my-cart', component: MyCartComponent, canActivate: [AuthGuard] },
  { path: 'shop', loadChildren: () => import('./pages/shop/shop/shop.module').then((m) => m.ShopModule) },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }