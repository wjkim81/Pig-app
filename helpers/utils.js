var path          = require('path');
var http          = require('http');
var parseString   = require('xml2js').parseString;
var pad           = require('pad');

var models        = require('../models')
var Pig           = models.schemas.Pig;

var self = module.exports = {
  /**
   * csvtojson converts csv format file to json
   * @param {csvFilePath} csvFilePath 
   * @param {*} callback 
   */
  downloadButcheryInfoFromEkape(issuedYmd, apiKey, callback) {
    
    var baseUrl = 'http://openapi.ekape.or.kr/rest/user/grade/confirminfo/pig/ownerlist';

    var url = baseUrl + '?apiKey=' + apiKey + '&issueYmd=' + issuedYmd;
    var parseOption = {
      explicitArray: false
    };

    console.log(`Accessing ekape with url: ${url}`)
    http.get(url, (res) => {
      let xmldata = '';
      let pigsJsArr = [];

      res.on('data', (chunk) => {
        xmldata += chunk;
      });
      res.on('end', () => {
        if (data) {
          callback(null, null);
          return;
        }
        console.log('Accessing ekape finished')
        parseString(xmldata, parseOption, (err, jsData) => {
          //console.log(jsData.pigVoes.pigVo[0].returnCd);
          if (jsData.pigVoes.pigVo[0].returnCd === 'INFO_0000') {
            for (var i = 0; i < jsData.pigVoes.pigVo.length; i++) {
              //console.log(idx);
              //console.log(self.convertFromEkape(jsEl));
              pigsJsArr.push(self.convertFromEkape(jsData.pigVoes.pigVo[i]));
            }
            callback(null, pigsJsArr);
          } else {
            console.log('Some error while download butcheryInfo with open-api');
          }
        });
      });
    }).on('error', (err) => {
      console.log(err, null);
    });
  },

  /**
   * This convert json format fro Ekape to json which can be stored in our database
   * @param {json obejct} ekapeJsonPig 
   */
  convertFromEkape(ekapeJsonPig) {
    date = new Date();
    //console.log(date.getFullYear())
    //dateYear = date.getFullYear();
    //var pig = models.schemas.pig;
    var pigId = ekapeJsonPig.issueYmd + ekapeJsonPig.pigNo + ekapeJsonPig.butcheryNo;
    //console.log(`pigId: ${pigId}`);
    var pig = new Pig(pigId);
    
    //key = 
    
    pig.traceNo = ekapeJsonPig.pigNo;
    pig.pigNo = ekapeJsonPig.butcheryNo;
    //pig.birthYmd = ekapeJsonPig
    //pig.lsTypeCd = ekapeJsonPig
    //pig.lsTypeNm = ekapeJsonPig
    pig.sexCd = ekapeJsonPig.judgeSexCd;
	  pig.sexNm = ekapeJsonPig.judgeSexNm;
      
    pig.farmInfo.farmNo = ekapeJsonPig.farmUniqueNo
    pig.farmInfo.farmNm = ekapeJsonPig.farmNm;
    //pig.farmInfo.farmAddr = ekapeJsonPig
    pig.farmInfo.farmerNm = ekapeJsonPig.farmerNm;
    //pig.farmInfo.regType = ekapeJsonPig
    //pig.farmInfo.regYmd = ekapeJsonPig
      
    //pig.butcheryInfo.butcheryPlaceAddr = ekapeJsonPig
    pig.butcheryInfo.requestCorpNo = ekapeJsonPig.requestCorpNo;
    pig.butcheryInfo.requestCorpNm = ekapeJsonPig.requestCorpNm;

    pig.butcheryInfo.issueYmd = ekapeJsonPig.issueYmd;
    pig.butcheryInfo.issueNo = ekapeJsonPig.issueNo;
    pig.butcheryInfo.butcheryUseCd = ekapeJsonPig.butcheryUseCd;
    pig.butcheryInfo.butcheryUseNm = ekapeJsonPig.butcheryUseNm;
    pig.butcheryInfo.inspectCode = ekapeJsonPig.judgeTypeCd;
    pig.butcheryInfo.inspectMethod = ekapeJsonPig.judgeTypeNm;
    pig.butcheryInfo.skinYn = ekapeJsonPig.skinYn;
    pig.butcheryInfo.butcheryShape = ekapeJsonPig.skinNm;
    pig.butcheryInfo.butcheryCode = ekapeJsonPig.abattCode;
    pig.butcheryInfo.butcheryPlaceNm = ekapeJsonPig.abattNm;
    pig.butcheryInfo.judgeYmd = ekapeJsonPig.judgeYmd;
    pig.butcheryInfo.butcheryYmd = ekapeJsonPig.abattYmd;
    pig.butcheryInfo.firstGradeNm = ekapeJsonPig.firstGrade;
    pig.butcheryInfo.gradeNm = ekapeJsonPig.lastGrade;
    //pig.butcheryInfo.inspectPassYn = ekapeJsonPig
    pig.butcheryInfo.butcheryWeight = parseInt(ekapeJsonPig.weight);
    pig.butcheryInfo.backFatThickness = parseInt(ekapeJsonPig.backfat);
    pig.butcheryInfo.fatup = ekapeJsonPig.fatup;

    //pig.butcheryInfo.processPlaceNm = ekapeJsonPig
    //console.log(pig);

    //pig._id = pig.butcheryInfo.butcheryYmd + pig.traceNo + pig.pigNo;
    return pig;
  },


  // Get today in the format YYMMDD
  getTodayYYMMDD() {
    var date = new Date();

    todayYY = date.getFullYear().toString().substring(2);
    todayMM = (date.getMonth() + 1).toString();
    todayMM = pad(2, todayMM, '0');
    todayDD = date.getDate().toString();
    todayDD = pad(2, todayDD, '0');
    today = todayYY + todayMM + todayDD;

    return today;
  },

  // Get today in the format YYYYMMDD
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
