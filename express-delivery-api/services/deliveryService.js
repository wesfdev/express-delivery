const { connection, insert } = require('../config/connection')
const _ = require('lodash');
const uuid = require('uuid');
const base_query = 'select * from delivery.shop';

let getUserFacebook = (page) =>{
    let user = '';
    if(page){
        let value = page.replace(/\/s*$/, "");//Remove last "/"
        value = value.split('/');
        user = value[value.length -1 ];
    }
    return user;
}

let num = val =>{ return isNaN(val) ? 0 : Number(val)}

let bool = (value) =>{
    if('true' === value || ('false' !== value && value)){
        return 1;
    }else{
        return 0
    }
}

let getShops = async () => {
    let db = connection.promise()
    //let sql = `${base_query}`;
    let sql = `
        select s.*, vl.description as image from delivery.shop s 
        inner join delivery.value_list vl on vl.dbid = s.category;
    `;

    let [rows]  = await db.execute(sql);
    return rows;
}

let getShop = async (dbid) => {
    console.log('getShopByDbid', dbid)
    let shops = await getShopByDbid(dbid);
    let paymentMethods = await getPaymentMethodsByShop(dbid);
    let pictures = await getImagesByShop(dbid);
    let shop = shops[0];

    return {
        shop: shop ? shop : { },
        paymentMethods,
        pictures
    };
}

let getShopByDbid = async (dbid) => {
    let db = connection.promise()
    let sql = `${base_query} where dbid = ?`;

    let [rows]  = await db.execute(sql, [ dbid ]);
    return rows;
}

let getPaymentMethodsByShop = async (dbid) => {
    let db = connection.promise()
    let sql = `
            select pm.dbid, pm.shop, vl.discriminator, vl.name, vl.description from delivery.payment_method pm
            inner join delivery.value_list vl on vl.dbid = pm.payment
            where pm.shop = ? `;
    let [ rows ]  = await db.execute(sql, [ dbid ]);
    return rows;
}

let getImagesByShop = async (dbid) => {
    let db = connection.promise()
    let [ rows ]  = await db.execute(`select * from delivery.shop_image where shop = ?`, [ dbid ]);
    return rows;
}

let getShopsByCategory = async (category) => {
    let db = connection.promise()
    let sql = `
            select s.*, vl.description as image from delivery.shop s 
            inner join delivery.value_list vl on vl.dbid = s.category
            where s.category = ?`;

    let [rows]  = await db.execute(sql, [ category ]);
    return rows;       
}

let getShopsByName = async (name) => {
    let db = connection.promise();
    let sql = `
            select s.*, vl.description as image from delivery.shop s 
            inner join delivery.value_list vl on vl.dbid = s.category
            where s.name LIKE CONCAT('%', ?,  '%')
    `;
    let [rows]  = await db.execute(sql, [ name ]);
    return rows;        
}

let searchShop = async (value) => {
    let db = connection.promise();
    let sql = `
            select s.*, vl.description as image from delivery.shop s 
            inner join delivery.value_list vl on vl.dbid = s.category
            where s.name LIKE CONCAT('%', ?,  '%') OR s.description LIKE CONCAT('%', ?,  '%')
    `;

    let [rows]  = await db.execute(sql, [ value, value ]);
    return rows;       
}

let createShop = async (req) => {
    console.log('createShop')

    let status = 19;
    let { lat, lng } = req.location.geometry;

    let sql = `
        INSERT INTO delivery.shop
        (name, category, description, whatsapp, facebook, messenger, webpage, lat, lng, delivery, code, status)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    let shop = await insert(
            sql, 
            [
                req.name, num(req.category), req.description, num(req.whatsapp), req.facebook, getUserFacebook(req.facebook),
                req.webpage, lat, lng, bool(req.delivery), req.code, status
            ]
        );

    await saveMethods(shop.insertId, req.methodPayment);        
    await savePictures(shop.insertId, req.pictures);   
    console.log('save success') 

}

let savePictures = async(shop, pictures)=>{
    let sql = `INSERT INTO delivery.shop_image( image, principal, shop, mime_type, name, size_image)VALUES(?, ?, ?, ?, ?, ?);`;

    for(let i = 0; i < pictures.length; i++){
        let file = pictures[i];
        console.log(String(file.size))
        await insert(sql, [ file.file, bool(file.principal), shop, file.mimeType, file.name, file.sizeImage]);
    }

}

let saveMethods = async(shop, methods)=>{
    let sql = `INSERT INTO delivery.payment_method(payment, shop)VALUES(?, ?);`;

    for(let i = 0; i < methods.length; i++){
        let method = methods[i];//JSON.parse(methods[i]);
        await insert(sql, [ method.dbid, shop ]);
    }
    
}

let updateShop = async (request) => {
    console.log('updateShop',request)
}

let searchJob = async () => {
    let db = connection.promise()
    let sql = `select * from delivery.job`;

    let [rows]  = await db.execute(sql);
    return rows;    

}

let createJob = async (req) => {
    let sql = `
            INSERT INTO delivery.job
            (name, age, code, whatsapp, description, car, motorcycle, other, observations)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    await insert(sql, [ req.name, req.age, req.code, req.whatsapp, req.description, bool(req.car), bool(req.motorcycle), bool(req.other), req.observations]);

}


module.exports = {
    getShops,
    getShop,
    getShopsByCategory,
    getShopsByName,
    searchShop,
    createShop,
    updateShop,
    searchJob,
    createJob
}