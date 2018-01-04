var path          = require('path');
var csv           = require('csvtojson');
var models        = require('../models')
var Pig           = models.schemas.Pig;
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
    //var pig = models.schemas.pig;
    var pigId = dateYear + ekapeJsonPig['월'] + ekapeJsonPig['일'] + ekapeJsonPig['이력번호'] + ekapeJsonPig['도체번호'];
    console.log(`pigId: ${pigId}`);
    var pig = new Pig(pigId);
    
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
    pig.butcheryInfo.backFatThickness = ekapeJsonPig['등지방두께'];
    //pig.butcheryInfo.abattCode = ekapeJsonPig
    //pig.butcheryInfo.processPlaceNm = ekapeJsonPig
    //console.log(pig);

    //pig._id = pig.butcheryInfo.butcheryYmd + pig.traceNo + pig.pigNo;
    return pig;
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
  }
}
