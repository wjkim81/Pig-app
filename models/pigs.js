var nano = require('nano')('http://localhost:5984');

var nokdon = nano.db.use('nokdondb');

module.exports = {
  insertPig(key, pig, callback) {
    //console.log(key);
    nokdon.insert(pig, key, (err, body, header) => {
      if (err) {
        console.log('[insertPig] ' + err.message);
      }
      //console.log('Updated pig');
      //console.log(body);
    })
  },
  insertPigs(pigsArr) {
    
  }

}