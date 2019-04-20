"use strict";

exports.Network = class {
  /*
  The network itself
  Knows about all the nodes, as well as some config type stuff
  */
  constructor (app, json) {
    this.app = app; // store reference to the application, if we ever need it

    this.concepts = {}; // start from scratch

    if (json) { // if we are importing a past "save"
      for (let key in json.concepts) {
        if (/* todo: concept already exists */false) {}
        this.concepts[key] = new exports.Concept( this, json.concepts[key] );
      }
    }
  }

  exportJson () {
    let end = {
      concepts: {}
    };

    for (let key in this.concepts) end.concepts[key] = this.concepts[key].exportJson();

    return JSON.stringify(end, (k,v)=>v, 2); // make the end json string readable to humans
  }
}
/* This is a remnant from when concepts and relations were different things.
exports.Relatable = class {
  constructor (network, json) {
    this.network = network;

    for (let concept of )
  }
}
*/
exports.Concept = class {
  /*
  Some kind of idea that the network knows about
  */
  constructor (network, json) {
    this.network = network;

    for (let connect of json)
  }
}

exports.Relation = class {
  /*
  The connection between two concepts
  */
  constructor (network, start, end, routes) {
    this.network = network;


  }
}

exports.Route = class {
  /*
  A specific way in which two concepts are connected
  */
  constructor (network, start, end, path) {
    this.network = network;
    

  }
}
