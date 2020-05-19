import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { NgxSpinnerService } from "ngx-spinner";

declare var google: any;
const maxI = 50, rad = 24, opac = .6;    

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  public categories:any = [];
  public shops:any = [];
  public src:string = 'assets/img/store/';
  public searchValue:string;

  constructor(public api: RestService, private spinner: NgxSpinnerService) { 
    this.getCategories();
    this.getShops();
  }

  ngOnInit() {
  }

  async search(){
    this.spinner.show();
    if(this.searchValue){
      let request =  await this.api.gethttp(`/v1/delivery/shop/search?search=${this.searchValue}`) .toPromise(); 
      this.shops = request.body;
      this.spinner.hide();
    }else{
      this.getShops()
    }
  }

  clear(){
    this.searchValue = '';
    this.getShops()
  }

  async getCategories(){
    let request =  await this.api.gethttp('/v1/resources/discriminator/Category') .toPromise(); 
    this.categories = request.body;
  }

  async getShops(){
    this.spinner.show();
    let request =  await this.api.gethttp('/v1/delivery') .toPromise(); 
    this.shops = request.body;
    this.initMap(this.shops);
    this.spinner.hide();
  }

  getWhatsApp(code, whatsapp){
    let prefix = code.split('+').join('').replace(/ /gi,'');
    return prefix + whatsapp;
  }

  getUrlWhatsApp(shop){
    let wa = this.getWhatsApp(shop.code, shop.whatsapp);
    return `https://wa.me/${wa}?text=Buenos%20días%2c%20estoy%20interesado%20en%20adquirir%20sus%20productos.`;
  }

  initMap(result) {

    document.getElementById('mapByCity').style.display = 'block';
    let map = new google.maps.Map(document.getElementById('mapByCity'), {
      zoom: 7.7,
      center: {lat: 15.5000000, lng: -90.2500000},
      mapTypeId: 'roadmap',
    });

        let locations = [];

        result.forEach(location => {
          let lat = Number(location.lat)
          let ln = Number(location.lng)
          let factor = 10 * 1;
          let i = 0;

          let iconUrl = `assets/img/store/${location.image}`;
          var icon = {
            url:iconUrl, // url
            scaledSize: new google.maps.Size(25, 25), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
          };

          while (i < factor) {
            locations.push(new google.maps.LatLng(lat, ln));
            let whatsapp = this.getUrlWhatsApp(location);
            let contentString = `
              <div>
                <b>${location.name}</b><br/>
                <a style:"color:#635c5c !important;" target="_blank" href='${whatsapp}'> <img style="height: 20px;" alt='shop' src='assets/img/store/whatsapp.svg'> WhatsApp</a>
                <br/>Descripción: <b>${location.description}</b>
              </div>`;

            let infowindow = new google.maps.InfoWindow({
              content: contentString
            });

            let marker = new google.maps.Marker({
              position: {lat: lat, lng: ln},
              map: map,
              icon: icon
            });

            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });

            i++;
          }
        });

        let analyticsMap = new google.maps.visualization.HeatmapLayer({
          data: locations,
          map: map,
          maxIntensity: maxI,
          radius: rad,
          opacity: opac
        });
        

   }  


}
