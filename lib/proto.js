var debug = require('debug')('cruise-state');
var bind = require('bind-all');

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
 * Appends the entries for this call
 *
 * @return {} [description]
 */

exports.appendEntries = function (req, callback) {
  var node = this.node;
  var term = node.term();
  var log = node.log();
  var failure = {
    term: term,
    success: false
  };

  if (req.term < term) {
    debug('received outdated term expected %s, got %s ', term, req.term);
    return callback(null, failure);
  }

  node.term(req.term);
  node.leader(req.leader);

  var prev = log.get(req.prevLogIndex);
  if (!prev) {
    debug('could not find a log entry for %s', req.prevLogIndex);
    return callback(null, failure);
  }
};
