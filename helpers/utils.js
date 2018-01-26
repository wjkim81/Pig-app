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
        if (!xmldata) {
          callback('error', null);
          return;
        }
        console.log('Accessing ekape finished')
        parseString(xmldata, parseOption, (err, jsData) => {
          //console.log(jsData);

          var returnCode = jsData.pigVoes.pigVo.returnCd;
          if (returnCode === 'INFO_0001') {
            console.log('INFO_0001: 조회결과가 존재하지 않습니다.')
            callback('error', null);
            return;
          } else if (returnCode === 'WARN_0001') {
            console.log('WARN_0001: 개체식별번호 오류입니다.')
            callback('error', null);
            return;
          } else if (returnCode === 'ERROR_0001') {
            console.log('ERROR_0001: 인증된 사용자가 아닙니다.')
            callback('error', null);
            return;
          } else if (returnCode === 'ERROR_0002') {
            console.log('ERROR_0002: 승인대기중인 사용자입니다.')
            callback('error', null);
            return;
          } else if (returnCode === 'ERROR_0003') {
            console.log('ERROR_0003: 허용된 기능이 아닙니다. 서비스신청 후 사용하시기 바랍니다')
            callback('error', null);
            return;
          } else if (returnCode === 'ERROR_0004') {
            console.log('ERROR_0004: 일별/월별 허용된 조회 건수가 초과되었습니다.')
            callback('error', null);
            return;
          } else if (returnCode === 'ERROR_0005') {
            console.log('ERROR_0005: 접속허용된 서버주소가 아닙니다.')
            callback('error', null);
            return;
          } else if (returnCode === 'ERROR_9001') {
            console.log('ERROR_9001: 미제공 서비스 요청입니다.')
            callback('error', null);
            return;
          } else if (returnCode === 'ERROR_9002') {
            console.log('ERROR_9002: 웹서버 오류입니다.')
            callback('error', null);
            return;
          } else {
            for (var i = 0; i < jsData.pigVoes.pigVo.length; i++) {
              //console.log(idx);
              //console.log(self.convertFromEkape(jsEl));
              pigsJsArr.push(self.convertFromEkape(jsData.pigVoes.pigVo[i]));
            }
            callback(null, pigsJsArr);
            return;
          }
        });
      });
    }).on('error', (err) => {
      console.log(err);
      callback(err, null);
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
    pig.butcheryInfo.corpNo = ekapeJsonPig.requestCorpNo;
    pig.butcheryInfo.corpNm = ekapeJsonPig.requestCorpNm;

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

    pig.butchertyInfo.abattStartNo = ekapeJsonPig.abattStartNo;
    pig.butchertyInfo.abattEndNo = ekapeJsonPig.abattEndNo;
    pig.butchertyInfo.judgeBreedCd = ekapeJsonPig.judgeBreedCd;
    pig.butchertyInfo.judgeBreedNm = ekapeJsonPig.judgeBreedNm;
    pig.butchertyInfo.auctYmd = ekapeJsonPig.auctYmd;
    pig.butchertyInfo.costAmt = ekapeJsonPig.costAmt;
    pig.butchertyInfo.belly = ekapeJsonPig.belly;
    pig.butchertyInfo.fatstick = ekapeJsonPig.fatstick;
    pig.butchertyInfo.insfat = ekapeJsonPig.insfat;
    pig.butchertyInfo.yuksak = ekapeJsonPig.yuksak;
    pig.butchertyInfo.tissue = ekapeJsonPig.tissue;
    pig.butchertyInfo.fatsak = ekapeJsonPig.fatsak;
    pig.butchertyInfo.fatqual = ekapeJsonPig.fatqual;
    pig.butchertyInfo.defectCode = ekapeJsonPig.defectCode;
    pig.butchertyInfo.defect = ekapeJsonPig.defect;
    pig.butchertyInfo.offgradeNo = ekapeJsonPig.offgradeNo;

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

    var todayYYYY = date.getFullYear();
    var todayMM = (date.getMonth() + 1).toString();
    var todayMM = pad(2, todayMM, '0');
    var todayDD = date.getDate().toString();
    var todayDD = pad(2, todayDD, '0');
    var today = todayYYYY + todayMM + todayDD;

    return today;
  }
}
