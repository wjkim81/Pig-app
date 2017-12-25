// Import for web server
const express = require('express') 
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')

// Import eatformation libraries
const helpers = require('./helpers')
const models = require('./models')
const pigsdb = require('./models/pigs')
const fs = require('fs')


let app = express()

app.use(bodyParser.json())
app.use(logger('dev'))
app.use(errorhandler())

// static file path
app.use('/static', express.static(__dirname + '/public'));

var csvFilePath = './pig_data/pig_2017-12-11.csv';

/*
helpers.utils.updateButcheryInfoFromEkape(csvFilePath, function(numUpdated) {
  console.log(numUpdated + ' of pigs are updated');
});
*/

/*
helpers.utils.createLotNo((lotNo) => {
  //var today = helpers.utils.getToday();
  //console.log(today);
  helpers.utils.getUnprocessedPigs((pigsArr) => {
    //console.log('pigsArr: ' + pigsArr);
    //console.log(pigsArr);
    helpers.utils.getUniqueTraceNo(pigsArr, (uniqueTraceNoArr) => {
      console.log('uniqueTraceNoArr: ' + uniqueTraceNoArr);
    });
  });
});
*/

/*
helpers.utils.getUnprocessedPigs((pigsArr) => {
  //console.log('pigsArr: ' + pigsArr);
  helpers.utils.getUniqueTraceNo(pigsArr, (uniqueTraceNoArr) => {
    //console.log('uniqueTraceNoArr: ' + uniqueTraceNoArr);
    helpers.utils.upateLotNo('L117122612345000', uniqueTraceNoArr);
  });
});
*/
/*
helpers.utils.createNewProcessNo('L117122612345000', (body) => {
  console.log(body);
});

helpers.utils.updateProcessInfoWeight('20171226L1171226123450000', 80, (body) => {
  //console.log(body);
});
*/
/*
helpers.utils.updateProcessInfoPart('20171226L1171226123450000', '삼겹살', (body) => {
  //console.log(body);
});
helpers.utils.updateProcessInfoPurchasingCost('20171226L1171226123450000', 200000, (body) => {
  //console.log(body);
});
*/
helpers.utils.updateProcessInfoSellingPrice('20171226L1171226123450000', 300000, (body) => {
  //console.log(body);
});
// Save our port
var port = process.env.PORT || 3000;

// Start the server and listen on port
/*
app.listen(port, '0.0.0.0', function() {
  console.log("Live on port: " + port);
});
*/