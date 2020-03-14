/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server.js');
let Stock = require('../models/Stock');

chai.use(chaiHttp);

Stock.collection.drop();
// Create the new project


suite('Functional Tests', function() {
    before(function (done) {
      var newStock = new Stock({
        stock: 'goog',
        likes: 0,
        price: 200
      });

      newStock.save(function (err) {
        return done();
      });
    });
      before(function(done){
        var newStock2 = new Stock({
          stock: 'test',
          likes: 1,
          price: 100
        });
        newStock2.save(function (err) {
          return done();
        });
      })
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body,'stockData','Stock is a key');
          assert.property(res.body['stockData'],'stock','stock is a key');
          assert.property(res.body['stockData'],'likes','likes is a key');
          assert.property(res.body['stockData'],'price','price is a key');
          assert.equal(res.body.stockData.stock,'goog')
          done();
        });
      });
      
      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock:'goog',like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body,'stockData','Stock is a key');
          assert.property(res.body['stockData'],'stock','stock is a key');
          assert.property(res.body['stockData'],'likes','likes is a key');
          assert.property(res.body['stockData'],'price','price is a key');
          assert.equal(res.body.stockData.likes,1);
          assert.equal(res.body.stockData.stock,'goog')
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock:'goog',like: true})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body,'stockData','Stock is a key');
            assert.property(res.body['stockData'],'stock','stock is a key');
            assert.property(res.body['stockData'],'likes','likes is a key');
            assert.property(res.body['stockData'],'price','price is a key');
            assert.equal(res.body.stockData.likes,1); // Likes should still be 1 since ip recorded
            assert.equal(res.body.stockData.stock,'goog')
            done();
        });
      });

      test('2 stocks', function(done) {
        
      });
      
      test('2 stocks with like', function(done) {
        
      });
      
    });

});
