'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
const fetch = require("node-fetch");
// Packages added
let dotenv = require('dotenv');
let mongoose = require('mongoose');
let helmet = require('helmet');

var app = express();
let Stock = require('./models/Stock');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"]
  }
}))

/********************** DATABASE ************************/
// mongoose.connect('mongodb://localhost:27017/fcc_stock_price', { useNewUrlParser: true, useUnifiedTopology: true });

// CONNECT TO MONGODB ATLAS DATABASE - pass URI key to connect
mongoose.connect(process.env.DATABASE, {
  userNewUrlParser: true,
  useCreateIndex: true
}).then(async () => {
  console.log("Connected to DB!");
  await Stock.collection.drop();
}).catch(err => {
  console.log("Error: ", err.message);
});
//Index page (static HTML)

app.route('/')
  .get(function (req, res) {
    
      res.sendFile(process.cwd() + '/views/index.html');
   
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
// app.use(function(req, res, next) {
//   res.status(404)
//     .type('text')
//     .send('Not Found');
// });

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
