var Emitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var proto = require('./proto');
var statics = require('./statics');
var tick = process.nextTick;
var bind = require('bind-all');


module.exports = function (name) {

  /**
   * Cruise State constructor
   */

  function State (node) {
    if (!(this instanceof State)) return new State(node);
    this.node = node;
    var self = this;
    tick(function () {
      State.emit('construct', self);
    });
  }

  /**
   * Mixin EventEmitter
   *
   * TODO: change to setPrototypeOf once it's implemented
   */

  State.__proto__ = Emitter.prototype;

  /**
   * Inherit instance from emitter
   */

  inherits(State, Emitter);

  /**
   * Add the statics and prototypes
   */
  State.name = name;
  State.prototype.name = name;
  for (var key in statics) State[key] = statics[key];
  for (var key in proto) State.prototype[key] = proto[key];

  return State
    .rpc('appendEntries');
};