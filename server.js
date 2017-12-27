// Import for web server
const express = require('express'); 
const logger = require('morgan');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const path          = require('path');
const fs = require('fs');



// Import eatformation libraries
const helpers = require('./helpers');
const models = require('./models');
const pigsdb = require('./models/pigs');


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
helpers.utils.getUnprocessedPigs((err, pigsArr) => {
  if (err)
    console.log(err);
  else
    console.log(pigsArr);
  //helpers.utils.getUniqueTraceNo(pigsArr, (uniqueTraceNoArr) => {
    //console.log('uniqueTraceNoArr: ' + uniqueTraceNoArr);
  //  helpers.utils.upateLotNo('L117122612345000', uniqueTraceNoArr);
  //});
});
*/
/*
var queryString = {
  "key": "20171227"
}
pigsdb.runViewWithQuery('pigsDoc', 'pigLotNo-by-createdDate-view', queryString, (err, body) => {
  console.log(body);
  body.rows.forEach((row) => {
    console.log(row.id, row.key);
  });
});
*/
/*
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

helpers.utils.updateProcessInfoSellingPrice('20171226L1171226123450000', 300000, (body) => {
  //console.log(body);
});

helpers.utils.queryLotNoWithDate('20171227', (err, body) => {
  console.log(body);
});
*/


// Save our port
var port = process.env.PORT || 3000;

// Start the server and listen on port


app.listen(port, '0.0.0.0', function() {
  console.log("Live on port: " + port);
});
