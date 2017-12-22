// Import for web server
const express = require('express') 
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')

// Import eatformation libraries
const helpers = require('./helpers')
const models = require('./models')
const fs = require('fs')


let app = express()

app.use(bodyParser.json())
app.use(logger('dev'))
app.use(errorhandler())

// static file path
app.use('/static', express.static(__dirname + '/public'));

var csvFilePath = './pig_data/pig_2017-12-11.csv';

helpers.utils.updateButcheryInfoFromEkape(csvFilePath);


// Save our port
var port = process.env.PORT || 3000;

// Start the server and listen on port
/*
app.listen(port, '0.0.0.0', function(){
  console.log("Live on port: " + port);
})
;
*/