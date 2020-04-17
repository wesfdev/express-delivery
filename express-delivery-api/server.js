require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { connectDatabase } = require('./config/connection')
const cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//limits
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// CORS domain
app.use(cors());

// parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index'));
   
//connection database
//connectDatabase();  

// APP Listen
app.listen(process.env.PORT,()=>{
    console.log('listen port: ', process.env.PORT)
});