

/**
 * Add a function to the rpc exports
 *
 * @param {String} name
 */

exports.rpc = function (name, fn) {
  this.prototype._rpc = this.prototype._rpc || {};
  fn = fn || this.prototype[name];
  if (!fn) throw new Error('rpc: '+ name + ' did not exist!');

  this.prototype._rpc[name] = fn;
  return this;
};