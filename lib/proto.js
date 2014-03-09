var once = require('once');

/**
 * Return all the RPC calls for this state. Make sure they are bound to the
 * prototype
 *
 * @return {Object} rpcs  { name: call }
 */

exports.rpc = function () {
  var rpc = {};
  for (var key in this._rpc) rpc[key] = wrap(this._rpc[key]).bind(this);
  return rpc;
};

/**
 * Wrap an rpc call
 */

function wrap(rpc){
  return function(req, callback){
    var self = this;
    if (req.term > this.node.term()) {
      this.node.term(req.term);
      this.emit('change', 'follower');
    }
    rpc.call(this, req, function(err, res){
      if (res) res.term = self.node.term();
      return callback(err, res);
    });
  }
}

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
  this.init();
  return this;
};

/**
 * Init function, defaults to a noop
 */

exports.init = function () {};

/**
 * Calls an RPC on all of the server's peers, and calls back once a quorum
 * of them have responded.
 */

exports.send = function (name, req, callback) {
  var peers = this.node.peers();
  var quorum = Math.floor(peers.length / 2) + 1;
  var successes = 0;
  var failures = 0;
  var self = this;
  callback = once(callback);
  peers.forEach(function (peer) {
    peer.call(name, req, function (err, res) {
      if (err) {
        failures++;
        return self.debug('error: %s', err);
      }

      if (res.success) successes++;
      else failures++;
      self.debug('%s: +%d -%d / %d', name, successes, failures, quorum);

      if (successes >= quorum) return callback(null, true);
      if (failures >= quorum) return callback(null, false);
    });
  });
};
