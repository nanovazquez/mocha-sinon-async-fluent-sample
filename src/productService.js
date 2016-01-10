'use strict';

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function productService(
  productRepository,
  auditService
  ) {
  return {
    update: update
  };

  function update(item) {
    return Promise.resolve()
      .then(function () {
        // Validate payload with business rules
        if (!item.name) {
          return Promise.reject(new Error('Invalid name'));
        }
        return item;
      })
      .then(function (item) {
        // Retrieve item from database
        return productRepository.get(item.id);
      })
      .then(function (itemToUpdate) {
        if (!itemToUpdate) {
          return Promise.reject(new Error('Invalid ID'));
        }

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
};
