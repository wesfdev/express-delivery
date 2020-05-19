import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from '../rest.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  public viewForm:boolean = false;
  public formJob: FormGroup;
  public listJobs:any = [ ];
  public listFlags:any = [];

  constructor(public fb: FormBuilder, public api: RestService, private toastr: ToastrService, 
    private sanitizer: DomSanitizer, private spinner: NgxSpinnerService) { 
    this.loadForm()
    this.getJobs()
  }

  ngOnInit() {}

  async loadForm() {

    let request = await this.api.http().get('assets/common/codes-react.json').toPromise();
    this.listFlags = request;

    this.formJob = this.fb.group({
      name: ['', Validators.required],
      age: [null, Validators.required],
      whatsapp: ['', Validators.required],
      code: ['', Validators.required],
      description: [null, Validators.required],
      car: [null],
      motorcycle: [null],
      other: [null],
      observations: [null],
    });
  }

  getSanitizer(url){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getWhatsApp(code, whatsapp){
    let prefix = code.split('+').join('').replace(/ /gi,'');
    return prefix + whatsapp;
  }

  getUrlWhatsApp(job){
    let wa = this.getWhatsApp(job.code, job.whatsapp);
    return `https://wa.me/${wa}`;
  }

  async getJobs(){
    this.spinner.show();
    let request  = await this.api.gethttp('/v1/delivery/jobs/search').toPromise();
    this.listJobs = request.body; 
    this.spinner.hide();   
  }

  newJob(){
    this.viewForm = !this.viewForm;
    this.formJob.reset();
    this.formJob.controls['code'].setValue('+502')
  }


  validateForm(){

    let errors = '';
    let shop =  this.formJob.value;

    if(!shop.name.trim()){
        errors =errors + '<span>Agregue su nombre. </span><br/> <br/>';
    }

    if(!shop.age){
        errors =errors + '<span>Agregue su edad </span><br/> <br/>';
    }

    if(!shop.description.trim()){
        errors =errors + '<span>Agregue una descripcion. </span><br/> <br/>';
    }

    if(!shop.code.trim()){
        errors =errors + '<span>Seleccione el codigo de su pais. </span><br/> <br/>';
    }

    if(!shop.whatsapp.trim()){
        errors =errors + '<span>Ingrese su numero o WhatsApp. </span><br/> <br/>';
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

  async saveJob(){

    let val = this.validateForm();

    if(val.valid){
      this.spinner.show();
      let body = this.formJob.value;
      await this.api.posthttp('/v1/delivery/jobs/new', body).toPromise();      
      this.toastr.success('', 'Se ha registrado con éxito!');       
      this.viewForm = false;
      await this.getJobs()
      this.spinner.hide();

    }else{
      this.toastr.warning(val.errors,
        'Verificar!' , {
                 enableHtml: true,
                 closeButton: true,
                 timeOut: 10000
             });  
    }
  }

  copyText(val: string){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.toastr.info('', 'Número copiado!');       
    }

}
