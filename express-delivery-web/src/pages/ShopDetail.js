import React from 'react';
import '../assets/styles/shop.css';
import fb from '../assets/images/fb.svg'
import msn from '../assets/images/messenger-2.svg'
import ws from '../assets/images/whatsapp.svg'
import moto from '../assets/images/motocycle.svg'
import card from '../assets/images/credit-card.svg'
import loc from '../assets/images/location.svg'
import axios from 'axios';
import { isAndroid, isIOS, isBrowser, isTablet, isIPad13 } from 'react-device-detect';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';
import PlacesView from '../components/maps/PlacesView';
import Swal from 'sweetalert2'
import PlacesWithPegman from '../components/maps/PlacesWithPegman';


class ShopDetail extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loading:true,
            load:false,
            data:{
                shop:{ },
                paymentMethods :[],
                pictures: []
            }
         };
    }

    componentDidMount(){
        this.getShopDetail(this.props.match.params.shop);
    }

    getFacebookUrl(value){

        if(isBrowser){
            return value;
        }

        if(isAndroid){
            return value;
            //return 'fb://facewebmodal/f?href=' + this.getUserFacebook(value);
        }

        if(isIOS){
            return value;
            //return 'fb://' + this.getUserFacebook(value);
        }
    }

    getUserFacebook(page){
        let user = '';
        if(page){
            let value = page.replace(/\/s*$/, "");//Remove last "/"
            value = value.split('/');
            user = value[value.length -1 ];
        }
        return user;
    }

    getUrl(value){
        let url = value.filter((e)=>e.principal);
        return this.getObjectUrl(url[0]);
    }

    getBoolean(value){
        if('true' === value || ('false' !== value && value)){
            return 'SI';
        }else{
            return 'NO'
        }
    }

    getWhatsApp(code, whatsapp){
        let prefix = code.split('+').join('').replace(/ /gi,'');
        return prefix + whatsapp;
    }

    getObjectUrl(image){
        const def = '/images/category/bag.svg';

        if(image && image.mime_type){
            const bufferBase64 = new Buffer(image.image.data, "base64").toString('binary');
            const byteCharacters = atob(bufferBase64);
            const byteNumbers = new Array(byteCharacters.length);
    
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
    
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: image.mimeType});
            return URL.createObjectURL(blob);
        }
        return def;
    }

    async getShopDetail(dbid){
        this.setState({load:true})
        const shop = await axios.get(`http://localhost:3001/v1/delivery/${dbid}`);

        let result = shop.data.body;
        this.setState({load:false})
        result.shop.url = this.getObjectUrl(result.shop);

        this.setState({
            loading:false,
            data: {
                shop: result.shop,
                paymentMethods: result.paymentMethods,
                pictures: result.pictures                
            }
        })           
    }


    render(){

        const { shop, paymentMethods, pictures } = this.state.data;

        let facebook ;
        let messenger;
        let whatsapp;
        let homeDelivery;
        let payments;
        let load;
        let param = `/shops/${shop.category}/category`;
        let direction = `https://www.google.com/maps?q=${shop.lat},${shop.lng}`;
        let location;
        let maps;
        let pegman;
        if(shop.lat && shop.lng){
            let center = {lat: Number(shop.lat), lng: Number(shop.lng)};
            maps = (  <PlacesView center={ center } /> )
            //pegman = ( <PlacesWithPegman center={ center } /> );
        }

        if(this.state.load){
            load = ( <ReactLoading type={'cylon'} color={'rgb(53, 126, 221)'} height={100} width={100} />  )
        }

        location = (

                    <div className="input-group input-group-shop mb-3">
                    <div className="input-group-prepend div-prepend" >
                        <img src={loc} alt='location logo' className='Home_logos' />
                    </div>
                    <label>
                        <a target='_blank' href={direction} className='btn btn-info'>
                            Ir a ubicación
                        </a> 
                    </label>              
                </div>              
        );

        if(shop.facebook){
            facebook = (
                    <div className="input-group input-group-shop mb-3">
                        <div className="input-group-prepend div-prepend" >
                            <img src={fb} alt='facebook logo' className='Shop__image mdi-link fb'/>
                        </div>
                        <label>
                        <a target="_blank" href={this.getFacebookUrl(shop.facebook)}>{shop.name}</a> </label>              
                    </div>                                                  
            );
    
            messenger = (
                    <div className="input-group input-group-shop mb-3">
                        <div className="input-group-prepend div-prepend" >
                        </div>
                        <label>
                            <a target="_blank" 
                            className='btn  btn-sm msn'
                            href={`http://m.me/${this.getUserFacebook(shop.facebook)}`}>
                                <img src={msn} alt='messenger logo' className='Shop__image mdi-link'/>
                                &nbsp; Contactar por Messenger
                                </a>                               
                        </label>              
                    </div>                                                  
            ) 
        }
    
        if(shop.whatsapp){
            whatsapp = (
                    <div className="input-group input-group-shop mb-3">
                        <div className="input-group-prepend div-prepend" >
                            
                        </div>
                        <label>
                            <a  target="_blank" 
                                className='btn btn-primary btn-sm'
                                href={`https://wa.me/${this.getWhatsApp(shop.code, shop.whatsapp)}?text=Buenos%20días%2c%20estoy%20interesado%20en%20adquirir%20productos`}>
                                    <img src={ws} alt='whatsapp logo' className='Shop__image mdi-link'/>
                                    &nbsp; Contactar por WhatsApp
                                </a>
                        </label>              
                    </div>                                                  
            ) 
        }
    
        homeDelivery = (
            <div className="input-group input-group-shop mb-3">
                <div className="input-group-prepend div-prepend" >
                    <img src={moto} alt='home delivery logo' className='Shop__image mdi-link'/>
                </div>
                <label><strong>Servicio a domicilio:</strong> {this.getBoolean(shop.delivery)}</label>              
            </div>                                                  
        );
    
        if(paymentMethods.length > 0){
            payments = (
                <div className="input-group input-group-shop mb-3">
                    <div className="input-group-prepend div-prepend" >
                        <img src={card} alt='card delivery logo' className='Shop__image mdi-link'/>
                    </div>
                    <strong>Formas de pago:</strong>
                    {paymentMethods.map((obj)=>{                       
                        return (
                            <div className='container' key={obj.dbid}>
                            <label >
                                { obj.description }
                            </label>                               
                            </div>
                        );
                    })}
                    <label>
                    </label>              
    
                </div>     
            );
    
        }
    
        return (
            <React.Fragment>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12 col-sm-12'>
                        <div className='col-md-12'>
                            <br/><Link to={param} className='btn btn-primary btn-sm'>Regresar</Link> &nbsp;
                            <Link to='/shops' className='btn btn-primary btn-sm'>Categorías</Link>                             
                        </div>
                        <div className='Shop_head'>
                            <div className='Shop'>
                                <div className='Shop__header'>
                                    <img style={{height:'100px', width:'93px'}} src={this.getUrl(pictures)} alt='Logo'></img>
                                </div>
            
                                <div className='Shop__section-name'>
                                    <h4>{shop.name}</h4>
                                </div>  
            
                                <div className='row'>
                                    <div className='col-lg-6 col-md-12'>
                                        <div className='Shop__section-info'>
                                            
                                            { load }

                                            <h6>{shop.description}</h6><br/>
                    
                                            { facebook }
                    
                                            { messenger }
                                            
                                            { whatsapp }
                    
                                            { homeDelivery }
                    
                                            { payments }

                                            { location }

                    
                                        </div>                                    
                                    </div>

                                    <div className='col-lg-6 col-md-12'>
                                        <div className='Shop__section-maps'>
                                            { maps }                      
                                            { pegman }                  
                                        </div>
                                    </div>                                    
                                
                                </div>

                                <div className='col-lg-12'><br/><br/>
                                    { pictures.map((p)=>{
                                        return ( <img key={p.dbid} style={{height:'100px', width:'93px'}} src={this.getObjectUrl(p)} alt='Logo'></img>)
                                    })}
                                </div><br/> 
                                
            
                            </div>                     
                        </div>
                        </div>                        
                </div>
            </div>
            </React.Fragment>
        );
    }

}

export default ShopDetail;