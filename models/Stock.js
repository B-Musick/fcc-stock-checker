let mongoose = require('mongoose');

let stockSchema = new mongoose.Schema({
    stock: String,
    price: Number,
    likes: Number,
    likeIP: {type:Array, default:[]}
});

module.exports = mongoose.model('Stock',stockSchema);