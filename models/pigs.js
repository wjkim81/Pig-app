var nano = require('nano')('http://localhost:5984');

var db = nano.db.use('nokdondb');

module.exports = {
  insertPig(key, pig, callback) {
    //console.log(key);
    db.insert(pig, key, (err, body, header) => {
      if (err) {
        console.log('[insertPig] ' + err.message);
      }
      //console.log('Updated pig');
      //console.log(body);
      callback(body);
    })
  },
  insertPigs(pigsArr) {
    
  },
  
  /**
   * We don't know lotNo because they are only saved in db.
   * Thus we need to check if db has lotNo with current date and provide new seriesNo
   * by comparing the existing seriesNo.
   * @param {*} lotNo 
   */
  makeNewSeriesNo(lotNo, queryString) {
    db.fetch(queryString, (err, body) => {
      if (!err) {
        body.rows.forEach(function(doc) {
          console.log(doc);
          //console.log('key: ' + doc.key);
          //console.log('value: ' + JSON.stringify(doc.value));
          //console.log(doc.doc)
        });
      }
    })
  },
}