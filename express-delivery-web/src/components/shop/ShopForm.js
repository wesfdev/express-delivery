import React from 'react';
import bag from '../../assets/images/bag.svg'
import ws from '../../assets/images/whatsapp.svg'
import moto from '../../assets/images/motocycle.svg'
import category from '../../assets/images/category.svg'
import desc from '../../assets/images/description.svg'
import fb from '../../assets/images/fb.svg'
import card from '../../assets/images/credit-card.svg'
import image from '../../assets/images/image.svg'
import cancel from '../../assets/images/cancel.svg'
import data from '../../assets/libs/statics/codes-react.json'
import ReactCustomFlagSelect from 'react-custom-flag-select';
import "react-custom-flag-select/lib/react-custom-flag-select.min.css";
import axios from 'axios';
import Swal from 'sweetalert2'
import ReactLoading from 'react-loading';
import PlacesWithStandaloneSearchBox from '../maps/PlacesWithStandaloneSearchBox';
import { Link } from 'react-router-dom';


const ca = localStorage.getItem('code');

const _ = require('lodash');
const FLAG_SELECTOR_OPTION_LIST =  data;
const DEFAULT_AREA_CODE =  ca ? ca : FLAG_SELECTOR_OPTION_LIST[80].id;

const find = (arr, obj) => {
    const res = [];
    arr.forEach(o => {
      let match = false;
      Object.keys(obj).map(i => {
        if (obj[i] === o[i]) {
          match = true;
        }
      });
      if (match) {
        res.push(o);
      }
    });
    return res;
  };



class ShopForm extends React.Component {
 

    constructor(props){
        super(props);
        this.state = {
            count:0,
            areaCode: DEFAULT_AREA_CODE,
            phone:'',
            load:false 
        };
    }    

    setDefaultValues(props){
        let form = {
                name:'',
                category:'',            
                description:'',            
                whatsapp:'',
                facebook:'',
                webpage:'',
                messenger:'',
                location:{ },
                pictures:[],
                methodPayment:[],
                delivery:false,
                code: ca,
                picturesAlt:'',
                methodPaymentAlt:false,
                default: false,
                payment: []
            };

        
        for(let p in form){
            props.formValues[p] = form[p];
            let ev = {
                target:{ name: p, value: form[p] }
            };            
            console.log(ev)
            props.onChange(ev);
        }        

    }

    async uploadFile(props, e, value, type){ 
        this.setState({count: this.state.count+1, ...this.state.count});
        const url = URL.createObjectURL(value);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary').toString('base64');
        let principal = false;
        if(!props.formValues[type].length){
            principal = true;
        }
        let picture = {
            id: this.state.count,
            value:value,
            file: buffer,
            url: url,
            principal: principal,
            mimeType: value.type,
            name: value.name,
            sizeImage: value.size
        };


        props.formValues[type].push(picture);
        props.formValues.picturesAlt = null;
        //e.target.value = '';
        let ev = {
            target:{ name:type, value: props.formValues[type] }
        };
        props.onChange(ev);

    }

    renewalFile (props, e, object, type){

        let index = props.formValues.pictures.indexOf(object);        
        if(index > -1){
            if('update' === type){
                props.formValues.pictures.forEach((element) => element.principal = false);                
                object.principal = true;
                props.formValues.pictures[index] = object;

            }else if('delete' === type){
                props.formValues.pictures.splice( index, 1 );
            }   
            props.onChange(e);            
        }
    }

    handleChange(props, e, type){
        let isPicture = 'pictures' === type;
        let checked =  isPicture ? true: e.target.checked; 
        let value = isPicture ? e.target.files[0] : e.target.value;

        if(checked){
            if(isPicture){
                this.uploadFile(props, e, value, type);
            }else{
                props.formValues[type].push(value);
            }

        }else{
            let index = props.formValues[type].indexOf(value);
            if(index > -1){
                props.formValues[type].splice( index, 1 );
            }

        }
        props.onChange(e);
    }

    handleClick = (props, e) =>{
        this.setState({load:true})
        let valid = this.validateForm(this.props.formValues)
        if(valid){
            this.saveShop(this.props.formValues, props)
        }
    }

    async saveShop(body, props){
        let shop = await axios.post(`http://localhost:3001/v1/delivery`, body)
        console.log(shop)
        if(shop.status == 200){

            this.setState({load:false})
            this.setDefaultValues(props);

            Swal.fire({
                title: 'Felicidades!',
                text: 'Tu negocio ha sido registrado, ahora puedes compartirlo para que más personas te conozcan. ',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Vamos de compras!',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.value) {
                    let path = `${window.location.origin}/shops`
                    window.location.replace(path)
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    window.location.reload();
                }else{
                    window.location.reload();
                }
              })

        }else{
            this.setState({load:false})
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Parece que hubo un inconveniente'
              })            

        }


    }

    validateForm(shop){

        let errors = '';
        
        if(!shop.name.trim()){
            errors =errors + '<span>Agregue un nombre para su negocio. </span><br/>';
        }

        if(!shop.whatsapp.trim()){
            errors =errors + '<span>Agregue un numero de teléfono(WhatsApp) para que las personas se puedan comunicar con usted. </span><br/>';
        }

        if(_.isEmpty(shop.location)){
            errors =errors + '<span>Revisa tu ubicación, al parecer no es válida. </span><br/>';
        }

        if(!shop.methodPayment.length){
            errors =errors + '<span>Seleccione alguna forma de pago. </span><br/>';
        }

        if(!shop.pictures.length){
            errors =errors + '<span>Por favor, seleccione una imagen. </span><br/>';
        }else{
            let result = _.filter(shop.pictures, (item) => { return item.principal });     
            if(!result.length){
                errors =errors + '<span>Por favor, seleccione una imagen como principal. </span><br/>';
            }       
            console.log(result)
        }

        
        if(errors){
            this.setState({load:false});
            Swal.fire({
                title: '<strong>Por favor, verificar</u></strong>',
                icon: 'info',
                html: errors ,
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText:"OK"
              })
              return false;
        }else{
            return true;
        }   



    }


    handleSubmit = e =>{
        //console.log('submitted',e)
        e.preventDefault();
    }

    handlePhoneChange(code) {
        localStorage.setItem("code", code)
        this.props.formValues.code = code;
        let e = {
            target:{name:'code', value:code}
        };
        this.props.onChange(e);
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
          event.preventDefault();
        }
    }

    render(){
        const { areaCode } = this.state;
        const { formValues, data, payment } = this.props;
        const currentItem = find(FLAG_SELECTOR_OPTION_LIST, { id: areaCode })[0];

        let loading;

        if(this.state.load){
            loading = (
                <ReactLoading type={'cylon'} color={'rgb(53, 126, 221)'} height={100} width={100} />
            );
        }

        return (
            <React.Fragment>
                <Link to='/' className='btn btn-primary btn-sm'>Regresar al menú</Link><br/> <br/>         
                <h3><strong>Agrega un nuevo comercio</strong></h3><br/>
                <form onSubmit={this.handleSubmit} onKeyPress={this.onKeyPress} id='create-shop'>

                    <div className='form-group'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend div-prepend" >
                                <img src={bag} alt='name logo' className='Shop__image mdi-link'/>
                            </div>
                            <input type="text" className="field-z form-control" placeholder="Nombre comercio (Ej.: Tienda San Juan)" name='name'
                            onChange={this.props.onChange} value={formValues.name}/>                            
                        </div>                                                  
                    </div>  
                  <div className='form-group'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend div-prepend" >
                                <img src={category} alt='category logo' className='Shop__image mdi-link'/>
                            </div>
                            <select onChange={this.props.onChange} className='field-z form-control' type='text' name='category'
                                    value={formValues.category} placeholder="Categoría">
                                    <option selected defaultValue="0">Selecccione una categoría</option>
                                    {data.map((c)=>{
                                        return (<option key={c.dbid} value={c.dbid}>{c.name}</option>)
                                    })}
                                </select>

                        </div>                                                  
                    </div>                     

                    <div className='form-group'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend div-prepend" >
                                <img src={desc} alt='description' className='Shop__image mdi-link'/>
                            </div>
                            <textarea onChange={this.props.onChange} className=' field-z form-control' type='text' name='description'
                            value={formValues.description} placeholder="Descripción comercio. Ejemplo: Horario atención: De Lunes a viernes hasta la 1pm"></textarea>
                        </div>                                                  
                    </div> 

                    <span>Facebook y WhatsApp seran los medios con los que los compradores se podrán comunicar contigo.</span> 
                    <div className='form-group'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend div-prepend" >
                            <img src={ws} alt='whatsapp' className='Shop__image mdi-link'/>

                            <ReactCustomFlagSelect
                                tabIndex={"1"} 
                                id={"areaCode"}
                                name={"areaCode"} 
                                value={currentItem.id}
                                showSearch={true} 
                                animate={true} 
                                optionList={FLAG_SELECTOR_OPTION_LIST} 
                                customStyleContainer={{ border: "none", fontSize: "12px"}} 
                                customStyleSelect={{ width: "80px" }} 
                                customStyleOptionListItem={{ }}
                                customStyleOptionListContainer={{
                                    maxHeight: "100px",
                                    overflow: "auto",
                                    width: "120px", 
                                    marginTop: '11px'
                                }} 
                                onChange={(areaCode) => {
                                    this.setState({ areaCode: areaCode }, () => {
                                    this.handlePhoneChange(areaCode);
                                    });
                                }}/>

                            </div>
                            <input type="text" className="field-z form-control" placeholder="WhatsApp" name='whatsapp'
                            onChange={this.props.onChange} value={formValues.whatsapp}/>
                        </div>                                                  
                    </div>      

                    <span>Ejemplo: .</span> 
                    <div className='form-group'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend div-prepend" >
                                <img src={fb} alt='facebook logo' className='Shop__image mdi-link'/>
                            </div>
                            <input type="text" className="field-z form-control" placeholder="Ingrese url de facebook" name='facebook'
                            onChange={this.props.onChange} value={formValues.facebook}/>
                        </div>                                                  
                    </div>                      

                    <div className='form-group'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend div-prepend" >
                                <img src={moto} alt='delivery logo' className='Shop__image mdi-link'/>
                            </div>
                            <label className='field-z'>Servicio a domicilio?</label>

                            <div className='container'>
                            <label className="container-ui">SI
                                    <input type="radio" name="delivery" onChange={this.props.onChange} value={true} />
                                    <span className="radio-z checkmark"></span>
                                </label>
                                <label className="container-ui">NO
                                    <input type="radio" name="delivery" onChange={this.props.onChange} value={false}/>
                                <span className="radio-z checkmark"></span>
                                </label>                        
                            </div>
                        </div>                                                  
                    </div>   

                    <div className='form-group'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend div-prepend" >
                                <img src={card} alt='payment logo' className='Shop__image mdi-link'/>
                            </div>
                            <label className='field-z'>Formas de pago:</label>

                            <div className='container'>
                                {payment.map((p)=>{
                                    return (
                                        <label className="container-ui" key={p.dbid}>{p.description}
                                            <input type="checkbox" name="methodPaymentAlt" onChange={(e)=>this.handleChange(this.props, e, 'methodPayment')} value={JSON.stringify(p)}/>
                                            <span className="field-z checkmark"></span>
                                        </label>
    
                                    )
                                })}
                            </div>
                        </div>                                                  
                    </div>

                    <label>
                    Sube imágenes y selecciona la que estará como principal para tu negocio.                       
                    </label>
                    <div className='form-group'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend div-prepend" >
                                <img src={image} alt='pictures logo' className='Shop__image mdi-link'/>
                            </div>
                            <input type="file" className="field-z form-control" placeholder="Agregar imagen" name='picturesAlt'
                            onChange={(e)=>this.handleChange(this.props, e, 'pictures')} />
                            {/* <button className='btn btn-primary' onClick={(e)=>this.uploadFile(this.props, e)}>Subir</button> */}
                        </div>                                                  
                    </div> 

                    <div className='row container-fluid'>
                        {formValues.pictures.length ? <span><strong>Por favor, selecciona la image principal para tu negocio</strong></span> : '' }
                        {formValues.pictures.map((p)=>{
                        return (
                            <span key={p.id}>
                                <img style={{height:'100px', width:'93px'}} src={p.url} alt='Logo'></img>
                                <img style={{height:'30px', width:'25px'}} src={cancel} alt='delete' onClick={(e)=>this.renewalFile(this.props, e, p,'delete')} />
                                <div className='container'>
                                <label className="container-ui">Imagen principal?
                                    <input type="radio" name="principal" value={p.principal} onClick={(e)=>this.renewalFile(this.props, e, p, 'update')} />
                                    <span className="radio-z checkmark"></span>
                                </label>
                            </div>
                            </span>
                        )
                        })}
                    </div>

                    <div>
                        <span>Escribe una ubicación de referencia. Al escribir se te sugeriran direcciones por medio de google maps.  
                            <strong> Ejemplo: Guatemala City. </strong>
                             Después podras seleccionar tu ubicación exacta desde el mapa.
                        </span>                              
                        { <PlacesWithStandaloneSearchBox formValues={formValues} /> }                     
                    </div>

                        { loading }
                        <button onClick={(e)=>this.handleClick(this.props, e)} className='btn btn-primary'>Guardar</button>
    

                   
                </form>
                <br/><br/>
            </React.Fragment>
        );
    }

}

export default ShopForm;