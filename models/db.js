/**
 * db.js consists of basic db operation such as insert, delete, update, and read
 * Updating database must use these operation rather than implementing functions by themselves
 * 
 * Eatformation
 */

var nano      = require('nano')('http://localhost:5984');
var db        = nano.db.use('nokdondb');

module.exports = {
  insert(obj, key, callback) {
    //console.log(key);
    db.insert(obj, key, (err, result) => {
      if (err) {
        console.log(`[error] db.insert: ${err}`);
      }

      callback(err, result);
    })
  },

  insertObjs(objsArr) {
    
  },

  /**
   * Query only one document with key
   * 
   * @param {*} key 
   * @param {*} callback 
   */
  get(key, callback) {
    db.get(key, (err, resultDoc) => {
      if (err) console.log(`[error] db.get ${err}`);
      callback(err, resultDoc);
    });
  },

  update(obj, key, callback) {
    db.get(key, (err, existing) => {
      if (err) {
        console.log(`[error] db.get ${err}`);
        callback(err, existing);
        return;
      }
      obj._rev = existing._rev;

      db.insert(obj, key, (insertErr, result) => {
        if (insertErr) console.log(`[error] db.update: ${insertErr}`);
        callback(insertErr, result);
      });
    });
  },

  delete(key, callback) {
    db.get(key, (err, existing) => {
      if (err) {
        console.log(`[error] db.get ${err}`);
        callback(err, existing);
        return;
      }

      console.log(`[delete] ${existing}`);
      db.destroy(key, existing._rev, (destroyErr, result) => {
        if (destroyErr) console.log(`[error] db.destroy: ${destroyErr}`);
        callback(destroyErr, result);
      });
    });
  },

  bulkInsert(docs, callback) {
    db.bulk({"docs": docs}, (err, result) => {
      if (err) {
        console.log(`[error] db.bulk: ${err}`);
      }

      callback(err, result);
    });
  },
  
  /**
   * Run Query
   * @param {json} queryString
   * queryString should include key
   * ex:
   * {
   *   "key": "20181207"
   * }
   * {
   *   "startkey": "20181207"
   *   "endkey": "20171220"
   * }
   */
  list(queryString, callback) {
    db.list(queryString, (err, results) => {
      if (err) {
        console.log(`[error] db.list: ${err}`)
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

  runFetch(keys, queryString, callback) {
    db.fetch(keys, queryString, (err, result) => {
      if (err) console.log(`[error] runFetch: ${err}`)
      
      callback(err, result);
    });
  },

  /**
   * Before run this function, view must be created in couchdb first
   * 
   * @param {string} designname 
   * @param {string} viewname 
   * @param {string} callback => error, body
   */
  runView(designname, viewname, callback) {
    db.view(designname, viewname, (err, result) => {
      if (err) console.log(`[error] runView: ${err}`);

      callback(err, result);
    });
  },

  /**
   * Before run this function, view must be created in couchdb first
   * 
   * @param {string} designname 
   * @param {string} viewname 
   * @param {string} callback => error, body
   */
  runViewWithQuery(designname, viewname, queryString, callback) {
    db.view(designname, viewname, queryString, (err, result) => {
      if (err) console.log(`[error] runViewWithQuery: ${err}`);

      callback(err, result);
    });
  },

  getDocsFromViewWithQuery(designname, viewname, queryString, callback) {
    //console.log(queryString);
    db.view(designname, viewname, queryString, (err, resultKeys) => {
      if (err) {
        console.log(`[error] getDocsFromViewWithQuery: ${err}`);
        callback(err, resultKeys);
        return;
      }

      keysArr = [];
      //console.log(resultKeys);

      for (var i = 0; i < resultKeys.rows.length; i++) {
        keysArr.push(resultKeys.rows[i].id);
      }

      var queryStr = {
        "keys": keysArr
      }

      //console.log(queryStr);
      db.fetch(queryStr, (errFetch, resultDocs) => {
        if (errFetch) console.log(`[error] queryProcessInfoWithDate: errFetch`);

        //console.log(resultDocs.rows);
        callback(errFetch, resultDocs.rows);
      })
    })
  }
}
