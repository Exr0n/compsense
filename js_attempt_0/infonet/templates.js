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
      for (let key in json.concepts) this.createConcept( name ); // create all the concepts

      for (let name in this.concepts) {
        let concept = this.concepts[name];
        let frame = json.concepts[name];

        for (let key in frame.relations) {
          for (let route of frame.relations[key].routes) {
            let via = [];
            for (let name in route.via) via.push( this.concepts[name] || undefined )
            concept.route( this.concepts[frame.relations[key].end] || undefined, via, route.strength );
          }
        }
      }
    }
  }

  createConcept (name) {
    let concept = new exports.Concept( this, name );
    this.concepts[name] = concept;
    return concept
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

    this.relations = {};
  }

  route (other, via, strength) {
    /* Form a connection between this and another concept */
    let relation;
    if (!this.relations[other.name]) {
      relation = new exports.Relation(this.network, this, other);
      this.relations[other.name] = relation;
    } else {
      relation = this.relations[other.name];
    }

    relation.route( via, strength );
  }

  exportJson () {
    let end = {
      relations: {}
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
    this.strength = 0; // todo: what should even go here? how should this change?
  }

  route (path, strength) {
    /* todo Create a new route via concepts */
    
  }

  exportJson () {
    let end = {
      end: this.end.name,
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
  constructor (network, start, end, path, strength) {
    this.network = network;

    this.start = start;
    this.end = end;
    this.path = path;
    this.strength = strength; // todo: what does this even mean, how will it work? via points themselves may be unrelated
  }

  exportJson () {
    var end = {
      strength: this.strength,
      via: []
    };
    for (let concept of path) end.via.push( concept.name );
    return end;
  }
}
