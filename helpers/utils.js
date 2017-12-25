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
    pig.farmInfo.farnNm = ekapeJsonPig['출하농가'];
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
    pig.butcheryInfo.butcheryWeight = ekapeJsonPig['도체중'];
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
          //console.log(body);
          callback(body);
        });

        pigsArr.push(pig)
      })
      .on('done', (error) => {
        if (error) return process.exit(1)
        console.log("Number of pigs: " + pigsArr.length);
        callback(pigsArr.length)
      }
    )
  },

  // Get today in the format YYYYMMDD
  getToday () {
    var date = new Date();

    todayYY = date.getFullYear().toString().substring(2);
    todayMM = (date.getMonth() + 1).toString();
    todayMM = pad(2, todayMM, '0');
    todayDD = date.getDate().toString();
    todayDD = pad(2, todayDD, '0');
    today = todayYY + todayMM + todayDD;

    return today;
  },

  /**
   * CreateLotNo is starting point of works
   * 
   */
  createLotNo(callback) {
    let today = self.getToday();

    var corpNo = '12345';

    var startKey = 'L1' + today + corpNo + '000';
    var endKey = 'L1' + today + corpNo + '999';

    queryString = {
      startkey: startKey,
      endkey: endKey,
      include_docs: true,
      limit: 1000
    }

    // Retrieve all lotNo with current day and 
    pigsdb.runQuery(queryString, (body) => {
      var seriesNo = body.rows.length;
      var lotNo = 'L1' + today + corpNo + pad(3, seriesNo.toString(), '0');

      var newPigLotNo = models.schemas.pigLotNo;
      //console.log('seriesNo: ' + seriesNo)
      //console.log(body);
      
      
      pigsdb.insert(newPigLotNo, lotNo, (body) => {
        console.log(body);
      });
      
      callback(lotNo);
    });
  },

  upateLotNo(pigsArr, callback) {
    
  },

  createNewLabel(lotNo) {
    //console.log(models.schemas.pigParts["frozenType"]);
  },

  updateLabel(traceNoArr) {
    
  },

  getUnprocessedPigs(callback) {
    // Get pig documents where processed is false
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

    /*
    pigsdb.runQuery(queryString, (body) => {
      //console.log(body.rows);
      //var uniqueTraceNo = Array.from(new Set(body.rows.doc.traceNo));
      //console.log(uniquteTraceNo);
      //console.log(body);
      callback(body);
    })
    */
    pigsdb.runView('processedDoc', 'non-processed-view', (body) => {
     callback(body);
    });
  },

  getUniqueTraceNo(pigsArr, callback) {

    var uniqueTraceNoArr = [];
    for (var i = 0; i < pigsArr.rows.length; i++) {
      //console.log(pigsArr.rows[i]);
      if (!uniqueTraceNoArr.includes(pigsArr.rows[i].value)) 
        uniqueTraceNoArr.push(pigsArr.rows[i].value);
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
