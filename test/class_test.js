const pigs        = require('../models/schemas');
const db          = require('../models/db')
const pigsdb      = require('../models/pigs')
const Pig         = pigs.Pig;
const ProcessInfo = pigs.ProcessInfo;
const PigLotNo    = pigs.PigLotNo;
const utils       = require('../helpers/utils')
const csv         = require('csvtojson');

/*
pigObj = new ProcessInfo('20171227L117122712345000001')
console.log(pigObj);
//pigObj.setLotNo('L117122712345000');
//console.log(pigObj);
pigObj.processWeight = 100;
console.log(pigObj);

pigsdb.updateButcheryInfoFromEkape('./pig_data/pig_2017-12-21.csv', (err, numUpdated) => {
  //res.status(200);
  console.log(numUpdated + ' of pigs are updated');
});
*/
/*
csv()
  .fromFile('./pig_data/pig_2017-12-11.csv')
  .on('json', (ekapeJsonPig) => {
    console.log(ekapeJsonPig);
    const pig = utils.convertFromEkape(ekapeJsonPig);
    console.log(pig);
  })
  .on('done', (error) => {
    if (error) console.log(`[error] updateButcheryInfoFromEkape: ${error}, csv.done`);
  })
*/

var ekapePig = require('./pig_ekape.json');
var jsonPig     = require('./pig_ex.json');


//console.log(ekapePig);
//var newPig = utils.convertFromEkape(ekapePig);
//console.log(newPig);


//var newPig2 = new Pig('201812111600750000001050');
//var newPig2 = new Pig('201812111600750000001051');
//console.log(newPig2); 

// Test db operations
/* 
db.insert(newPig2, newPig2._id, (err, result) => {
  console.log(result);
})

db.update(newPig2, newPig2._id, (err, result) => {
  console.log(result);
})

db.delete('201812111600750000001050', (err, result) => {
  console.log(`[test] ${result}`);
})
*/

var queryString = {
  "key": "20171227"
};
/*
db.runViewWithQuery('pigsDoc', 'pigLotNo-by-lotNoYmd-view', queryString, (err, result) => {
  if (err) 
    console.log('[error] queryLotNoWithDate');
  console.log(err, result);
});
*/
pigsdb.queryLotNoWithDate("20171227", (err, results) => {
  if (err) console.log(err);
  console.log(results);
})