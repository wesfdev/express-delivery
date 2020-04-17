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
            where pm.dbid = ? `;
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
            select s.*, si.image, si.mime_type as mimeType, si.name as imageName, si.size_image as sizeImage  from delivery.shop s 
            left join delivery.shop_image si on si.shop = s.dbid
            where s.category = ?
            and si.principal = ?`;

    let [rows]  = await db.execute(sql, [ category, 1 ]);
    return rows;       
}

let getShopsByName = async (name) => {
    let db = connection.promise();
    let [rows]  = await db.execute(`${base_query} where name LIKE CONCAT('%', ?,  '%')`, [ name ]);
    return rows;        
}

let searchShop = async (value) => {
    let db = connection.promise();
    let [rows]  = await db.execute(`${base_query} where name LIKE CONCAT('%', ?,  '%') OR description LIKE CONCAT('%', ?,  '%')`, [ value, value ]);
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
        let method = JSON.parse(methods[i]);
        await insert(sql, [ method.dbid, shop ]);
    }
    
}

let updateShop = async (request) => {
    console.log('updateShop',request)
}


module.exports = {
    getShop,
    getShopsByCategory,
    getShopsByName,
    searchShop,
    createShop,
    updateShop
}