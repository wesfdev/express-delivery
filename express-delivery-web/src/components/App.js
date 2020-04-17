import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './layout/Layout';
import Shops from '../pages/Shops';
import ShopsNew from '../pages/ShopsNew';
import NotFound from '../pages/NotFound'
import Home from '../pages/Home';
import ShopCategory from '../pages/ShopCategory';
import ShopDetail from '../pages/ShopDetail';


function App (){
    return (
        <BrowserRouter>
            <Layout>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/shops' component={Shops} />
                    <Route exact path='/new' component={ShopsNew} /> 
                    <Route exact path='/shops/:category/category' component={ShopCategory} />
                    <Route exact path='/shops/:shop/detail' component={ShopDetail} />                    
                    <Route component={NotFound} />
                </Switch>
            </Layout>            
        </BrowserRouter>
    );
}

export default App;