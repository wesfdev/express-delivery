
/** PORT **/
process.env.PORT = process.env.PORT || 3001;

/** PORT **/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/** PORT **/
let urlDB = '';
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'localhost';
}else{
    urlDB = process.env.MYSQL_URI;
}

process.env.urlDB = urlDB;
