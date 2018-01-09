// Import for web server
const express          = require('express');
/*
const logger           = require('morgan');
const errorhandler     = require('errorhandler');
const bodyParser       = require('body-parser');
const SuperLogin       = require('superlogin');
*/

const path             = require('path');
const fs               = require('fs');

// Import eatformation libraries
const helpers          = require('./helpers');
const models           = require('./models');
const pigsdb           = require('./models/pigs');


//let app = express()
// express app is defined in routes/index.js because to configure nunjucks using app.get routing than router
var app = require('./routes');


//app.use('/', routes);
//app.use(require('./controllers'))(app)


// Save our port
var port = process.env.PORT || 3000;

// Start the server and listen on port
/*
var http = require('http')
http.createServer(app).listen(port, '0.0.0.0', function() {
  console.log("Live on port: " + port);
});
*/

//console.log('app.js')
app.listen(port, '0.0.0.0', function() {
  console.log("Live on port: " + port);
});
