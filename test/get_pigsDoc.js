var nano      = require('nano')('http://localhost:5984');
var db        = nano.db.use('nokdondb');
var fs        = require('fs');

db.get('_design/pigsDoc', (err, pigsDoc) => {
  if (err) console.log(`[error] ${err}`);

  fs.writeFileSync('pigsDoc.json', JSON.stringify(pigsDoc));  
  //console.log(pigsDoc);
})