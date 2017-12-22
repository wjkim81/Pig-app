var path          = require('path');
var csv           = require('csvtojson');
var models        = require('../models')
var pigsdb         = require('../models/pigs')

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

        key = pig.butcheryInfo.butcheryYmd + pig.traceNo + pig.pigNo;
        //console.log(key);

        pigsdb.insertPig(key, pig, (body) => {
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


  /**
   * CreateLotNo is starting point of works
   * 
   */
  createLotNo() {
    var date = new Date();

    todayYY = date.getFullYear().toString().substring(2);
    todayMM = (date.getMonth() + 1).toString();
    todayDD = date.getDate().toString();
    today = todayYY + todayMM + todayDD;

    var corpNo = '12345';
    var seriesNo = 000;

    //console.log(date);
    //console.log(todayYY);
    //console.log(todayMM);
    //console.log(todayDD);

    lotNo = 'L1' + today + corpNo + seriesNo;
    queryString = {
      "selector": {
        "butcheryInfo.butcheryYmd": "20171211"
      }
    }
    pigsdb.makeNewSeriesNo(lotNo, queryString);
    //pigsdb.get()
    //pigsdb.
  }
  
}
