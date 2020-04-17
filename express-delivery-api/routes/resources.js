const express = require('express')
const app = express()
const version = 'v1'
const resource = 'resources'
const path = `/${version}/${resource}`

const { 
        getValueList, 
        getValueListByDiscriminator, 
        getValueListByDiscriminatorAndName,
        getValueListByDbid
    } = require('../services/resourcesService')

app.get(path, async function (req, res) {
    let response = await getValueList();
    
    return res.status(200).json({
        message: "Get value list",
        body: response
    });
});


app.get(`${path}/:dbid`, async function (req, res) {
    let dbid = req.params.dbid;
    let response = await getValueListByDbid(dbid);

    return res.status(200).json({
        message: "Get value list by discriminator",
        body: response
    });
});

app.get(`${path}/discriminator/:discriminator`, async function (req, res) {
    let discriminator = req.params.discriminator;
    let response = await getValueListByDiscriminator(discriminator);

    return res.status(200).json({
        message: "Get value list by discriminator",
        body: response
    });
});


app.get(`${path}/discriminator/:discriminator/name/:name`, async function (req, res) {
    let discriminator = req.params.discriminator;
    let name = req.params.name;
    let response = await getValueListByDiscriminatorAndName(discriminator, name);

    return res.status(200).json({
        message: "Get value list by discriminator and name",
        body: response
    });
});
   

module.exports = app;