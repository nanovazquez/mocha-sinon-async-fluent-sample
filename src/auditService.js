'use strict';

var Promises = require('bluebird');
var _ = require('lodash');

module.exports = function auditService() {
  return {
    logUpdate: logUpdate,
  };

  function logUpdate(item) {
    // Log update somewhere
    // To simplify things, we are simply returning a resolved promise
    var logEntity = _.assign({}, item, {action: 'update', timestamp: new Date()});
    return Promise.delay(10).resolve(logEntity);
  }
};
