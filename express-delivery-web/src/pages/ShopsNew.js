import React from 'react';
import Shop from '../components/shop/Shop';
import ShopForm from '../components/shop/ShopForm';


const _ = require('lodash');
const ca = localStorage.getItem("code") ;
class ShopsNew extends React.Component{
    
    state = { 
        form: {
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
            code: ca ? ca : '+502',
            default:false
        },
        category:{
            body:[]
        },
        payment:{
            body:[]
        }         
    }

    handleChange = e => {
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });

    }    

    renameArray(array){
        var keyMap = {
            dbid: 'value',
            name: 'label',
            description: 'description',
            discriminator: 'discriminator'
          }; 

        return array.map(function(obj) {
            return _.mapKeys(obj, function(value, key) {
              return keyMap[key];
            });
          });
    }

    componentDidMount(){
        this.fetchCategories();
    }

    fetchCategories = async () =>{

        try {

            const categories = await fetch(`http://localhost:3001/v1/resources/discriminator/Category`);
            const data = await categories.json();

            const payment = await fetch(`http://localhost:3001/v1/resources/discriminator/MethodPayment`);
            const pay = await payment.json();

            this.setState({
                category: data,
                payment: pay
            })           

        } catch (error) {
            console.error(error);
        }


    }

    render(){
        const shopFormComponent = 
        <ShopForm 
            data={this.state.category.body} 
            payment={this.state.payment.body}
            onChange={this.handleChange} 
            formValues={this.state.form}
        />;

        const shopComponent = <Shop  formValues={this.state.form} />;

        return (
            <React.Fragment>
                <br/>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 col-sm-12' style={{ color: 'white' }}>
                            { shopFormComponent }
                        </div>

                       {/*
                            <div className='col-md-4 col-sm-12'>
                                { shopComponent }
                            </div>               
                        */}          
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ShopsNew;