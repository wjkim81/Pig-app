utils         = require('../helpers/utils');
var nano      = require('nano')('http://localhost:5984');
var db        = nano.db.use('test');



//var today = utils.getTodayYYMMDD();
//console.log(today);


var date = new Date();
console.log(date );
console.log(date.toString());

var jDoc = {
  "date": date
}

/*
db.insert(jDoc, null, (err, result) => {
  if (err) console.log(`[error] ${err}`);

  console.log(result);
})
*/
db.view('testDoc', 'date-view', null, (err, docs) => {
  if (err) console.log(`[error] ${err}`);

  var results = docs.rows;
  results.forEach((elem, idx, arr) => {
    console.log(elem.key);
    var createdDate = new Date(elem.key);
    console.log(createdDate);  
  })
  //console.log(docs);
})