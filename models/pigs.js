var nano      = require('nano')('http://localhost:5984');
var db        = nano.db.use('nokdondb');
var csv       = require('csvtojson');
var utils     = require('../helpers/utils');



module.exports = {
  insert(obj, key, callback) {
    //console.log(key);
    db.insert(obj, key, (err, body, header) => {
      if (err) {
        console.log(`[error] db.insert: ${err}`);
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
        if (!err) console.log(`[error] update: ${err}`);
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
    db.view(designname, viewname, queryString, (viewError, body) => {
      if (viewError) console.log(`[error] runViewWithQuery: ${viewError}`);
      callback(viewError, body);
    });
  },

  /**
   * This will insert pig json object data from data given by ekape
   * 1. csvtojson
   * 2. convert json of ekape to json of our database schema
   * 3. insert into each json of pig data into couchdb
   * @param {*} csvFilePath 
   */
  updateButcheryInfoFromEkape(csvFilePath, callback) {
    var pigsArr = [];

    // Convert csv format file into json
    // For each json object, insert into couchDB 
    csv()
      .fromFile(csvFilePath)
      .on('json', (ekapeJsonPig) => {
        var pig = utils.convertFromEkape(ekapeJsonPig);
        //console.log(key);

        db.insert(pig, pig._id, (err, body) => {
          if (err) console.log('[error] updateButcheryInfoFromEkape, db.insert');
          //callback(body);
        });

        pigsArr.push(pig)
      })
      .on('done', (error) => {
        if (error) console.log('[error] updateButcheryInfoFromEkape, csv.done');
        console.log("Number of pigs: " + pigsArr.length);
        callback(pigsArr.length)
      }
    )
  },

  /**
   * CreateLotNo is starting point of works
   * 
   */
  createLotNo(traceNoArr, callback) {
    let today = self.getToday();

    var corpNo = '12345';

    var startKey = 'L1' + today + corpNo + '000';
    var endKey = 'L1' + today + corpNo + '999';

    queryString = {
      startkey: startKey,
      endkey: endKey,
      include_docs: true,
      limit: 1000
    };

    // Retrieve all lotNo with current day 
    db.runQuery(queryString, (body) => {
      var seriesNo = body.rows.length;
      var newLotNo = 'L1' + today + corpNo + pad(3, seriesNo.toString(), '0');

      var newPigLotNo = models.schemas.pigLotNo;
      newPigLotNo.traceNoArr = [];
      newPigLotNo.createdDate = self.getTodayYYYYMMDD();
      //console.log('seriesNo: ' + seriesNo)
      //console.log(body);
      
      if (traceNoArr.length > 0) {
        for (var i = 0; i < traceNoArr.length; i++)
        /**
         * Let's check traceNo with exisitng traceNo here!
         */
          newPigLotNo.traceNoArr.push(traceNoArr[i]);
      }

      db.insert(newPigLotNo, newLotNo, (err, body) => {
        console.log('[insert] ' + body);
        callback(err, newLotNo);
      });
    });
  },

  upateLotNo(lotNo, pigsArr, callback) {
    var queryString;

    queryString = {
      "key": lotNo
    };
    //console.log(queryString);
    db.runViewWithQuery('pigsDoc', 'pigLotNo-view', queryString, (body) => {
      //console.log(body);
      var updateLotNo = models.schemas.pigLotNo;
      updateLotNo._id = lotNo;
      updateLotNo._rev = body.rows[0].value._rev;
      for (var i = 0; i < pigsArr.length; i++) {
        updateLotNo.referenceKey.push(pigsArr[i]);
        console.log(updateLotNo);
        db.update(updateLotNo, lotNo, (err, lotNoBody) => {

          console.log(pigsArr[i]);
          queryString = {
            "selector": {
              "traceNo": pigsArr[i]
            }
          };
          //console.log(queryString);
          db.runViewWithQuery('pigsDoc', 'pig-view', queryString, (pigsBody) => {
            //console.log(body);
            pigsBody.rows.forEach((row) => {
              row.value.processed = 1
              console.log(row.value);
              db.update(row.value, row.value._id, (err, body) => {
                console.log(body);
              });    
            });
          });
        });
      }
    });
  },

  queryLotNoWithDate(createdDate, callback) {
    var queryString = {
      "key": createdDate
    };

    //console.log(createdDate);
    console.log(queryString);
    db.runViewWithQuery('pigsDoc', 'pigLotNo-by-createdDate-view', queryString, (error, body) => {
      if (error) 
        console.log('[error] queryLotNoWithDate');
      callback(error, body);
    });
  },

  createNewProcessNo(lotNo, callback) {
    var queryString = {
      "key": lotNo
    };
    //console.log(queryString);
    db.runViewWithQuery('pigsDoc', 'processInfo-by-lotNo-view', queryString, (error, processBody) => {
      //console.log(processBody);
      var seriesNo = processBody.rows.length;
      var today = self.getTodayYYYYMMDD();
      var processNo = today + lotNo + pad(3, seriesNo, '0');

      processInfo = models.schemas.processInfo;
      processInfo.lotNo = lotNo;
      processInfo.processYmd = today;
      processInfo.corpNo = '12345';

      //console.log(processInfo);
      //console.log(processNo);
      db.insert(processInfo, processNo, (err, body) => {
        //console.log(body);
        callback(err, processNo);
      });
    });
  },

  updateProcessInfoFromApp(processInfo, callback) {
    console.log(`processInfo[0]: ${processInfo[0]}`)
    var queryString = {
      "key": processInfo[0]
    }
    db.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      if (error) {
        console.log(`[error] runViewWithQuery: ${error}`);
        callback(error, processBody);
      }
      //console.log(processBody);
      if (processBody.rows.length !== 0) {
        newProcessInfo = processBody.rows[0].value;
        newProcessInfo.lotNo = processInfo[1];
        newProcessInfo.processPlaceNm = processInfo[2];
        newProcessInfo.processPlaceAddr = processInfo[3];
        newProcessInfo.processPart = processInfo[4];
        newProcessInfo.processWeight = parseInt(processInfo[5]);
        newProcessInfo.processYmd = processInfo[6];
        newProcessInfo.purchasingCost = parseInt(processInfo[7]);
        newProcessInfo.sellingPrice = parseInt(processInfo[8]);

        //console.log(`newProcessInfo: ${JSON.stringify(newProcessInfo)}`);
        db.update(newProcessInfo, processInfo[0], (updateErr, updateResult) => {
          if (updateErr) console.log(`[error] ${updateErr}`);

          callback(updateErr, updateResult);
        });
      }
    });
  },

  updateProcessInfoWeight(processNo, processWeight, callback) {
    var queryString = {
      "key": processNo
    };
    db.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      //console.log(processBody);
      processBody.rows[0].value.processWeight = processWeight;
      //console.log(processBody.rows[0].value);
      
      db.update(processBody.rows[0].value, processNo, (err, updateBody) => {
        callback(err, updateBody);
      });
    });
  },

  updateProcessInfoPart(processNo, processPart, callback) {
    var queryString = {
      "key": processNo
    };
    db.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      processBody.rows[0].value.processPart = processPart;
      console.log(processBody.rows[0].value);
      
      db.update(processBody.rows[0].value, processNo, (err, updateBody) => {
        callback(updateBody);
      });
    });
  },
  
  updateProcessInfoPurchasingCost(processNo, purchasingCost, callback) {
    var queryString = {
      "key": processNo
    };
    db.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      processBody.rows[0].value.purchasingCost = purchasingCost;
      console.log(processBody.rows[0].value);
      
      db.update(processBody.rows[0].value, processNo, (err, updateBody) => {
        callback(updateBody);
      });
    });
  },

  updateProcessInfoSellingPrice(processNo, sellingPrice, callback) {
    var queryString = {
      "key": processNo
    };
    db.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      processBody.rows[0].value.sellingPrice = sellingPrice;
      console.log(processBody.rows[0].value);
      
      db.update(processBody.rows[0].value, processNo, (err, updateBody) => {
        callback(err, updateBody);
      });
    });
  },

  queryProcessInfoWithDate(processDate, callback) {
    var queryString = {
      "key": processDate
    };

    db.runViewWithQuery('pigsDoc', 'processInfo-by-processYmd-view', queryString, (err, processBody) => {
      //console.log(processBody.rows);
      callback(err, processBody.rows);
    });
  },

  updateProcessTrackHistory(originNo, destinationNo, callback) {

  },

  getUnprocessedPigs(callback) {
    // Get pig documents where processed is false
    db.runView('pigsDoc', 'non-processed-view', (err, body) => {
      //console.log(err, body);
      if (err) console.log('[error] getUnprocessedPigs');
      callback(err, body);
    });
  },

  getUniqueTraceNo(pigsArr, callback) {

    var uniqueTraceNoArr = [];
    for (var i = 0; i < pigsArr.rows.length; i++) {
      //console.log(pigsArr.rows[i]);
      if (!uniqueTraceNoArr.includes(pigsArr.rows[i].value.traceNo)) 
        uniqueTraceNoArr.push(pigsArr.rows[i].value.traceNo);
    }
    callback(uniqueTraceNoArr);
  },

  queryProcessSummary(startDate, endDate, callback) {
    var queryString = {
      //"startkey": "20171220",
      //"endkey": "20171229"
      //"key": ["20171228", "L117122812345000"]
      //"key": "20171228"
      "startkey": [startDate, null, null],
      "endkey": [endDate, null, null],
      "group_level": 3
    };
    db.runViewWithQuery('pigsDoc', 'processInfo-summary-view', queryString, (error, viewResult) => {
      //console.log(viewResult.rows);
      if (error) console.log(`[error] queryProcessSummary: ${eerror}`);
      callback(error, viewResult.rows);
    })
  }
}
