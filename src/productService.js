'use strict';

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function productService(
  productRepository,
  auditService
  ) {
    return {
      get: 	get,
      create: create,
      update: update,
      del:  del
  };

  function get(id) {

  }

  function create(item) {

  }

  function update(item) {
  	return Promise.resolve()
  		.then(function () {
  			// Validate payload with business rules
        if (item.id <= 0) {
          return Promise.reject(new Error('Invalid ID'));
        }
        return item;
  		})
  		.then(function (item) {
  			// Retrieve item from database
  			return productRepository.get(item.id);
  		})
  		.then(function (itemToUpdate) {
  			// Update item
  			var itemUpdated = _.assign({}, itemToUpdate, item);
  			return productRepository.update(itemUpdated);
  		})
  		.tap(function (itemUpdated) {
  			// Audit update in DB
  			return auditService.logUpdate(itemUpdated);
  		})
  	;
  }

  function del(item) {

  }
};
