var path          = require('path');
var csv           = require('csvtojson');
var models        = require('../models')

module.exports = {
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
  convertToSchema(pigsFromCsv) {
    for (var i = 0; i < pigsFromCsv.length; i++) {
      var pig = models.schemas.pig;
      //key = 
      pig.traceNo = pigsFromCsv[i]['이력번호']
      pig.pigNo = pigsFromCsv[i]['도체번호']
      console.log(pig.pigNo)
      /*
      pig.pigNo = pigsFromCsv[i]
      pig.birthYmd = pigsFromCsv[i]
      pig.lsTypeCd = pigsFromCsv[i]
      pig.lsTypeNm = pigsFromCsv[i]

      pig.farmInfo.farmNo = pigsFromCsv[i]
      pig.farmInfo.farnNm = pigsFromCsv[i]
      pig.farmInfo.farmAddr = pigsFromCsv[i]
      pig.farmInfo.farmerNm = pigsFromCsv[i]
      pig.farmInfo.regType = pigsFromCsv[i]
      pig.farmInfo.regYmd = pigsFromCsv[i]

      pig.butcheryInfo.butcheryPlaceAddr = pigsFromCsv[i]
      pig.butcheryInfo.butcheryPlaceNm = pigsFromCsv[i]
      pig.butcheryInfo.butcheryYmd = pigsFromCsv[i]
      pig.butcheryInfo.gradeNm = pigsFromCsv[i]
      pig.butcheryInfo.inspectPassYn = pigsFromCsv[i]
      pig.butcheryInfo.butcheryWeight = pigsFromCsv[i]
      pig.butcheryInfo.abattCode = pigsFromCsv[i]
      pig.butcheryInfo.processPlaceNm = pigsFromCsv[i]

일련번호': '1',
  '작업장명': '(유)참푸른글로벌',
  '월': '12',
  '일': '11',
  '도체번호': '1001',
  '판정방법': '온',
  '도체형태': '탕박',
  '성': '거세',
  '도체중(kg)': '88',
  '등지방두께': '20',
  '등심직경': '',
  '수율': '',
  '1차등급': '1+',
  '비육상태': '',
  '삼겹살상태': '',
  '지방부착': '',
  '지방침착': '',
  '육색': '',
  '육조직감': '',
  '지방색': '',
  '지방질': '',
  '항목': '',
  '하향': '',
  '등외': '',
  '최종등금': '1+',
  '출하농가': '농업회사법인 주식회사드림피그',
  '이력번호': '160074700588',
  field28: '' }
        */


    }
  }
}
