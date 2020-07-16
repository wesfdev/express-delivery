import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-shop-category',
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.css']
})
export class ShopCategoryComponent implements OnInit {

  public shops:any = [];
  public src:string = 'assets/img/store/';
  public category:any;
  
  constructor(public api: RestService, private route: ActivatedRoute, private spinner: NgxSpinnerService) { 
    this.category = this.route.snapshot.paramMap.get('dbid');    
    this.getShopsByCategory(this.category);
  }

  ngOnInit() {
  }

  async getShopsByCategory(category){
    this.spinner.show();
    let request =  await this.api.gethttp(`/v1/delivery/shop/category/${category}`) .toPromise(); 
    await this.api.posthttp('/v1/delivery/category/new', { category } ).toPromise();    
    this.shops = request.body;
    this.spinner.hide();
  }

}
