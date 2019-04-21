"use strict"

var app = {
  modules: {
    crypto: require('crypto')
  }
};
app.config = require('./config.js');
app.templates = require('./templates.js');

app.network = new app.templates.Network(app);
app.c = app.network.concepts; // shorthand

app.network.createConcept("is");
app.network.createConcept("not");

app.network.createConcept("cat");
app.network.createConcept("kitten").route(app.c.cat, [app.c.is], 1);
app.network.createConcept("dog")
  .route(app.c.cat, [app.c.is, app.c.not], 1)
  .route(app.c.kitten, [app.c.is, app.c.not], 1);

console.log( JSON.stringify(app.network.exportJson(), (k,v)=>v, 2) );
