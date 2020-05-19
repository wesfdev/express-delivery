import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { AboutComponent } from './about/about.component';
import { MainComponent } from './main/main.component';
import { ShopComponent } from './shop/shop.component';
import { JobComponent } from './job/job.component';
import { CommerceComponent } from './commerce/commerce.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { ShopCategoryComponent } from './shop-category/shop-category.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoaderComponent,
    AboutComponent,
    MainComponent,
    ShopComponent,
    JobComponent,
    CommerceComponent,
    PageNotFoundComponent,
    ShopDetailComponent,
    ShopCategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
