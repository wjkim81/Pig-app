var path          = require('path');
var csv           = require('csvtojson');
var models        = require('../models')
var pigsdb        = require('../models/pigs')
var pad           = require('pad');

var self = module.exports = {
  /**
   * csvtojson converts csv format file to json
   * @param {csvFilePath} csvFilePath 
   * @param {*} callback 
   */
  csvtojson(csvFilePath, callback) {
    //console.log(csvFilePath)
    var pigsArr = [];

    csv().fromFile(csvFilePath, (error, jsonObj) => {
      if (error) return callback(error);
      //console.log(jsonObj[0]);
      callback(jsonObj);
    })
    /*
    csv()
      .fromFile(csvFilePath)
      .on('json', (jsonObj) => {
        pigsArr.push(jsonObj)
      })
      .on('done', (error) => {
        //if (error) return process.exit(1)
        //console.log(pigsArr)
        //var numPigs = pigsArr.length;
        //console.log(numPigs);
        //return pigsArr;
      }
    )
    */
  },
  /**
   * This convert json format fro Ekape to json which can be stored in our database
   * @param {json obejct} ekapeJsonPig 
   */
  convertFromEkape(ekapeJsonPig) {
    date = new Date();
    //console.log(date.getFullYear())
    dateYear = date.getFullYear();
    var pig = models.schemas.pig;
    
    //key = 
    
    pig.traceNo = ekapeJsonPig['이력번호'];
    pig.pigNo = ekapeJsonPig['도체번호'];
    //pig.birthYmd = ekapeJsonPig
    //pig.lsTypeCd = ekapeJsonPig
    //pig.lsTypeNm = ekapeJsonPig
    //pig.sexCd = ekapeJsonPig
	  pig.sexNm = ekapeJsonPig['성'];
      
    //pig.farmInfo.farmNo = ekapeJsonPig
    pig.farmInfo.farmNm = ekapeJsonPig['출하농가'];
    //pig.farmInfo.farmAddr = ekapeJsonPig
    //pig.farmInfo.farmerNm = ekapeJsonPig
    //pig.farmInfo.regType = ekapeJsonPig
    //pig.farmInfo.regYmd = ekapeJsonPig
      
    //pig.butcheryInfo.butcheryPlaceAddr = ekapeJsonPig
    pig.butcheryInfo.inspectMethod = ekapeJsonPig['판정방법'];
    pig.butcheryInfo.butcheryShape = ekapeJsonPig['도체형태'];
    pig.butcheryInfo.butcheryPlaceNm = ekapeJsonPig['작업장명'];
    pig.butcheryInfo.butcheryYmd = dateYear + ekapeJsonPig['월'] + ekapeJsonPig['일'];
    pig.butcheryInfo.firstGradeNm = ekapeJsonPig['1차등급']
    pig.butcheryInfo.gradeNm = ekapeJsonPig['최종등급']
    //pig.butcheryInfo.inspectPassYn = ekapeJsonPig
    pig.butcheryInfo.butcheryWeight = ekapeJsonPig['도체중(kg)'];
    pig.butcheryInfo.backFatThickness = ekapeJsonPig['등지방두꼐'];
    //pig.butcheryInfo.abattCode = ekapeJsonPig
    //pig.butcheryInfo.processPlaceNm = ekapeJsonPig
    //console.log(pig);

    pig._id = pig.butcheryInfo.butcheryYmd + pig.traceNo + pig.pigNo;
    return pig;
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
        var pig = self.convertFromEkape(ekapeJsonPig);
        //console.log(key);

        pigsdb.insert(pig, pig._id, (body) => {
          console.log(body);
          //callback(body);
        });

        pigsArr.push(pig)
      })
      .on('done', (error) => {
        if (error) console.log('updateButcheryInfoFromEkape: ' + error);
        console.log("Number of pigs: " + pigsArr.length);
        callback(pigsArr.length)
      }
    )
  },

  // Get today in the format YYYYMMDD
  getToday() {
    var date = new Date();

    todayYY = date.getFullYear().toString().substring(2);
    todayMM = (date.getMonth() + 1).toString();
    todayMM = pad(2, todayMM, '0');
    todayDD = date.getDate().toString();
    todayDD = pad(2, todayDD, '0');
    today = todayYY + todayMM + todayDD;

    return today;
  },

  getTodayYYYYMMDD() {
    var date = new Date();

    todayYYYY = date.getFullYear();
    todayMM = (date.getMonth() + 1).toString();
    todayMM = pad(2, todayMM, '0');
    todayDD = date.getDate().toString();
    todayDD = pad(2, todayDD, '0');
    today = todayYYYY + todayMM + todayDD;

    return today;
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
    pigsdb.runQuery(queryString, (body) => {
      var seriesNo = body.rows.length;
      var newLotNo = 'L1' + today + corpNo + pad(3, seriesNo.toString(), '0');

      var newPigLotNo = models.schemas.pigLotNo;
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

      pigsdb.insert(newPigLotNo, newLotNo, (err, body) => {
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
    pigsdb.runViewWithQuery('pigsDoc', 'pigLotNo-view', queryString, (body) => {
      //console.log(body);
      var updateLotNo = models.schemas.pigLotNo;
      updateLotNo._id = lotNo;
      updateLotNo._rev = body.rows[0].value;
      for (var i = 0; i < pigsArr.length; i++) {
        updateLotNo.referenceKey.push(pigsArr[i]);
        console.log(updateLotNo);
        pigsdb.update(updateLotNo, lotNo, (err, lotNoBody) => {

          console.log(pigsArr[i]);
          queryString = {
            "selector": {
              "traceNo": pigsArr[i]
            }
          };
          //console.log(queryString);
          pigsdb.runViewWithQuery('pigsDoc', 'traceNo-view', queryString, (pigsBody) => {
            //console.log(body);
            pigsBody.rows.forEach((row) => {
              row.value.processed = 1
              console.log(row.value);
              pigsdb.update(row.value, row.value._id, (err, body) => {
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
      "selector": {
        "createdDate": createdDate
      }
    };

    //console.log(createdDate);
    console.log(queryString);
    pigsdb.runViewWithQuery('pigsDoc', 'pigLotNo-view', queryString, (error, body) => {
      if (error) 
        console.log('[error] queryLotNoWithDate');
      callback(error, body);
    });
  },

  createNewProcessNo(lotNo, callback) {
    var queryString = {
      "selector": {
        "lotNo": lotNo
      }
    };
    //console.log(queryString);
    pigsdb.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      //console.log(processBody);
      var seriesNo = processBody.rows.length;
      var today = self.getTodayYYYYMMDD();
      var processNo = today + lotNo + seriesNo;

      processInfo = models.schemas.processInfo;
      processInfo.lotNo = lotNo;
      processInfo.processYmd = today;
      processInfo.corpNo = '12345';

      //console.log(processInfo);
      //console.log(processNo);
      pigsdb.insert(processInfo, processNo, (err, body) => {
        //console.log(body);
        callback(err, processNo);
      });
    });
  },

  updateProcessInfoWeight(processNo, processWeight, callback) {
    var queryString = {
      "key": processNo
    };
    pigsdb.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      //console.log(processBody);
      processBody.rows[0].value.processWeight = processWeight;
      //console.log(processBody.rows[0].value);
      
      pigsdb.update(processBody.rows[0].value, processNo, (err, updateBody) => {
        callback(err, updateBody);
      });
    });
  },

  updateProcessInfoPart(processNo, processPart, callback) {
    var queryString = {
      "key": processNo
    };
    pigsdb.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      processBody.rows[0].value.processPart = processPart;
      console.log(processBody.rows[0].value);
      
      pigsdb.update(processBody.rows[0].value, processNo, (err, updateBody) => {
        callback(updateBody);
      });
    });
  },
  
  updateProcessInfoPurchasingCost(processNo, purchasingCost, callback) {
    var queryString = {
      "key": processNo
    };
    pigsdb.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      processBody.rows[0].value.purchasingCost = purchasingCost;
      console.log(processBody.rows[0].value);
      
      pigsdb.update(processBody.rows[0].value, processNo, (err, updateBody) => {
        callback(updateBody);
      });
    });
  },

  updateProcessInfoSellingPrice(processNo, sellingPrice, callback) {
    var queryString = {
      "key": processNo
    };
    pigsdb.runViewWithQuery('pigsDoc', 'processInfo-view', queryString, (error, processBody) => {
      processBody.rows[0].value.sellingPrice = sellingPrice;
      console.log(processBody.rows[0].value);
      
      pigsdb.update(processBody.rows[0].value, processNo, (err, updateBody) => {
        callback(updateBody);
      });
    });
  },

  updateProcessTrackHistory(originNo, destinationNo, callback) {

  },

  getUnprocessedPigs(callback) {
    // Get pig documents where processed is false
    /*
    queryString = {
      "selector": {
        "processed": {
         "$and": [
            {
               "$exists": true
            },
            {
               "$eq": 0
            }
          ]
        }
      },
      "include_docs": true,
      "limit": 1000
    }
    pigsdb.runQuery(queryString, (body) => {
      //console.log(body.rows);
      //var uniqueTraceNo = Array.from(new Set(body.rows.doc.traceNo));
      //console.log(uniquteTraceNo);
      //console.log(body);
      callback(body);
    })
    */
    //console.log('started');
    pigsdb.runView('pigsDoc', 'non-processed-view', (err, body) => {
      //console.log(err, body);
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
    //var uniqueTraceNo = [];
      
    //for (var i = 0; i < body.rows.length; i++) {
      //console.log(body.rows[i]);
      //if (!uniqueTraceNo.includes(body.rows[i].doc.traceNo)) 
      //  uniqueTraceNo.push(body.rows[i].doc.traceNo);
    //}
    //console.log(uniqueTraceNo);

    //body.rows.forEach((doc) => {
    //  if (!uniqueTraceNo.includes(doc.doc.traceNo)) 
    //    uniqueTraceNo.push(doc.doc.traceNo);

      //console.log(doc.doc.traceNo, doc.doc.pigNo);
      //console.log(uniqueTraceNo);
    //})
    
  }

}
