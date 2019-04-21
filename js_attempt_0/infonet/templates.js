"use strict";

const crypto = require('crypto');

exports.Network = class {
  /*
  The network itself
  Knows about all the nodes, as well as some config type stuff
  */
  constructor (app, json) {
    this.app = app; // store reference to the application, if we ever need it

    this.concepts = {}; // start from scratch

    if (json) { // if we are importing a past "save"
      json = JSON.parse(json);

      for (let key in json.concepts) this.createConcept( name ); // create all the concepts

      for (let name in this.concepts) {
        let concept = this.concepts[name];
        let frame = json.concepts[name];

        for (let key in frame.relations) {
          for (let id in frame.relations[key].routes) {
            let route = frame.relations[key].routes[id];
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
    return concept;
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
    this.bias = 0; // todo: how does this affect other stuff?
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

    return this;
  }

  feed (strength) {
    /* An activation chain in the network */
    for (let name in this.relations) {
      let relation = this.relations[name];
      relation.end.feed( strength * relation.strength + this.bias ); // todo: shove this through a sigmoid or something
      relation.bias *= strength / (10*1000); // todo: this math here could be improved, sigmoid squishification?; this is meant to simulate fire together wire together
    }

    return this;
  }

  exportJson () {
    let end = {
      relations: {}
    }
    for (let rel in this.relations) end.relations[rel] = this.relations[rel].exportJson();
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

    this.routes = {};
    this.bias = 0; // todo: this seems needed, but how does it change the strength?

    this.strength = 0; // todo: what should even go here? how should this change?
  }

  route (via, strength) {
    /* todo Create a new route via concepts */
    let route_name = this.network.app.modules.crypto.createHash( 'md5' );
    for (let concept of via) route_name.update( concept.name );
    route_name = route_name.digest('hex');

    if (!this.routes[route_name]) {
      this.routes[route_name] = new exports.Route(this.network, this.start, this.end, via, strength);
    } else {
      this.routes[route_name].update(strength);
    }
    this.reSync();
  }

  reSync () {
    /* Update this.strength to reflect the state of the routes */
    let end = 0;
    for (let name in this.routes) {
      let route = this.routes[name];
      end += route.strength;
    }
    this.strength = end / this.routes.size + this.bias;
    // todo: this is a simple average and bias right now, but we could probably do better if I knew more fancy math.
  }

  exportJson () {
    let end = {
      end: this.end.name,
      routes: []
    }
    for (let route in this.routes) end.routes.push( this.routes[route].exportJson() );
    return end;
  }
}

exports.Route = class {
  /*
  A specific way in which two concepts are connected
  */
  constructor (network, start, end, via, strength) {
    this.network = network;

    this.start = start;
    this.end = end;
    this.via = via;
    this.strength = strength; // todo: what does this even mean, how will it work? via points themselves may be unrelated

    this.hashsum = this.network.app.modules.crypto.createHash( 'md5' );
    for (let concept of via) this.hashsum.update( concept.name );
    this.name = this.hashsum.digest('hex');
  }

  update (strength) {
    this.strength = strength; // todo: this could be changed to a fancy formula to make for more efficient learning
  }

  exportJson () {
    var end = {
      strength: this.strength,
      via: []
    };
    for (let concept of this.via) end.via.push( concept.name );
    return end;
  }
}
