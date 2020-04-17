
const express = require('express');
const app = express();

app.use(require('./resources'));
app.use(require('./delivery'));

module.exports = app;