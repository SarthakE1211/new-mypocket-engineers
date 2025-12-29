import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShopHomeComponent } from "../components/shop-home/shop-home.component";
import { AllBrandsComponent } from "../components/all-brands/all-brands.component";
import { ShopBuyNowPageComponent } from "../components/shop-buy-now-page/shop-buy-now-page.component";

import { CheckOutComponent } from "../components/check-out/check-out.component";
import { CartComponent } from "../components/cart/cart.component";
import { ShoporderDetailsComponent } from "../components/shoporder-details/shoporder-details.component";
import { AllRefurbishedProductsComponent } from '../components/all-refurbished-products/all-refurbished-products.component';

const routes: Routes = [

  {path:'home',component:ShopHomeComponent},
  {path:'brands',component:AllBrandsComponent},
  {path:'allrefurbisheddata',component:AllRefurbishedProductsComponent},
  {path:'buy_now/:id',component:ShopBuyNowPageComponent},
  {path:'check-out/:sid/:status',component:CheckOutComponent},
  {path:'cart',component:CartComponent},
  {path:'order_details/:id',component:ShoporderDetailsComponent}
  // {
  //   path: 'shop',
  //   children: [
  //     { path: 'order_details/:id', component: ShoporderDetailsComponent }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
