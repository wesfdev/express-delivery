import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { JobComponent } from './job/job.component';
import { CommerceComponent } from './commerce/commerce.component';
import { ShopComponent } from './shop/shop.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { ShopCategoryComponent } from './shop-category/shop-category.component';

const routes: Routes = [
  { path: 'home', component: MainComponent } ,  
  { path: 'jobs', component: JobComponent } ,
  { path: 'commerce', component: CommerceComponent  } ,
  { path: 'shop', component: ShopComponent },
  { path: 'shop-detail/:dbid', component: ShopDetailComponent },  
  { path: 'shop-category/:dbid', component: ShopCategoryComponent },  
  { path: '',   redirectTo: '/home', pathMatch: 'full' }, 
  { path: '**', component: MainComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
