

/**
 * Return all the RPC calls for this state. Make sure they are bound to the
 * prototype
 *
 * @return {Object} rpcs  { name: call }
 */

exports.rpc = function () {
  var rpc = {};
  for (var key in this._rpc) rpc[key] = this._rpc[key].bind(this);
  return rpc;
};


/**
 * Stops the current state
 */

exports.stop = function () {
  this.debug('stopping %s', this.name);
  var intervals = this._intervals || [];
  var jitters = this._jitters || [];
  intervals.forEach(function (interval) { clearInterval(interval); });
  jitters.forEach(function (clear) { clear(); });
  this.debug('cleared %d intervals, %d jitters', intervals.length,
    jitters.length);
  return this;
};


/**
 * Start the current state
 */

exports.start = function () {
  this.debug('starting %s', this.name);
  var intervals = this._intervals = this._intervals || [];
  var jitters = this._jitters = this._jitters || [];
  var self = this;
  this._intervalFns.forEach(function (fn) { intervals.push(fn(self)); });
  this._jitterFns.forEach(function (fn) { jitters.push(fn(self)); });
  this.debug('added %d intervals, %d jitters', intervals.length, jitters.length);
  return this;
};