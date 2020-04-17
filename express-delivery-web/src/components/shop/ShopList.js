import React from 'react';
import '../../assets/styles/shopList.css'
import '../../assets/styles/shop.css'
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';

class ShopList extends React.Component {

    render(){
        const { data, loading, error } = this.props;

        return (
            <div className="ShopList">                        
            <ul className='list-unstyled'>
        
                {!loading && data.map((cat)=>{
                    return (
                        <li className='ShopListItem' key={cat.dbid}>
                            <Link to={`/shops/${cat.dbid}/category`}>
                                <div className='Shop__section-name-list' > 
                                    <img className='Shop__avatar2' src={`/images/category/${cat.description}`} alt='Logo'/>
                                    <span style={{paddingRight: '10px'}}>{cat.name} </span>
                                    <span className="badge badge-pill badge-primary"> </span>
                                </div> 
                            </Link>
                        </li>
                    )
                })}
            </ul>

            {loading && (
                <ReactLoading type={'cylon'} color={'rgb(53, 126, 221)'} height={100} width={100} />
            )}

            {error && (
                <div>error</div>
            )}

            </div>
        );
    }
}

export default ShopList;