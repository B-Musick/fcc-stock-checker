/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
let Stock = require('../models/Stock');
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      console.log(Array.isArray(req.query.stock))
      console.log(req.query.stock)
      if(Array.isArray(req.query.stock)){
        // If multiple values of the same key are used (means multiple stocks given)
        // Print both and get relative likes {"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]}
        
      }else{
        Stock.findOne({stock:req.query.stock},(err,foundStock)=>{
          if (req.query.like && !foundStock.likeIP.includes(req.ip)) {
            // If a like is added, then save it to the stock
            // If this ip has already liked then dont allow it to
            foundStock.likes++;
            foundStock.likeIP.push(req.ip)
            foundStock.save();
            res.json({ stockData: foundStock })
          }else{
            res.json({ stockData: foundStock })

          }
        })
      }

    });
    
};
