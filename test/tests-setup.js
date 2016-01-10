'use strict';

module.exports = function testsSetup() {
  var chai = require("chai");
  var sinon = require("sinon");
  var sinonChai = require("sinon-chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.should();
  chai.use(sinonChai);
  chai.use(chaiAsPromised);
  require('sinon-as-promised');

  beforeEach(function() {this.sinon = sinon.sandbox.create();});
  before(function() {this.sinon = sinon.sandbox.create();});
  afterEach(function() {this.sinon.restore();});
  after(function() {this.sinon.restore();});
};

