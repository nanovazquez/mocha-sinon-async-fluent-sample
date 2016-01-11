'use strict';

require('./tests-setup')();

var Promises = require('bluebird');
var _ = require('lodash');

var ProductRepository = require('../src/productRepository');
var AuditService = require('../src/auditService');
var ProductService = require('../src/productService');

describe('productService', function() {
  var productRepository;
  var auditService;
  var productService;

  beforeEach(function () {
  	productRepository = this.sinon.stub(new ProductRepository());
  	auditService = this.sinon.stub(new AuditService());
    productService = new ProductService(productRepository, auditService);
  });

  describe('#update', function () {
    var currentItem;
    var promise;
    var itemToUpdate;

    beforeEach(function () {
      currentItem = {id: 1, name: '1'};
      productRepository.get.withArgs(currentItem.id).resolves(currentItem);
    });

    describe('when item is sent with valid values', function () {

      beforeEach(function () {
        itemToUpdate = {id: 1, name: 'new name'};
        productRepository.update.withArgs(itemToUpdate).resolves(itemToUpdate);
        auditService.logUpdate.withArgs(itemToUpdate).resolves({});

        return promise = productService.update(itemToUpdate);
      });

      it('should retrieve current item from database', function () {
        productRepository.get.should.have.been.called.once;
        productRepository.get.should.have.been.calledWith(currentItem.id);
      });

      it('should update item', function () {
        productRepository.update.should.have.been.called.once;
        productRepository.update.should.have.been.calledWith(itemToUpdate);
      });

      it('should log update', function () {
        auditService.logUpdate.should.have.been.called.once;
        auditService.logUpdate.should.have.been.calledWith(itemToUpdate);
      });

      it('should return updated item', function () {
        return promise.should.become(itemToUpdate);
      });
    });

    describe('when item is sent with invalid name', function () {
      beforeEach(function () {
        itemToUpdate = {id: 1, name: ''};
        return (promise = productService.update(itemToUpdate)).catch(_.noop);
      });

      it('should reject operation', function () {
        return promise.should.be.eventually.be.rejectedWith(new Error('Invalid name').message);
      });

      it('should not retrieve item from database', function () {
        productRepository.get.should.not.have.been.called;
      });

      it('should not update item', function () {
        productRepository.update.should.not.have.been.called;
      });

      it('should not log update', function () {
        auditService.logUpdate.should.not.have.been.called;
      });
    });

    describe('when item is not found in the database', function () {
      beforeEach(function () {
        itemToUpdate = {id: 5, name: 'new name'};
        productRepository.get.withArgs(itemToUpdate).resolves(null);

        return (promise = productService.update(itemToUpdate)).catch(_.noop);
      });

      it('should reject operation', function () {
        return promise.should.be.eventually.be.rejectedWith(new Error('Invalid ID').message);
      });

      it('should try to retrieve item', function () {
        productRepository.get.should.have.been.called;
      });

      it('should not update item', function () {
        productRepository.update.should.not.have.been.called;
      });

      it('should not log update', function () {
        auditService.logUpdate.should.not.have.been.called;
      });
    });

    describe('when update item fails', function () {
      beforeEach(function () {
        itemToUpdate = {id: 1, name: 'new name'};
        productRepository.update.withArgs(itemToUpdate).rejects(new Error('Error while updating'));

        return (promise = productService.update(itemToUpdate)).catch(_.noop);
      });

      it('should reject operation', function () {
        return promise.should.be.eventually.be.rejectedWith(new Error('Error while updating').message);
      });

      it('should retrieve item from database', function () {
        productRepository.get.should.have.been.called;
      });

      it('should try to update item', function () {
        productRepository.update.should.have.been.called;
      });

      it('should not log update', function () {
        auditService.logUpdate.should.not.have.been.called;
      });
    });
  });
});
