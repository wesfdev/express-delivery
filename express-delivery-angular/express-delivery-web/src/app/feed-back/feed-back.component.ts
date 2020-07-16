import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from '../rest.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.css']
})
export class FeedBackComponent implements OnInit {

  public formComment: FormGroup;

  constructor(public fb: FormBuilder, public api: RestService, 
    private toastr: ToastrService, private spinner: NgxSpinnerService) { 

      this.loadForm();

 }

  ngOnInit() {
  }


  loadForm() {
    this.formComment = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.email],
      observations: [null, Validators.required]
    });
  }

  async sendComment(){
    if(this.formComment.invalid){
      this.toastr.warning('', 'Por favor, revise el formulario.');       
    }else{
      this.spinner.show();
      let body = this.formComment.value;
      await this.api.posthttp('/v1/delivery/feedback/new', body).toPromise();
      this.toastr.success('', 'Tu comentario ha sido enviado, gracias!');       
      this.formComment.reset();   
      this.spinner.hide();  
    }
  }

}
