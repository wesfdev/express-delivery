import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/shopping.svg'
import '../../assets/styles/navbar.css';


class Navbar extends React.Component {
    render(){
        return <div className='Navbar'>
                <div className='container-fluid'>
                    <Link className='Navbar__brand' to='/'>
                        <img className='Navbar__brand-logo' src={logo} alt='Logo'></img>
                        <span className='font-weight-light'>Express </span>
                        <span className='font-weight-bold'> Delivery</span>                    
                    </Link>                    
                </div>
               </div>;
    }

}

export default Navbar;