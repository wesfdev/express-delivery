const express = require('express')
const app = express()
const version = 'v1'
const resource = 'delivery'
const path = `/${version}/${resource}`

const {
    getShop,
    getShopsByCategory,
    getShopsByName,
    searchShop,
    createShop,
    updateShop
} = require('../services/deliveryService')

app.get(`${path}/:dbid`, async function (req, res) {
    let dbid = req.params.dbid;
    let response = await getShop(dbid);
    
    return res.status(200).json({
        message: "Get shop by dbid",
        body: response
    });

});

app.get(`${path}/shop/category/:category`, async function (req, res) {
    let category = req.params.category;
    let response = await getShopsByCategory(category);
    
    return res.status(200).json({
        message: "Get shop by category",
        body: response
    });

});

app.get(`${path}/shop/name`, async function (req, res) {
    let name = req.query.name;
    let response = await getShopsByName(name);
    
    return res.status(200).json({
        message: "Get shop by name",
        body: response
    });

});

app.get(`${path}/shop/search`, async function (req, res) {
    let search = req.query.search;
    let response = await searchShop(search);
    
    return res.status(200).json({
        message: "Search shop",
        body: response
    });

});


app.post(path, async function (req, res) {
    let shop = req.body;
    let response = await createShop(shop);
    return res.status(200).json({
        message: "Save shop",
        body: response
    });
});

app.put(path, async function (req, res) {
    let shop = req.body;
    let response = await updateShop(shop);
    return res.status(200).json({
        message: "update shop",
        body: response
    });
});

module.exports = app;