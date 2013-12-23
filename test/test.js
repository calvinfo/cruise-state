var assert = require('assert');
var Node = require('cruise-node');
var State = require('../');


describe('cruise-state', function () {

  describe('.name', function () {
  });


  describe('#rpc', function () {
  });

  describe('#jitter', function () {
    it('should set up an jitter interval', function (done) {
      var runs = 0;
      var Jitter = State('jitter')
        .jitter(function () { if (4 == runs++) done() }, 10);

      Jitter(Node())
        .start();
    });
  });


  describe('#interval', function () {
    it('should set up an interval', function (done) {
      var runs = 0;
      var Interval = State('interval')
        .interval(function () { if (4 == runs++) done() }, 10);

      Interval(Node())
        .start();
    });
  });


  describe('.start', function () {
    it('should start any intervals', function () {
      var runs = 0;
    });
  });

  describe('.stop', function () {
    it('should stop an existing interval', function (done) {
      var runs = 0;
      var Interval = State('interval')
        .interval(function () { if (4 == runs++) interval.stop(); }, 10);

      var interval = Interval(Node())
        .start();

      setTimeout(function () {
        assert(runs === 5);
        done();
      }, 100);
    });


    it('should stop an existing jitter', function (done) {
      var runs = 0;
      var Jitter = State('jitter')
        .jitter(function () { if (4 == runs++) jitter.stop(); }, 10, 10);

      var jitter = Jitter(Node())
        .start();

      setTimeout(function () {
        assert(runs === 5);
        done();
      }, 100);
    });
  });
});