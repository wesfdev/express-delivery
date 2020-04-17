import React from 'react';
import '../assets/styles/shop.css'
import ShopList from '../components/shop/ShopList';
import { Link } from 'react-router-dom';


class Badges extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            nextPage:1,
            loading:true,
            error: null,
            data:{
                body:[]
            }
         };
     }

    componentDidMount(){
        this.fetchCategories();
    }

    fetchCategories = async () =>{
        this.setState({loading:true, error:null})

        try {

            const categories = await fetch(`http://localhost:3001/v1/resources/discriminator/Category`);
            const data = await categories.json();

            this.setState({
                loading:false,
                data: data,
                nextPage: this.state.nextPage + 1
            })           

        } catch (error) {
            this.setState({
                loading:false,
                error:error
            })             
        }


    }



    render(){

        return (
                <React.Fragment>
                    <div className='Shop__list'>
                        <div className='Shop__container'>
                            <br/>
                            <Link to='/' className='btn btn-primary btn-sm'>Regresar al menú</Link><br/> <br/>         
                            <h3 style={{color:'white'}}><strong>Categorías</strong></h3>
                            <ShopList 
                            data={this.state.data.body} 
                            loading={this.state.loading} 
                            error={this.state.error}  
                            fetchCategories={this.fetchCategories}
                            />
                        </div>
                    </div>

                </React.Fragment>
        );
    }

}

export default Badges;