var nano = require('nano')('http://localhost:5984');

var db = nano.db.use('nokdondb');

module.exports = {
  insert(obj, key, callback) {
    //console.log(key);
    db.insert(obj, key, (err, body, header) => {
      if (err) {
        console.log('[error] db.insert');
      }
      //console.log('Updated pig');
      //console.log(body);
      callback(err, body);
    })
  },

  insertObjs(objsArr) {
    
  },

  update(obj, key, callback) {
    db.get(key, (error, existing) => { 
      if(!error) obj._rev = existing._rev;
      db.insert(obj, key, (err, body) => {
        if (!err) console.log(body);
        callback(err, body);
      });
    });
  },

  
  /**
   * Run Query
   * @param {json} queryString 
   */
  runQuery(queryString, callback) {
    db.list(queryString, (err, body) => {
      if (!err) {
        console.log('body: ' + body)
        callback(body);
        /*
        body.rows.forEach(function(doc) {
          console.log(doc.length);
        });
        if (body.rows == 0)
          console.log('0')
        */
      }
    })
  },

  runView(designname, viewname, callback) {
    db.view(designname, viewname, (viewError, body) => {
      if (viewError) console.log('[error] runView: ' + viewError);
      callback(viewError, body);
    });
  },

  runViewWithQuery(designname, viewname, queryString, callback) {
    db.view(designname, viewname, queryString, (err, body) => {
        if (err) console.log('[error] runViewWithQuery');
        callback(err, body);
    });
  }
}
