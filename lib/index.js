var bind = require('bind-all');
var debug = require('debug');
var Emitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var proto = require('./proto');
var rpcs = require('./rpcs');
var statics = require('./statics');
var tick = process.nextTick;


module.exports = function (name) {

  /**
   * Cruise State constructor
   */

  function State (node) {
    if (!(this instanceof State)) return new State(node);
    this.node = node;
    this.debug = debug(['cruise', name, node.id()].join(':'));
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
   * Add the statics, prototypes and rpc functions
   */

  State.name = name;
  State.prototype.name = name;

  State.prototype._intervalFns = [];
  State.prototype._jitterFns = [];

  for (var key in statics) State[key] = statics[key];
  for (var key in proto) State.prototype[key] = proto[key];
  for (var key in rpcs) State.rpc(key, rpcs[key]);

  return State;
};