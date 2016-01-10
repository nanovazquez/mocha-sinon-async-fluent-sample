'use strict';

var Promises = require('bluebird');
var _ = require('lodash');

module.exports = function productRepository() {
  return {
    get: get,
    update: update,
  };

  function get(itemId) {
    // Get item from database
    // To simplify things, we are simply returning a resolved promise
    var item = _.assign({}, {id: itemId, name: 'Product' + itemId});
    return Promise.delay(10).resolve(item);
    ;
  }

  function update(item) {
    // Update the item in the database
    // To simplify things, we are simply returning a resolved promise
    return Promise.delay(10).resolve(item);
  }
};
