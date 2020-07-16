const express = require('express')
const app = express()
const version = 'v1'
const resource = 'delivery'
const path = `/${version}/${resource}`


const {
    getShops,
    getShop,
    getShopsByCategory,
    getShopsByName,
    searchShop,
    createShop,
    updateShop,
    searchJob,
    createJob,
    getShopByToken,
    createFeedBack,
    visitShop,
    clickShop,
    visitCategory,
    visitMenu    
} = require('../services/deliveryService')


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

app.get(`${path}`, async function (req, res) {
    let response = await getShops();
    
    return res.status(200).json({
        message: "Get shops",
        body: response
    });

});


app.get(`${path}/:dbid`, async function (req, res) {
    let dbid = req.params.dbid;
    let response = await getShop(dbid);
    
    return res.status(200).json({
        message: "Get shop by dbid",
        body: response
    });

});

app.get(`${path}/token/:token`, async function (req, res) {
    let token = req.params.token;
    let response = await getShopByToken(token);
    
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


app.get(`${path}/jobs/search`, async function (req, res) {
    let response = await searchJob();    
    return res.status(200).json({
        message: "Search jobs",
        body: response
    });

});

app.post(`${path}/jobs/new`, async function (req, res) {
    let job = req.body;
    let response = await createJob(job);
    return res.status(200).json({
        message: "Save job",
        body: response
    });
});

app.post(`${path}/feedback/new`, async function (req, res) {
    let feedback = req.body;
    let response = await createFeedBack(feedback);
    return res.status(200).json({
        message: "Save feedback",
        body: response
    });
});

app.post(`${path}/visit/new`, async function (req, res) {
    let visit = req.body;
    let response = await visitShop(visit);
    return res.status(200).json({
        message: "Save visit",
        body: response
    });
});

app.post(`${path}/check/new`, async function (req, res) {
    let clic = req.body;
    let response = await clickShop(clic);
    return res.status(200).json({
        message: "Save",
        body: response
    });
});

app.post(`${path}/menu/new`, async function (req, res) {
    let body = req.body;
    let response = await visitMenu(body);
    return res.status(200).json({
        message: "Save",
        body: response
    });
});


app.post(`${path}/category/new`, async function (req, res) {
    let body = req.body;
    let response = await visitCategory(body);
    return res.status(200).json({
        message: "Save",
        body: response
    });
});


module.exports = app;