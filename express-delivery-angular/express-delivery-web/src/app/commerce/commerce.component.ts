import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from '../rest.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";

declare var require: any
declare var google: any;
const maxI = 50, rad = 24, opac = .6;    

var Buffer = require('buffer').Buffer

@Component({
  selector: 'app-commerce',
  templateUrl: './commerce.component.html',
  styleUrls: ['./commerce.component.css']
})
export class CommerceComponent implements OnInit, AfterViewInit {

  @ViewChild('addresstext') addresstext: any;
  public autocompleteInput: string;

  public formCommerce: FormGroup;
  public result:any = {};
  public listCategories:any = [ ];
  public listMethodPayment:any = [ ];
  public listFlags:any = [];

  constructor(public fb: FormBuilder, public api: RestService, private toastr: ToastrService,
     private sanitizer: DomSanitizer, private spinner: NgxSpinnerService) { 
    this.loadData();
    this.loadForm();
  }

  ngOnInit() {
    let location = {
      name: '',
      description: '',
      lat: 14.6407204,
      lng: -90.5132675
    };

    this.initMap(location)

  }


  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  getSanitizer(url){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  private getPlaceAutocomplete() {
      const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,{});
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
          const place = autocomplete.getPlace();
          this.invokeEvent(place);
      });
  }

  invokeEvent(place: Object) {

    let loc = place['geometry'].location;

    let geometry = {
      lat: loc.lat(),
      lng: loc.lng()
    };

    this.formCommerce.controls['location'].setValue({geometry});

    let shop = this.formCommerce.value;
    let location = {
      name: shop.name,
      description: shop.description,
      lat: loc.lat(),
      lng: loc.lng()
    };

    this.initMap(location)
  }

  loadForm() {
    this.formCommerce = this.fb.group({
      name: ['', Validators.required],
      description: [null, Validators.required],
      category: [null, Validators.required],
      facebook: [null, Validators.required],
      whatsapp: ['', Validators.required],
      delivery: [null, Validators.required],
      picture: [null, Validators.required],
      pictures: [[], Validators.required],
      methodPayment: [[], Validators.required],
      location: [{}, Validators.required],
      code: ['+502', Validators.required]
    });
  }

  async loadData(){
      this.spinner.show();
      let request = await this.api.gethttp('/v1/resources/discriminator/Category').toPromise();
      this.listCategories = request.body;

      request = await this.api.gethttp('/v1/resources/discriminator/MethodPayment').toPromise();
      this.listMethodPayment = request.body;

      request = await this.api.http().get('assets/common/codes-react.json').toPromise();
      this.listFlags = request;
      this.spinner.hide();
  }

  async handleFileInput(files){

    let value = files[0];
    let url = URL.createObjectURL(value);

    let response:any = await this.api.http().get(url, { responseType: 'arraybuffer' }).toPromise();
    let buffer = Buffer.from(response, 'binary').toString('base64');

    let picture = {
        value:value,
        file: buffer,
        url: url,
        principal: true,
        mimeType: value.type,
        name: value.name,
        sizeImage: value.size
    };
    let pictures = [picture];
    this.formCommerce.controls['pictures'].setValue(pictures);
  }  

  changeMethod(e, item){
    let checked = e.target.checked
    let array = this.formCommerce.value.methodPayment;   

    if(checked){
      array.push(item)
    }else{
      let index = array.indexOf(item);
      if(index > -1){
        array.splice( index, 1 );
      }
  
    }
    this.formCommerce.controls['methodPayment'].setValue(array);

  }

  validateForm(){

    let errors = '';
    let shop =  this.formCommerce.value;

    if(!shop.name.trim()){
        errors =errors + '<span>Agregue un nombre para su negocio. </span><br/> <br/>';
    }

    if(!shop.whatsapp.trim()){
        errors =errors + '<span>Agregue un numero de teléfono(WhatsApp) para que las personas se puedan comunicar con usted. </span><br/> <br/>';
    }

    if(this.isEmpty(shop.location)){
        errors =errors + '<span>Revisa tu ubicación, al parecer no es válida. </span><br/> <br/>';
    }

    if(!shop.methodPayment.length){
        errors =errors + '<span>Seleccione alguna forma de pago. </span><br/> <br/>';
    }

    if(!shop.pictures.length){
        errors =errors + '<span>Por favor, seleccione una imagen. </span><br/> <br/>';
    }

    if(errors){
      return {
        valid:false,
        errors
      }
    }else{
      return {
        valid: true
      }
    }

  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  async saveCommerce(event){

    let validation = this.validateForm()

    if(validation.valid){
      
      this.spinner.show();
      let body = this.formCommerce.value;
      let request = await this.api.posthttp('/v1/delivery', body).toPromise();
      this.result = request.body;   
      this.toastr.success('', 'Comercio registrado!');       
      this.formCommerce.reset();   
      this.spinner.hide();

    }else{
      this.toastr.warning(validation.errors,
               'Verificar!' , {
                        enableHtml: true,
                        closeButton: true,
                        timeOut: 10000
                    });      
    }

  }


  initMap(location) {

    let lat = Number(location.lat)
    let ln = Number(location.lng)

          document.getElementById('mapByCity').style.display = 'block';
          let map = new google.maps.Map(document.getElementById('mapByCity'), {
            zoom: 16,
            center: {lat: lat, lng: ln},
            mapTypeId: 'roadmap',
          });

          let locations = [];
          let factor = 10 * 1;
          let i = 0;

          let iconUrl = 'assets/img/store/location.svg';
          var icon = {
            url:iconUrl, // url
            scaledSize: new google.maps.Size(25, 25), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
          };

          while (i < factor) {

            locations.push(new google.maps.LatLng(lat, ln));
            let contentString = `<div><b>${location.name}</b><br/>Descripción: <b>${location.description}</b></div>`;
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


        let analyticsMap = new google.maps.visualization.HeatmapLayer({
          data: locations,
          map: map,
          maxIntensity: maxI,
          radius: rad,
          opacity: opac
        }); 

   }    



}
