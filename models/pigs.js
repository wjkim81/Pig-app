var db        = require('./db')
var models    = require('./schemas')

var utils     = require('../helpers/utils');

var Pig       = models.Pig;
var PigLotNo  = models.PigLotNo;
var ProcessInfo = models.ProcessInfo;
var PigBox = models.PigBox;

var async     = require('async');
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
   * TraceNoArr: TraceNo(14) + PigNo(4)
   */
  createLotNo(traceNoArr, corpNo, callback) {
    let lotNoYmd = utils.getTodayYYYYMMDD();
    //console.log(lotNoYmd);

    var queryString = {
      "key": lotNoYmd
    }

    var createNewPigLotNo = function(done) {
      db.runViewWithQuery('pigsDoc', 'pigLotNo-by-lotNoYmd-view', queryString, (err, viewResult) => {
        
        //console.log(viewResult);
        if (err) {
          console.log(`[error] ${err}`)
        }
        //console.log('viewResult: ');
        //console.log(viewResult);
        var seriesNo;
        if (viewResult.rows.length === 0) {
          seriesNo = 0;
        } else {
          seriesNo = viewResult.rows[0].value;
        }
        //console.log('seriesNo: ' + seriesNo)

        let today = utils.getTodayYYMMDD();
        var newLotNo = 'L1' + today + corpNo + pad(3, seriesNo.toString(), '0');

        //console.log(newLotNo);
        var newPigLotNo = new PigLotNo(newLotNo);
        newPigLotNo.pigLotNoYmd = utils.getTodayYYYYMMDD();
        done(newPigLotNo);
      });
    }

    // Retrieve all lotNo with current day 
    /**
     * [ErrorCheck] 만약 우리가 이미 가공한 도체번호를 다시 묶음번호에 넣을려고 할 때는 어떻게 해야 하나..
     */

    var infoForNewPigLotNo = {
      "totalWeight": 0,
      "referenceKeys": [],
      "traceNoPigNoArr": []
    }

    // Updating pig data accrodingly with pigLotNo
    var updatePigs = function(newPigLotNoIn, done) {
      //console.log('updatePigs');
      //console.log(newPigLotNoIn);
      var traceNoEl, traceNo, pigNo;

      var traceNoPigNoArr = [];
      for (var i = 0; i < traceNoArr.length; i++) {
        /**
         * [ErrorCheck] traceNo이 이미 있을 때는 넣지 말아야 한다.
         */
        infoForNewPigLotNo.traceNoPigNoArr.push(traceNoArr[i]);

        traceNoEl = traceNoArr[i].split('-');
        traceNoPigNoArr.push(traceNoEl);
      }
      
      queryString = {
        "keys": traceNoPigNoArr
      };
      //console.log(queryString);
      //console.log(traceNoEl, traceNo, pigNo);
      
      db.getDocsFromViewWithQuery('pigsDoc', 'pigs-by-unprocessed-traceNo-pigNo-view', queryString, (errView, result) => {
        if (errView) {
          console.log(`[error] ${errView}`);
          done(errView, null);
          return;
        }

        //console.log(result);
        if (result.length !== traceNoArr.length) {
          //console.log('Some pig or pigs are already processed into pigLotNo');
          done('Some pig or pigs are already processed into pigLotNo', null);
          return;
        }
          
        
        for (var i = 0; i < result.length; i++) {
          console.log(result[i].doc);
          if (!result[i].doc.processed) {
            result[i].doc.processed = true;
          } else {
            console.log(`${result[i].key} was already processed`);
            done(`${result[i].key} was already processed`, null);
            return;
          }

          let newHistory = [result[i].key, newPigLotNoIn._id];
          if (result[i].doc.processHistory.indexOf(newHistory) === -1)
            result[i].doc.processHistory.push(newHistory);

          
          db.update(result[i].doc, result[i].key, (errUpdate, updateResult) => {
            if (errUpdate) {
              console.log(`[error] db.update ${errUpdate}`);
              done(errUpdate, null);
              return;
            }
          });
          

          //console.log(`push: ${result[i].key}`);
          newPigLotNoIn.referenceKeys.push(result[i].key);
          newPigLotNoIn.lotNoTotalWeight += result[i].doc.butcheryInfo.butcheryWeight;
        }
        
        newPigLotNoIn.traceNoPigNoArr = traceNoArr;
        //console.log(newPigLotNoIn);
        done(null, newPigLotNoIn);
      });
    }

    var insertNewPigLotNo = function(pigLotNoIn, done) {
      db.insert(pigLotNoIn, pigLotNoIn._id, (insertErr, insesrtResult) => {
        if (insertErr) console.log(`[error] ${insertErr}`)

        console.log(`[insert] ${pigLotNoIn._id}`);
        done(null, pigLotNoIn._id);
      });
    }

    /*
    tasks = [
      (callback) => {
        updatePigs((newPigLotNo) => {
          callback(newPigLotNo)
        });
      },
      (newPigLotNo, callback) => {
        insertNewPigLotNo(newPigLotNo, (err2, newPigLotNoOut) => {
          callback(newPigLotNoOut);
        });
      },
      (pigLotNo, callback) => {
        insertNewPigLotNo(pigLotNo, (err3, newLotNo) => {
          console.log(newLotNo);
        });
      }
    ];
    async.waterfall(tasks, (asyncErr, asyncResult) => {
      
      // ErrorCheck: check if asyncErr[0] or asyncError[1]

      if (asyncErr) {
        //console.log('done');
        console.log('asyncErr');
        console.log(asyncErr);
      }
      //console.log('asyncResult');
      //console.log(asyncResult[1]);
      callback(null, asyncResult);
      //callback(asyncErr, asyncResult);
    });
    */
    
    createNewPigLotNo((newPigLotNo) => {
      //console.log(newPigLotNo);
      updatePigs(newPigLotNo, (uErr, pigLotNo) => {
        //console.log('Inserting pigLotNo: ');
        //console.log(pigLotNo);
        if (uErr) {
          //console.log(`[error] ${uErr}`);
          callback(uErr, null);
          return;
        } else {
          //console.log('coming here?')
          insertNewPigLotNo(pigLotNo, (iErr, newLotNo) => {
            //console.log(newLotNo);
            callback(null, newLotNo);
          });
        }
      });
    })
    
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
      "key": pigLotNoYmd,
      "reduce": false
    };

    //console.log(createdDate);
    //console.log(queryString);
    db.runViewWithQuery('pigsDoc', 'pigLotNo-by-lotNoYmd-view', queryString, (err, pigLotNoKeys) => {
      //console.log(pigLotNoKeys);
      if (err) {
        console.log('[error] queryLotNoWithDate');
        callback(err, null);
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
    // [ErrorCheck] 없는 lotNo를 입력했으면 error 출력
    var queryString = {
      "key": lotNo
    };
    //console.log(queryString);
    db.runViewWithQuery('pigsDoc', 'processInfo-by-lotNo-view', queryString, (error, processResult) => {
      //console.log(processResult);

      var seriesNo = 0;
      if (processResult.rows[0])
        seriesNo = processResult.rows[0].value;

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
      
      queryString = {
        "keys": [lotNo]
      }
      db.runFetch(queryString, (err, docResults) => {
        //console.log(docResults);
        //console.log(docResults.rows[0].doc);
        processInfo.lotNoTotalWeight = docResults.rows[0].doc.lotNoTotalWeight;
        db.insert(processInfo, processNo, (err, body) => {
          //console.log(body);
          callback(err, processNo);
        });
      })

    });
  },

  createBox(processInfoArr, nexCorp, callback) {
    console.log('createBox in function')
    //console.log(processInfoArr);
    var newBox = new PigBox();

    //console.log('newBox:');
    //console.log(newBox);
    newBox.boxYmd = utils.getTodayYYYYMMDD();
    newBox.inBox = processInfoArr;
    newBox.nextCorpNm = nexCorp;

    //console.log('newBox:');
    //console.log(newBox);
    
    db.insert(newBox, null, (insertErr, insertResult) => {
      //console.log(insertResult);
      callback(insertErr, insertResult);
    })
  },

  queryBoxWithDate(boxDate, callback) {

    var queryString = {
      "key": boxDate
    };

    db.runViewWithQuery('pigsDoc', 'pigBox-by-boxYmd-view', queryString, (err, pibBoxKeys) => {
      if (err) {
        console.log('[error] queryBoxWith');
        callback(err, null);
        return;
      }
      
      //console.log(pibBoxKeys);
      keysArr = [];
      for (var i = 0; i < pibBoxKeys.rows.length; i++) {
        //console.log(pigLotNoKeys.rows[i].id)
        keysArr.push(pibBoxKeys.rows[i].id);
      }
      console.log(keysArr);

      queryString = {
        "keys": keysArr
      }
      db.runFetch(queryString, (errFetch, docResults) => {
        if (errFetch) console.log('[error] queryBoxWith');

        console.log(docResults);
        callback(errFetch, docResults.rows);
      })
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
        db.get(queryResult.rows[0].id, (getErr, resultDoc) => {
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
      "key": queryYmd,
      "reduce": false
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
    console.log(queryString);
    db.runViewWithQuery('pigsDoc', 'processInfo-summary-view', queryString, (err, viewResult) => {
      //console.log(viewResult.rows);
      if (err) console.log(`[error] queryProcessSummary: ${err}`);
      callback(err, viewResult.rows);
    })
  },

  getSummaryPigsByDate(callback) {
    var queryString ={
      "startKey": "20000101",
      "endKey": "30000101",
      "group_level": 1,
      "limit": 10,
      "descending": true
    }
    db.runViewWithQuery('pigsDoc', 'pigs-by-issueYmd-view', queryString, (err, viewResults) => {
      if (err) {
        console.log(`[error] getSummaryPigsByDate: ${err}`);
        callback(err, null);
        return;
      } else {
        //console.log(viewResults);
        callback(null, viewResults);
      }
    })
  },

  loadProducts(callback) {
    db.get('product_code', (err, results) => {
      //console.log(results.productCode);
      callback(results);
    });
  },

  loadCustomers(callback) {
    db.get('customers', (err, results) => {
      //console.log(results.productCode);
      callback(results);
    });
  }

}
