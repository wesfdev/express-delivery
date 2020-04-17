const mysql  = require('mysql2');

let connection = mysql.createPool({
    host     : process.env.urlDB,
    port     : '3306',
    database : 'delivery',
    user     : 'root',
    password : 'admin1234',
});

let insert = async (sql, arguments)=>{
    let db = connection.promise();
    let [ rows ]  = await db.query(sql,arguments);
    return rows;
}


module.exports = {
    connection,
    insert
}