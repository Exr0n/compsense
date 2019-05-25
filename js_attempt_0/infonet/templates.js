"use strict";

const crypto = require('crypto');

const util = require('./util.js');

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

exports.Concept = class {
  /*
  Some kind of idea that the network knows about
  */
  constructor (network, name) {
    this.network = network;
    this.name = name;

    this.relations = {};
    this.bias = 0; // todo: how does this affect other stuff?
    this.id = Math.random();
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

  feed (pulse, strength) {
    /* An activation chain in the network */
    if ( !pulse.path.contains(this.id) ) {
      pulse.log(this, strength);

      for (let name in this.relations) {
        let relation = this.relations[name];
        relation.end.feed( pulse, util.sigmoid(strength * relation.strength + this.bias) ); // todo: should this math really go here?
      }
    } else {} // deja vu: we've been here before... todo now what?

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
   * A connection between two concepts
   * (simple), no separate routes or anything like that
   */
  constructor (init) {
    //* [ network, base_node, target_node, strength?, bias? ]
    this.netw = init[0];
    this.base = init[1];
    this.trgt = init[2];

    this.strn = init[3] || Math.random()*2 -1;
    this.bias = init[4] || Math.random()*2 -1;
  }

  feed (pulse, strength) {
    // feed forward
    strength = util.sigmoid( strength * this.strn + this.bias );
    if (this.strength >= 0) {
      this.trgt.feed( pulse, strength );
    }
    // update self
    this.strn = strength; // todo: this math could also be improved;
    this.bias *= strength / (10*1000); // todo: this math here could be improved, sigmoid squishification?; this is meant to simulate fire together wire together
  }
}

exports.Pulse = class {
  /*
   * Represents a pulse through the network
   * todo: is there more to add here?
   */
  constructor (base) {
    this.base = base;

    this.id = Math.random();
    this.path = [];
  }

  log (node, strn) {
    this.path.push(node);
  }
}
