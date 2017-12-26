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
const nunjucks    = require('nunjucks')

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', (req, res) => {
  var pigsArr = []
  res.render('index.html', { pigsArr: pigsArr.rows });
  //console.log(req);
  //res.sendFile(path.join(__dirname, '../views/pigs', 'index.html'), {test: 'test'})
  //helpers.utils.getUnprocessedPigs((pigsArr) => {
    //helpers.utils.
    //console.log('pigsArr: ' + pigsArr);
    //console.log(pigsArr.rows);
    //res.render('index.html', { pigsArr: pigsArr.rows });
  //});
})
*/
/*
app.post('/upload', function(req, res) {
  console.log(req.files);
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let csvFile = req.files.csvFile;
 

  
  // Use the mv() method to place the file somewhere on your server
  csvFilePath = path.join(__dirname, 'pigs_data', csvFile.name);
  csvFile.mv(csvFilePath, function(err) {
    if (err)
      return res.status(500).send(err);
    console.log(csvFilePath);
    helpers.utils.updateButcheryInfoFromEkape(csvFilePath, (numUpdated) => {
      console.log(numUpdated + ' of pigs are updated');
      //fs.unlinkSync(csvFilePath);
      res.status(200);
      res.redirect('/');
    });
  });
});
*/

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

helpers.utils.updateProcessInfoSellingPrice('20171226L1171226123450000', 300000, (body) => {
  //console.log(body);
});
*/
// Save our port
var port = process.env.PORT || 3000;

// Start the server and listen on port


app.listen(port, '0.0.0.0', function() {
  console.log("Live on port: " + port);
});