"use strict"

var app = {};
app.config = require('./config.js');
app.templates = require('./templates.js');

app.network = new app.templates.Network();

console.log(JSON.stringify(app.network.concepts));
