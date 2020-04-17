import React from 'react';
import { Link } from 'react-router-dom';
import marketing from '../assets/images/marketing.svg';
import '../assets/styles/home.css';
import '../assets/libs/magic.css/dist/magic.min.css';
import $ from "jquery";
import whatsapp from '../assets/images/whatsapp.svg';
import messenger from '../assets/images/messenger-2.svg';
import moto from '../assets/images/motocycle.svg';
import free from '../assets/images/free.svg';
import tracker from '../assets/images/tracker.svg';

class Home extends React.Component{

    componentDidMount(){
        this.logoEffects()
        this.buttonsEffects()
        this.descriptionEffects()


        let config = {
            enableHighAccuracy: true, 
            maximumAge        : 30000, 
            timeout           : 27000
          };

        if ("geolocation" in navigator) {
            /* Yeih! habemus geolocalización  */
            console.log('yes')
          /*así llamamos la función getCurrentPosition*/
          navigator.geolocation.getCurrentPosition(this.onSucccess, this.onError, config );            
          } else {
            /* el navegador no soporta la geolocalización*/
            console.log('no')
          }


    }

    onSucccess(position) {
        console.log(position.coords.latitude, position.coords.longitude);
      }
       
    /*se ejecuta si el permiso fue denegado o no se puede encontrar una ubicación*/
    onError(error)
    {
        switch(error.code)
        {
            case error.PERMISSION_DENIED:
                console.log('ERROR: User denied access to track physical position!');
            break;
    
            case error.POSITION_UNAVAILABLE:
                console.log("ERROR: There is a problem getting the position of the device!");
            break;
    
            case error.TIMEOUT:
                console.log("ERROR: The application timed out trying to get the position of the device!");
            break;
    
            default:
                console.log("ERROR: Unknown problem!");
            break;
        }
    }
      
    logoEffects(){
        $('.logo').addClass('magictime twisterInDown');
    }

    buttonsEffects(){
        $('.buttons').addClass('magictime tinRightIn');
    }

    descriptionEffects(){
        setTimeout(function(){
            $('.description').addClass('magictime vanishIn');
        }, 2000);        
    }

    render(){
        
        return (
            <React.Fragment>
                <div className='Home row'>
                    <div className='logo col-lg-6 col-sm-12'>
                        <img src={marketing} alt='Logo home' className='Home__img' />
                    </div>
                    <div className='buttons col-lg-6 col-sm-12'>
                        <div className='container-fluid col-lg-12 col-sm-12' style={{textAlign: 'center'}}>
                            <Link to='/shops' className='btn btn-primary'>Ir de compras</Link><br/><br/>
                            <Link to='/new' className='btn btn-primary'>Nuevo comercio</Link><br/><br/>
                            <a target='_blank' href='http://www.covid-gt.com' className='btn btn-primary'>
                                <img src={tracker} alt='tracker logo' className='Home_logos' />
                                Informate COVID-19
                            </a>                                                            
                        </div>
                        <div className='description col-lg-12 col-sm-12' style={{paddingBottom: '3px'}}>
                            <div className='form-group'>
                                <img src={whatsapp} alt='whatsapp logo' className='Home_logos' />
                                <p>Comunícate por medio de WhatsApp.</p>
                            </div>
                            <div className='form-group'>
                                <img src={messenger} alt='messenger logo' className='Home_logos' />
                                <p>También puedes hacerlo por Messenger.</p>
                            </div>                            
                            <div className='form-group'>
                            <img src={moto} alt='home delivery logo' className='Home_logos' />                                
                                Con opción de entregas a domicilio.
                            </div>

                            <div className='form-group'>
                                <img src={free} alt='free logo' className='Home_logos' />     &nbsp;&nbsp;                           
                                No necesitas pagar ningún tipo de suscripción. Es totalmente gratis.                                
                            </div>
                        </div>                        
                    </div>
                </div>
                <div className='detail row'>
                    <div className='container'>
                        <h3><strong>Express delivery</strong></h3>
                        <p>
                            A raíz del brote de COVID-19, los pequeños comercios y productores locales pasan por una situación muy complicada,
                            ya que muchos de ellos necesitan seguir trabajando y no tienen algún medio o plataforma para darse a conocer a 
                            diferencia de grandes corporaciones. Con esta web app se pretende dar a conocer a estos pequeños comercios, 
                            permitiendoles comunicarse con otras personas. Y de alguna manera que las personas puedan seguir comprando en sus 
                            comercios de confianza en los vecindarios.
                        </p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Home;