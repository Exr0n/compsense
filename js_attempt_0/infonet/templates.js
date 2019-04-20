"use strict";

exports.Network = class {
  constructor (app, json) {
    this.app = app; // store reference to the application, if we ever need it

    this.concepts = {}; // start from scratch
    this.relations = {};

    if (json) { // if we are importing a past "save"
      for (let key in json.concepts) this.concepts[key] = new exports.Concept( this, json.concepts[key] );
      for (let key in json.relations) this.relations[key] = new exports.Relation( this, json.relations[key] );
    }
  }

  exportJson () {
    let end = {
      concepts: {},
      relations: {}
    };

    for (let key in this.concepts) end.concepts[key] = this.concepts[key].exportJson();
    for (let key in this.relations) end.relations[key] = this.relations[key].exportJson();

    return JSON.stringify(end, (k,v)=>v, 2); // make the end json string readable to humans
  }
}

exports.Relatable = class {
  constructor (network, json) {
    this.network = network;

    for (let concept of )
  }
}

exports.Concept = class {

}
