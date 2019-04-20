"use strict";

exports.Network = class {
  constructor (app, json) {

    this.app = app;

    if (json) {
      this.concepts = {}
      for (let key in json.concepts) this.concepts[key] = new exports.Concept( json.concepts[key] );
    } else {
      this.concepts = {};
      this.relations = {};
    }
  }

  exportJson

  /*
  self = {
    nodes: {}
  };
  return self;
  */
}

/*
exports.Network.prototype = {

}
*/
