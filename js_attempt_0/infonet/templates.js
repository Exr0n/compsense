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
      for (let key in json.concepts) this.concepts[key] = new exports.Concept( this, name ); // create all the concepts
      /* todo: import the connections */
    }
  }

  exportJson () {
    let end = {
      concepts: {}
    };

    for (let key in this.concepts) end.concepts[key] = this.concepts[key].exportJson();

    return end;
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
  constructor (network, name) {
    this.network = network;
    this.name = name;

    this.relations = [];
  }

  connect (other) {
    /* todo Form a connection between this and another concept */
  }

  exportJson () {
    let end = {
      relations: []
    }
    for (let rel of this.relations) end.relations.push( rel.exportJson() );
    return end;
  }
}

exports.Relation = class {
  /*
  A connection between two concepts
  */
  constructor (network, start, end) {
    this.network = network;
    this.start = start;
    this.end = end;

    this.routes = [];
    this.strength = 0;
  }

  addRoute (path) {
    /* todo Create a new route via concepts */
  }

  exportJson () {
    let end = {
      routes: []
    }
    for (let route of this.routes) end.push( route.exportJson() );
    return end;
  }
}

exports.Route = class {
  /*
  A specific way in which two concepts are connected
  */
  constructor (network, start, end, path) {
    this.network = network;

    this.path = path;
    this.strength = undefined; // todo: what does this even mean, how will it work? via points themselves may be unrelated
  }

  exportJson () {
    var end = [];
    for (let concept of path) end.push( )
  }
}
