
/**
 * Heartbeat function
 */

exports.heartbeat = function (req, callback) {
  this.node.heartbeat(Date.now());
  this.node.leader(req.leader);
  callback();
};


/**
 * The RPC handler for the `appendEntries`
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
    this.debug('received outdated term expected %s, got %s ', term, req.term);
    return callback(null, failure);
  }

  node.term(req.term);
  node.leader(req.leader);

  var prev = log.get(req.prevLogIndex);
  if (!prev && req.prevLogIndex) {
    this.debug('could not find a log entry for %s', req.prevLogIndex);
    return callback(null, failure);
  }

  req.entries.forEach(function (value, offset) {
    var index = req.prevLogIndex + offset + 1;
    log.append(index, req.term, value);
  });
  return callback(null, { term: term, success: true });
};


/**
 * RPC handler to respond to a vote request.
 */

exports.onVoteRequest = function (req, callback) {
  var node = this.node;
  var term = node.term();
  var rejected  = { term: term, voteGranted: false };
  var granted = { term: req.term, voteGranted: true };

  this.debug('received vote request %j', req);

  if (req.term < term) return callback(null, rejected);
  if (req.term > term) {
    node.term(req.term);
    callback(null, granted);
    return this.emit('change', 'follower');
  }

  var votedFor = node.votedFor();
  if (votedFor && votedFor !== req.candidate) return callback(null, rejected);

  node.votedFor(req.candidate);
  return callback(null, granted);
};
