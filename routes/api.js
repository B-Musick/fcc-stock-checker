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
let fetch = require('node-fetch');
module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      if(Array.isArray(req.query.stock)){
        // If multiple values of the same key are used (means multiple stocks given)
        // Print both and get relative likes {"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]}
        
        // Get possible data from the API
        let latestPrice1;
        await testAPI(req.query.stock[0]).then(data=>latestPrice1 = data.latestPrice);
        let latestPrice2;
        await testAPI(req.query.stock[1]).then(data=>latestPrice2 = data.latestPrice);

        await Stock.findOne({stock:req.query.stock[0]},async (err,stock1)=>{
          await Stock.findOne({stock:req.query.stock[1]},(err,stock2)=>{
            updatePrice(stock1,latestPrice1); // If there is latest price
            updatePrice(stock2,latestPrice2); // If second one has latest price

            if (req.query.like && !stock1.likeIP.includes(req.ip) && !stock2.likeIP.includes(req.ip)) {
              // If a like is added, then save it to the stock
              // If this ip has already liked then dont allow it to
              updateLikes(stock1);
              updateLikes(stock2);
           }
          //  Create stock data to return 
            let s1 = {
              stock:stock1.stock,
              price:stock1.price,
              rel_likes:stock1.likes - stock2.likes
            }
            let s2 = {
              stock:stock2.stock,
              price:stock2.price,
              rel_likes:stock2.likes - stock1.likes
            }
            res.json({stockData:[s1,s2]}) 
          })
        })    
      }else{
        let latestPrice;
        await testAPI(req.query.stock).then(data=>latestPrice = data.latestPrice);
        // Was getting timeout error
        await Stock.findOne({stock:req.query.stock},(err,foundStock)=>{
          updatePrice(foundStock,latestPrice);
          if (req.query.like && !foundStock.likeIP.includes(req.ip)) {
            // If a like is added, then save it to the stock
            // If this ip has already liked then dont allow it to
            updateLikes(foundStock);
            res.json({ stockData: foundStock })
          }else{
            res.json({ stockData: foundStock })
          }
        });
      }
    });
    
};

let testAPI = async (stock)=>{
  let response = await fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`);
  let data = await response.json();
  return data;    
}

let updatePrice = (stock,latestPrice)=>{
  if(latestPrice){
    // If this stock is in the API then use latest price from fetching it
    stock.price = latestPrice;
    stock.save()
  }
}
let updateLikes = (stock)=>{
  // Update likes of the stock if like=true in req.query
  stock.likes++;
  stock.likeIP.push(req.ip);
  stock.save();
}
 