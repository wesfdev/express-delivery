import React from 'react';
import '../assets/styles/shopList.css'
import '../assets/styles/shop.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';

const _ = require('lodash');

class ShopCategory extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loading:true,
            data:{
                body:[]
            },
            image: '',
            category: {}
         };
    }

    componentDidMount(){
        this.getShopByCategory(this.props.match.params.category);
    }

    getObjectUrl(image){
        const def = '/images/category/bag.svg';
        if(image.mimeType){
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


    async getShopByCategory(category){
        const shop = await axios.get(`http://localhost:3001/v1/delivery/shop/category/${category}`);
        const result = _.map(shop.data.body, v => _.assign({}, v, { url: this.getObjectUrl(v) }));

        const categoryRs  = await axios.get(`http://localhost:3001/v1/resources/${category}`);

        this.setState({
            loading:false,
            data: { body : result },
            category: categoryRs.data.body
        })           
    }

    render(){

        let { data } = this.state;
        let newShop;

        if(!data.body.length){
            newShop = (
                <div style={{color:'white'}}>
                    <span>Upss.. Parace que aún no hay ningún comercio registrado. </span>
                    <span>Quieres registrar uno?</span><br/>
                    <br/><Link to='/new' className='btn btn-primary btn-sm'>Nuevo comercio</Link><br/>
                </div>
             );
        }

        return (

            <React.Fragment>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12 col-sm-12'>

                            <br/><Link to='/shops' className='btn btn-primary btn-sm'>Regresar</Link><br/> <br/>         
                            <h3 style={{color:'white'}}><strong>Listado de comercios</strong> - <span>{this.state.category.name} </span></h3>                    

                            { newShop }

                        <div className="ShopList">                        
                        <ul className='list-unstyled'>

                            {!this.state.loading && this.state.data.body.map((cat)=>{
                                return (
                                    <li className='ShopListItem' key={cat.dbid}>
                                        <Link to={`/shops/${cat.dbid}/detail`}>
                                            <div className='Shop__section-name-list'> 
                                                <img className='Shop__avatar2' src={cat.url} alt='Logo'/>
                                                <span style={{paddingRight: '10px'}}>{cat.name} </span>
                                            </div> 
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>

                        {this.state.loading && (
                             <ReactLoading type={'cylon'} color={'rgb(53, 126, 221)'} height={100} width={100} />
                        )}

                        {this.state.error && (
                            <div>error</div>
                        )}

                        </div>
                    </div>                        
                </div>
            </div>
            </React.Fragment>            
        );
    }
}

export default ShopCategory;

