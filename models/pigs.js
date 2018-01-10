var db        = require('./db')
var models    = require('./schemas')

var utils     = require('../helpers/utils');

var Pig       = models.Pig;
var PigLotNo  = models.PigLotNo;
var ProcessInfo = models.ProcessInfo;

var pad       = require('pad');

module.exports = {

  updateButcheryInfoFromEkape(issuedYmd, apiKey, callback) {
    utils.downloadButcheryInfoFromEkape(issuedYmd, apiKey, (err, pigsArr) => {
      if (err) {
        console.log('Updating butcheryInfo from ekape failed');
        callback(err, null);
        return;
      } else {
          let numSuccess = 0;
          //var numInsert = pigsArr.length;

          db.bulkInsert(pigsArr, (bulkErr, bulkResult) => {
            //if (!bulkErr) bulkSuccessArr.push[false]
            //else bulkSuccessArr.push(true);
            //console.log(`${pigsArr.length} are updated`)
            if (bulkErr) console.log('[error] bulkInsert');
            console.log('BulkInsert was done');
            //console.log(bulkResult);
            for (var i = 0; i < bulkResult.length; i++) {
              //console.log(`i: ${i}`);
              if (!bulkResult[i].error) numSuccess++;
            }
            console.log(`${numSuccess} are inserted by bulk`)
            callback(bulkErr, numSuccess);
          });

      }
    });
  },

  /**
   * CreateLotNo is starting point of works
   * 
   */
  createLotNo(traceNoArr, corpNo, callback) {
    let today = utils.getTodayYYMMDD();

    //var corpNo = '1234';

    var startKey = 'L1' + today + corpNo + '000';
    var endKey = 'L1' + today + corpNo + '999';

    queryString = {
      startkey: startKey,
      endkey: endKey,
      include_docs: true,
      limit: 1000
    };

    // Retrieve all lotNo with current day 
    db.runQuery(queryString, (result) => {
      var seriesNo = result.rows.length;
      var newLotNo = 'L1' + today + corpNo + pad(3, seriesNo.toString(), '0');

      var newPigLotNo = new PigLotNo(newLotNo);
      //newPigLotNo.traceNoArr = [];
      newPigLotNo.pigLotNoYmd = utils.getTodayYYYYMMDD();
      //console.log('seriesNo: ' + seriesNo)
      //console.log(result);
      
      if (traceNoArr.length > 0) {
        for (var i = 0; i < traceNoArr.length; i++)
        /**
         * Let's check traceNo with exisitng traceNo here!
         */
          newPigLotNo.traceNoArr.push(traceNoArr[i]);
      }

      db.insert(newPigLotNo, newLotNo, (err, insesrtResult) => {
        console.log('[insert] ' + insesrtResult);
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

  queryLotNoWithDate(pigLotNoYmd, callback) {
    //console.log(`pigLotNoYmd: ${pigLotNoYmd}`)
    var queryString = {
      "key": pigLotNoYmd
    };

    //console.log(createdDate);
    //console.log(queryString);
    db.runViewWithQuery('pigsDoc', 'pigLotNo-by-lotNoYmd-view', queryString, (err, pigLotNoKeys) => {
      if (err) {
        console.log('[error] queryLotNoWithDate');
        callback(err, pigLotNoKeys);
        return;
      }
      
      //console.log(pigLotNoKeys);
      keysArr = [];
      for (var i = 0; i < pigLotNoKeys.rows.length; i++) {
        //console.log(pigLotNoKeys.rows[i].id)
        keysArr.push(pigLotNoKeys.rows[i].id);
      }
      //console.log(keysArr);

      queryString = {
        "keys": keysArr
      }
      db.runFetch(queryString, (errFetch, docResults) => {
        if (errFetch) console.log('[error] queryLotNoWithDate');

        //console.log(docResults);
        callback(errFetch, docResults);
      })
    });
  },

  createNewProcessNo(lotNo, callback) {
    var queryString = {
      "key": lotNo
    };
    //console.log(queryString);
    db.runViewWithQuery('pigsDoc', 'processInfo-by-lotNo-view', queryString, (error, processResult) => {
      //console.log(processResult);
      var seriesNo = processResult.rows[0].value;
      var today = utils.getTodayYYYYMMDD();
      //console.log(seriesNo)
      var processNo = today + lotNo + pad(3, seriesNo, '0');

      //console.log(processNo)
      processInfo = new ProcessInfo(processNo);
      processInfo.lotNo = lotNo;
      processInfo.processYmd = today;
      processInfo.corpNo = '1234';

      //console.log(processInfo);
      //console.log(processNo);
      db.insert(processInfo, processNo, (err, body) => {
        //console.log(body);
        callback(err, processNo);
      });
    });
  },

  updateProcessInfoFromApp(processInfo, callback) {
    //console.log(`processInfo[0]: ${processInfo[0]}`)
    var queryString = {
      "key": processInfo[0]
    }
    db.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (err, queryResult) => {
      if (err) {
        console.log(`[error] runViewWithQuery: ${err}`);
        callback(error, queryResult);
      }
      //console.log('queryResult:');
      //console.log(queryResult);
      
      if (queryResult.rows.length == 0) {
        callback("No processInfo with processInfo Number", null);
      } else {
        db.select(queryResult.rows[0].id, (selectErr, resultDoc) => {
          //console.log(resultDoc);
          newProcessInfo = resultDoc;
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

    db.runViewWithQuery('pigsDoc', 'processInfo-by-processYmd-view', queryString, (err, processInfoKeys) => {
      //console.log(processBody.rows);
      if (err) {
        console.log('[error] queryProcessInfoWithDate')
        callback(err, processInfoKeys);
        return;
      }

      keysArr = [];
      for (var i = 0; i < processInfoKeys.rows.length; i++) {
        keysArr.push(processInfoKeys.rows[i].id);
      }

      queryString = {
        "keys": keysArr
      };
      db.runFetch(queryString, (errFetch, resultDocs) => {
        if (errFetch) console.log('[error] queryProcessInfoWithDate');

        //console.log(resultDocs.rows);
        callback(err, resultDocs.rows);
      });
    });
  },

  updateProcessTrackHistory(originNo, destinationNo, callback) {

  },

  queryPigsWithDate(queryYmd, callback) {
    // Get pig documents where processed is false
    var queryString = {
      "key": queryYmd
    }
    db.getDocsFromViewWithQuery('pigsDoc', 'pigs-by-issueYmd-view', queryString, (err, queryResult) => {
      //console.log(err, body);
      if (err) console.log('[error] queryPigsWithDate');
      callback(err, queryResult);
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
    db.runViewWithQuery('pigsDoc', 'processInfo-summary-view', queryString, (err, viewResult) => {
      //console.log(viewResult.rows);
      if (err) console.log(`[error] queryProcessSummary: ${err}`);
      callback(err, viewResult.rows);
    })
  }
}
