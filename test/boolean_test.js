// Import for web server
const fs = require('fs');

// Import eatformation libraries
const helpers = require('../helpers');
const models = require('../models');
const db = require('../models/db');

var keys = [
  ["150040500223", "4999"],
  ["150040500223", "5002"],
  ["150040500223", "5003"],
]


/*
var queryString = {
  //"startkey": "20171220",
  //"endkey": "20171229"
  //"key": ["20171228", "L117122812345000"]
  //"key": "20171228"
  //"key": ["150040500223", "5006"]
  "keys": keys
  //"group_level": 1
}

db.runView('pigsDoc', 'pigs-by-traceNo-pigNo-view', (error, viewResult) => {
  console.log(viewResult.rows);
})

db.runViewWithQuery('pigsDoc', 'pigs-by-traceNo-pigNo-view', queryString, (error, viewResults) => {
  //console.log(viewResults);
  
  viewResults.rows.forEach((el, idx, arr) => {
    console.log(el);
  })
  
})
*/

/*
queryString = {
  "key": "20180125"
};
db.runViewWithQuery('pigsDoc', 'pigLotNo-by-lotNoYmd-view', queryString, (err, viewResults) => {
  console.log(viewResults);

});
*/

var queryString = {
  "keys": keys
};

db.getDocsFromViewWithQuery('pigsDoc', 'pigs-by-traceNo-pigNo-view', queryString, (errView, result) => {
  if (errView) console(`[error] ${errView}`)

  console.log(result);
});