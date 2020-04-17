import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';

const container =  document.getElementById('root');
const app =  <App />;

ReactDOM.render(app,container);
