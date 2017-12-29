// Import for web server
const express          = require('express'); 
const logger           = require('morgan');
const errorhandler     = require('errorhandler');
const bodyParser       = require('body-parser');
const path             = require('path');
const fs               = require('fs');

// Import eatformation libraries
const helpers          = require('./helpers');
const models           = require('./models');
const pigsdb           = require('./models/pigs');


//let app = express()

/*
const nunjucks    = require('nunjucks')
nunjucks.configure('../views', {
  autoescape: true,
  express: app
});
*/
let app = require('./routes');

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(errorhandler());

// static file path
app.use('/static', express.static(__dirname + '/public'));
//app.use('/', routes);

//app.use(require('./controllers'))(app)

// Save our port
var port = process.env.PORT || 3000;

// Start the server and listen on port


app.listen(port, '0.0.0.0', function() {
  console.log("Live on port: " + port);
});
