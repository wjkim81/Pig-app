var db        = require('../models/db')
var fs        = require('fs');

var pigsDocStr = fs.readFileSync('pigsDoc.json');  
var pigsDoc = JSON.parse(pigsDocStr);
console.log(pigsDoc);

db.insert(pigsDoc, '_design/pigsDoc', (err, insertResult) => {
  if (err) console.log(`[error] ${err}`);

  console.log(insertResult);
});