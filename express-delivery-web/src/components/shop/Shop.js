import React from 'react';
import '../../assets/styles/shop.css';
import fb from '../../assets/images/fb.svg'
import msn from '../../assets/images/messenger-2.svg'
import ws from '../../assets/images/whatsapp.svg'
import moto from '../../assets/images/motocycle.svg'
import card from '../../assets/images/credit-card.svg'

class Shop extends React.Component {

    getFacebookUrl(value){
        return value.replace('https','');
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
        return url.length ? url[0].url : '';
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

    render(){

        const values = this.props.formValues;
        let facebook ;
        let messenger;
        let whatsapp;
        let homeDelivery;
        let payments;

        if(values.facebook){
            facebook = (
                    <div className="input-group input-group-shop mb-3">
                        <div className="input-group-prepend div-prepend" >
                            <img src={fb} alt='facebook logo' className='Shop__image mdi-link fb'/>
                        </div>
                        <label>
                        <a target="_blank" href={'fb://siomix'}>{values.name}</a> </label>              
                    </div>                                                  
            );

            messenger = (
                    <div className="input-group input-group-shop mb-3">
                        <div className="input-group-prepend div-prepend" >
                        </div>
                        <label>
                            <a target="_blank" 
                            className='btn  btn-sm msn'
                            href={`http://m.me/${this.getUserFacebook(values.facebook)}`}>
                                <img src={msn} alt='messenger logo' className='Shop__image mdi-link'/>
                                &nbsp; Contactar por Messenger
                                </a>                               
                        </label>              
                    </div>                                                  
            ) 
        }

        if(values.whatsapp){
            whatsapp = (
                    <div className="input-group input-group-shop mb-3">
                        <div className="input-group-prepend div-prepend" >
                            
                        </div>
                        <label>
                            <a  target="_blank" 
                                className='btn btn-primary btn-sm'
                                href={`https://wa.me/${this.getWhatsApp(values.code, values.whatsapp)}?text=Buenos%20días%2c%20estoy%20interesado%20en%20adquirir%20productos`}>
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
                <label><strong>Servicio a domicilio:</strong> {this.getBoolean(values.delivery)}</label>              
            </div>                                                  
        );

        if(values.methodPayment.length > 0){
            payments = (
                <div className="input-group input-group-shop mb-3">
                    <div className="input-group-prepend div-prepend" >
                        <img src={card} alt='card delivery logo' className='Shop__image mdi-link'/>
                    </div>
                    <strong>Formas de pago:</strong>
                    {values.methodPayment.map((mp, i)=>{
                        let obj = JSON.parse(mp);
                        return (
                            <div className='container' key={i}>
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
                <div className='Shop_head'>
                    <div className='Shop'>
                        <div className='Shop__header'>
                            <img style={{height:'100px', width:'93px'}} src={this.getUrl(values.pictures)} alt='Logo'></img>
                        </div>

                        <div className='Shop__section-name'>
                            <h4>{values.name}</h4>
                        </div>  

                        <div className='Shop__section-info'>

                            <h6>{values.description}</h6><br/>

                            { facebook }

                            { messenger }
                            
                            { whatsapp }

                            { homeDelivery }

                            { payments }

                        </div>
                        

                    </div>                     
                </div>
            </React.Fragment>
        );
    }
}

export default Shop;